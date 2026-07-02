import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X } from 'lucide-react';

const Toast = ({ message, styleName, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-black/80 border border-emerald-500/30 text-emerald-400 shadow-[0_4px_30px_rgba(16,185,129,0.15)] backdrop-blur-md"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white">{message}</span>
            {styleName && (
              <span className="text-xs text-emerald-400/80 font-mono">
                Style: {styleName}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1 rounded-md text-emerald-400/60 hover:text-emerald-400 hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
