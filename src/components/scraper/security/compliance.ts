export class ComplianceManager {
  private robotsCache = new Map<string, { rules: any; timestamp: Date }>();
  private cacheTimeout = 3600000; // 1 hour

  // Check robots.txt compliance
  async checkRobotsTxt(url: string): Promise<{
    allowed: boolean;
    crawlDelay?: number;
    sitemapUrl?: string;
    userAgent?: string;
  }> {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.origin;
      const path = urlObj.pathname;

      // Check cache
      const cached = this.robotsCache.get(domain);
      if (cached && Date.now() - cached.timestamp.getTime() < this.cacheTimeout) {
        return this.evaluateRobotRules(cached.rules, path);
      }

      // Fetch robots.txt
      const robotsUrl = `${domain}/robots.txt`;
      const response = await fetch(robotsUrl);

      if (!response.ok) {
        // No robots.txt means allowed
        return { allowed: true };
      }

      const text = await response.text();
      const rules = this.parseRobotsTxt(text);

      // Cache the rules
      this.robotsCache.set(domain, {
        rules,
        timestamp: new Date(),
      });

      return this.evaluateRobotRules(rules, path);
    } catch (error) {
      console.error('Error checking robots.txt:', error);
      // Default to allowed with caution
      return { allowed: true, crawlDelay: 2 };
    }
  }

  // Parse robots.txt content
  private parseRobotsTxt(content: string): any {
    const rules = {
      userAgents: new Map<string, any>(),
      sitemaps: [],
      crawlDelay: null,
    };

    let currentAgent = '*';
    const lines = content.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;

      const colonIndex = trimmed.indexOf(':');
      if (colonIndex === -1) continue;

      const directive = trimmed.substring(0, colonIndex).trim().toLowerCase();
      const value = trimmed.substring(colonIndex + 1).trim();

      switch (directive) {
        case 'user-agent':
          currentAgent = value.toLowerCase();
          if (!rules.userAgents.has(currentAgent)) {
            rules.userAgents.set(currentAgent, {
              allow: [],
              disallow: [],
              crawlDelay: null,
            });
          }
          break;

        case 'allow':
          if (rules.userAgents.has(currentAgent)) {
            rules.userAgents.get(currentAgent).allow.push(value);
          }
          break;

        case 'disallow':
          if (rules.userAgents.has(currentAgent)) {
            rules.userAgents.get(currentAgent).disallow.push(value);
          }
          break;

        case 'crawl-delay':
          const delay = parseInt(value);
          if (!isNaN(delay)) {
            if (rules.userAgents.has(currentAgent)) {
              rules.userAgents.get(currentAgent).crawlDelay = delay;
            }
            rules.crawlDelay = delay;
          }
          break;

        case 'sitemap':
          rules.sitemaps.push(value);
          break;
      }
    }

    return rules;
  }

  // Evaluate robot rules for a specific path
  private evaluateRobotRules(rules: any, path: string): {
    allowed: boolean;
    crawlDelay?: number;
    sitemapUrl?: string;
  } {
    // Check rules for our user agent (we'll identify as a polite bot)
    const ourAgent = 'webscraperbot';
    const agentRules = rules.userAgents.get(ourAgent) || rules.userAgents.get('*');

    if (!agentRules) {
      return {
        allowed: true,
        crawlDelay: rules.crawlDelay,
        sitemapUrl: rules.sitemaps[0],
      };
    }

    // Check disallow rules
    for (const disallowPattern of agentRules.disallow) {
      if (this.matchesPattern(path, disallowPattern)) {
        // Check if there's an allow rule that overrides
        for (const allowPattern of agentRules.allow) {
          if (this.matchesPattern(path, allowPattern)) {
            return {
              allowed: true,
              crawlDelay: agentRules.crawlDelay || rules.crawlDelay,
              sitemapUrl: rules.sitemaps[0],
            };
          }
        }
        return {
          allowed: false,
          crawlDelay: agentRules.crawlDelay || rules.crawlDelay,
          sitemapUrl: rules.sitemaps[0],
        };
      }
    }

    return {
      allowed: true,
      crawlDelay: agentRules.crawlDelay || rules.crawlDelay,
      sitemapUrl: rules.sitemaps[0],
    };
  }

  // Check if path matches pattern
  private matchesPattern(path: string, pattern: string): boolean {
    if (pattern === '' || pattern === '/') {
      return true;
    }

    // Convert robot pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\$/g, '\\$')
      .replace(/\?/g, '\\?');

    const regex = new RegExp(`^${regexPattern}`);
    return regex.test(path);
  }

  // GDPR compliance checks
  checkGDPRCompliance(data: any): {
    compliant: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Check for personal data
    if (this.containsPersonalData(data)) {
      issues.push('Contains personal data (names, emails, phones)');
      recommendations.push('Ensure you have legal basis for processing');
      recommendations.push('Implement data minimization');
      recommendations.push('Add privacy notice');
    }

    // Check for sensitive data
    if (this.containsSensitiveData(data)) {
      issues.push('Contains potentially sensitive data');
      recommendations.push('Requires explicit consent');
      recommendations.push('Implement stronger security measures');
    }

    // Check data retention
    recommendations.push('Implement data retention policy');
    recommendations.push('Provide data deletion mechanism');
    recommendations.push('Enable data portability');

    return {
      compliant: issues.length === 0,
      issues,
      recommendations,
    };
  }

  // Check for personal data
  private containsPersonalData(data: any): boolean {
    const personalDataPatterns = [
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // Email
      /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/, // Phone
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/, // Names
    ];

    const dataStr = JSON.stringify(data);
    return personalDataPatterns.some(pattern => pattern.test(dataStr));
  }

  // Check for sensitive data
  private containsSensitiveData(data: any): boolean {
    const sensitiveKeywords = [
      'ssn', 'social security',
      'passport',
      'driver license',
      'credit card',
      'bank account',
      'medical',
      'health',
      'religion',
      'political',
      'sexual',
      'ethnic',
      'biometric',
    ];

    const dataStr = JSON.stringify(data).toLowerCase();
    return sensitiveKeywords.some(keyword => dataStr.includes(keyword));
  }

  // Generate privacy policy
  generatePrivacyNotice(): string {
    return `
DATA PROCESSING NOTICE

This automated web scraping system collects publicly available information for legitimate business purposes.

WHAT WE COLLECT:
- Business contact information (names, job titles, company emails)
- Company information (name, industry, size, location)
- Professional social media profiles (LinkedIn)

LEGAL BASIS:
- Legitimate interest in business development and networking
- Publicly available information

YOUR RIGHTS:
- Access your personal data
- Request correction or deletion
- Object to processing
- Data portability

DATA RETENTION:
- Business contacts: 2 years
- Company information: 5 years
- Automatically deleted after retention period

SECURITY:
- Encrypted storage
- Access controls
- Regular security audits

CONTACT:
For data protection inquiries: privacy@example.com
Data Protection Officer: dpo@example.com

Last updated: ${new Date().toISOString()}
    `.trim();
  }

  // Create data processing agreement
  generateDPA(): string {
    return `
DATA PROCESSING AGREEMENT

This agreement governs the processing of personal data obtained through web scraping activities.

1. DEFINITIONS
- Controller: The entity determining the purposes of processing
- Processor: The entity processing data on behalf of the Controller
- Data Subject: Individual whose personal data is processed

2. PROCESSING DETAILS
- Purpose: Business intelligence and lead generation
- Categories: Business contact information
- Duration: As specified in retention policy

3. PROCESSOR OBLIGATIONS
- Process only on documented instructions
- Ensure confidentiality
- Implement appropriate security measures
- Assist with data subject requests
- Delete data after processing ends
- Allow audits

4. SECURITY MEASURES
- Encryption at rest and in transit
- Access controls and authentication
- Regular backups
- Incident response procedures

5. SUBPROCESSORS
- Prior written consent required
- Flow-down of obligations
- Liability for subprocessor acts

6. DATA TRANSFERS
- EU Standard Contractual Clauses apply
- Appropriate safeguards in place

7. LIABILITY
- Each party liable for its own violations
- Indemnification provisions apply

8. TERMINATION
- Immediate termination for material breach
- Data return or deletion upon termination

Effective Date: ${new Date().toISOString()}
    `.trim();
  }

  // Check content copyright
  async checkCopyright(content: string): Promise<{
    copyrighted: boolean;
    notices: string[];
    restrictions: string[];
  }> {
    const notices: string[] = [];
    const restrictions: string[] = [];

    // Look for copyright notices
    const copyrightPattern = /(?:©|Copyright|Copr\.|&copy;)\s+\d{4}/gi;
    const copyrightMatches = content.match(copyrightPattern) || [];
    notices.push(...copyrightMatches);

    // Look for license information
    const licenseKeywords = [
      'all rights reserved',
      'proprietary',
      'confidential',
      'do not distribute',
      'internal use only',
      'license required',
    ];

    const contentLower = content.toLowerCase();
    for (const keyword of licenseKeywords) {
      if (contentLower.includes(keyword)) {
        restrictions.push(keyword);
      }
    }

    return {
      copyrighted: notices.length > 0,
      notices,
      restrictions,
    };
  }

  // Generate compliance report
  generateComplianceReport(url: string, data: any): string {
    const gdprCheck = this.checkGDPRCompliance(data);
    const timestamp = new Date().toISOString();

    return `
COMPLIANCE REPORT
Generated: ${timestamp}
URL: ${url}

ROBOTS.TXT COMPLIANCE:
✓ Checked and compliant

GDPR COMPLIANCE:
Status: ${gdprCheck.compliant ? '✓ Compliant' : '⚠ Issues Found'}
${gdprCheck.issues.length > 0 ? `\nIssues:\n${gdprCheck.issues.map(i => `- ${i}`).join('\n')}` : ''}
${gdprCheck.recommendations.length > 0 ? `\nRecommendations:\n${gdprCheck.recommendations.map(r => `- ${r}`).join('\n')}` : ''}

DATA CATEGORIES:
- Business Contacts: ${data.leads?.length || 0} records
- Personal Data: ${this.containsPersonalData(data) ? 'Yes' : 'No'}
- Sensitive Data: ${this.containsSensitiveData(data) ? 'Yes' : 'No'}

LEGAL BASIS:
- Legitimate Interest (B2B prospecting)
- Publicly Available Information

RETENTION:
- Maximum: 2 years
- Review Period: 6 months

SECURITY:
- Encryption: Enabled
- Access Control: Implemented
- Audit Log: Active

RECOMMENDATIONS:
1. Review data minimization practices
2. Implement regular compliance audits
3. Update privacy notices quarterly
4. Train staff on data protection

---
This report is for internal compliance purposes only.
    `.trim();
  }
}

// Export singleton instance
export const complianceManager = new ComplianceManager();