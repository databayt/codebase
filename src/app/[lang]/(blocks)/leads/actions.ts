'use server';

import { generateObject, generateText } from 'ai';
import { z } from 'zod';
import { selectProvider } from '@/lib/ai/providers';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';

// Lead extraction schema
const LeadExtractionSchema = z.object({
  leads: z.array(z.object({
    name: z.string().describe('Full name of the lead'),
    email: z.string().email().optional().describe('Email address'),
    company: z.string().optional().describe('Company name'),
    title: z.string().optional().describe('Job title or role'),
    phone: z.string().optional().describe('Phone number'),
    linkedinUrl: z.string().url().optional().describe('LinkedIn profile URL'),
    industry: z.string().optional().describe('Industry or sector'),
    score: z.number().min(0).max(100).describe('Lead quality score'),
    notes: z.string().optional().describe('Additional notes or context'),
    confidence: z.number().min(0).max(1).describe('Extraction confidence level')
  }))
});

// AI-powered lead extraction from raw text
export async function extractLeadsFromText(
  rawText: string,
  source: 'manual' | 'web' | 'file' = 'manual'
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to extract leads'
      };
    }

    // Select optimal model for extraction
    const model = selectProvider('extraction', 'cost');

    // Extract leads using AI
    const result = await generateObject({
      model,
      schema: LeadExtractionSchema,
      prompt: `Extract all potential leads from the following text. Look for:
- Names of people
- Email addresses
- Company names
- Job titles
- Contact information
- Professional details

For each lead found, provide a quality score (0-100) based on completeness and relevance.
Also provide a confidence level (0-1) for how certain you are about the extraction.

Text to analyze:
${rawText}`,
      system: `You are a lead extraction specialist. Extract structured lead information from unstructured text.
Be thorough but accurate - only extract information that is clearly present.`
    });

    // Save extracted leads to database
    const savedLeads = await Promise.all(
      result.object.leads.map(async (lead) => {
        // Check for duplicate by email
        if (lead.email) {
          const existing = await db.lead.findFirst({
            where: {
              email: lead.email,
              userId: user.id
            }
          });

          if (existing) {
            return { ...existing, duplicate: true };
          }
        }

        // Save new lead
        const saved = await db.lead.create({
          data: {
            ...lead,
            userId: user.id,
            source,
            tags: ['ai-extracted'],
            extractionMetadata: {
              extractedAt: new Date().toISOString(),
              model: 'groq-llama-3.1-70b',
              confidence: lead.confidence
            }
          }
        });

        return saved;
      })
    );

    // Revalidate leads page
    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: {
        extracted: result.object.leads.length,
        saved: savedLeads.filter(l => !l.duplicate).length,
        duplicates: savedLeads.filter(l => l.duplicate).length,
        leads: savedLeads
      }
    };
  } catch (error) {
    console.error('Lead extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract leads'
    };
  }
}

// AI-powered lead scoring
export async function scoreLeads(leadIds: string[]) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to score leads'
      };
    }

    // Fetch leads from database
    const leads = await db.lead.findMany({
      where: {
        id: { in: leadIds },
        userId: user.id
      }
    });

    // Score each lead using AI
    const model = selectProvider('analysis', 'quality');

    const scoredLeads = await Promise.all(
      leads.map(async (lead) => {
        const result = await generateObject({
          model,
          schema: z.object({
            score: z.number().min(0).max(100),
            category: z.enum(['hot', 'warm', 'cold']),
            priority: z.enum(['low', 'medium', 'high', 'urgent']),
            nextAction: z.string(),
            reasoning: z.string()
          }),
          prompt: `Score this lead based on available information:
Name: ${lead.name}
Company: ${lead.company || 'Unknown'}
Title: ${lead.title || 'Unknown'}
Industry: ${lead.industry || 'Unknown'}
Notes: ${lead.notes || 'None'}

Provide a score (0-100), categorize as hot/warm/cold, set priority, and recommend next action.`,
          system: 'You are a sales expert specializing in lead qualification and scoring.'
        });

        // Update lead in database
        await db.lead.update({
          where: { id: lead.id },
          data: {
            score: result.object.score,
            priority: result.object.priority.toUpperCase() as any,
            notes: lead.notes
              ? `${lead.notes}\n\nAI Analysis: ${result.object.reasoning}`
              : `AI Analysis: ${result.object.reasoning}`
          }
        });

        return {
          ...lead,
          ...result.object
        };
      })
    );

    // Revalidate leads page
    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: scoredLeads
    };
  } catch (error) {
    console.error('Lead scoring error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to score leads'
    };
  }
}

// AI-powered lead enrichment
export async function enrichLead(leadId: string) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'You must be logged in to enrich leads'
      };
    }

    const lead = await db.lead.findUnique({
      where: {
        id: leadId,
        userId: user.id
      }
    });

    if (!lead) {
      return {
        success: false,
        error: 'Lead not found'
      };
    }

    // Generate enrichment prompt
    const model = selectProvider('generation', 'quality');

    const enrichment = await generateText({
      model,
      prompt: `Based on the following lead information, provide additional insights and enrichment:
Name: ${lead.name}
Company: ${lead.company || 'Unknown'}
Title: ${lead.title || 'Unknown'}
Email: ${lead.email || 'Unknown'}
Industry: ${lead.industry || 'Unknown'}

Provide:
1. Likely pain points and challenges
2. Potential buying signals
3. Recommended approach strategy
4. Estimated company size and budget range
5. Best time to contact`,
      system: 'You are a B2B sales intelligence expert. Provide actionable insights for sales teams.'
    });

    // Update lead with enrichment
    await db.lead.update({
      where: { id: leadId },
      data: {
        notes: lead.notes
          ? `${lead.notes}\n\n--- AI Enrichment ---\n${enrichment.text}`
          : enrichment.text
      }
    });

    // Revalidate leads page
    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: {
        leadId,
        enrichment: enrichment.text
      }
    };
  } catch (error) {
    console.error('Lead enrichment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enrich lead'
    };
  }
}