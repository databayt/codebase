import { ExtractedLead, CompanyInfo } from '../type';

export class DataTransformer {
  // Transform and normalize lead data
  transformLead(lead: ExtractedLead): ExtractedLead {
    return {
      ...lead,
      name: this.normalizeName(lead.name),
      email: this.normalizeEmail(lead.email),
      phone: this.normalizePhone(lead.phone),
      title: this.normalizeTitle(lead.title),
      company: this.normalizeCompany(lead.company),
      location: this.normalizeLocation(lead.location),
    };
  }

  // Batch transform leads
  transformLeads(leads: ExtractedLead[]): ExtractedLead[] {
    return leads.map(lead => this.transformLead(lead));
  }

  // Transform company info
  transformCompanyInfo(company: CompanyInfo): CompanyInfo {
    return {
      ...company,
      name: this.normalizeCompany(company.name),
      domain: this.normalizeDomain(company.domain),
      size: this.normalizeCompanySize(company.size),
      location: this.normalizeLocation(company.location),
      technologies: this.deduplicateArray(company.technologies || []),
      services: this.deduplicateArray(company.services || []),
    };
  }

  // Normalize name
  private normalizeName(name: string): string {
    if (!name) return name;

    // Remove extra spaces
    name = name.trim().replace(/\s+/g, ' ');

    // Proper case
    return name
      .split(' ')
      .map(part =>
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
      )
      .join(' ');
  }

  // Normalize email
  private normalizeEmail(email?: string): string | undefined {
    if (!email) return email;

    // Lowercase and trim
    email = email.toLowerCase().trim();

    // Remove common invalid patterns
    if (email.includes('example.com') || email.includes('test.com')) {
      return undefined;
    }

    return email;
  }

  // Normalize phone
  private normalizePhone(phone?: string): string | undefined {
    if (!phone) return phone;

    // Remove all non-numeric except + at start
    let normalized = phone.replace(/[^\d+]/g, '');

    // Format US numbers
    if (normalized.length === 10) {
      normalized = `+1${normalized}`;
    } else if (normalized.length === 11 && normalized.startsWith('1')) {
      normalized = `+${normalized}`;
    }

    return normalized;
  }

  // Normalize title
  private normalizeTitle(title?: string): string | undefined {
    if (!title) return title;

    // Common abbreviation expansions
    const expansions: Record<string, string> = {
      'CEO': 'Chief Executive Officer',
      'CTO': 'Chief Technology Officer',
      'CFO': 'Chief Financial Officer',
      'COO': 'Chief Operating Officer',
      'VP': 'Vice President',
      'Sr': 'Senior',
      'Jr': 'Junior',
      'Mgr': 'Manager',
      'Dir': 'Director',
      'Eng': 'Engineer',
      'Dev': 'Developer',
    };

    let normalized = title.trim();

    // Expand abbreviations
    for (const [abbr, full] of Object.entries(expansions)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
      normalized = normalized.replace(regex, full);
    }

    // Proper case
    return normalized
      .split(' ')
      .map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      )
      .join(' ');
  }

  // Normalize company name
  private normalizeCompany(company?: string): string | undefined {
    if (!company) return company;

    // Remove common suffixes
    const suffixes = [
      ', Inc.',
      ' Inc.',
      ', LLC',
      ' LLC',
      ', Ltd.',
      ' Ltd.',
      ', Corp.',
      ' Corp.',
      ', Co.',
      ' Co.',
    ];

    let normalized = company.trim();

    for (const suffix of suffixes) {
      if (normalized.endsWith(suffix)) {
        normalized = normalized.slice(0, -suffix.length);
      }
    }

    return normalized;
  }

  // Normalize location
  private normalizeLocation(location?: string): string | undefined {
    if (!location) return location;

    // Basic normalization
    location = location.trim();

    // Expand common abbreviations
    const stateAbbreviations: Record<string, string> = {
      'CA': 'California',
      'NY': 'New York',
      'TX': 'Texas',
      'FL': 'Florida',
      'WA': 'Washington',
      'MA': 'Massachusetts',
      'IL': 'Illinois',
      'PA': 'Pennsylvania',
      // Add more as needed
    };

    for (const [abbr, full] of Object.entries(stateAbbreviations)) {
      const regex = new RegExp(`\\b${abbr}\\b`, 'g');
      location = location.replace(regex, full);
    }

    return location;
  }

  // Normalize domain
  private normalizeDomain(domain: string): string {
    // Remove www. prefix
    domain = domain.replace(/^www\./, '');

    // Lowercase
    return domain.toLowerCase();
  }

  // Normalize company size
  private normalizeCompanySize(size?: string): string | undefined {
    if (!size) return size;

    // Extract number range
    const match = size.match(/(\d+)[\s-]+(\d+)/);
    if (match) {
      return `${match[1]}-${match[2]} employees`;
    }

    // Single number
    const singleMatch = size.match(/(\d+)/);
    if (singleMatch) {
      const num = parseInt(singleMatch[1]);
      if (num < 10) return '1-10 employees';
      if (num < 50) return '11-50 employees';
      if (num < 200) return '51-200 employees';
      if (num < 500) return '201-500 employees';
      if (num < 1000) return '501-1000 employees';
      if (num < 5000) return '1001-5000 employees';
      return '5000+ employees';
    }

    return size;
  }

  // Deduplicate array
  private deduplicateArray<T>(array: T[]): T[] {
    return [...new Set(array)];
  }

  // Merge duplicate leads
  mergeLeads(leads: ExtractedLead[]): ExtractedLead[] {
    const mergedMap = new Map<string, ExtractedLead>();

    for (const lead of leads) {
      const key = (lead.email || lead.name || '').toLowerCase();

      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!;
        // Merge data, preferring non-null values
        mergedMap.set(key, {
          ...existing,
          ...lead,
          name: lead.name || existing.name,
          email: lead.email || existing.email,
          phone: lead.phone || existing.phone,
          title: lead.title || existing.title,
          company: lead.company || existing.company,
          linkedinUrl: lead.linkedinUrl || existing.linkedinUrl,
          confidence: Math.max(lead.confidence, existing.confidence),
        });
      } else {
        mergedMap.set(key, lead);
      }
    }

    return Array.from(mergedMap.values());
  }

  // Enrich lead with additional data
  enrichLead(lead: ExtractedLead, additionalData: any): ExtractedLead {
    return {
      ...lead,
      enrichedData: {
        ...lead.enrichedData,
        ...additionalData,
      },
    };
  }

  // Format for specific CRM
  formatForCRM(
    lead: ExtractedLead,
    crmType: 'salesforce' | 'hubspot' | 'pipedrive'
  ): Record<string, any> {
    switch (crmType) {
      case 'salesforce':
        return {
          FirstName: lead.name.split(' ')[0],
          LastName: lead.name.split(' ').slice(1).join(' ') || 'Unknown',
          Email: lead.email,
          Phone: lead.phone,
          Title: lead.title,
          Company: lead.company,
          LeadSource: 'Web Scraper',
        };

      case 'hubspot':
        return {
          firstname: lead.name.split(' ')[0],
          lastname: lead.name.split(' ').slice(1).join(' ') || 'Unknown',
          email: lead.email,
          phone: lead.phone,
          jobtitle: lead.title,
          company: lead.company,
          hs_lead_status: 'NEW',
        };

      case 'pipedrive':
        return {
          name: lead.name,
          email: [{ value: lead.email, primary: true }],
          phone: [{ value: lead.phone, primary: true }],
          org_name: lead.company,
          job_title: lead.title,
        };

      default:
        return lead as any;
    }
  }
}

// Export singleton instance
export const dataTransformer = new DataTransformer();