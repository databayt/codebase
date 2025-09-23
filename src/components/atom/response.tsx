'use client';

import { cn } from '@/lib/utils';
import { type ComponentProps, memo } from 'react';
import { Streamdown } from 'streamdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({
    className,
    children,
    parseIncompleteMarkdown = true,
    allowedImagePrefixes = ['*'],
    allowedLinkPrefixes = ['*'],
    remarkPlugins = [remarkGfm, remarkMath],
    rehypePlugins = [rehypeKatex],
    ...props
  }: ResponseProps) => (
    <Streamdown
      className={cn(
        'size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0',
        'prose prose-sm max-w-none dark:prose-invert',
        'prose-headings:font-semibold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg',
        'prose-p:leading-relaxed prose-p:text-muted-foreground',
        'prose-strong:text-foreground prose-strong:font-semibold',
        'prose-code:text-xs prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md',
        'prose-code:bg-muted prose-code:text-foreground prose-code:font-mono',
        'prose-pre:bg-muted prose-pre:text-foreground prose-pre:rounded-lg',
        'prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-li:text-muted-foreground prose-li:marker:text-primary',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        className,
      )}
      parseIncompleteMarkdown={parseIncompleteMarkdown}
      allowedImagePrefixes={allowedImagePrefixes}
      allowedLinkPrefixes={allowedLinkPrefixes}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
      {...props}
    >
      {children}
    </Streamdown>
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);

Response.displayName = 'Response';