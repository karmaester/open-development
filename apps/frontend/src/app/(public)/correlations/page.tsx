import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/data-display/empty-state';
import { formatDate, formatRValue, formatPValue } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchCorrelations(params: Record<string, string>) {
  const url = new URL(`${API_BASE}/api/v1/correlations`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { data: [], meta: { totalCount: 0 } };
  return res.json();
}

export default async function CorrelationsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await fetchCorrelations(searchParams);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold">Correlations</h1>
      <p className="mb-8 text-muted-foreground">Statistical correlation analyses</p>

      {result.data.length === 0 ? (
        <EmptyState title="No correlations found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {result.data.map((corr: any) => (
            <Card key={corr.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <StatusBadge status={corr.status} />
                  <Badge variant="outline">{corr.method}</Badge>
                </div>
                <CardTitle className="text-sm">Correlation Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {corr.rValue !== null && (
                    <p>
                      <strong>r:</strong> {formatRValue(corr.rValue)}
                    </p>
                  )}
                  {corr.pValue !== null && (
                    <p>
                      <strong>p:</strong> {formatPValue(corr.pValue)}
                    </p>
                  )}
                  {corr.sampleSize && (
                    <p>
                      <strong>n:</strong> {corr.sampleSize}
                    </p>
                  )}
                  {corr.countryCode && (
                    <p>
                      <strong>Country:</strong> {corr.countryCode}
                    </p>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{formatDate(corr.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
