"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, retryCount: 0 };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Report to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would send to error reporting service
      // e.g., Sentry, LogRocket, etc.
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isRepeatedError = this.state.retryCount >= 2;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-off-white via-off-white/98 to-off-white/95 px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <ion-icon name="warning-outline" style={{ color: '#dc2626', fontSize: '2rem' }}></ion-icon>
            </div>
            <h1 className="font-urbanist text-xl font-600 text-charcoal mb-3">
              {isRepeatedError ? 'Persistent Error' : 'Something went wrong'}
            </h1>
            <p className="font-urbanist text-sm text-charcoal/70 mb-6 leading-relaxed">
              {isRepeatedError
                ? 'We\'re experiencing technical difficulties. Please contact support if this continues.'
                : 'We encountered an unexpected error. Please try again.'
              }
            </p>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-red-50 p-4 rounded-lg">
                <summary className="font-urbanist text-sm font-600 text-red-600 cursor-pointer">
                  Error Details (Dev Only)
                </summary>
                <pre className="mt-2 text-xs text-red-800 whitespace-pre-wrap overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                disabled={isRepeatedError}
                className={`w-full font-urbanist text-base font-600 py-3 px-6 rounded-2xl transition-colors duration-300 focus:outline-none focus:ring-2 ${
                  isRepeatedError
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-sage text-white hover:bg-sage/90 focus:ring-sage/30'
                }`}
              >
                {isRepeatedError ? 'Unable to Retry' : 'Try Again'}
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-coral text-white font-urbanist text-base font-600 py-3 px-6 rounded-2xl hover:bg-coral/90 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-coral/30"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;