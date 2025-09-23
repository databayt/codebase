/**
 * Content orchestration component for the Leads feature
 * Main UI component that brings together all lead-related functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Plus, BarChart3 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PageHeader } from '@/components/atom/page-header';
import { TwoButtons } from '@/components/atom/two-buttons';
import { All } from './all';
import { Featured } from './featured';
import { Form } from './form';
import { LeadCard } from './card';
import { useLeads } from './use-leads';
import { LeadAnalytics } from './analytics';
import { BulkOperations } from './bulk-operations';
import { PasteImport } from './paste-import';
import { FEATURE_FLAGS } from './constant';
import LeadsPrompt from './prompt';

export default function LeadsContent() {
  const router = useRouter();
  const {
    leads,
    isLoading,
    filters,
    setFilters,
    selectedLeads,
    setSelectedLeads,
    refreshLeads,
  } = useLeads();

  console.log('🎯 [LeadsContent] Component rendered with:', {
    leadsCount: leads.length,
    isLoading,
    hasFilters: Object.keys(filters).length > 0,
    selectedCount: selectedLeads.length
  });

  const [activeTab, setActiveTab] = useState('/leads/all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  console.log('📄 [LeadsContent] State:', {
    activeTab,
    showCreateForm
  });

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowCreateForm(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <>
      <LeadsPrompt />
      <div id="leads-content" className="flex flex-col gap-6 p-6" suppressHydrationWarning>
        {/* Header Section */}
        <PageHeader
          heading="Leads Management"
          description="Efficiently manage, track, and convert your sales pipeline. Transform prospects into customers with intelligent lead scoring and automation."
          headingClassName="text-3xl font-bold tracking-tight"
          actions={
            <>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => setShowCreateForm(true)}
                >
                  Add Lead
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setActiveTab('/leads/all')}
                >
                  Browse Leads
                </Button>
              </div>
              {FEATURE_FLAGS.BULK_OPERATIONS && selectedLeads.length > 0 && (
                <BulkOperations
                  selectedLeads={selectedLeads}
                  onComplete={() => {
                    setSelectedLeads([]);
                    refreshLeads();
                  }}
                />
              )}
            </>
          }
        />

      {/* Tabs Navigation */}
      <div className="border-t border-b">
        <div className="flex items-center gap-2 py-2">
          <button
            className={`flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary ${
              activeTab === '/leads/all' ? 'bg-muted text-primary' : ''
            }`}
            onClick={() => setActiveTab('/leads/all')}
          >
            All Leads
          </button>
          <button
            className={`flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary ${
              activeTab === '/leads/featured' ? 'bg-muted text-primary' : ''
            }`}
            onClick={() => setActiveTab('/leads/featured')}
          >
            Featured
          </button>
          <button
            className={`flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary ${
              activeTab === '/leads/cards' ? 'bg-muted text-primary' : ''
            }`}
            onClick={() => setActiveTab('/leads/cards')}
          >
            Card View
          </button>
          {FEATURE_FLAGS.AI_EXTRACTION && (
            <button
              className={`flex h-7 items-center justify-center rounded-full px-4 text-center transition-colors hover:text-primary ${
                activeTab === '/leads/ai' ? 'bg-muted text-primary' : ''
              }`}
              onClick={() => setActiveTab('/leads/ai')}
            >
              AI Extraction
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4">
        {activeTab === '/leads/all' && (
          <All
            leads={leads}
            isLoading={isLoading}
            filters={filters}
            showFilters={true}
            onFiltersChange={setFilters}
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
            onRefresh={refreshLeads}
            onAnalyticsClick={() => setShowAnalytics(true)}
          />
        )}
        {activeTab === '/leads/featured' && (
          <Featured
            leads={leads.filter(l => l.score >= 80)}
            isLoading={isLoading}
            onRefresh={refreshLeads}
          />
        )}
        {activeTab === '/leads/cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onUpdate={refreshLeads}
                onDelete={refreshLeads}
              />
            ))}
          </div>
        )}
        {FEATURE_FLAGS.AI_EXTRACTION && activeTab === '/leads/ai' && (
          <PasteImport onComplete={refreshLeads} />
        )}
      </div>

      {/* Dialogs */}
      {showCreateForm && (
        <Form
          open={showCreateForm}
          onClose={() => {
            console.log('🔘 [LeadsContent] Form.onClose callback triggered');
            setShowCreateForm(false);
          }}
          onSuccess={() => {
            console.log('📤 [LeadsContent] Form.onSuccess callback triggered');
            console.log('🔄 [LeadsContent] Closing form and refreshing leads...');
            setShowCreateForm(false);
            refreshLeads();
          }}
        />
      )}

      {/* Analytics Dialog */}
      <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="sr-only">Lead Analytics</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 grid-cols-2">
            <LeadAnalytics />
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </>
  );
}