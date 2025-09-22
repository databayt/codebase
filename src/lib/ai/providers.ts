import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { createGroq } from '@ai-sdk/groq';

export type TaskType =
  | 'analysis'      // Complex reasoning
  | 'extraction'    // Data extraction
  | 'generation'    // Content creation
  | 'streaming'     // Real-time responses
  | 'embedding';    // Vector operations

export type Priority = 'cost' | 'quality' | 'speed';

// Initialize providers with API keys
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
});

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
});

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY || ''
});

// Provider configurations with model tiers
export const providers = {
  anthropic: {
    fast: anthropic('claude-3-haiku-20240307'),
    balanced: anthropic('claude-3-5-sonnet-20241022'),
    powerful: anthropic('claude-3-opus-20240229')
  },
  groq: {
    fast: groq('llama-3.1-8b-instant'), // Fast model for simple tasks
    balanced: groq('openai/gpt-oss-20b'), // Supports structured outputs
    powerful: groq('openai/gpt-oss-120b') // Most powerful, supports structured outputs
  },
  openai: {
    fast: openai('gpt-4o-mini'),
    balanced: openai('gpt-4o'),
    powerful: openai('gpt-4-turbo')
  }
};

// Task-based model selection strategy
const taskStrategy = {
  analysis: {
    primary: 'anthropic',
    model: 'balanced',
    fallback: { provider: 'openai', model: 'balanced' }
  },
  extraction: {
    primary: 'groq',  // Use Groq (free)
    model: 'powerful',  // Using model that supports JSON
    fallback: { provider: 'anthropic', model: 'fast' }
  },
  generation: {
    primary: 'anthropic',
    model: 'balanced',
    fallback: { provider: 'openai', model: 'balanced' }
  },
  streaming: {
    primary: 'groq',
    model: 'fast',
    fallback: { provider: 'anthropic', model: 'fast' }
  },
  embedding: {
    primary: 'openai',
    model: 'fast',
    fallback: { provider: 'groq', model: 'fast' }
  }
};

// Priority-based selection overrides
const priorityOverrides = {
  cost: {
    preferredProvider: 'groq',
    preferredTier: 'fast'
  },
  quality: {
    preferredProvider: 'anthropic',
    preferredTier: 'powerful'
  },
  speed: {
    preferredProvider: 'groq',
    preferredTier: 'fast'
  }
};

// Smart provider selection with fallbacks
export function selectProvider(
  task: TaskType,
  priority: Priority = 'cost'
) {
  // Check if priority override should be applied
  if (priority !== 'cost') {
    const override = priorityOverrides[priority];
    try {
      const provider = providers[override.preferredProvider as keyof typeof providers];
      return provider[override.preferredTier as keyof typeof provider];
    } catch (error) {
      console.warn(`Priority provider failed, falling back to task-based selection`);
    }
  }

  // Use task-based selection
  const strategy = taskStrategy[task];

  try {
    const provider = providers[strategy.primary as keyof typeof providers];
    return provider[strategy.model as keyof typeof provider];
  } catch (error) {
    console.warn(`Primary provider ${strategy.primary} failed, using fallback`);
    const fallbackProvider = providers[strategy.fallback.provider as keyof typeof providers];
    return fallbackProvider[strategy.fallback.model as keyof typeof fallbackProvider];
  }
}

// Cost estimation per 1M tokens (in USD)
export const modelCosts = {
  'claude-3-haiku-20240307': { input: 0.25, output: 1.25 },
  'claude-3-5-sonnet-20241022': { input: 3, output: 15 },
  'claude-3-opus-20240229': { input: 15, output: 75 },
  'llama-3.1-8b-instant': { input: 0.05, output: 0.08 },
  'llama-3.1-70b-versatile': { input: 0.59, output: 0.79 },
  'llama-3.2-90b-text-preview': { input: 2.5, output: 2.5 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4o': { input: 2.50, output: 10 },
  'gpt-4-turbo': { input: 10, output: 30 }
};

// Helper to estimate operation cost
export function estimateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): number {
  const costs = modelCosts[model as keyof typeof modelCosts];
  if (!costs) return 0;

  const inputCost = (inputTokens / 1_000_000) * costs.input;
  const outputCost = (outputTokens / 1_000_000) * costs.output;

  return inputCost + outputCost;
}