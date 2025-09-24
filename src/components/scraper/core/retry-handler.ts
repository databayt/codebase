import { RetryConfig } from '../type';

export class RetryHandler {
  private config: RetryConfig;

  constructor(config?: Partial<RetryConfig>) {
    this.config = {
      maxAttempts: config?.maxAttempts || 3,
      initialDelay: config?.initialDelay || 1000,
      maxDelay: config?.maxDelay || 30000,
      backoffFactor: config?.backoffFactor || 2,
    };
  }

  async execute<T>(
    fn: () => Promise<T>,
    context?: {
      url?: string;
      operation?: string;
    }
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;

        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error;
        }

        if (attempt < this.config.maxAttempts) {
          const delay = this.calculateDelay(attempt);

          console.log(
            `Retry attempt ${attempt}/${this.config.maxAttempts} for ${
              context?.operation || 'operation'
            }${context?.url ? ` (${context.url})` : ''} after ${delay}ms delay`
          );

          await this.sleep(delay);
        }
      }
    }

    // All retries exhausted
    throw new Error(
      `Failed after ${this.config.maxAttempts} attempts: ${lastError?.message || 'Unknown error'}`
    );
  }

  private calculateDelay(attempt: number): number {
    const exponentialDelay =
      this.config.initialDelay * Math.pow(this.config.backoffFactor, attempt - 1);

    // Add jitter to prevent thundering herd
    const jitter = Math.random() * 0.1 * exponentialDelay;

    return Math.min(exponentialDelay + jitter, this.config.maxDelay);
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private isNonRetryableError(error: any): boolean {
    // Don't retry on these error types
    const nonRetryableMessages = [
      '404',
      'not found',
      'forbidden',
      '403',
      'unauthorized',
      '401',
      'invalid url',
      'malformed',
    ];

    const errorMessage = error?.message?.toLowerCase() || '';

    return nonRetryableMessages.some(msg => errorMessage.includes(msg));
  }

  // Circuit breaker pattern for repeated failures
  private circuitBreaker = new Map<string, {
    failures: number;
    lastFailure: Date;
    isOpen: boolean;
  }>();

  async executeWithCircuitBreaker<T>(
    key: string,
    fn: () => Promise<T>,
    options?: {
      failureThreshold?: number;
      resetTimeout?: number;
    }
  ): Promise<T> {
    const failureThreshold = options?.failureThreshold || 5;
    const resetTimeout = options?.resetTimeout || 60000; // 1 minute

    const circuit = this.circuitBreaker.get(key);

    // Check if circuit is open
    if (circuit?.isOpen) {
      const timeSinceLastFailure =
        Date.now() - circuit.lastFailure.getTime();

      if (timeSinceLastFailure < resetTimeout) {
        throw new Error(`Circuit breaker open for ${key}`);
      } else {
        // Reset circuit after timeout
        circuit.isOpen = false;
        circuit.failures = 0;
      }
    }

    try {
      const result = await this.execute(fn);

      // Reset failures on success
      if (circuit) {
        circuit.failures = 0;
        circuit.isOpen = false;
      }

      return result;
    } catch (error) {
      // Track failures
      const currentCircuit = this.circuitBreaker.get(key) || {
        failures: 0,
        lastFailure: new Date(),
        isOpen: false,
      };

      currentCircuit.failures++;
      currentCircuit.lastFailure = new Date();

      if (currentCircuit.failures >= failureThreshold) {
        currentCircuit.isOpen = true;
        console.error(`Circuit breaker opened for ${key} after ${currentCircuit.failures} failures`);
      }

      this.circuitBreaker.set(key, currentCircuit);
      throw error;
    }
  }

  // Get circuit breaker status
  getCircuitStatus(key: string) {
    return this.circuitBreaker.get(key) || {
      failures: 0,
      lastFailure: null,
      isOpen: false,
    };
  }

  // Reset specific circuit
  resetCircuit(key: string) {
    this.circuitBreaker.delete(key);
  }

  // Reset all circuits
  resetAllCircuits() {
    this.circuitBreaker.clear();
  }
}

// Singleton instance for global use
export const globalRetryHandler = new RetryHandler();

// Helper function for simple retry
export async function withRetry<T>(
  fn: () => Promise<T>,
  options?: Partial<RetryConfig>
): Promise<T> {
  const handler = new RetryHandler(options);
  return handler.execute(fn);
}

// Helper function for retry with circuit breaker
export async function withCircuitBreaker<T>(
  key: string,
  fn: () => Promise<T>,
  options?: {
    retry?: Partial<RetryConfig>;
    failureThreshold?: number;
    resetTimeout?: number;
  }
): Promise<T> {
  const handler = new RetryHandler(options?.retry);
  return handler.executeWithCircuitBreaker(key, fn, options);
}