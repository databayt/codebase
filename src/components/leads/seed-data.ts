/**
 * Seed data script for testing the leads system
 * Creates sample leads of different types
 */

import { bulkImportLeads } from './action';

export const sampleLeads = [
  // Clients
  {
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-0101',
    company: 'TechCorp Solutions',
    title: 'CTO',
    website: 'https://techcorp.com',
    linkedinUrl: 'https://linkedin.com/in/johnsmith',
    location: 'San Francisco, CA',
    industry: 'Technology',
    leadType: 'CLIENT',
    score: 85,
    notes: 'Interested in automation tools for their development team',
    companySize: '50-200',
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@innovate.io',
    phone: '+1-555-0102',
    company: 'Innovate.io',
    title: 'CEO',
    website: 'https://innovate.io',
    location: 'New York, NY',
    industry: 'SaaS',
    leadType: 'CLIENT',
    score: 92,
    notes: 'Looking for website redesign and custom integrations',
    companySize: '10-50',
  },

  // Competitors
  {
    name: 'Michael Chen',
    email: 'michael@competitor.com',
    phone: '+1-555-0103',
    company: 'WebBuilders Inc',
    title: 'VP of Engineering',
    website: 'https://webbuilders.com',
    location: 'Austin, TX',
    industry: 'Web Development',
    leadType: 'COMPETITOR',
    score: 65,
    notes: 'Competitor analysis - they focus on e-commerce solutions',
    companySize: '200-500',
  },

  // Remote Jobs
  {
    name: 'Emily Rodriguez',
    email: 'emily.r@example.com',
    phone: '+1-555-0104',
    company: 'Remote First Co',
    title: 'Senior React Developer',
    linkedinUrl: 'https://linkedin.com/in/emilyrod',
    location: 'Remote',
    industry: 'Technology',
    leadType: 'JOB',
    score: 78,
    notes: 'Potential candidate for senior developer position',
    companySize: '1-10',
  },
  {
    name: 'David Kim',
    email: 'david.kim@dev.com',
    phone: '+1-555-0105',
    company: 'Freelance',
    title: 'Full Stack Developer',
    location: 'Seattle, WA',
    industry: 'Technology',
    leadType: 'JOB',
    score: 72,
    notes: 'Available for contract work, strong Python and Node.js skills',
  },

  // Partners
  {
    name: 'Lisa Anderson',
    email: 'lisa@designstudio.com',
    phone: '+1-555-0106',
    company: 'Creative Design Studio',
    title: 'Creative Director',
    website: 'https://designstudio.com',
    location: 'Los Angeles, CA',
    industry: 'Design',
    leadType: 'PARTNER',
    score: 88,
    notes: 'Potential partnership for design services',
    companySize: '10-50',
  },
  {
    name: 'Robert Taylor',
    email: 'robert@marketingpro.com',
    phone: '+1-555-0107',
    company: 'MarketingPro Agency',
    title: 'Business Development Manager',
    website: 'https://marketingpro.com',
    location: 'Chicago, IL',
    industry: 'Marketing',
    leadType: 'PARTNER',
    score: 76,
    notes: 'Interested in white-label partnership for web development',
    companySize: '50-200',
  },

  // Verified High-Score Leads
  {
    name: 'Jennifer White',
    email: 'jennifer@enterprise.com',
    phone: '+1-555-0108',
    company: 'Enterprise Solutions Inc',
    title: 'VP of Digital Transformation',
    website: 'https://enterprise.com',
    linkedinUrl: 'https://linkedin.com/in/jwhite',
    location: 'Boston, MA',
    industry: 'Enterprise Software',
    leadType: 'CLIENT',
    score: 95,
    notes: 'Hot lead - Budget approved for Q1 2024, needs custom automation platform',
    companySize: '500+',
    verified: true,
    emailVerified: true,
    phoneVerified: true,
  },
  {
    name: 'Marcus Brown',
    email: 'marcus@fintech.com',
    phone: '+1-555-0109',
    company: 'FinTech Innovations',
    title: 'Head of Technology',
    website: 'https://fintech.com',
    location: 'Miami, FL',
    industry: 'Financial Services',
    leadType: 'CLIENT',
    score: 89,
    notes: 'Needs API integration with banking systems',
    companySize: '50-200',
    verified: true,
    emailVerified: true,
  },

  // Recent Import Batch
  {
    name: 'Alex Thompson',
    email: 'alex@startup.com',
    phone: '+1-555-0110',
    company: 'AI Startup',
    title: 'Founder',
    location: 'Denver, CO',
    industry: 'Artificial Intelligence',
    leadType: 'CLIENT',
    score: 68,
    notes: 'Early-stage startup, interested in MVP development',
    companySize: '1-10',
    scraperSource: 'LinkedIn',
  },
  {
    name: 'Nicole Davis',
    email: 'nicole@healthcare.com',
    phone: '+1-555-0111',
    company: 'HealthTech Solutions',
    title: 'Product Manager',
    website: 'https://healthtech.com',
    location: 'Portland, OR',
    industry: 'Healthcare',
    leadType: 'CLIENT',
    score: 74,
    notes: 'Looking for HIPAA-compliant web application',
    companySize: '10-50',
    scraperSource: 'Indeed',
  },
  {
    name: 'James Wilson',
    email: 'james@ecommerce.com',
    phone: '+1-555-0112',
    company: 'E-Shop Pro',
    title: 'Technical Lead',
    location: 'Phoenix, AZ',
    industry: 'E-commerce',
    leadType: 'CLIENT',
    score: 81,
    notes: 'Needs custom e-commerce platform with automation',
    companySize: '50-200',
    scraperSource: 'Web Scraper',
  },
];

export async function seedLeads() {
  try {
    console.log('🌱 Seeding leads database...');

    const result = await bulkImportLeads(sampleLeads, 'SEED_DATA');

    if (result.success && result.data) {
      console.log(`✅ Successfully seeded ${result.data.imported} leads`);
      console.log(`⚠️ Skipped ${result.data.duplicates} duplicates`);
      return result.data;
    } else {
      console.error('❌ Failed to seed leads:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Error seeding leads:', error);
    return null;
  }
}