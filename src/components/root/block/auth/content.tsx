"use client";

import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthBlockContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

const authFeatures = [
  {
    title: "Login",
    description: "Email/password and OAuth authentication",
    href: "/auth/login",
  },
  {
    title: "Register",
    description: "User registration with email verification",
    href: "/auth/register",
  },
  {
    title: "Forgot Password",
    description: "Password reset via email",
    href: "/auth/reset",
  },
  {
    title: "Two-Factor Auth",
    description: "Optional 2FA for enhanced security",
    href: "/setting",
  },
];

export default function AuthBlockContent({ lang }: AuthBlockContentProps) {
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {authFeatures.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/${lang}${feature.href}`}>
                  View {feature.title}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Stack</CardTitle>
          <CardDescription>Built with Auth.js (NextAuth v5)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Providers: Email/Password, Google, GitHub, Facebook</p>
          <p>Database: Prisma adapter with PostgreSQL (Neon)</p>
          <p>Features: Email verification, password reset, 2FA, role-based access</p>
        </CardContent>
      </Card>
    </div>
  );
}
