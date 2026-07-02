import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

const CustomInput = ({ value, onChange, onSubmit, isLoading }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  
  const hints = [
    "Enter your name...",
    "Type 'Srinith'...",
    "Try 'Cyberpunk'...",
    "Try 'FontMorph'...",
    "Create beautiful text art..."
  ];

  // Placeholder typing animation
  useEffect(() => {
    let currentHintIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingTimer;

    const tick = () => {
      const currentFullText = hints[currentHintIndex];
      
      if (!isDeleting) {
        // Typing characters
        setPlaceholderText(currentFullText.substring(0, currentCharIndex + 1));
        currentCharIndex++;

        if (currentCharIndex === currentFullText.length) {
          // Pause at the end of word
          isDeleting = true;
          typingTimer = setTimeout(tick, 2000);
        } else {
          typingTimer = setTimeout(tick, 100);
        }
      } else {
        // Deleting characters
        setPlaceholderText(currentFullText.substring(0, currentCharIndex - 1));
        currentCharIndex--;

        if (currentCharIndex === 0) {
          isDeleting = false;
          currentHintIndex = (currentHintIndex + 1) % hints.length;
          typingTimer = setTimeout(tick, 500); // short pause before typing next
        } else {
          typingTimer = setTimeout(tick, 50);
        }
      }
    };

    tick();

    return () => clearTimeout(typingTimer);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto px-4 relative z-10">
      <div
        className={`relative flex items-center p-1.5 rounded-2xl transition-all duration-500 bg-black/60 border ${
          isFocused 
            ? 'border-brand-purple shadow-[0_0_25px_0_rgba(168,85,247,0.35)]' 
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {/* Glow overlay inside the border */}
        <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 opacity-50 blur-sm pointer-events-none" />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          maxLength={50}
          className="w-full bg-transparent px-4 py-3.5 text-white placeholder-white/30 text-lg md:text-xl font-medium focus:outline-none select-all"
        />

        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
            value.trim() 
              ? 'bg-gradient-to-r from-brand-purple to-brand-blue hover:shadow-[0_0_20px_0_rgba(168,85,247,0.5)] cursor-pointer hover:scale-[1.02] active:scale-[0.98]' 
              : 'bg-white/5 text-white/40 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span className="hidden md:inline">Generate</span>
              <Sparkles className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Characters counter */}
      <div className="mt-2 text-right text-xs text-white/40 pr-2">
        {value.length}/50 characters
      </div>
    </form>
  );
};

export default CustomInput;
