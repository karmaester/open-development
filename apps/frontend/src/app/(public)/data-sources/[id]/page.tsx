import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchDataSource(id: string) {
  const res = await fetch(`${API_BASE}/api/v1/data-sources/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function DataSourceDetailPage({ params }: { params: { id: string } }) {
  const source = await fetchDataSource(params.id);
  if (!source) notFound();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{source.type}</Badge>
          <Badge variant={source.isActive ? 'success' : 'outline'}>
            {source.isActive ? 'Active' : 'Inactive'}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">{source.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Base URL:</strong> {source.baseUrl}
            </p>
            {source.apiVersion && (
              <p>
                <strong>API Version:</strong> {source.apiVersion}
              </p>
            )}
            <p>
              <strong>Created:</strong> {formatDate(source.createdAt)}
            </p>
            {source.lastSyncAt && (
              <p>
                <strong>Last Sync:</strong> {formatDate(source.lastSyncAt)}
              </p>
            )}
          </CardContent>
        </Card>

        {source.description && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{source.description}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
