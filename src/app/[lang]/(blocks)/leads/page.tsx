'use client';

import dynamic from 'next/dynamic';

export const runtime = "nodejs";

const LeadsContent = dynamic(
  () => import('@/components/leads/content'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-screen">
        <div className="text-muted-foreground">Loading leads...</div>
      </div>
    )
  }
);

export default function Leads() {
  return <LeadsContent />;
}