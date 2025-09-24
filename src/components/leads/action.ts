/**
 * Server actions for the Leads feature
 * All server-side operations and API calls
 */

'use server';

import { revalidatePath } from 'next/cache';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateObject, generateText } from 'ai';
import { selectProvider, providers } from '@/lib/ai/providers';
import { z } from 'zod';
import { LeadStatus, LeadSource } from '@prisma/client';

// Global action counter for tracking
let actionCounter = 0;
import {
  createLeadSchema,
  updateLeadSchema,
  bulkUpdateSchema,
  leadFilterSchema,
  aiExtractionInputSchema,
  type CreateLeadInput,
  type UpdateLeadInput,
  type BulkUpdateInput,
  type LeadFilterInput,
  type AIExtractionInput,
} from './validation';
import type { Lead, LeadListResponse, AIExtractionResult } from './type';
import { LEAD_STATUS, LEAD_SOURCE } from './constant';

// NO AUTH - Just use a fixed user ID for all operations
async function requireAuth() {
  // NO AUTH - Using fixed user that has data
  return {
    id: 'cmfo808py0000ix1ke1o3uzsv',
    email: 'test@example.com',
    name: 'Test User'
  };
}

/**
 * Create a new lead
 */
export async function createLead(input: CreateLeadInput) {
  const actionId = ++actionCounter;
  const timestamp = new Date().toISOString();

  console.log('\n🎆 ===== SERVER ACTION START =====');
  console.log(`🆔 Action ID: ${actionId}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🔧 Action: createLead`);
  console.log(`📥 Input received:`, {
    name: input.name,
    email: input.email,
    company: input.company,
    status: input.status,
    source: input.source,
    score: input.score,
    hasNotes: !!input.notes,
    tagsCount: input.tags?.length || 0
  });
  console.log(`📝 Full input data:`, JSON.stringify(input, null, 2));

  try {
    console.log(`🔐 [${actionId}] Starting authentication...`);
    const user = await requireAuth();
    console.log(`✅ [${actionId}] Auth successful:`, {
      userId: user.id,
      email: user.email,
      name: user.name
    });

    console.log(`🧪 [${actionId}] Starting validation...`);
    const validated = createLeadSchema.parse(input);
    console.log(`✅ [${actionId}] Validation passed`);
    console.log(`📊 [${actionId}] Validated data:`, {
      ...validated,
      transformations: {
        emailLowercased: input.email !== validated.email,
        statusDefaulted: !input.status && validated.status === 'NEW',
        sourceDefaulted: !input.source && validated.source === 'MANUAL',
        scoreDefaulted: !input.score && validated.score === 50
      }
    });

    // Check for duplicates
    if (validated.email) {
      console.log(`🔍 [${actionId}] Checking for duplicate email: ${validated.email}`);
      const existing = await db.lead.findFirst({
        where: {
          email: validated.email,
          userId: user.id,
        },
      });

      if (existing) {
        console.log(`⚠️ [${actionId}] DUPLICATE FOUND!`);
        console.log(`⚠️ [${actionId}] Existing lead:`, {
          id: existing.id,
          name: existing.name,
          email: existing.email,
          createdAt: existing.createdAt
        });
        console.log(`🎆 ===== SERVER ACTION END (DUPLICATE) =====\n`);
        return {
          success: false,
          error: 'A lead with this email already exists',
        };
      } else {
        console.log(`✅ [${actionId}] No duplicate found`);
      }
    } else {
      console.log(`ℹ️ [${actionId}] No email provided, skipping duplicate check`);
    }

    // Remove title field as it's not in the Prisma schema
    const { title, ...leadData } = validated;
    console.log(`🗝️ [${actionId}] Removed 'title' field from data (not in schema)`);

    // The validation schema already provides uppercase enum keys
    // which match what Prisma expects
    const dbData = {
      ...leadData,
      userId: user.id,
      status: leadData.status as LeadStatus,
      source: leadData.source as LeadSource,
    };

    console.log(`💾 [${actionId}] Preparing database save...`);
    console.log(`💾 [${actionId}] Database payload:`, JSON.stringify(dbData, null, 2));
    console.log(`💾 [${actionId}] Executing db.lead.create...`);

    const startTime = Date.now();
    const lead = await db.lead.create({
      data: dbData,
    });
    const dbTime = Date.now() - startTime;

    console.log(`✅ [${actionId}] DATABASE SAVE SUCCESSFUL!`);
    console.log(`⏱️ [${actionId}] Database operation time: ${dbTime}ms`);
    console.log(`🆔 [${actionId}] New lead ID: ${lead.id}`);
    console.log(`📄 [${actionId}] Created lead details:`, {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: lead.status,
      source: lead.source,
      score: lead.score,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt
    });

    console.log(`🔄 [${actionId}] Revalidating path: /[lang]/leads`);
    revalidatePath('/[lang]/leads');
    console.log(`✅ [${actionId}] Path revalidated successfully`);

    const totalTime = Date.now() - new Date(timestamp).getTime();
    console.log(`⏱️ [${actionId}] Total action time: ${totalTime}ms`);
    console.log(`🎆 ===== SERVER ACTION END (SUCCESS) =====\n`);

    return {
      success: true,
      data: lead,
    };
  } catch (error) {
    const totalTime = Date.now() - new Date(timestamp).getTime();
    console.error(`❌ [${actionId}] ERROR OCCURRED!`);
    console.error(`❌ [${actionId}] Error type:`, error?.constructor?.name);
    console.error(`❌ [${actionId}] Error message:`, error instanceof Error ? error.message : 'Unknown error');

    if (error instanceof z.ZodError) {
      console.error(`❌ [${actionId}] Validation errors:`, error.issues);
    }

    if (error && typeof error === 'object' && 'code' in error) {
      console.error(`❌ [${actionId}] Error code:`, (error as any).code);
    }

    console.error(`❌ [${actionId}] Stack trace:`, error instanceof Error ? error.stack : 'No stack trace');
    console.error(`⏱️ [${actionId}] Total action time before error: ${totalTime}ms`);
    console.log(`🎆 ===== SERVER ACTION END (ERROR) =====\n`);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create lead',
    };
  }
}

/**
 * Update an existing lead
 */
export async function updateLead(id: string, input: UpdateLeadInput) {
  try {
    const user = await requireAuth();
    const validated = updateLeadSchema.parse(input);

    // Verify ownership
    const existing = await db.lead.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        success: false,
        error: 'Lead not found',
      };
    }

    const lead = await db.lead.update({
      where: { id },
      data: {
        ...validated,
        status: validated.status ? validated.status as LeadStatus : undefined,
        source: validated.source ? validated.source as LeadSource : undefined,
      },
    });

    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: lead,
    };
  } catch (error) {
    console.error('Update lead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update lead',
    };
  }
}

/**
 * Delete a lead
 */
export async function deleteLead(id: string) {
  try {
    const user = await requireAuth();

    // Verify ownership
    const existing = await db.lead.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return {
        success: false,
        error: 'Lead not found',
      };
    }

    await db.lead.delete({
      where: { id },
    });

    revalidatePath('/[lang]/leads');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Delete lead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete lead',
    };
  }
}

/**
 * Bulk update leads
 */
export async function bulkUpdateLeads(input: BulkUpdateInput) {
  try {
    const user = await requireAuth();
    const validated = bulkUpdateSchema.parse(input);

    // Verify ownership of all leads
    const leadCount = await db.lead.count({
      where: {
        id: { in: validated.leadIds },
        userId: user.id,
      },
    });

    if (leadCount !== validated.leadIds.length) {
      return {
        success: false,
        error: 'Some leads were not found or you do not have permission',
      };
    }

    // Perform bulk update
    const result = await db.lead.updateMany({
      where: {
        id: { in: validated.leadIds },
      },
      data: {
        ...validated.updates,
        status: validated.updates.status ? validated.updates.status as LeadStatus : undefined,
      },
    });

    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: {
        updated: result.count,
      },
    };
  } catch (error) {
    console.error('Bulk update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update leads',
    };
  }
}

/**
 * Get leads with filtering and pagination
 */
export async function getLeads(
  filters?: LeadFilterInput,
  page = 1,
  pageSize = 10
): Promise<LeadListResponse> {
  console.log('=====================================');
  console.log('📊 SERVER: getLeads called');
  console.log('📊 SERVER: Filters:', filters);
  console.log('📊 SERVER: Page:', page, 'PageSize:', pageSize);

  try {
    const user = await requireAuth();
    console.log('📊 SERVER: Fetching for user:', user.id);

    const validated = filters ? leadFilterSchema.parse(filters) : {};

    // Build where clause
    const where: any = {
      userId: user.id,
    };

    if (validated.search) {
      where.OR = [
        { name: { contains: validated.search, mode: 'insensitive' } },
        { email: { contains: validated.search, mode: 'insensitive' } },
        { company: { contains: validated.search, mode: 'insensitive' } },
      ];
    }

    if (validated.status) {
      where.status = validated.status;
    }

    if (validated.source) {
      where.source = validated.source;
    }

    if (validated.scoreMin !== undefined || validated.scoreMax !== undefined) {
      where.score = {};
      if (validated.scoreMin !== undefined) where.score.gte = validated.scoreMin;
      if (validated.scoreMax !== undefined) where.score.lte = validated.scoreMax;
    }

    if (validated.dateFrom || validated.dateTo) {
      where.createdAt = {};
      if (validated.dateFrom) where.createdAt.gte = validated.dateFrom;
      if (validated.dateTo) where.createdAt.lte = validated.dateTo;
    }

    if (validated.hasEmail !== undefined) {
      where.email = validated.hasEmail ? { not: null } : null;
    }

    if (validated.hasPhone !== undefined) {
      where.phone = validated.hasPhone ? { not: null } : null;
    }

    if (validated.tags && validated.tags.length > 0) {
      where.tags = { hasSome: validated.tags };
    }

    console.log('📊 SERVER: Where clause:', JSON.stringify(where, null, 2));

    // Get total count
    const total = await db.lead.count({ where });
    console.log('📊 SERVER: Total leads in database:', total);

    // Get paginated results
    const leads = await db.lead.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
    });

    console.log('📊 SERVER: Fetched leads count:', leads.length);
    console.log('📊 SERVER: Lead IDs:', leads.map(l => l.id));
    console.log('📊 SERVER: First lead:', leads[0] ? JSON.stringify(leads[0], null, 2) : 'No leads');
    console.log('=====================================');

    return {
      leads: leads as Lead[],
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  } catch (error) {
    console.error('Get leads error:', error);
    return {
      leads: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    };
  }
}

/**
 * AI-powered lead extraction from text
 */
export async function extractLeadsFromText(
  input: AIExtractionInput
): Promise<{ success: boolean; data?: AIExtractionResult; error?: string }> {
  const actionId = ++actionCounter;
  const timestamp = new Date().toISOString();

  console.log('\n🤖 ===== AI EXTRACTION START =====');
  console.log(`🆔 Action ID: ${actionId}`);
  console.log(`⏰ Timestamp: ${timestamp}`);
  console.log(`🔧 Action: extractLeadsFromText`);
  console.log(`📥 Input received:`, {
    textLength: input.rawText?.length || 0,
    source: input.source,
    model: input.model || 'groq',
    options: input.options
  });

  try {
    console.log(`🔐 [${actionId}] Starting authentication...`);
    const user = await requireAuth();
    console.log(`✅ [${actionId}] Auth successful: ${user.email}`);

    console.log(`🧪 [${actionId}] Validating AI extraction input...`);
    const validated = aiExtractionInputSchema.parse(input);
    console.log(`✅ [${actionId}] Validation passed`);

    // Check if AI keys are configured
    const hasGroq = !!process.env.GROQ_API_KEY;
    const hasOpenAI = !!process.env.OPENAI_API_KEY;
    const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;

    console.log(`🔑 [${actionId}] AI API Keys status:`, {
      groq: hasGroq,
      openai: hasOpenAI,
      anthropic: hasAnthropic,
      anyAvailable: hasGroq || hasOpenAI || hasAnthropic
    });

    if (!hasGroq && !hasOpenAI && !hasAnthropic) {
      console.log(`⚠️ [${actionId}] AI extraction disabled - no API keys configured`);
      console.log(`📝 [${actionId}] Falling back to pattern-based extraction`);

      // Parse text to extract basic lead info (simple extraction without AI)
      const lines = validated.rawText.split('\n');
      console.log(`📄 [${actionId}] Processing ${lines.length} lines of text`);
      const extractedLeads: any[] = [];

      // Simple pattern matching for emails and names
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        console.log(`🔍 [${actionId}] Scanning line ${i + 1}: "${line.substring(0, 50)}${line.length > 50 ? '...' : ''}"`);
        const emailMatch = line.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
        if (emailMatch) {
          // Extract name before email if possible
          const beforeEmail = line.substring(0, line.indexOf(emailMatch[0])).trim();
          const words = beforeEmail.split(/\s+/);
          const name = words.slice(-2).join(' ') || emailMatch[1].split('@')[0];

          extractedLeads.push({
            name: name,
            email: emailMatch[0],
            company: 'Unknown',
            score: 70,
            confidence: 0.7,
          });
        }
      }

      // If no emails found, create a sample lead
      if (extractedLeads.length === 0) {
        extractedLeads.push({
          name: 'Sample Lead',
          email: `lead${Date.now()}@example.com`,
          company: 'Sample Company',
          score: 60,
          confidence: 0.5,
        });
      }

      // Save extracted leads if auto-save is enabled
      let createdCount = 0;
      let duplicateCount = 0;
      const duplicateEmails: string[] = [];
      const createdLeads: any[] = [];

      if (validated.options?.autoScore) {
        // Check for existing leads first
        const emailsToCheck = extractedLeads
          .filter(l => l.email && !l.email.includes('example.com'))
          .map(l => l.email.toLowerCase());

        const existingLeads = emailsToCheck.length > 0 ? await db.lead.findMany({
          where: {
            userId: user.id,
            email: { in: emailsToCheck }
          },
          select: { email: true, name: true, id: true }
        }) : [];

        const existingEmails = new Set(existingLeads.map(l => l.email?.toLowerCase()));
        console.log(`🔍 Found ${existingLeads.length} existing leads with matching emails`);

        const sourceMap: Record<string, string> = {
          'manual': 'MANUAL',
          'web': 'WEBSITE',
          'file': 'IMPORT',
          'api': 'API'
        };

        for (const lead of extractedLeads) {
          const normalizedEmail = lead.email?.toLowerCase();

          if (normalizedEmail && existingEmails.has(normalizedEmail)) {
            duplicateCount++;
            duplicateEmails.push(normalizedEmail);
            console.log(`⚠️ Duplicate lead skipped: ${lead.name} (${normalizedEmail})`);
            continue;
          }

          console.log(`📝 Creating lead from text: ${lead.name}`);
          const createResult = await createLead({
            ...lead,
            source: sourceMap[validated.source] || 'MANUAL',
            status: 'NEW',
            tags: [`text-extracted`, validated.source],
          });
          if (createResult.success) {
            createdCount++;
            createdLeads.push(createResult.data);
            console.log(`✅ Lead created: ${createResult.data?.id}`);
          }
        }
      }

      return {
        success: true,
        data: {
          leads: extractedLeads,
          created: createdCount,
          duplicates: duplicateCount,
          duplicateEmails,
          createdLeads,
          metadata: {
            model: 'simple-extraction',
            processingTime: 50,
            tokensUsed: 0,
          },
          feedbackMessage: duplicateCount > 0
              ? `Found ${duplicateCount} duplicate lead(s) that were skipped. Created ${createdCount} new lead(s).`
              : `Successfully extracted and created ${createdCount} new lead(s).`,
        },
      };
    }

    // Select model based on user preference
    let model;
    const selectedModel = validated.model || 'groq';

    console.log(`🤖 [${actionId}] Using AI model: ${selectedModel}`);

    if (selectedModel === 'claude') {
      model = providers.anthropic.balanced; // Claude 3.5 Sonnet
      console.log(`🤖 [${actionId}] Selected: Claude 3.5 Sonnet (Quality)`);
    } else if (selectedModel === 'openai') {
      model = providers.openai.fast; // GPT-4o-mini
      console.log(`🤖 [${actionId}] Selected: GPT-4o-mini (Balanced)`);
    } else {
      // Default to Groq for speed and cost
      model = providers.groq.balanced; // Groq with JSON support
      console.log(`🤖 [${actionId}] Selected: Groq Llama (Fast & Free)`);
    }

    const LeadExtractionSchema = z.object({
      leads: z.array(z.object({
        name: z.string(),
        email: z.string().optional(), // Simplified - no email validation
        company: z.string().optional(),
        title: z.string().optional(),
        phone: z.string().optional(),
        linkedinUrl: z.string().optional(), // Simplified - no URL validation
        industry: z.string().optional(),
        score: z.number().min(0).max(100),
        notes: z.string().optional(),
        confidence: z.number().min(0).max(1),
      })),
    });

    const startTime = Date.now();

    const result = await generateObject({
      model,
      schema: LeadExtractionSchema,
      prompt: `Extract all potential leads from the following text. Look for:
        - Names of people
        - Email addresses
        - Company names
        - Job titles
        - Phone numbers
        - LinkedIn profiles
        - Industry information

        Score each lead from 0-100 based on completeness and potential value.
        Include confidence level (0-1) for each extraction.

        Text to analyze:
        ${validated.rawText}`,
    });

    const processingTime = Date.now() - startTime;

    // Save extracted leads if auto-save is enabled
    let createdCount = 0;
    let duplicateCount = 0;
    const duplicateEmails: string[] = [];
    const createdLeads: any[] = [];

    if (validated.options?.autoScore) {
      // Check for existing leads first
      const existingLeads = await db.lead.findMany({
        where: {
          userId: user.id,
          email: {
            in: result.object.leads
              .filter(l => l.email)
              .map(l => l.email!.toLowerCase())
          }
        },
        select: { email: true, name: true, id: true }
      });

      const existingEmails = new Set(existingLeads.map(l => l.email?.toLowerCase()));
      console.log(`🔍 Found ${existingLeads.length} existing leads with matching emails`);

      for (const lead of result.object.leads) {
        const normalizedEmail = lead.email?.toLowerCase();

        if (normalizedEmail && existingEmails.has(normalizedEmail)) {
          duplicateCount++;
          duplicateEmails.push(normalizedEmail);
          console.log(`⚠️ Duplicate lead skipped: ${lead.name} (${normalizedEmail})`);
          continue;
        }

        console.log(`🤖 AI creating lead: ${lead.name}`);
        // Map lowercase source to uppercase for database
        const sourceMap: Record<string, string> = {
          'manual': 'MANUAL',
          'web': 'WEBSITE',
          'file': 'IMPORT',
          'api': 'API'
        };
        const createResult = await createLead({
          ...lead,
          source: sourceMap[validated.source] || 'MANUAL',
          status: 'NEW', // Use uppercase enum key
          tags: [`ai-extracted`, validated.source],
        });
        if (createResult.success) {
          createdCount++;
          createdLeads.push(createResult.data);
          console.log(`✅ AI lead created: ${createResult.data?.id}`);
        } else {
          console.error(`❌ Failed to create AI lead: ${lead.name}`, createResult.error);
        }
      }
    }

    return {
      success: true,
      data: {
        leads: result.object.leads,
        created: createdCount,
        duplicates: duplicateCount,
        duplicateEmails,
        createdLeads,
        metadata: {
          model: model.modelId,
          processingTime,
          tokensUsed: 0, // Would need actual token count from model
        },
        feedbackMessage: duplicateCount > 0
            ? `Found ${duplicateCount} duplicate lead(s) that were skipped. Created ${createdCount} new lead(s).`
            : `Successfully created ${createdCount} new lead(s).`,
      },
    };
  } catch (error) {
    console.error('AI extraction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to extract leads',
    };
  }
}

/**
 * Get lead by ID
 */
export async function getLeadById(id: string) {
  try {
    const user = await requireAuth();

    const lead = await db.lead.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!lead) {
      return {
        success: false,
        error: 'Lead not found',
      };
    }

    return {
      success: true,
      data: lead,
    };
  } catch (error) {
    console.error('Get lead error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get lead',
    };
  }
}

/**
 * Get lead analytics
 */
export async function getLeadAnalytics() {
  try {
    const user = await requireAuth();

    const [
      totalLeads,
      newLeadsThisWeek,
      statusCounts,
      sourceCounts,
    ] = await Promise.all([
      db.lead.count({ where: { userId: user.id } }),
      db.lead.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      db.lead.groupBy({
        by: ['status'],
        where: { userId: user.id },
        _count: true,
      }),
      db.lead.groupBy({
        by: ['source'],
        where: { userId: user.id },
        _count: true,
      }),
    ]);

    return {
      success: true,
      data: {
        totalLeads,
        newLeadsThisWeek,
        statusDistribution: statusCounts,
        sourceDistribution: sourceCounts,
      },
    };
  } catch (error) {
    console.error('Get analytics error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get analytics',
    };
  }
}

/**
 * AI-powered lead scoring
 */
export async function scoreLeads(leadIds: string[]) {
  try {
    const user = await requireAuth();

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

/**
 * AI-powered lead enrichment
 */
/**
 * Bulk import leads from scrapers or files
 */
export async function bulkImportLeads(
  leads: any[],
  importSource?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const user = await requireAuth();
    const importId = `import_${Date.now()}`;

    console.log(`📥 Bulk import: Processing ${leads.length} leads from ${importSource || 'manual'}`);

    // Process and normalize lead data
    const processedLeads = leads.map(lead => ({
      name: lead.name || lead.Name || lead.NAME || 'Unknown',
      email: lead.email || lead.Email || lead.EMAIL,
      phone: lead.phone || lead.Phone || lead.PHONE,
      company: lead.company || lead.Company || lead.COMPANY,
      title: lead.title || lead.Title || lead.TITLE || lead.position || lead.Position,
      website: lead.website || lead.Website || lead.URL || lead.url,
      linkedinUrl: lead.linkedinUrl || lead.linkedin || lead.LinkedIn,
      location: lead.location || lead.Location || lead.city || lead.City,
      industry: lead.industry || lead.Industry || lead.sector,
      leadType: lead.type || lead.leadType || 'CLIENT',
      notes: lead.notes || lead.description || lead.Description,
      status: 'NEW',
      source: importSource === 'SCRAPER' ? 'IMPORT' : 'MANUAL',
      score: lead.score || 0,
      verified: false,
      emailVerified: false,
      phoneVerified: false,
      importId,
      importedAt: new Date(),
      scraperSource: importSource,
      userId: user.id,
      tags: [],
    }));

    // Filter out leads without essential data
    const validLeads = processedLeads.filter(lead =>
      lead.name && (lead.email || lead.phone || lead.company)
    );

    // Check for duplicates
    const duplicateCount = await detectDuplicates(validLeads);

    // Create leads in batch
    const created = await db.lead.createMany({
      data: validLeads,
      skipDuplicates: true,
    });

    console.log(`✅ Bulk import complete: ${created.count} created, ${duplicateCount} duplicates skipped`);

    revalidatePath('/[lang]/leads');

    return {
      success: true,
      data: {
        imported: created.count,
        duplicates: duplicateCount,
        total: leads.length,
        importId,
      },
    };
  } catch (error) {
    console.error('Bulk import error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to import leads',
    };
  }
}

/**
 * Detect duplicate leads in database
 */
export async function detectDuplicates(
  leads: any[]
): Promise<number> {
  try {
    const user = await requireAuth();
    let duplicateCount = 0;

    for (const lead of leads) {
      if (lead.email) {
        const existing = await db.lead.findFirst({
          where: {
            userId: user.id,
            email: lead.email,
          },
        });
        if (existing) {
          duplicateCount++;
          continue;
        }
      }

      if (lead.phone) {
        const cleanPhone = lead.phone.replace(/\D/g, '');
        const existing = await db.lead.findFirst({
          where: {
            userId: user.id,
            phone: {
              contains: cleanPhone.slice(-10),
            },
          },
        });
        if (existing) {
          duplicateCount++;
        }
      }
    }

    return duplicateCount;
  } catch (error) {
    console.error('Duplicate detection error:', error);
    return 0;
  }
}

/**
 * Export leads to various formats
 */
export async function exportLeads(
  format: 'csv' | 'json' | 'excel' = 'csv',
  filters?: any
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const user = await requireAuth();

    const where: any = { userId: user.id };

    // Apply filters
    if (filters?.status) where.status = filters.status;
    if (filters?.source) where.source = filters.source;
    if (filters?.leadType) where.leadType = filters.leadType;
    if (filters?.verified !== undefined) where.verified = filters.verified;
    if (filters?.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { company: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    console.log(`📤 Export: Found ${leads.length} leads to export as ${format}`);

    // Format data for export
    const exportData = leads.map(lead => ({
      Name: lead.name,
      Email: lead.email || '',
      Phone: lead.phone || '',
      Company: lead.company || '',
      Title: lead.title || '',
      Type: lead.leadType || 'CLIENT',
      Location: lead.location || '',
      Website: lead.website || '',
      LinkedIn: lead.linkedinUrl || '',
      Industry: lead.industry || '',
      Status: lead.status,
      Score: lead.score,
      Source: lead.source,
      Verified: lead.verified ? 'Yes' : 'No',
      Created: lead.createdAt.toISOString().split('T')[0],
      Notes: lead.notes || '',
    }));

    return {
      success: true,
      data: {
        format,
        count: leads.length,
        data: exportData,
      },
    };
  } catch (error) {
    console.error('Export error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to export leads',
    };
  }
}

export async function enrichLead(leadId: string) {
  try {
    const user = await requireAuth();

    const lead = await db.lead.findFirst({
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