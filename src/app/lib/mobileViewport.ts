// Mobile viewport height utilities to prevent unintended scroll
export class MobileViewportManager {
  private static instance: MobileViewportManager;
  private isInitialized = false;

  static getInstance(): MobileViewportManager {
    if (!MobileViewportManager.instance) {
      MobileViewportManager.instance = new MobileViewportManager();
    }
    return MobileViewportManager.instance;
  }

  init(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.setViewportHeight();
    this.addEventListeners();
    this.isInitialized = true;
  }

  private setViewportHeight(): void {
    if (typeof window === 'undefined') return;

    // Calculate actual viewport height
    const vh = window.innerHeight * 0.01;

    // Set CSS custom property
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Log for debugging (development only)
    if (process.env.NODE_ENV === 'development') {
      console.log(`📱 Viewport height set: ${window.innerHeight}px (--vh: ${vh}px)`);
    }
  }

  private addEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Update on resize (throttled)
    let resizeTimeout: NodeJS.Timeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.setViewportHeight();
      }, 100);
    });

    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      // Delay to ensure viewport has adjusted
      setTimeout(() => {
        this.setViewportHeight();
      }, 200);
    });

    // Update on visual viewport change (for virtual keyboards)
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', () => {
        this.setViewportHeight();
      });
    }
  }

  // Force update viewport height
  updateViewportHeight(): void {
    this.setViewportHeight();
  }

  // Check if device is mobile
  isMobileDevice(): boolean {
    if (typeof window === 'undefined') return false;

    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth <= 768;
  }

  // Apply mobile page class to element
  applyMobilePageClass(element: HTMLElement): void {
    if (this.isMobileDevice()) {
      element.classList.add('mobile-page');
    }
  }

  // Remove mobile page class from element
  removeMobilePageClass(element: HTMLElement): void {
    element.classList.remove('mobile-page');
  }

  // Get current viewport height
  getViewportHeight(): number {
    if (typeof window === 'undefined') return 0;
    return window.innerHeight;
  }

  // Check if viewport is in landscape mode
  isLandscape(): boolean {
    if (typeof window === 'undefined') return false;
    return window.innerWidth > window.innerHeight;
  }

  // Prevent scroll bounce on iOS
  preventScrollBounce(element?: HTMLElement): void {
    const target = element || document.body;

    target.style.overscrollBehavior = 'none';
    target.style.overscrollBehaviorY = 'none';
    target.style.webkitOverflowScrolling = 'touch';
  }

  // Enable smooth scrolling for mobile
  enableSmoothScrolling(element?: HTMLElement): void {
    const target = element || document.body;

    target.style.webkitOverflowScrolling = 'touch';
    target.style.scrollBehavior = 'smooth';
  }
}

// Hook for React components
export function useMobileViewport() {
  if (typeof window !== 'undefined') {
    const manager = MobileViewportManager.getInstance();

    // Initialize on first use
    if (!manager['isInitialized']) {
      manager.init();
    }

    return {
      updateViewportHeight: () => manager.updateViewportHeight(),
      isMobileDevice: () => manager.isMobileDevice(),
      getViewportHeight: () => manager.getViewportHeight(),
      isLandscape: () => manager.isLandscape(),
      applyMobilePageClass: (element: HTMLElement) => manager.applyMobilePageClass(element),
      removeMobilePageClass: (element: HTMLElement) => manager.removeMobilePageClass(element),
      preventScrollBounce: (element?: HTMLElement) => manager.preventScrollBounce(element),
      enableSmoothScrolling: (element?: HTMLElement) => manager.enableSmoothScrolling(element),
    };
  }

  // Return no-op functions for SSR
  return {
    updateViewportHeight: () => {},
    isMobileDevice: () => false,
    getViewportHeight: () => 0,
    isLandscape: () => false,
    applyMobilePageClass: () => {},
    removeMobilePageClass: () => {},
    preventScrollBounce: () => {},
    enableSmoothScrolling: () => {},
  };
}

// Auto-initialize when module loads
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      MobileViewportManager.getInstance().init();
    });
  } else {
    MobileViewportManager.getInstance().init();
  }
}

export default MobileViewportManager;