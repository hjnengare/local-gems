"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95">
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-coral/20 to-coral/10 rounded-full flex items-center justify-center">
              <ion-icon name="alert-circle-outline" style={{ fontSize: "32px", color: "#d67469" }} />
            </div>
            <h1 className="font-urbanist text-1 font-700 text-charcoal mb-2">
              Something went wrong
            </h1>
            <p className="font-urbanist text-6 text-charcoal/70 mb-6">
              We&apos;re experiencing a technical issue. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-sage to-sage/90 hover:from-sage/90 hover:to-sage text-white font-urbanist font-600 py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;