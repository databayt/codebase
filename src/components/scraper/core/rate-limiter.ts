import { RateLimitConfig } from '../type';

// Token bucket algorithm for rate limiting
class TokenBucket {
  private tokens: number;
  private lastRefill: Date;

  constructor(
    private capacity: number,
    private refillRate: number, // tokens per second
  ) {
    this.tokens = capacity;
    this.lastRefill = new Date();
  }

  async takeToken(): Promise<boolean> {
    this.refill();

    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }

    return false;
  }

  async waitForToken(): Promise<void> {
    while (!(await this.takeToken())) {
      const waitTime = Math.ceil(1000 / this.refillRate);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  private refill() {
    const now = new Date();
    const timePassed = (now.getTime() - this.lastRefill.getTime()) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  getAvailableTokens(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}

export class RateLimiter {
  private limiters = new Map<string, TokenBucket>();
  private domainDelays = new Map<string, number>();
  private lastRequestTime = new Map<string, Date>();
  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = {
      requests: config?.requests || 10,
      period: config?.period || 60, // seconds
      adaptiveBackoff: config?.adaptiveBackoff ?? true,
      respectCrawlDelay: config?.respectCrawlDelay ?? true,
    };
  }

  async checkLimit(url: string): Promise<boolean> {
    const domain = this.extractDomain(url);

    if (!this.limiters.has(domain)) {
      // Create new token bucket for this domain
      const tokensPerSecond = this.config.requests / this.config.period;
      this.limiters.set(
        domain,
        new TokenBucket(this.config.requests, tokensPerSecond)
      );
    }

    const limiter = this.limiters.get(domain)!;
    return await limiter.takeToken();
  }

  async waitForSlot(url: string): Promise<void> {
    const domain = this.extractDomain(url);

    // Check custom domain delay (from robots.txt or rate limit headers)
    const customDelay = this.domainDelays.get(domain);
    if (customDelay) {
      const lastRequest = this.lastRequestTime.get(domain);
      if (lastRequest) {
        const timeSinceLastRequest = Date.now() - lastRequest.getTime();
        if (timeSinceLastRequest < customDelay) {
          await this.sleep(customDelay - timeSinceLastRequest);
        }
      }
    }

    // Wait for token from rate limiter
    if (!this.limiters.has(domain)) {
      const tokensPerSecond = this.config.requests / this.config.period;
      this.limiters.set(
        domain,
        new TokenBucket(this.config.requests, tokensPerSecond)
      );
    }

    const limiter = this.limiters.get(domain)!;
    await limiter.waitForToken();

    // Update last request time
    this.lastRequestTime.set(domain, new Date());
  }

  // Update rate limits based on response headers
  updateLimits(url: string, headers: Headers) {
    const domain = this.extractDomain(url);

    // Check for rate limit headers
    const rateLimitLimit = headers.get('x-ratelimit-limit');
    const rateLimitRemaining = headers.get('x-ratelimit-remaining');
    const rateLimitReset = headers.get('x-ratelimit-reset');
    const retryAfter = headers.get('retry-after');

    if (this.config.adaptiveBackoff) {
      if (retryAfter) {
        // Server explicitly told us to wait
        const delay = this.parseRetryAfter(retryAfter);
        this.domainDelays.set(domain, delay);
        console.log(`Adaptive backoff: Setting delay for ${domain} to ${delay}ms`);
      } else if (rateLimitRemaining !== null && parseInt(rateLimitRemaining) === 0) {
        // We've hit the rate limit
        if (rateLimitReset) {
          const resetTime = parseInt(rateLimitReset) * 1000;
          const delay = Math.max(0, resetTime - Date.now());
          this.domainDelays.set(domain, delay);
          console.log(`Rate limit hit: Backing off ${domain} for ${delay}ms`);
        }
      }

      // Update token bucket if we have rate limit info
      if (rateLimitLimit && rateLimitReset) {
        const limit = parseInt(rateLimitLimit);
        const resetTime = parseInt(rateLimitReset);
        const period = Math.max(1, (resetTime - Date.now() / 1000));
        const tokensPerSecond = limit / period;

        // Create new, more restrictive limiter
        this.limiters.set(
          domain,
          new TokenBucket(limit, tokensPerSecond)
        );
      }
    }
  }

  // Set crawl delay from robots.txt
  setCrawlDelay(domain: string, delaySeconds: number) {
    if (this.config.respectCrawlDelay) {
      this.domainDelays.set(domain, delaySeconds * 1000);
      console.log(`Set crawl delay for ${domain}: ${delaySeconds}s`);
    }
  }

  // Get backoff time for a domain
  getBackoffTime(url: string): number {
    const domain = this.extractDomain(url);
    return this.domainDelays.get(domain) || 0;
  }

  // Check if we should back off from a domain
  shouldBackoff(url: string): boolean {
    const domain = this.extractDomain(url);
    const backoffTime = this.domainDelays.get(domain);

    if (!backoffTime) return false;

    const lastRequest = this.lastRequestTime.get(domain);
    if (!lastRequest) return false;

    return Date.now() - lastRequest.getTime() < backoffTime;
  }

  // Reset rate limit for a domain
  resetLimit(url: string) {
    const domain = this.extractDomain(url);
    this.limiters.delete(domain);
    this.domainDelays.delete(domain);
    this.lastRequestTime.delete(domain);
  }

  // Get current status for a domain
  getStatus(url: string) {
    const domain = this.extractDomain(url);
    const limiter = this.limiters.get(domain);

    return {
      domain,
      availableTokens: limiter?.getAvailableTokens() || this.config.requests,
      backoffTime: this.domainDelays.get(domain) || 0,
      lastRequest: this.lastRequestTime.get(domain) || null,
    };
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return 'unknown';
    }
  }

  private parseRetryAfter(retryAfter: string): number {
    // Retry-After can be in seconds or HTTP date
    const seconds = parseInt(retryAfter);
    if (!isNaN(seconds)) {
      return seconds * 1000;
    }

    // Try to parse as date
    const retryDate = new Date(retryAfter);
    if (!isNaN(retryDate.getTime())) {
      return Math.max(0, retryDate.getTime() - Date.now());
    }

    // Default to 1 minute
    return 60000;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Global rate limiter instance
export const globalRateLimiter = new RateLimiter();

// Helper function to create domain-specific rate limiter
export function createRateLimiter(config?: Partial<RateLimitConfig>): RateLimiter {
  return new RateLimiter(config);
}

// Decorator for rate-limited functions
export function rateLimited(config?: Partial<RateLimitConfig>) {
  const limiter = new RateLimiter(config);

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const url = args[0]; // Assume first argument is URL
      if (typeof url === 'string') {
        await limiter.waitForSlot(url);
      }
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}