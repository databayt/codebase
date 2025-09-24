import { ExtractedLead, ExportOptions } from '../type';

export class ExportManager {
  // Export to CSV format
  exportToCSV(
    leads: ExtractedLead[],
    options?: Partial<ExportOptions>
  ): string {
    if (leads.length === 0) {
      return '';
    }

    // Define fields to export
    const fields = options?.fields || [
      'name',
      'email',
      'phone',
      'title',
      'company',
      'department',
      'seniority',
      'linkedinUrl',
      'location',
      'confidence',
      'sourceUrl',
    ];

    // Create header
    const headers = fields.map(field =>
      options?.customMapping?.[field] || this.humanizeFieldName(field)
    );

    // Create rows
    const rows = leads.map(lead => {
      return fields.map(field => {
        const value = (lead as any)[field];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      });
    });

    // Combine header and rows
    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n');

    // Add BOM for Excel compatibility
    return '\ufeff' + csv;
  }

  // Export to JSON format
  exportToJSON(
    leads: ExtractedLead[],
    options?: Partial<ExportOptions>
  ): string {
    const data = options?.includeMetadata
      ? {
          exportDate: new Date().toISOString(),
          totalLeads: leads.length,
          fields: options.fields || Object.keys(leads[0] || {}),
          leads: leads,
        }
      : leads;

    return JSON.stringify(data, null, 2);
  }

  // Export to Excel format (returns base64 for simplicity)
  exportToExcel(
    leads: ExtractedLead[],
    options?: Partial<ExportOptions>
  ): string {
    // For a real implementation, you'd use a library like xlsx
    // This is a simplified version that creates an HTML table
    // that Excel can open

    const fields = options?.fields || [
      'name',
      'email',
      'phone',
      'title',
      'company',
      'department',
      'linkedinUrl',
      'location',
    ];

    const headers = fields.map(field =>
      options?.customMapping?.[field] || this.humanizeFieldName(field)
    );

    let html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office"
            xmlns:x="urn:schemas-microsoft-com:office:excel"
            xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="utf-8">
        <style>
          table { border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #4CAF50; color: white; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              ${headers.map(h => `<th>${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    for (const lead of leads) {
      html += '<tr>';
      for (const field of fields) {
        const value = (lead as any)[field] || '';
        html += `<td>${this.escapeHtml(String(value))}</td>`;
      }
      html += '</tr>';
    }

    html += '</tbody></table></body></html>';

    // Convert to base64
    return btoa(unescape(encodeURIComponent(html)));
  }

  // Export to XML format
  exportToXML(
    leads: ExtractedLead[],
    options?: Partial<ExportOptions>
  ): string {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<leads>\n';

    for (const lead of leads) {
      xml += '  <lead>\n';
      const fields = options?.fields || Object.keys(lead);
      for (const field of fields) {
        const value = (lead as any)[field];
        if (value !== null && value !== undefined) {
          xml += `    <${field}>${this.escapeXml(String(value))}</${field}>\n`;
        }
      }
      xml += '  </lead>\n';
    }

    xml += '</leads>';
    return xml;
  }

  // Create downloadable blob
  createDownloadBlob(
    data: string,
    format: 'csv' | 'json' | 'excel' | 'xml'
  ): Blob {
    let mimeType: string;
    let content: string = data;

    switch (format) {
      case 'csv':
        mimeType = 'text/csv;charset=utf-8';
        break;
      case 'json':
        mimeType = 'application/json;charset=utf-8';
        break;
      case 'excel':
        mimeType = 'application/vnd.ms-excel';
        // Decode from base64
        content = atob(data);
        break;
      case 'xml':
        mimeType = 'application/xml;charset=utf-8';
        break;
      default:
        mimeType = 'text/plain';
    }

    return new Blob([content], { type: mimeType });
  }

  // Generate filename with timestamp
  generateFilename(format: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `leads-export-${timestamp}.${format}`;
  }

  // Download file directly
  downloadFile(
    leads: ExtractedLead[],
    format: 'csv' | 'json' | 'excel' | 'xml',
    options?: Partial<ExportOptions>
  ) {
    let data: string;

    switch (format) {
      case 'csv':
        data = this.exportToCSV(leads, options);
        break;
      case 'json':
        data = this.exportToJSON(leads, options);
        break;
      case 'excel':
        data = this.exportToExcel(leads, options);
        break;
      case 'xml':
        data = this.exportToXML(leads, options);
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    const blob = this.createDownloadBlob(data, format);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.generateFilename(format);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Format for specific CRM
  formatForCRM(
    leads: ExtractedLead[],
    crmType: 'salesforce' | 'hubspot' | 'pipedrive'
  ): any[] {
    return leads.map(lead => {
      switch (crmType) {
        case 'salesforce':
          return {
            FirstName: lead.name.split(' ')[0],
            LastName: lead.name.split(' ').slice(1).join(' ') || 'Unknown',
            Email: lead.email,
            Phone: lead.phone,
            Title: lead.title,
            Company: lead.company,
            Department__c: lead.department,
            LinkedIn_URL__c: lead.linkedinUrl,
            Lead_Score__c: Math.round(lead.confidence * 100),
            LeadSource: 'Web Scraper',
            Status: 'New',
          };

        case 'hubspot':
          return {
            properties: {
              firstname: lead.name.split(' ')[0],
              lastname: lead.name.split(' ').slice(1).join(' ') || 'Unknown',
              email: lead.email,
              phone: lead.phone,
              jobtitle: lead.title,
              company: lead.company,
              hs_lead_status: 'NEW',
              lead_confidence_score: lead.confidence,
              linkedin_profile: lead.linkedinUrl,
              lead_source_detail_1: 'web_scraper',
            },
          };

        case 'pipedrive':
          return {
            name: lead.name,
            email: lead.email ? [{ value: lead.email, primary: true }] : [],
            phone: lead.phone ? [{ value: lead.phone, primary: true }] : [],
            org_name: lead.company,
            job_title: lead.title,
            visible_to: '3', // Everyone
            add_time: new Date().toISOString(),
            label: 'Hot lead',
            custom_fields: {
              linkedin_url: lead.linkedinUrl,
              confidence_score: lead.confidence,
              department: lead.department,
            },
          };

        default:
          return lead;
      }
    });
  }

  // Helper methods
  private humanizeFieldName(field: string): string {
    return field
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  // Generate export summary
  generateSummary(leads: ExtractedLead[]): string {
    const total = leads.length;
    const withEmail = leads.filter(l => l.email).length;
    const withPhone = leads.filter(l => l.phone).length;
    const withLinkedIn = leads.filter(l => l.linkedinUrl).length;
    const avgConfidence =
      leads.reduce((sum, l) => sum + l.confidence, 0) / total;

    return `
Export Summary:
- Total Leads: ${total}
- With Email: ${withEmail} (${Math.round((withEmail / total) * 100)}%)
- With Phone: ${withPhone} (${Math.round((withPhone / total) * 100)}%)
- With LinkedIn: ${withLinkedIn} (${Math.round((withLinkedIn / total) * 100)}%)
- Average Confidence: ${(avgConfidence * 100).toFixed(1)}%
- Export Date: ${new Date().toLocaleString()}
    `.trim();
  }
}

// Export singleton instance
export const exportManager = new ExportManager();