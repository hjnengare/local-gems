"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface AnimatedToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
  getToastStyles: (type: Toast['type']) => string;
  getToastIcon: (type: Toast['type']) => string;
}

export default function AnimatedToast({ toast, onRemove, getToastStyles, getToastIcon }: AnimatedToastProps) {
  return (
    <motion.div
      key={toast.id}
      initial={{ opacity: 0, x: 300, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 300, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
        duration: 0.3
      }}
      className={`
        pointer-events-auto max-w-sm w-full backdrop-blur-xl border rounded-xl p-4 shadow-2xl
        ${getToastStyles(toast.type)}
      `}
      layout
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <ion-icon
            name={getToastIcon(toast.type)}
            style={{ fontSize: '24px' }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-urbanist text-sm font-600 leading-tight">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
        >
          <ion-icon name="close" style={{ fontSize: '20px' }} />
        </button>
      </div>
    </motion.div>
  );
}