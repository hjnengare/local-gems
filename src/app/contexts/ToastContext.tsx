"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: Toast['type'] = 'info', duration = 4000) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type, duration };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getToastStyles = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-sage/95 border-sage/30 text-white';
      case 'error':
        return 'bg-red-500/95 border-red-400/30 text-white';
      case 'warning':
        return 'bg-amber-500/95 border-amber-400/30 text-white';
      default:
        return 'bg-charcoal/95 border-charcoal/30 text-white';
    }
  };

  const getToastIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'close-circle';
      case 'warning':
        return 'warning';
      default:
        return 'information-circle';
    }
  };

  const value: ToastContextType = {
    showToast,
    removeToast
  };

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* Toast Container - Simple version without animations for performance */}
      {toasts.length > 0 && (
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`
                pointer-events-auto max-w-sm w-full backdrop-blur-xl border rounded-xl p-4 shadow-2xl
                transition-all duration-300 ease-out
                ${getToastStyles(toast.type)}
              `}
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
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity duration-200"
                >
                  <ion-icon name="close" style={{ fontSize: '20px' }} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}