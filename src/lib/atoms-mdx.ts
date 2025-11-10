// Static imports for all MDX files
// This is required because dynamic imports with variables don't work in Next.js build

import IntroductionMDX from '@/content/atoms/introduction.mdx'
// import InfiniteSliderMDX from '@/content/atoms/infinite-slider.mdx' // Temporarily disabled

export const mdxComponents: Record<string, any> = {
  'introduction': IntroductionMDX,
  // 'infinite-slider': InfiniteSliderMDX, // Temporarily disabled
}

export function getMDXComponent(slug: string) {
  return mdxComponents[slug]
}
