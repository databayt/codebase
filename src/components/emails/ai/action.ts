'use server';

import { generateText, generateObject, streamText } from 'ai';
// Removed createStreamableValue import as it's not available in AI SDK v5
import { z } from 'zod';
import { selectProvider } from '@/lib/ai/providers';
import { currentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import {
  EmailAnalysisSchema,
  FollowUpEmailSchema,
  GenerateEmailRequestSchema,
  PersonalizeEmailRequestSchema,
  AnalyzeEmailRequestSchema,
  GenerateFollowUpRequestSchema
} from './validation';
import type {
  EmailTemplate,
  EmailAnalysis,
  FollowUpSequence,
  EmailLead,
  EmailContent
} from './type';

// Generate email template with streaming
export async function generateEmailTemplateStreaming(
  purpose: string,
  targetAudience: string,
  keyPoints: string[],
  tone: 'professional' | 'friendly' | 'casual' | 'urgent' = 'professional'
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // Validate input
    const validation = GenerateEmailRequestSchema.safeParse({
      purpose,
      targetAudience,
      keyPoints,
      tone
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Invalid input'
      };
    }

    const model = selectProvider('generation', 'quality');

    const result = await generateText({
      model,
      prompt: `Create a compelling email template for the following:

Purpose: ${purpose}
Target Audience: ${targetAudience}
Key Points to Include: ${keyPoints.join(', ')}
Tone: ${tone}

Create a complete, ready-to-send email with:
1. Attention-grabbing subject line
2. Personalized greeting with merge tags ({{firstName}}, {{company}}, etc.)
3. Strong, engaging introduction
4. Clear value proposition with specific benefits
5. Social proof or credibility builders
6. Single, clear call-to-action
7. Professional closing
8. P.S. line for additional impact

Make it scannable with short paragraphs and bullet points where appropriate.
Ensure mobile-friendly formatting.`,
      system: `You are an expert email copywriter specializing in conversion-optimized business emails.
Your emails achieve:
- 30%+ open rates
- 10%+ click rates
- Clear, compelling messaging
- Natural personalization
- Action-driving copy

Write emails that are concise (150-250 words), engaging, and results-focused.`
    });

    // Parse the email content
    const emailContent: EmailContent = {
      subject: extractSubjectLine(result.text),
      htmlContent: convertToHtml(result.text),
      textContent: result.text,
      personalizationTokens: {}
    };

    return {
      success: true,
      data: emailContent
    };
  } catch (error) {
    console.error('Email template generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate template'
    };
  }
}

// Generate personalized email
export async function generatePersonalizedEmail(
  template: string,
  lead: EmailLead,
  tone: 'professional' | 'friendly' | 'casual' | 'urgent' = 'professional'
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // Validate input
    const validation = PersonalizeEmailRequestSchema.safeParse({
      template,
      lead,
      tone
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Invalid input'
      };
    }

    const model = selectProvider('generation', 'quality');

    const result = await generateText({
      model,
      prompt: `Personalize this email template for the recipient:

Template:
${template}

Recipient Information:
- Name: ${lead.name}
- Email: ${lead.email}
- Company: ${lead.company || 'Not specified'}
- Title: ${lead.title || 'Not specified'}
- Industry: ${lead.industry || 'Not specified'}
- Location: ${lead.location || 'Not specified'}
- LinkedIn: ${lead.linkedinUrl || 'Not available'}
- Notes: ${lead.notes || 'None'}

Tone: ${tone}

Instructions:
1. Replace all merge tags with actual information
2. Add natural personalization based on recipient data
3. Reference their company/industry specifically
4. Maintain the core message and value proposition
5. Keep the same structure and length
6. Make it feel genuinely written for them`,
      system: `You are an expert at email personalization. Create emails that feel individually crafted, not mass-produced.
Focus on:
- Natural, conversational personalization
- Industry-specific pain points
- Company-relevant benefits
- Authentic human connection`
    });

    // Parse the personalized email
    const emailContent: EmailContent = {
      subject: extractSubjectLine(result.text),
      htmlContent: convertToHtml(result.text),
      textContent: result.text,
      personalizationTokens: {
        firstName: lead.firstName || lead.name.split(' ')[0],
        company: lead.company || '',
        title: lead.title || ''
      }
    };

    return {
      success: true,
      data: emailContent
    };
  } catch (error) {
    console.error('Email personalization error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to personalize email'
    };
  }
}

// Analyze email effectiveness
export async function analyzeEmailEffectiveness(
  emailContent: string,
  targetAudience?: string,
  purpose?: string
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // Validate input
    const validation = AnalyzeEmailRequestSchema.safeParse({
      content: emailContent,
      targetAudience,
      purpose
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Invalid input'
      };
    }

    const model = selectProvider('analysis', 'quality');

    const result = await generateObject({
      model,
      schema: EmailAnalysisSchema,
      prompt: `Analyze this email for effectiveness and conversion potential:

Email Content:
${emailContent}

${targetAudience ? `Target Audience: ${targetAudience}` : ''}
${purpose ? `Purpose: ${purpose}` : ''}

Provide a comprehensive analysis including:
1. Scoring for all key elements
2. Specific strengths with examples
3. Actionable improvements
4. Concrete suggestions for optimization
5. Predicted performance metrics
6. Spam risk assessment with triggers
7. Reading time calculation
8. Sentiment analysis

Be specific and actionable in your feedback.`,
      system: `You are an email marketing expert with deep knowledge of:
- Email copywriting best practices
- Conversion optimization
- Deliverability factors
- A/B testing insights
- Industry benchmarks

Provide data-driven, actionable analysis that improves email performance.`
    });

    return {
      success: true,
      data: result.object as EmailAnalysis
    };
  } catch (error) {
    console.error('Email analysis error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to analyze email'
    };
  }
}

// Generate follow-up sequence
export async function generateFollowUpSequence(
  initialEmail: string,
  numberOfFollowUps: number = 3,
  daysBetween: number = 3,
  strategy: 'persistent' | 'value_add' | 'urgency' | 'nurture' = 'value_add'
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    // Validate input
    const validation = GenerateFollowUpRequestSchema.safeParse({
      initialEmail,
      numberOfFollowUps,
      daysBetween,
      strategy
    });

    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0]?.message || 'Invalid input'
      };
    }

    const model = selectProvider('generation', 'quality');

    const strategyInstructions = {
      persistent: 'Be politely persistent, referencing previous emails and asking for a response',
      value_add: 'Add new value, insights, or resources with each follow-up',
      urgency: 'Build increasing urgency and scarcity with each email',
      nurture: 'Build relationship gradually with educational content and soft touches'
    };

    const followUps = await Promise.all(
      Array.from({ length: numberOfFollowUps }, (_, i) => i + 1).map(async (followUpNumber) => {
        const result = await generateObject({
          model,
          schema: FollowUpEmailSchema,
          prompt: `Create follow-up email #${followUpNumber} for this sequence:

Initial Email:
${initialEmail}

Follow-up Strategy: ${strategy} - ${strategyInstructions[strategy]}
This is follow-up #${followUpNumber} to be sent ${daysBetween * followUpNumber} days after the previous email.

Create a follow-up that:
1. Is shorter than the previous email (${Math.max(50, 150 - followUpNumber * 20)} words max)
2. References the previous communication naturally
3. ${strategy === 'value_add' ? 'Adds new value or insight' : ''}
4. ${strategy === 'urgency' ? 'Increases urgency appropriately' : ''}
5. ${strategy === 'persistent' ? 'Politely asks for a response' : ''}
6. ${strategy === 'nurture' ? 'Builds relationship without being pushy' : ''}
7. Has a clear, simple call-to-action
8. Maintains professional tone

Subject line should be a variation or follow-up to the original.`,
          system: `You are an expert at creating follow-up sequences that get responses.
Your follow-ups achieve 50% higher response rates through:
- Strategic timing and messaging
- Value-driven content
- Psychological triggers
- Clear next steps`
        });

        return result.object;
      })
    );

    const sequence: FollowUpSequence = {
      name: `Follow-up Sequence - ${strategy}`,
      initialEmail: {
        subject: extractSubjectLine(initialEmail),
        htmlContent: convertToHtml(initialEmail),
        textContent: initialEmail,
        personalizationTokens: {}
      },
      followUps,
      totalEmails: numberOfFollowUps + 1,
      strategy,
      stopOnReply: true,
      maxAttempts: numberOfFollowUps
    };

    return {
      success: true,
      data: sequence
    };
  } catch (error) {
    console.error('Follow-up generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate follow-ups'
    };
  }
}

// Generate A/B test variations
export async function generateABTestVariations(
  baseEmail: string,
  testElement: 'subject' | 'content' | 'cta' | 'tone' | 'length'
) {
  try {
    const user = await currentUser();
    if (!user) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const model = selectProvider('generation', 'quality');

    const variationPrompts = {
      subject: 'Create a variation with a different subject line approach',
      content: 'Rewrite the body with different messaging and structure',
      cta: 'Create a variation with a different call-to-action',
      tone: 'Rewrite with a different tone (more casual or more formal)',
      length: 'Create a significantly shorter or longer version'
    };

    const result = await generateText({
      model,
      prompt: `Create an A/B test variation of this email:

Original Email:
${baseEmail}

Test Element: ${testElement}
Instruction: ${variationPrompts[testElement]}

Create a variation that:
1. Only changes the ${testElement}
2. Maintains the same core message
3. Is significantly different for meaningful testing
4. Could potentially outperform the original`,
      system: 'You are an A/B testing expert. Create variations that provide meaningful test insights.'
    });

    return {
      success: true,
      data: {
        original: baseEmail,
        variation: result.text,
        testElement
      }
    };
  } catch (error) {
    console.error('A/B test generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate variation'
    };
  }
}

// Helper functions
function extractSubjectLine(emailText: string): string {
  const lines = emailText.split('\n');
  const subjectLine = lines.find(line =>
    line.toLowerCase().startsWith('subject:') ||
    line.toLowerCase().startsWith('subject line:')
  );

  if (subjectLine) {
    return subjectLine.replace(/^subject\s*(line)?:\s*/i, '').trim();
  }

  // If no subject line found, use first line or generate one
  return lines[0]?.slice(0, 100) || 'Follow-up';
}

function convertToHtml(text: string): string {
  // Basic text to HTML conversion
  return text
    .split('\n\n')
    .map(paragraph => `<p>${paragraph.replace(/\n/g, '<br>')}</p>`)
    .join('\n');
}