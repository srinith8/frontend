import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Shuffle, 
  Star, 
  Download, 
  RotateCcw, 
  ExternalLink,
  Flame,
  LayoutGrid,
  Heart
} from 'lucide-react';

import ParticleBackground from '../components/ParticleBackground';
import CustomInput from '../components/CustomInput';
import FontCard from '../components/FontCard';
import Toast from '../components/Toast';

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const presetWords = [
  "FontMorph", "Srinith", "Vercel", "Linear", "Antigravity", 
  "Cyberpunk", "Cosmos", "Aesthetic", "Nebula", "Spectre", 
  "Odyssey", "Elysium", "Genesis", "Matrix", "Phoenix"
];

const LandingPage = () => {
  const [inputText, setInputText] = useState('FontMorph');
  const [stylesMap, setStylesMap] = useState({});
  const [stylesOrder, setStylesOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ isVisible: false, message: '', styleName: '' });
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('fontmorph_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);

  // Generate styles on initial load
  useEffect(() => {
    handleGenerate('FontMorph');
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('fontmorph_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handleGenerate = async (text) => {
    const query = text.trim();
    if (!query) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: query }),
      });

      if (!response.ok) {
        throw new Error('API failed to generate styles');
      }

      const data = await response.json();
      setStylesMap(data.styles_map);
      
      // Retain or set standard ordering
      const keys = Object.keys(data.styles_map);
      setStylesOrder(keys);

      // Save to recent queries
      if (!recentQueries.includes(query)) {
        setRecentQueries(prev => [query, ...prev.slice(0, 4)]);
      }
    } catch (error) {
      console.error('Error generating styles:', error);
      showToast('Connection error. Is the backend running?', 'Error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomize = () => {
    const randomWord = presetWords[Math.floor(Math.random() * presetWords.length)];
    setInputText(randomWord);
    handleGenerate(randomWord);
  };

  const handleShuffle = () => {
    if (stylesOrder.length === 0) return;
    const shuffled = [...stylesOrder].sort(() => Math.random() - 0.5);
    setStylesOrder(shuffled);
    showToast('Shuffled styles order', 'Layout');
  };

  const toggleFavorite = (styleName, styledText) => {
    const existingIndex = favorites.findIndex(f => f.styleName === styleName && f.text === inputText);
    
    if (existingIndex > -1) {
      // Remove from favorites
      setFavorites(prev => prev.filter((_, idx) => idx !== existingIndex));
      showToast('Removed style from favorites', styleName);
    } else {
      // Add to favorites
      setFavorites(prev => [...prev, { styleName, styledText, text: inputText }]);
      showToast('Added style to favorites', styleName);
    }
  };

  const isFavorited = (styleName) => {
    return favorites.some(f => f.styleName === styleName && f.text === inputText);
  };

  const handleDownloadAll = () => {
    if (Object.keys(stylesMap).length === 0) return;
    
    let content = `FontMorph Text Variations for: "${inputText}"\n`;
    content += `==============================================\n\n`;
    
    Object.entries(stylesMap).forEach(([styleName, styledText]) => {
      content += `[${styleName.toUpperCase()}]\n${styledText}\n\n`;
    });

    const element = document.createElement("a");
    const file = new Blob([content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `FontMorph_${inputText.replace(/\s+/g, '_')}_all_styles.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    showToast('Downloaded all styles as a text file', 'System');
  };

  const showToast = (message, styleName = '') => {
    setToast({ isVisible: true, message, styleName });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Filter list of card keys based on favorites toggle
  const visibleStyleNames = showOnlyFavorites 
    ? stylesOrder.filter(name => isFavorited(name))
    : stylesOrder;

  return (
    <div className="min-h-screen relative flex flex-col justify-between py-12 px-4 md:px-8 z-10">
      {/* Background Orbs */}
      <div className="glow-orb -top-20 -left-20 bg-brand-purple/10 animate-pulse-glow" />
      <div className="glow-orb top-1/3 -right-20 bg-brand-blue/10 animate-pulse-glow" style={{ animationDelay: '-1.5s' }} />

      <ParticleBackground />

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto flex-1 flex flex-col justify-start">
        
        {/* Header/Logo */}
        <header className="flex justify-between items-center mb-16 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center shadow-lg shadow-brand-purple/20">
              <Flame className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              Font<span className="text-brand-purple-light">Morph</span>
            </span>
          </div>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-white/70 hover:text-white transition-all border border-white/5"
          >
            <span>v1.0.0</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </header>

        {/* Hero Section */}
        <section className="text-center mb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-4">
              Transform Your <span className="text-gradient">Text Into Art</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/50 max-w-xl mx-auto font-medium">
              Instantly generate stylish text designs & copy them anywhere
            </p>
          </motion.div>
        </section>

        {/* Text Input Panel */}
        <section className="mb-10">
          <CustomInput 
            value={inputText}
            onChange={setInputText}
            onSubmit={handleGenerate}
            isLoading={isLoading}
          />
          
          {/* Action buttons bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 z-10 relative">
            <button
              onClick={handleRandomize}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white/80 hover:text-white transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-purple-light" />
              <span>Random Word</span>
            </button>

            <button
              onClick={handleShuffle}
              disabled={stylesOrder.length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5 text-brand-blue-light" />
              <span>Shuffle Styles</span>
            </button>

            <button
              onClick={() => {
                setShowOnlyFavorites(!showOnlyFavorites);
                showToast(showOnlyFavorites ? 'Showing all styles' : 'Showing favorited styles', 'Filter');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                showOnlyFavorites 
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                  : 'bg-white/5 border-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-amber-400' : ''}`} />
              <span>Favorites Only ({favorites.filter(f => f.text === inputText).length})</span>
            </button>

            <button
              onClick={handleDownloadAll}
              disabled={Object.keys(stylesMap).length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-semibold text-white/80 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download All</span>
            </button>
          </div>

          {/* Recent Queries bar */}
          {recentQueries.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-white/40 z-10 relative">
              <span className="font-mono uppercase tracking-wider text-[10px]">Recent:</span>
              <div className="flex flex-wrap gap-1.5">
                {recentQueries.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(q);
                      handleGenerate(q);
                    }}
                    className="px-2 py-0.5 rounded bg-white/5 border border-white/5 hover:border-brand-purple/20 text-white/60 hover:text-white transition-all cursor-pointer text-[11px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Output Cards Section */}
        <section className="mt-8 mb-16 relative z-10">
          <AnimatePresence mode="popLayout">
            {visibleStyleNames.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {visibleStyleNames.map((styleName) => (
                  <FontCard 
                    key={styleName}
                    styleName={styleName}
                    styledText={stylesMap[styleName] || ''}
                    onCopy={(style) => showToast('Copied style variation', style)}
                    isFavorite={isFavorited(styleName)}
                    onToggleFavorite={() => toggleFavorite(styleName, stylesMap[styleName])}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-12 rounded-3xl text-center max-w-md mx-auto"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
                  <Star className="w-5.5 h-5.5 text-amber-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">No Favorites Yet</h3>
                <p className="text-sm text-white/50">
                  {showOnlyFavorites 
                    ? `You haven't favorited any styles for the text "${inputText}". Click the star icon on any card to save it.`
                    : 'Enter some text above to generate stylish font designs.'
                  }
                </p>
                {showOnlyFavorites && (
                  <button
                    onClick={() => setShowOnlyFavorites(false)}
                    className="mt-5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-xs font-semibold text-white transition-all cursor-pointer"
                  >
                    View All Styles
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-white/30 relative z-10 font-mono mt-12">
        <p>© 2026 FontMorph — Handcrafted with React, FastAPI, Tailwind CSS v4 & Framer Motion</p>
      </footer>

      {/* Toast System */}
      <Toast 
        message={toast.message}
        styleName={toast.styleName}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
};

export default LandingPage;
