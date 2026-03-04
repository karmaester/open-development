'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/data-display/status-badge';
import { getEtlRuns } from '@/lib/api/admin';
import { formatDate } from '@/lib/format';

export default function AdminEtlPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEtlRuns()
      .then((res) => setRuns(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading ETL runs...</p>;

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">ETL Runs</h1>
      {runs.length === 0 ? (
        <p className="text-muted-foreground">No ETL runs yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Source</th>
                <th className="px-4 py-3 text-left">Started</th>
                <th className="px-4 py-3 text-left">Records</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-b">
                  <td className="px-4 py-3">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-4 py-3">{run.sourceId}</td>
                  <td className="px-4 py-3">{formatDate(run.startedAt)}</td>
                  <td className="px-4 py-3">{run.recordsProcessed ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
