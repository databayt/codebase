"use client";

import type { getDictionary } from "@/components/local/dictionaries";
import type { Locale } from "@/components/local/config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, ExternalLink } from "lucide-react";
import Link from "next/link";

interface TableBlockContentProps {
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  lang: Locale;
}

export default function TableBlockContent({ lang }: TableBlockContentProps) {
  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Table className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Data Table</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Advanced data table with filtering, sorting, and pagination
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">Features</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Server-side pagination
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Advanced filtering
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Multi-column sorting
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Row selection & actions
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Column visibility toggle
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Stack</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  TanStack Table v8
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  Prisma ORM
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  URL state management
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline" className="h-2 w-2 p-0 rounded-full" />
                  RTL support
                </li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href={`/${lang}/tablecn`}>
              <Button>
                <ExternalLink className="h-4 w-4 me-2" />
                View Live Demo
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
