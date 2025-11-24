import React from 'react';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// In production, you would:
// 1. Use fs to read MDX files from the contributors directory
// 2. Use gray-matter to parse frontmatter
// 3. Use next-mdx-remote or similar to render MDX content
// 4. Generate static params for all contributors

// Placeholder data
const contributorsData: Record<string, any> = {
  'example-contributor': {
    name: 'Example Contributor',
    github: 'example-username',
    date: '2024-11-25',
    avatar: 'https://github.com/example-username.png',
    role: 'Developer',
    location: 'Earth',
    featured: true,
    content: `
# Example Contributor

Hi! I'm contributing to Hogwarts because I believe in making education accessible and efficient for everyone.

## My Contributions

- Added new feature X
- Fixed bug in component Y
- Improved documentation

## Why Hogwarts?

Education technology has the potential to transform how millions of students learn. By contributing to Hogwarts, I'm helping build tools that make school management easier for administrators, teachers, and students alike.
    `,
  },
};

export async function generateStaticParams() {
  // In production, read all MDX files from the contributors directory
  return Object.keys(contributorsData).map((slug) => ({
    slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
    lang: string;
  }>;
}

export default async function ContributorPage({ params }: PageProps) {
  const { slug } = await params;
  const contributor = contributorsData[slug];

  if (!contributor) {
    notFound();
  }

  return (
    <div className="layout-container py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/blog/contributors"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          ← Back to Contributors
        </Link>

        {/* Header */}
        <div className="mb-12 pb-8 border-b">
          <div className="flex items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={contributor.avatar} alt={contributor.name} />
              <AvatarFallback>
                {contributor.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{contributor.name}</h1>
                {contributor.featured && (
                  <Badge variant="secondary">Featured</Badge>
                )}
              </div>
              <p className="text-muted-foreground mb-4">
                @{contributor.github}
              </p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                {contributor.role && <span>Role: {contributor.role}</span>}
                {contributor.location && (
                  <span>Location: {contributor.location}</span>
                )}
                <span>Joined: {contributor.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          {/* In production, render MDX content here */}
          <div
            dangerouslySetInnerHTML={{
              __html: contributor.content
                .split('\n')
                .map((line: string) => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold mt-8 mb-4">${line.slice(2)}</h1>`;
                  }
                  if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-semibold mt-6 mb-3">${line.slice(3)}</h2>`;
                  }
                  if (line.startsWith('- ')) {
                    return `<li class="ml-6">${line.slice(2)}</li>`;
                  }
                  if (line.trim() === '') {
                    return '<br />';
                  }
                  return `<p class="mb-4">${line}</p>`;
                })
                .join(''),
            }}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t">
          <div className="flex items-center justify-between">
            <a
              href={`https://github.com/${contributor.github}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              View GitHub Profile →
            </a>
            <Link
              href="/docs/get-started"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              Want to contribute? Get started →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
