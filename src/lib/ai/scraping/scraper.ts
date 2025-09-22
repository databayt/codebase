export class WebScraper {
  async fetchPage(url: string): Promise<{ content?: string; error?: string }> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return { error: `Failed to fetch: ${response.statusText}` };
      }
      const content = await response.text();
      return { content };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Failed to fetch page' };
    }
  }

  htmlToMarkdown(html: string): string {
    // Basic HTML to markdown conversion
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n')
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n')
      .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n')
      .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<br[^>]*>/gi, '\n')
      .replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n')
      .replace(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
      .replace(/<[^>]+>/g, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  async scrapeWithStrategy(
    startUrl: string,
    strategy: 'breadth' | 'depth' = 'breadth',
    maxPages: number = 10
  ): Promise<Array<{ url: string; leads: any[] }>> {
    const results: Array<{ url: string; leads: any[] }> = [];
    const visited = new Set<string>();
    const queue = [startUrl];

    while (queue.length > 0 && results.length < maxPages) {
      const url = queue.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);

      const { content } = await this.fetchPage(url);
      if (content) {
        // Extract leads (simplified)
        const leads = this.extractLeadsFromContent(content);
        results.push({ url, leads });

        // Extract URLs from content for crawling
        const urls = this.extractUrls(content, url);
        if (strategy === 'breadth') {
          queue.push(...urls.slice(0, 5));
        } else {
          queue.unshift(...urls.slice(0, 5));
        }
      }
    }

    return results;
  }

  private extractLeadsFromContent(content: string): any[] {
    const leads: any[] = [];

    // Simple email extraction
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = content.match(emailRegex) || [];

    emails.forEach(email => {
      leads.push({
        email,
        name: 'Unknown',
        source: 'web-scraper'
      });
    });

    return leads;
  }

  private extractUrls(content: string, baseUrl: string): string[] {
    const urls: string[] = [];
    const urlRegex = /href=["']([^"']+)["']/gi;
    let match;

    while ((match = urlRegex.exec(content)) !== null) {
      try {
        const url = new URL(match[1], baseUrl).href;
        if (url.startsWith('http') && !url.includes('#')) {
          urls.push(url);
        }
      } catch {
        // Invalid URL, skip
      }
    }

    return [...new Set(urls)];
  }
}