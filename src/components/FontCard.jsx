import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Star, Download } from 'lucide-react';

const FontCard = ({ styleName, styledText, onCopy, isFavorite, onToggleFavorite }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(styledText);
    setCopied(true);
    if (onCopy) onCopy(styleName);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([styledText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${styleName.replace(/\s+/g, '_')}_text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between h-48 relative overflow-hidden group select-none"
    >
      {/* Decorative gradient overlay that glows on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Top Bar: Card Name & Action Toggles */}
      <div className="flex justify-between items-start z-10">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors duration-300 font-mono">
          {styleName}
        </span>
        
        <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          {/* Favorite Toggle */}
          <button
            onClick={onToggleFavorite}
            aria-label="Toggle Favorite"
            className={`p-1.5 rounded-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${
              isFavorite 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Download Style */}
          <button
            onClick={handleDownload}
            aria-label="Download style as text file"
            className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-white/50 hover:bg-white/10 hover:text-white/80 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Section: Main Styled Text */}
      <div className="my-auto py-2 z-10 overflow-x-auto scrollbar-none max-w-full">
        <p className="text-2xl md:text-3xl text-white font-medium select-all selection:bg-brand-purple/30 text-left whitespace-nowrap break-keep pr-2 leading-relaxed">
          {styledText}
        </p>
      </div>

      {/* Bottom Bar: Action Copy Button */}
      <div className="flex justify-end z-10">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-xs font-semibold transition-all duration-300 cursor-pointer ${
            copied
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
              : 'bg-white/5 border-white/5 text-white/60 hover:bg-brand-purple/20 hover:border-brand-purple/40 hover:text-white'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 animate-bounce" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default FontCard;
