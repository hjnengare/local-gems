// Performance monitoring utilities for authentication flow
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(label: string): void {
    this.metrics.set(label, performance.now());
  }

  endTimer(label: string): number {
    const startTime = this.metrics.get(label);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.metrics.delete(label);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(label);
    return fn().finally(() => {
      this.endTimer(label);
    });
  }

  // Web Vitals tracking
  trackWebVitals(): void {
    if (typeof window === 'undefined') return;

    // Track CLS (Cumulative Layout Shift)
    this.observeLayoutShift();

    // Track LCP (Largest Contentful Paint)
    this.observeLCP();

    // Track FID (First Input Delay)
    this.observeFID();
  }

  private observeLayoutShift(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('hadRecentInput' in entry && (entry as { hadRecentInput: boolean }).hadRecentInput) continue;
        console.log('CLS:', entry.value);
      }
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }

  private observeLCP(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });

    observer.observe({ entryTypes: ['largest-contentful-paint'] });
  }

  private observeFID(): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if ('processingStart' in entry) {
          console.log('FID:', (entry as { processingStart: number }).processingStart - entry.startTime);
        }
      }
    });

    observer.observe({ entryTypes: ['first-input'] });
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Auth-specific performance tracking
export const trackAuthPerformance = {
  loginStart: () => performanceMonitor.startTimer('auth-login'),
  loginEnd: () => performanceMonitor.endTimer('auth-login'),
  registerStart: () => performanceMonitor.startTimer('auth-register'),
  registerEnd: () => performanceMonitor.endTimer('auth-register'),
  onboardingStepStart: (step: string) => performanceMonitor.startTimer(`onboarding-${step}`),
  onboardingStepEnd: (step: string) => performanceMonitor.endTimer(`onboarding-${step}`),
};