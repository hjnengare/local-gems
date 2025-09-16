// Rate limiting for client-side authentication attempts
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) { // 15 minutes
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const entry = this.attempts.get(key);

    if (!entry) {
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (now > entry.resetTime) {
      // Reset the counter
      this.attempts.set(key, { count: 1, resetTime: now + this.windowMs });
      return true;
    }

    if (entry.count >= this.maxAttempts) {
      return false;
    }

    entry.count++;
    return true;
  }

  getRemainingTime(key: string): number {
    const entry = this.attempts.get(key);
    if (!entry) return 0;

    const now = Date.now();
    return Math.max(0, entry.resetTime - now);
  }

  getAttempts(key: string): number {
    const entry = this.attempts.get(key);
    return entry?.count || 0;
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }

  // Clean up old entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.attempts.entries()) {
      if (now > entry.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// Global rate limiters for different operations
export const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes
export const emailRateLimiter = new RateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

// Clean up old entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    authRateLimiter.cleanup();
    emailRateLimiter.cleanup();
  }, 5 * 60 * 1000);
}

export default RateLimiter;