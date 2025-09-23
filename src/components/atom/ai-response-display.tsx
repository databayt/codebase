'use client';

import { useState } from 'react';
import { Response } from './response';
import { Reasoning, ReasoningTrigger, ReasoningContent } from './reasoning';
import { cn } from '@/lib/utils';

interface AIResponseDisplayProps {
  response?: string;
  reasoning?: string;
  isStreaming?: boolean;
  className?: string;
  showReasoning?: boolean;
}

export function AIResponseDisplay({
  response = '',
  reasoning = '',
  isStreaming = false,
  className,
  showReasoning = true,
}: AIResponseDisplayProps) {
  const [duration] = useState(Math.floor(Math.random() * 3) + 2); // Simulate 2-5 seconds thinking

  return (
    <div className={cn('space-y-4', className)}>
      {/* {showReasoning && reasoning && (
        <Reasoning
          isStreaming={isStreaming}
          duration={duration}
          defaultOpen={isStreaming}
        >
          <ReasoningTrigger />
          <ReasoningContent>{reasoning}</ReasoningContent>
        </Reasoning>
      )} */}

      {response && (
        <div className="p-4">
          <Response>{response}</Response>
        </div>
      )}
    </div>
  );
}

// Example hook for using AI responses
export function useAIResponse() {
  const [response, setResponse] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const generateResponse = async (prompt: string, options?: { includeReasoning?: boolean }) => {
    setIsStreaming(true);

    // Simulate AI reasoning
    if (options?.includeReasoning) {
      setReasoning(`
## Analysis Process

1. **Understanding the request**: Parsing the user's input to identify key requirements
2. **Data extraction**: Identifying relevant information from the context
3. **Pattern matching**: Applying appropriate patterns and best practices
4. **Validation**: Ensuring the response meets quality standards
5. **Optimization**: Refining the output for clarity and usefulness
      `);
    }

    // Simulate streaming delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Set the actual response
    setResponse(`
## AI Generated Response

Based on the analysis, here's the generated content tailored to your requirements:

- **Key Point 1**: Detailed explanation of the first important aspect
- **Key Point 2**: Additional insights and recommendations
- **Key Point 3**: Actionable steps and best practices

### Next Steps
1. Review the generated content
2. Make any necessary adjustments
3. Implement the recommendations
    `);

    setIsStreaming(false);
  };

  return {
    response,
    reasoning,
    isStreaming,
    generateResponse,
    setResponse,
    setReasoning,
  };
}