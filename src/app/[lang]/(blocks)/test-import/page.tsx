'use client';

import { useState } from 'react';
import { createLead, getLeads } from '@/components/leads/action';

export default function TestImport() {
  const [logs, setLogs] = useState<string[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  const addLog = (msg: string) => {
    console.log(msg);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  const testCreateLead = async () => {
    addLog('Starting test lead creation...');

    const testLead = {
      name: 'Test Lead ' + Date.now(),
      email: `test${Date.now()}@example.com`,
      company: 'Test Company',
      status: 'NEW',
      source: 'MANUAL',
      score: 75,
    };

    addLog(`Creating lead: ${JSON.stringify(testLead)}`);

    try {
      const result = await createLead(testLead);
      if (result.success) {
        addLog(`✅ Success! Lead ID: ${result.data?.id}`);
      } else {
        addLog(`❌ Failed: ${result.error}`);
      }
    } catch (error) {
      addLog(`❌ Error: ${error}`);
    }
  };

  const fetchLeads = async () => {
    addLog('Fetching leads...');
    try {
      const result = await getLeads();
      addLog(`Found ${result.leads.length} leads (Total: ${result.pagination.total})`);
      setLeads(result.leads);
      result.leads.forEach((lead, i) => {
        addLog(`  ${i + 1}. ${lead.name} - ${lead.email}`);
      });
    } catch (error) {
      addLog(`❌ Error fetching: ${error}`);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Lead Import Test & Debug</h1>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testCreateLead}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Test Lead
        </button>
        <button
          onClick={fetchLeads}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Fetch All Leads
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Refresh Page
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Logs</h2>
          <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">No logs yet. Click a button above.</p>
            ) : (
              logs.map((log, i) => (
                <div key={i} className={log.includes('❌') ? 'text-red-600' : log.includes('✅') ? 'text-green-600' : ''}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Current Leads ({leads.length})</h2>
          <div className="bg-gray-100 p-4 rounded h-96 overflow-y-auto">
            {leads.length === 0 ? (
              <p className="text-gray-500">No leads loaded. Click "Fetch All Leads".</p>
            ) : (
              leads.map((lead) => (
                <div key={lead.id} className="mb-3 pb-3 border-b">
                  <div className="font-semibold">{lead.name}</div>
                  <div className="text-sm text-gray-600">
                    {lead.email} | {lead.company} | {lead.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    ID: {lead.id}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Check Terminal Output:</strong> Look at your terminal for detailed SERVER: logs.
          <br />
          <strong>Check Browser Console:</strong> Press F12 to see client-side logs.
        </p>
      </div>
    </div>
  );
}