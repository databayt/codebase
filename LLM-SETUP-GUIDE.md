# LLM Setup Guide for Lead Generation System

## Quick Start with Groq (Recommended)

### Step 1: Get Your FREE Groq API Key
1. Go to https://console.groq.com/keys
2. Sign up for a free account
3. Generate an API key
4. Add to your `.env.local`:
```bash
GROQ_API_KEY=gsk_your_api_key_here
```

### Step 2: Configure AI Provider
Your system is already configured to use Groq. The provider selection is automatic based on availability.

## API Key Setup

### Option 1: Groq (FREE - Recommended)
```bash
# Free tier: 30 req/min, 14,400 req/day
GROQ_API_KEY=gsk_your_api_key_here
```
- Best for: Lead extraction, data parsing
- Speed: 300+ tokens/second
- Cost: FREE
- Get key: https://console.groq.com/keys

### Option 2: OpenAI (Paid - Good balance)
```bash
# GPT-4o-mini: $0.15/1M input, $0.60/1M output
OPENAI_API_KEY=sk-your_api_key_here
```
- Best for: Email generation, versatile tasks
- Speed: Fast
- Cost: ~$15-20/month for 1000 leads/day
- Get key: https://platform.openai.com/api-keys

### Option 3: Anthropic Claude (Paid - Best quality)
```bash
# Claude 3 Haiku: $0.25/1M input, $1.25/1M output
ANTHROPIC_API_KEY=sk-ant-your_api_key_here
```
- Best for: Professional emails, proposals
- Speed: Moderate
- Cost: ~$25-30/month for 1000 leads/day
- Get key: https://console.anthropic.com/settings/keys

## Usage Estimates

| Daily Volume | Groq (Free) | OpenAI Mini | Claude Haiku |
|-------------|-------------|-------------|--------------|
| 100 leads   | $0          | ~$1.50/mo   | ~$2.50/mo    |
| 500 leads   | $0          | ~$7.50/mo   | ~$12.50/mo   |
| 1000 leads  | $0          | ~$15/mo     | ~$25/mo      |
| 5000 leads  | Need paid   | ~$75/mo     | ~$125/mo     |

## Feature Comparison

| Feature | Groq | OpenAI | Anthropic |
|---------|------|--------|-----------|
| Lead Extraction | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Email Generation | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Upwork Proposals | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Speed | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Cost | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Rate Limits | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## Current System Configuration

The system automatically selects the best available provider:

1. **Lead Extraction**: Uses Groq if available (fastest, free)
2. **Email Generation**: Uses OpenAI if available (best balance)
3. **Fallback**: Pattern-based extraction (no API needed)

## Testing Your Setup

After adding your API key, test it at:
- `/[lang]/test-import` - Test lead creation
- `/[lang]/leads` - Full lead management with AI extraction

## Troubleshooting

### If AI extraction isn't working:
1. Check console for error messages
2. Verify API key is correctly set in `.env.local`
3. Check rate limits (Groq: 30 req/min)
4. System will fallback to pattern matching if no API keys are configured

### Rate Limit Handling:
- Groq: 30 requests/minute → Process in batches
- OpenAI: 3,500 requests/minute → Usually sufficient
- Anthropic: 1,000 requests/minute → Good for most cases

## Recommendations by Use Case

### High Volume (>1000 leads/day):
- Primary: OpenAI GPT-4o-mini
- Fallback: Groq (for overflow)

### Cost-Conscious (<1000 leads/day):
- Primary: Groq (free tier)
- Fallback: Pattern matching

### Quality-Focused (emails/proposals):
- Primary: Anthropic Claude
- Secondary: OpenAI GPT-4o

### Balanced Approach:
- Lead Extraction: Groq
- Email Generation: OpenAI
- Proposal Writing: Anthropic