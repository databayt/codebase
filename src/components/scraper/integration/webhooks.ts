import { EventEmitter } from 'events';
import { WebhookConfig } from '../type';

export class WebhookManager extends EventEmitter {
  private webhooks = new Map<string, WebhookConfig>();
  private deliveryHistory = new Map<string, any[]>();
  private retryQueue: Array<{
    webhookId: string;
    payload: any;
    attempt: number;
    nextRetry: Date;
  }> = [];

  // Register a new webhook
  register(config: WebhookConfig): string {
    const id = crypto.randomUUID();
    this.webhooks.set(id, config);
    this.deliveryHistory.set(id, []);

    console.log(`Webhook registered: ${id} -> ${config.url}`);
    return id;
  }

  // Unregister a webhook
  unregister(id: string): boolean {
    const existed = this.webhooks.delete(id);
    this.deliveryHistory.delete(id);
    return existed;
  }

  // Trigger webhooks for an event
  async trigger(event: string, data: any): Promise<void> {
    const webhooksToTrigger = Array.from(this.webhooks.entries()).filter(
      ([_, config]) => config.events.includes(event) || config.events.includes('*')
    );

    const promises = webhooksToTrigger.map(([id, config]) =>
      this.sendWebhook(id, config, { event, data, timestamp: new Date() })
    );

    await Promise.allSettled(promises);
  }

  // Send webhook with retry logic
  private async sendWebhook(
    id: string,
    config: WebhookConfig,
    payload: any,
    attempt: number = 1
  ): Promise<void> {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'X-Webhook-Id': id,
        'X-Webhook-Event': payload.event,
        'X-Webhook-Timestamp': payload.timestamp.toISOString(),
        'X-Webhook-Signature': this.generateSignature(payload),
        ...config.headers,
      };

      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30 second timeout
      });

      const delivery = {
        id: crypto.randomUUID(),
        webhookId: id,
        timestamp: new Date(),
        status: response.status,
        statusText: response.statusText,
        attempt,
        payload,
        response: await this.safeParseResponse(response),
      };

      this.deliveryHistory.get(id)?.push(delivery);

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      console.log(`Webhook delivered successfully: ${id}`);
      this.emit('delivered', { webhookId: id, delivery });
    } catch (error) {
      console.error(`Webhook delivery failed (attempt ${attempt}):`, error);

      const maxAttempts = config.retryPolicy?.maxAttempts || 3;

      if (attempt < maxAttempts) {
        // Schedule retry
        const backoff = config.retryPolicy?.backoff || 'exponential';
        const delay = this.calculateRetryDelay(attempt, backoff);

        this.retryQueue.push({
          webhookId: id,
          payload,
          attempt: attempt + 1,
          nextRetry: new Date(Date.now() + delay),
        });

        console.log(`Webhook ${id} scheduled for retry in ${delay}ms`);
        this.emit('retrying', { webhookId: id, attempt, nextRetry: new Date(Date.now() + delay) });

        // Schedule the retry
        setTimeout(() => {
          this.processRetryQueue();
        }, delay);
      } else {
        console.error(`Webhook ${id} failed after ${attempt} attempts`);
        this.emit('failed', { webhookId: id, error, attempts: attempt });

        // Add to failed deliveries
        const delivery = {
          id: crypto.randomUUID(),
          webhookId: id,
          timestamp: new Date(),
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
          attempt,
          payload,
        };

        this.deliveryHistory.get(id)?.push(delivery);
      }
    }
  }

  // Process retry queue
  private async processRetryQueue(): Promise<void> {
    const now = new Date();
    const toRetry = this.retryQueue.filter(item => item.nextRetry <= now);

    for (const item of toRetry) {
      const config = this.webhooks.get(item.webhookId);
      if (config) {
        await this.sendWebhook(item.webhookId, config, item.payload, item.attempt);
      }

      // Remove from retry queue
      const index = this.retryQueue.indexOf(item);
      if (index > -1) {
        this.retryQueue.splice(index, 1);
      }
    }
  }

  // Calculate retry delay based on backoff strategy
  private calculateRetryDelay(attempt: number, backoff: 'linear' | 'exponential'): number {
    const baseDelay = 1000; // 1 second

    if (backoff === 'linear') {
      return baseDelay * attempt;
    } else {
      // Exponential backoff with jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.1 * exponentialDelay;
      return Math.min(exponentialDelay + jitter, 300000); // Max 5 minutes
    }
  }

  // Generate signature for webhook payload
  private generateSignature(payload: any): string {
    // In production, use HMAC with a shared secret
    const content = JSON.stringify(payload);
    return Buffer.from(content).toString('base64').substring(0, 32);
  }

  // Safely parse response
  private async safeParseResponse(response: Response): Promise<any> {
    try {
      const text = await response.text();
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch {
      return null;
    }
  }

  // Get delivery status for a webhook
  getDeliveryStatus(webhookId: string): {
    total: number;
    successful: number;
    failed: number;
    pending: number;
    lastDelivery?: any;
  } {
    const history = this.deliveryHistory.get(webhookId) || [];
    const pending = this.retryQueue.filter(item => item.webhookId === webhookId).length;

    const successful = history.filter((d: any) => d.status >= 200 && d.status < 300).length;
    const failed = history.filter((d: any) => d.status === 'failed' || d.status >= 400).length;

    return {
      total: history.length,
      successful,
      failed,
      pending,
      lastDelivery: history[history.length - 1],
    };
  }

  // Get all registered webhooks
  getWebhooks(): Array<{ id: string; config: WebhookConfig; status: any }> {
    return Array.from(this.webhooks.entries()).map(([id, config]) => ({
      id,
      config,
      status: this.getDeliveryStatus(id),
    }));
  }

  // Test a webhook
  async testWebhook(id: string): Promise<{ success: boolean; error?: string }> {
    const config = this.webhooks.get(id);
    if (!config) {
      return { success: false, error: 'Webhook not found' };
    }

    try {
      await this.sendWebhook(id, config, {
        event: 'test',
        data: { message: 'This is a test webhook delivery' },
        timestamp: new Date(),
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Test failed',
      };
    }
  }

  // Bulk trigger webhooks
  async bulkTrigger(events: Array<{ event: string; data: any }>): Promise<void> {
    const promises = events.map(({ event, data }) => this.trigger(event, data));
    await Promise.allSettled(promises);
  }

  // Clear delivery history
  clearHistory(webhookId?: string): void {
    if (webhookId) {
      this.deliveryHistory.set(webhookId, []);
    } else {
      this.deliveryHistory.clear();
    }
  }

  // Get retry queue status
  getRetryQueueStatus(): Array<{
    webhookId: string;
    attempt: number;
    nextRetry: Date;
  }> {
    return this.retryQueue.map(item => ({
      webhookId: item.webhookId,
      attempt: item.attempt,
      nextRetry: item.nextRetry,
    }));
  }
}

// Webhook event types
export const WebhookEvents = {
  // Scraping events
  SCRAPE_STARTED: 'scrape.started',
  SCRAPE_COMPLETED: 'scrape.completed',
  SCRAPE_FAILED: 'scrape.failed',

  // Lead events
  LEAD_EXTRACTED: 'lead.extracted',
  LEAD_VALIDATED: 'lead.validated',
  LEAD_EXPORTED: 'lead.exported',

  // Queue events
  QUEUE_STARTED: 'queue.started',
  QUEUE_COMPLETED: 'queue.completed',
  QUEUE_PAUSED: 'queue.paused',

  // Error events
  ERROR_RATE_LIMIT: 'error.rate_limit',
  ERROR_ROBOTS_BLOCKED: 'error.robots_blocked',
  ERROR_PARSING: 'error.parsing',

  // System events
  SYSTEM_READY: 'system.ready',
  SYSTEM_SHUTDOWN: 'system.shutdown',
  WORKER_STARTED: 'worker.started',
  WORKER_STOPPED: 'worker.stopped',
};

// Predefined webhook templates
export const WebhookTemplates = {
  slack: (webhookUrl: string): WebhookConfig => ({
    url: webhookUrl,
    events: ['scrape.completed', 'scrape.failed', 'queue.completed'],
    headers: {
      'Content-Type': 'application/json',
    },
    retryPolicy: {
      maxAttempts: 3,
      backoff: 'exponential',
    },
  }),

  zapier: (webhookUrl: string): WebhookConfig => ({
    url: webhookUrl,
    events: ['lead.extracted', 'lead.validated'],
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'WebScraper/1.0',
    },
    retryPolicy: {
      maxAttempts: 5,
      backoff: 'exponential',
    },
  }),

  discord: (webhookUrl: string): WebhookConfig => ({
    url: webhookUrl,
    events: ['*'], // All events
    headers: {
      'Content-Type': 'application/json',
    },
    retryPolicy: {
      maxAttempts: 2,
      backoff: 'linear',
    },
  }),

  custom: (url: string, events: string[]): WebhookConfig => ({
    url,
    events,
    headers: {},
    retryPolicy: {
      maxAttempts: 3,
      backoff: 'exponential',
    },
  }),
};

// Export singleton instance
export const webhookManager = new WebhookManager();