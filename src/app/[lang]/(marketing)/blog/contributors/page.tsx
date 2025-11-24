import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// This is a placeholder - in production, you'd dynamically load MDX files
// using fs, gray-matter, or a content management system
const contributors = [
  {
    name: 'Example Contributor',
    github: 'example-username',
    date: '2024-11-25',
    avatar: 'https://github.com/example-username.png',
    role: 'Developer',
    location: 'Earth',
    featured: true,
    slug: 'example-contributor',
  },
];

export default function ContributorsPage() {
  return (
    <div className="layout-container py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Contributors</h1>
          <p className="text-lg text-muted-foreground">
            Meet the amazing people building the future of school automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contributors.map((contributor) => (
            <Link
              key={contributor.github}
              href={`/blog/contributors/${contributor.slug}`}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={contributor.avatar}
                        alt={contributor.name}
                      />
                      <AvatarFallback>
                        {contributor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-xl">
                        {contributor.name}
                      </CardTitle>
                      <CardDescription>@{contributor.github}</CardDescription>
                    </div>
                  </div>
                  {contributor.featured && (
                    <Badge variant="secondary" className="w-fit">
                      Featured
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground space-y-2">
                    {contributor.role && (
                      <p>
                        <strong>Role:</strong> {contributor.role}
                      </p>
                    )}
                    {contributor.location && (
                      <p>
                        <strong>Location:</strong> {contributor.location}
                      </p>
                    )}
                    <p>
                      <strong>Joined:</strong> {contributor.date}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 p-8 bg-muted rounded-lg border-l-4 border-primary">
          <h2 className="text-2xl font-semibold mb-4">Join Our Contributors</h2>
          <p className="text-muted-foreground mb-4">
            Want to see your name here? Contributing to Hogwarts is easy!
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>
              Create a new file:{' '}
              <code className="bg-background px-2 py-1 rounded">
                src/app/[lang]/(marketing)/blog/contributors/YOUR-NAME.mdx
              </code>
            </li>
            <li>Add your information using the example template</li>
            <li>Submit a PR with title: "feat: add [Your Name] to contributors"</li>
          </ol>
          <Link
            href="/docs/get-started"
            className="inline-block mt-4 text-primary hover:underline"
          >
            → Read the Get Started guide
          </Link>
        </div>
      </div>
    </div>
  );
}
