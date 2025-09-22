import { getLeads } from '@/components/leads/action';

export const runtime = "nodejs";

export default async function TestLeads() {
  const result = await getLeads();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Leads Data</h1>

      <div className="mb-4">
        <strong>Total Leads:</strong> {result.pagination.total}
      </div>

      <div className="space-y-2">
        {result.leads.map((lead, i) => (
          <div key={lead.id} className="p-4 border rounded">
            <div>{i + 1}. {lead.name}</div>
            <div className="text-sm text-gray-600">
              Email: {lead.email || 'N/A'} |
              Company: {lead.company || 'N/A'} |
              Status: {lead.status} |
              Source: {lead.source}
            </div>
          </div>
        ))}
      </div>

      {result.leads.length === 0 && (
        <div className="text-red-500">
          No leads found! Check the server console for debug logs.
        </div>
      )}
    </div>
  );
}