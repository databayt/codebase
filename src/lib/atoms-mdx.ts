// Static content components for atoms pages
// Using plain React components instead of MDX to avoid compilation issues

import { IntroductionContent } from './atoms-content'

export const contentComponents: Record<string, any> = {
  'introduction': IntroductionContent,
}

export function getMDXComponent(slug: string) {
  return contentComponents[slug]
}
