import { defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';
import type { RehypePrettyCodeOptions } from 'rehype-pretty-code';

// Rehype Pretty Code configuration with Shiki
const prettyCodeOptions: Partial<RehypePrettyCodeOptions> = {
  ...rehypeCodeDefaultOptions,
  theme: {
    light: 'github-light-default',
    dark: 'github-dark',
  },
  defaultLang: 'plaintext',
  transformers: [
    ...rehypeCodeDefaultOptions.transformers,
  ],
  onVisitLine(node: any) {
    // Prevent lines from collapsing in `display: grid` mode
    if (node.children.length === 0) {
      node.children = [{ type: 'text', value: ' ' }];
    }
  },
  onVisitHighlightedLine(node: any) {
    // Add class to highlighted lines
    node.properties.className = ['line--highlighted'];
  },
  onVisitHighlightedChars(node: any) {
    // Add class to highlighted chars
    node.properties.className = ['word--highlighted'];
  },
};

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: prettyCodeOptions,
  },
});

export const atoms = defineDocs({
  dir: 'content/atoms',
});
