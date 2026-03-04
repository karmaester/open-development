import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/data-display/empty-state';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchDataSources(params: Record<string, string>) {
  const url = new URL(`${API_BASE}/api/v1/data-sources`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { data: [], meta: { totalCount: 0 } };
  return res.json();
}

export default async function DataSourcesPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await fetchDataSources(searchParams);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold">Data Sources</h1>
      <p className="mb-8 text-muted-foreground">
        {result.meta.totalCount} international data sources
      </p>

      {result.data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((source: any) => (
            <Link key={source.id} href={ROUTES.dataSource(source.id)}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{source.type}</Badge>
                    <Badge variant={source.isActive ? 'success' : 'outline'}>
                      {source.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <CardTitle className="text-base">{source.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  {source.description && (
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {source.description}
                    </p>
                  )}
                  {source.lastSyncAt && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last sync: {formatDate(source.lastSyncAt)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
