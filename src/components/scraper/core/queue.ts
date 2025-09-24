import { EventEmitter } from 'events';
import { ScrapeQueueItem, QueueStatus, CrawlConfig } from '../type';

// Priority queue implementation
class PriorityQueue<T> {
  private items: { item: T; priority: number }[] = [];

  enqueue(item: T, priority: number) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift()?.item;
  }

  peek(): T | undefined {
    return this.items[0]?.item;
  }

  size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  clear() {
    this.items = [];
  }

  toArray(): T[] {
    return this.items.map(i => i.item);
  }
}

export class QueueManager extends EventEmitter {
  private queue = new PriorityQueue<ScrapeQueueItem>();
  private processing = new Set<string>();
  private completed = new Set<string>();
  private failed = new Map<string, string>(); // url -> error
  private visited = new Set<string>();
  private startTime: Date | null = null;
  private config: CrawlConfig;

  constructor(config: CrawlConfig) {
    super();
    this.config = config;
  }

  // Add URL to queue
  async addToQueue(
    url: string,
    options?: {
      priority?: number;
      depth?: number;
      parentUrl?: string;
    }
  ): Promise<void> {
    // Skip if already visited or in queue
    if (this.visited.has(url)) {
      return;
    }

    // Apply filters
    if (!this.shouldCrawl(url)) {
      return;
    }

    const item: ScrapeQueueItem = {
      url,
      priority: options?.priority || 0,
      depth: options?.depth || 0,
      parentUrl: options?.parentUrl,
      retries: 0,
      status: 'pending',
      addedAt: new Date(),
    };

    // Check max depth
    if (item.depth > this.config.maxDepth) {
      return;
    }

    // Check max pages
    if (this.getTotalProcessed() >= this.config.maxPages) {
      return;
    }

    this.queue.enqueue(item, item.priority);
    this.visited.add(url);
    this.emit('itemAdded', item);
  }

  // Add multiple URLs
  async addBatch(
    urls: string[],
    options?: {
      priority?: number;
      depth?: number;
      parentUrl?: string;
    }
  ): Promise<void> {
    for (const url of urls) {
      await this.addToQueue(url, options);
    }
  }

  // Get next item to process
  async getNext(): Promise<ScrapeQueueItem | null> {
    // Check concurrent limit
    if (this.processing.size >= this.config.concurrent) {
      return null;
    }

    const item = this.queue.dequeue();
    if (!item) {
      return null;
    }

    // Mark as processing
    item.status = 'processing';
    item.processedAt = new Date();
    this.processing.add(item.url);
    this.emit('itemStarted', item);

    return item;
  }

  // Mark item as completed
  markCompleted(url: string) {
    this.processing.delete(url);
    this.completed.add(url);
    this.emit('itemCompleted', url);

    // Check if all done
    if (this.isComplete()) {
      this.emit('queueComplete');
    }
  }

  // Mark item as failed
  markFailed(url: string, error: string, retry: boolean = true) {
    const wasProcessing = this.processing.has(url);
    this.processing.delete(url);

    if (retry) {
      // Find the original item and increment retries
      const item = this.findItem(url);
      if (item && item.retries < 3) {
        item.retries++;
        item.status = 'pending';
        item.error = error;
        // Re-add with lower priority
        this.queue.enqueue(item, item.priority - 1);
        this.emit('itemRetrying', item);
        return;
      }
    }

    this.failed.set(url, error);
    this.emit('itemFailed', { url, error });

    // Check if all done
    if (this.isComplete()) {
      this.emit('queueComplete');
    }
  }

  // Pause queue processing
  pause() {
    this.emit('queuePaused');
  }

  // Resume queue processing
  resume() {
    if (!this.startTime) {
      this.startTime = new Date();
    }
    this.emit('queueResumed');
  }

  // Clear the queue
  clear() {
    this.queue.clear();
    this.processing.clear();
    this.completed.clear();
    this.failed.clear();
    this.visited.clear();
    this.startTime = null;
    this.emit('queueCleared');
  }

  // Get queue status
  getStatus(): QueueStatus {
    const totalUrls = this.visited.size;
    const processed = this.completed.size + this.failed.size;
    const avgTime = this.calculateAverageTime();
    const remaining = this.queue.size();

    return {
      pending: this.queue.size(),
      processing: this.processing.size,
      completed: this.completed.size,
      failed: this.failed.size,
      totalUrls,
      averageProcessingTime: avgTime,
      estimatedTimeRemaining: remaining * avgTime,
    };
  }

  // Get detailed statistics
  getStatistics() {
    const runtime = this.startTime
      ? Date.now() - this.startTime.getTime()
      : 0;

    return {
      ...this.getStatus(),
      runtime,
      throughput: this.completed.size / (runtime / 1000) || 0,
      successRate:
        (this.completed.size / (this.completed.size + this.failed.size)) *
          100 || 0,
      failedUrls: Array.from(this.failed.entries()),
      processingUrls: Array.from(this.processing),
    };
  }

  // Stream results as they complete
  async *stream(): AsyncGenerator<ScrapeQueueItem> {
    while (!this.isComplete()) {
      const item = await this.getNext();
      if (item) {
        yield item;
      } else {
        // Wait a bit if no items available
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
  }

  // Check if queue is complete
  isComplete(): boolean {
    return (
      this.queue.isEmpty() &&
      this.processing.size === 0 &&
      (this.completed.size + this.failed.size) > 0
    );
  }

  // Check if URL should be crawled based on filters
  private shouldCrawl(url: string): boolean {
    // Check domain restriction
    if (this.config.filters.sameDomainOnly) {
      const baseDomain = this.extractDomain(this.config.startUrl);
      const urlDomain = this.extractDomain(url);
      if (baseDomain !== urlDomain) {
        return false;
      }
    }

    // Check include patterns
    if (this.config.filters.includePatterns.length > 0) {
      const matches = this.config.filters.includePatterns.some(pattern =>
        url.includes(pattern)
      );
      if (!matches) {
        return false;
      }
    }

    // Check exclude patterns
    if (this.config.filters.excludePatterns.length > 0) {
      const matches = this.config.filters.excludePatterns.some(pattern =>
        url.includes(pattern)
      );
      if (matches) {
        return false;
      }
    }

    return true;
  }

  private findItem(url: string): ScrapeQueueItem | undefined {
    return this.queue.toArray().find(item => item.url === url);
  }

  private getTotalProcessed(): number {
    return this.completed.size + this.failed.size + this.processing.size;
  }

  private calculateAverageTime(): number {
    if (this.completed.size === 0) {
      return 5000; // Default estimate
    }

    const runtime = this.startTime
      ? Date.now() - this.startTime.getTime()
      : 0;

    return runtime / this.completed.size;
  }

  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return '';
    }
  }
}

// Queued crawler implementation
export class QueuedCrawler {
  private queueManager: QueueManager;
  private config: CrawlConfig;
  public stats: {
    processed: number;
    queued: number;
    errors: number;
  };

  constructor(config: CrawlConfig & { startUrl: string }) {
    this.config = config;
    this.queueManager = new QueueManager(config);
    this.stats = {
      processed: 0,
      queued: 0,
      errors: 0,
    };

    // Add start URL
    this.queueManager.addToQueue(config.startUrl, {
      priority: 10,
      depth: 0,
    });
  }

  // Stream pages as they're crawled
  async *stream() {
    for await (const item of this.queueManager.stream()) {
      // This would normally scrape the page
      // For now, we'll yield the queue item
      yield item;

      // Update stats
      this.stats.processed++;
      this.stats.queued = this.queueManager.getStatus().pending;
    }
  }

  // Add URLs to queue
  async addUrls(urls: string[], parentUrl: string, depth: number) {
    await this.queueManager.addBatch(urls, {
      parentUrl,
      depth: depth + 1,
      priority: Math.max(0, 10 - depth),
    });
  }

  // Get queue status
  getStatus() {
    return this.queueManager.getStatus();
  }

  // Pause crawling
  pause() {
    this.queueManager.pause();
  }

  // Resume crawling
  resume() {
    this.queueManager.resume();
  }

  // Stop crawling
  stop() {
    this.queueManager.clear();
  }
}

// Helper to create a crawler
export function createCrawler(config: CrawlConfig & { startUrl: string }) {
  return new QueuedCrawler(config);
}