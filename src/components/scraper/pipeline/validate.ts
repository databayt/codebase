import { ExtractedLead, ValidationRule } from '../type';

export class DataValidator {
  private emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private phoneRegex = /^\+?[\d\s\(\)\-\.]+$/;
  private urlRegex = /^https?:\/\/.+\..+/;

  // Validate a single lead
  validateLead(lead: ExtractedLead): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!lead.name || lead.name.trim() === '') {
      errors.push('Name is required');
    }

    // Email validation
    if (lead.email) {
      if (!this.validateEmail(lead.email)) {
        errors.push(`Invalid email format: ${lead.email}`);
      }

      if (this.isDisposableEmail(lead.email)) {
        warnings.push(`Disposable email detected: ${lead.email}`);
      }

      if (this.isGenericEmail(lead.email)) {
        warnings.push(`Generic email detected: ${lead.email}`);
      }
    }

    // Phone validation
    if (lead.phone) {
      if (!this.validatePhone(lead.phone)) {
        errors.push(`Invalid phone format: ${lead.phone}`);
      }
    }

    // LinkedIn URL validation
    if (lead.linkedinUrl) {
      if (!this.validateLinkedInUrl(lead.linkedinUrl)) {
        errors.push(`Invalid LinkedIn URL: ${lead.linkedinUrl}`);
      }
    }

    // Confidence check
    if (lead.confidence < 0.3) {
      warnings.push('Low confidence score');
    }

    // Name quality check
    if (lead.name) {
      const nameIssues = this.validateName(lead.name);
      warnings.push(...nameIssues);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Batch validate leads
  validateLeads(leads: ExtractedLead[]): {
    valid: ExtractedLead[];
    invalid: Array<{ lead: ExtractedLead; errors: string[] }>;
    warnings: Array<{ lead: ExtractedLead; warnings: string[] }>;
  } {
    const valid: ExtractedLead[] = [];
    const invalid: Array<{ lead: ExtractedLead; errors: string[] }> = [];
    const warnings: Array<{ lead: ExtractedLead; warnings: string[] }> = [];

    for (const lead of leads) {
      const validation = this.validateLead(lead);

      if (validation.isValid) {
        valid.push(lead);
        if (validation.warnings.length > 0) {
          warnings.push({ lead, warnings: validation.warnings });
        }
      } else {
        invalid.push({ lead, errors: validation.errors });
      }
    }

    return { valid, invalid, warnings };
  }

  // Email validation
  validateEmail(email: string): boolean {
    if (!this.emailRegex.test(email)) {
      return false;
    }

    // Additional checks
    const [localPart, domain] = email.split('@');

    // Check local part
    if (localPart.length > 64) return false;
    if (localPart.startsWith('.') || localPart.endsWith('.')) return false;
    if (localPart.includes('..')) return false;

    // Check domain
    if (domain.length > 255) return false;
    if (!domain.includes('.')) return false;
    if (domain.startsWith('.') || domain.endsWith('.')) return false;

    return true;
  }

  // Phone validation
  validatePhone(phone: string): boolean {
    if (!this.phoneRegex.test(phone)) {
      return false;
    }

    // Extract digits
    const digits = phone.replace(/\D/g, '');

    // Check length (international numbers can vary)
    if (digits.length < 7 || digits.length > 15) {
      return false;
    }

    return true;
  }

  // LinkedIn URL validation
  validateLinkedInUrl(url: string): boolean {
    if (!this.urlRegex.test(url)) {
      return false;
    }

    // Must be LinkedIn domain
    if (!url.includes('linkedin.com')) {
      return false;
    }

    // Should be a profile URL
    if (!url.includes('/in/') && !url.includes('/company/')) {
      return false;
    }

    return true;
  }

  // Name validation
  validateName(name: string): string[] {
    const issues: string[] = [];

    // Check for test data
    const testNames = ['test', 'demo', 'example', 'sample', 'unknown'];
    if (testNames.some(test => name.toLowerCase().includes(test))) {
      issues.push('Name appears to be test data');
    }

    // Check for single word
    if (!name.includes(' ')) {
      issues.push('Name appears to be incomplete (single word)');
    }

    // Check for numbers
    if (/\d/.test(name)) {
      issues.push('Name contains numbers');
    }

    // Check for excessive special characters
    if (/[^a-zA-Z\s\-'.]/.test(name)) {
      issues.push('Name contains unusual characters');
    }

    // Check length
    if (name.length < 2) {
      issues.push('Name is too short');
    }

    if (name.length > 50) {
      issues.push('Name is unusually long');
    }

    return issues;
  }

  // Check for disposable email providers
  isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      'tempmail.com',
      'throwaway.email',
      'guerrillamail.com',
      'mailinator.com',
      '10minutemail.com',
      'trashmail.com',
      'yopmail.com',
      'fakeinbox.com',
      'tempmails.org',
      'sharklasers.com',
    ];

    const domain = email.split('@')[1];
    return disposableDomains.some(d => domain.includes(d));
  }

  // Check for generic email addresses
  isGenericEmail(email: string): boolean {
    const genericPrefixes = [
      'info',
      'contact',
      'admin',
      'support',
      'sales',
      'hello',
      'help',
      'noreply',
      'no-reply',
      'donotreply',
      'webmaster',
      'postmaster',
    ];

    const localPart = email.split('@')[0].toLowerCase();
    return genericPrefixes.includes(localPart);
  }

  // Validate against custom rules
  validateWithRules(
    data: any,
    rules: ValidationRule[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = data[rule.field];

      switch (rule.type) {
        case 'required':
          if (!value || value === '') {
            errors.push(rule.message || `${rule.field} is required`);
          }
          break;

        case 'email':
          if (value && !this.validateEmail(value)) {
            errors.push(rule.message || `${rule.field} must be a valid email`);
          }
          break;

        case 'phone':
          if (value && !this.validatePhone(value)) {
            errors.push(
              rule.message || `${rule.field} must be a valid phone number`
            );
          }
          break;

        case 'url':
          if (value && !this.urlRegex.test(value)) {
            errors.push(rule.message || `${rule.field} must be a valid URL`);
          }
          break;

        case 'regex':
          if (value && rule.pattern) {
            const regex = new RegExp(rule.pattern);
            if (!regex.test(value)) {
              errors.push(
                rule.message || `${rule.field} does not match required pattern`
              );
            }
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Check for duplicates
  findDuplicates(leads: ExtractedLead[]): Map<string, ExtractedLead[]> {
    const duplicates = new Map<string, ExtractedLead[]>();

    // Group by email
    const emailGroups = new Map<string, ExtractedLead[]>();
    for (const lead of leads) {
      if (lead.email) {
        const key = lead.email.toLowerCase();
        if (!emailGroups.has(key)) {
          emailGroups.set(key, []);
        }
        emailGroups.get(key)!.push(lead);
      }
    }

    // Find duplicates
    for (const [email, group] of emailGroups) {
      if (group.length > 1) {
        duplicates.set(email, group);
      }
    }

    return duplicates;
  }

  // Calculate overall data quality score
  calculateQualityScore(lead: ExtractedLead): number {
    let score = 0;
    let factors = 0;

    // Email quality
    if (lead.email) {
      factors++;
      if (this.validateEmail(lead.email)) {
        score += 1;
        if (!this.isGenericEmail(lead.email)) {
          score += 0.5;
        }
        if (!this.isDisposableEmail(lead.email)) {
          score += 0.5;
        }
      }
    }

    // Name quality
    if (lead.name) {
      factors++;
      const nameIssues = this.validateName(lead.name);
      if (nameIssues.length === 0) {
        score += 2;
      } else if (nameIssues.length === 1) {
        score += 1;
      }
    }

    // Phone quality
    if (lead.phone) {
      factors++;
      if (this.validatePhone(lead.phone)) {
        score += 1;
      }
    }

    // Professional info
    if (lead.title) {
      factors++;
      score += 1;
    }

    if (lead.company) {
      factors++;
      score += 1;
    }

    if (lead.linkedinUrl) {
      factors++;
      if (this.validateLinkedInUrl(lead.linkedinUrl)) {
        score += 1;
      }
    }

    // Calculate percentage
    return factors > 0 ? score / (factors * 2) : 0;
  }
}

// Export singleton instance
export const dataValidator = new DataValidator();