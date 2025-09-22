/**
 * Content orchestration component for the Leads feature
 * Main UI component that brings together all lead-related functionality
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download, Filter } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowFilters(!showFilters);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowCreateForm(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showFilters]);

  return (
    <>
      <LeadsPrompt />
      <div id="leads-content" className="flex flex-col gap-6 p-6" suppressHydrationWarning>
        {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Leads Management
            </h1>
            <p className="text-muted-foreground">
              Manage and track your sales leads
            </p>
          </div>

          <div className="flex gap-2">
            {FEATURE_FLAGS.BULK_OPERATIONS && selectedLeads.length > 0 && (
              <BulkOperations
                selectedLeads={selectedLeads}
                onComplete={() => {
                  setSelectedLeads([]);
                  refreshLeads();
                }}
              />
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>

            <Button
              size="sm"
              onClick={() => setShowCreateForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Lead
            </Button>
          </div>
        </div>

        {/* Analytics Dashboard */}
        <LeadAnalytics />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="all">All Leads</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="cards">Card View</TabsTrigger>
          {FEATURE_FLAGS.AI_EXTRACTION && (
            <TabsTrigger value="ai">AI Extraction</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="all" className="mt-4">
          <All
            leads={leads}
            isLoading={isLoading}
            filters={filters}
            showFilters={showFilters}
            onFiltersChange={setFilters}
            selectedLeads={selectedLeads}
            onSelectionChange={setSelectedLeads}
            onRefresh={refreshLeads}
          />
        </TabsContent>

        <TabsContent value="featured" className="mt-4">
          <Featured
            leads={leads.filter(l => l.score >= 80)}
            isLoading={isLoading}
            onRefresh={refreshLeads}
          />
        </TabsContent>

        <TabsContent value="cards" className="mt-4">
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
        </TabsContent>

        {FEATURE_FLAGS.AI_EXTRACTION && (
          <TabsContent value="ai" className="mt-4">
            <PasteImport onComplete={refreshLeads} />
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      {showCreateForm && (
        <Form
          open={showCreateForm}
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => {
            setShowCreateForm(false);
            refreshLeads();
          }}
        />
      )}

      {showImportDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Import Leads</h2>
            <PasteImport
              onComplete={() => {
                setShowImportDialog(false);
                refreshLeads();
              }}
            />
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}