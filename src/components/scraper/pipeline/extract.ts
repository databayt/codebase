import { ExtractedLead, CompanyInfo, ScrapedPage } from '../type';

export class DataExtractor {
  // Extract leads from HTML content
  async extractLeads(content: string): Promise<ExtractedLead[]> {
    const leads: ExtractedLead[] = [];

    // Email pattern
    const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const emails = content.match(emailPattern) || [];

    // Phone pattern (supports various formats)
    const phonePattern = /(\+?[\d\s\(\)\-\.]+[\d])/g;
    const phones = this.extractPhones(content);

    // LinkedIn URLs
    const linkedinPattern = /https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+/g;
    const linkedinUrls = content.match(linkedinPattern) || [];

    // Name extraction (simplified - would use NLP in production)
    const names = this.extractNames(content);

    // Combine extracted data
    for (let i = 0; i < Math.max(emails.length, names.length); i++) {
      const lead: ExtractedLead = {
        name: names[i] || 'Unknown',
        email: emails[i],
        phone: phones[i],
        linkedinUrl: linkedinUrls[i],
        confidence: this.calculateConfidence({
          hasEmail: !!emails[i],
          hasName: !!names[i],
          hasPhone: !!phones[i],
        }),
        sourceUrl: '',
        extractedAt: new Date(),
      };

      // Extract additional context
      if (emails[i]) {
        lead.context = this.extractContext(content, emails[i]);
        const titleInfo = this.extractTitleFromContext(lead.context);
        lead.title = titleInfo.title;
        lead.department = titleInfo.department;
        lead.seniority = titleInfo.seniority;
      }

      leads.push(lead);
    }

    return leads;
  }

  // Extract company information
  async extractCompanyInfo(content: string, url: string): Promise<CompanyInfo | null> {
    const domain = new URL(url).hostname.replace('www.', '');

    const companyInfo: CompanyInfo = {
      name: this.extractCompanyName(content, domain),
      domain,
      description: this.extractDescription(content),
      industry: this.extractIndustry(content),
      size: this.extractCompanySize(content),
      location: this.extractLocation(content),
      founded: this.extractFoundedYear(content),
      website: url,
      socialProfiles: this.extractSocialProfiles(content),
      technologies: this.detectTechnologies(content),
      services: this.extractServices(content),
    };

    // Only return if we have meaningful data
    if (companyInfo.name && companyInfo.name !== domain) {
      return companyInfo;
    }

    return null;
  }

  // Extract structured data from JSON-LD
  extractStructuredData(html: string): any {
    const jsonLdPattern = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
    const matches = html.matchAll(jsonLdPattern);
    const structuredData = [];

    for (const match of matches) {
      try {
        const data = JSON.parse(match[1]);
        structuredData.push(data);
      } catch (e) {
        // Invalid JSON, skip
      }
    }

    return structuredData;
  }

  // Extract meta tags
  extractMetaTags(html: string): Record<string, string> {
    const metaTags: Record<string, string> = {};
    const metaPattern = /<meta\s+(?:name|property)="([^"]+)"\s+content="([^"]+)"/g;
    const matches = html.matchAll(metaPattern);

    for (const match of matches) {
      metaTags[match[1]] = match[2];
    }

    return metaTags;
  }

  // Helper methods
  private extractPhones(content: string): string[] {
    const phonePatterns = [
      /(\+\d{1,3}[-.\s]?)?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}/g,
      /(\+\d{1,3}\s?)?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/g,
    ];

    const phones = new Set<string>();
    for (const pattern of phonePatterns) {
      const matches = content.match(pattern) || [];
      matches.forEach(phone => {
        // Clean and validate
        const cleaned = phone.replace(/[^\d+]/g, '');
        if (cleaned.length >= 10 && cleaned.length <= 15) {
          phones.add(phone);
        }
      });
    }

    return Array.from(phones);
  }

  private extractNames(content: string): string[] {
    const names: string[] = [];

    // Look for common name patterns
    const namePatterns = [
      /(?:Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
      /([A-Z][a-z]+\s+[A-Z][a-z]+)\s*,\s*(?:CEO|CTO|CFO|Director|Manager|Lead)/g,
      /Contact:\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/g,
    ];

    for (const pattern of namePatterns) {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        names.push(match[1]);
      }
    }

    return [...new Set(names)];
  }

  private extractContext(content: string, target: string): string {
    const index = content.indexOf(target);
    if (index === -1) return '';

    const start = Math.max(0, index - 200);
    const end = Math.min(content.length, index + 200);

    return content.substring(start, end);
  }

  private extractTitleFromContext(context: string): {
    title?: string;
    department?: string;
    seniority?: 'entry' | 'mid' | 'senior' | 'executive';
  } {
    const titles = {
      executive: ['CEO', 'CTO', 'CFO', 'COO', 'President', 'VP', 'Vice President', 'Director'],
      senior: ['Senior', 'Lead', 'Principal', 'Manager', 'Head'],
      mid: ['Developer', 'Engineer', 'Designer', 'Analyst', 'Specialist'],
      entry: ['Junior', 'Intern', 'Associate', 'Assistant'],
    };

    const departments = {
      engineering: ['Engineering', 'Development', 'Technical', 'IT'],
      sales: ['Sales', 'Business Development', 'Account'],
      marketing: ['Marketing', 'Growth', 'Brand', 'Content'],
      operations: ['Operations', 'Admin', 'HR', 'Finance'],
    };

    let foundTitle: string | undefined;
    let foundSeniority: 'entry' | 'mid' | 'senior' | 'executive' | undefined;
    let foundDepartment: string | undefined;

    // Check for titles
    for (const [level, keywords] of Object.entries(titles)) {
      for (const keyword of keywords) {
        if (context.includes(keyword)) {
          foundTitle = keyword;
          foundSeniority = level as any;
          break;
        }
      }
    }

    // Check for departments
    for (const [dept, keywords] of Object.entries(departments)) {
      for (const keyword of keywords) {
        if (context.includes(keyword)) {
          foundDepartment = dept;
          break;
        }
      }
    }

    return {
      title: foundTitle,
      department: foundDepartment,
      seniority: foundSeniority,
    };
  }

  private calculateConfidence(factors: {
    hasEmail: boolean;
    hasName: boolean;
    hasPhone: boolean;
  }): number {
    let score = 0;

    if (factors.hasEmail) score += 0.4;
    if (factors.hasName) score += 0.3;
    if (factors.hasPhone) score += 0.3;

    return Math.min(1, score);
  }

  private extractCompanyName(content: string, domain: string): string {
    // Try to find company name in common patterns
    const patterns = [
      /<title>([^<]+)<\/title>/i,
      /company[:\s]+([^,\n]+)/i,
      /(?:©|Copyright)\s+\d{4}\s+([^,\n]+)/i,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback to domain
    return domain.split('.')[0];
  }

  private extractDescription(content: string): string {
    const match = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
    return match ? match[1] : '';
  }

  private extractIndustry(content: string): string {
    const industries = [
      'Technology', 'Software', 'Healthcare', 'Finance', 'Education',
      'Retail', 'Manufacturing', 'Consulting', 'Media', 'Real Estate',
    ];

    for (const industry of industries) {
      if (content.toLowerCase().includes(industry.toLowerCase())) {
        return industry;
      }
    }

    return '';
  }

  private extractCompanySize(content: string): string {
    const sizePatterns = [
      /(\d+[-+]?\d*)\s*employees/i,
      /team of\s+(\d+)/i,
      /(\d+)\s*people/i,
    ];

    for (const pattern of sizePatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1] + ' employees';
      }
    }

    return '';
  }

  private extractLocation(content: string): string {
    // Simple location extraction - would use geocoding API in production
    const locationPattern = /(?:Location|Headquarters|Based in)[:\s]+([^,\n]+)/i;
    const match = content.match(locationPattern);
    return match ? match[1].trim() : '';
  }

  private extractFoundedYear(content: string): string {
    const patterns = [
      /(?:Founded|Established|Since)[:\s]+(\d{4})/i,
      /©\s*(\d{4})/,
    ];

    for (const pattern of patterns) {
      const match = content.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return '';
  }

  private extractSocialProfiles(content: string): any[] {
    const profiles = [];
    const socialPatterns = {
      linkedin: /https?:\/\/(www\.)?linkedin\.com\/company\/[a-zA-Z0-9-]+/g,
      twitter: /https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+/g,
      facebook: /https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+/g,
      instagram: /https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+/g,
    };

    for (const [platform, pattern] of Object.entries(socialPatterns)) {
      const matches = content.match(pattern);
      if (matches) {
        profiles.push({
          platform,
          url: matches[0],
        });
      }
    }

    return profiles;
  }

  private detectTechnologies(content: string): string[] {
    const technologies = [];
    const techIndicators = {
      'React': ['react', 'jsx', 'useState'],
      'Angular': ['ng-', 'angular'],
      'Vue': ['v-if', 'v-for', 'vue'],
      'WordPress': ['wp-content', 'wordpress'],
      'Shopify': ['shopify', 'myshopify'],
      'Next.js': ['_next', 'nextjs'],
      'Node.js': ['node', 'express'],
    };

    for (const [tech, indicators] of Object.entries(techIndicators)) {
      if (indicators.some(indicator => content.includes(indicator))) {
        technologies.push(tech);
      }
    }

    return technologies;
  }

  private extractServices(content: string): string[] {
    const services = [];
    const serviceKeywords = [
      'consulting', 'development', 'design', 'marketing',
      'analytics', 'support', 'training', 'integration',
    ];

    for (const keyword of serviceKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        services.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    }

    return services;
  }
}

// Export singleton instance
export const dataExtractor = new DataExtractor();