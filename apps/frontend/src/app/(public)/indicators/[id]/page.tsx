import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IndicatorDataView } from './indicator-data-view';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchIndicator(id: string) {
  const res = await fetch(`${API_BASE}/api/v1/indicators/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

async function fetchIndicatorData(id: string) {
  const res = await fetch(`${API_BASE}/api/v1/indicators/${id}/data?pageSize=100`, {
    cache: 'no-store',
  });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function IndicatorDetailPage({ params }: { params: { id: string } }) {
  const [indicator, dataResult] = await Promise.all([
    fetchIndicator(params.id),
    fetchIndicatorData(params.id),
  ]);

  if (!indicator) notFound();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="secondary">{indicator.category}</Badge>
          {indicator.sdgGoal && <Badge variant="outline">SDG {indicator.sdgGoal}</Badge>}
        </div>
        <h1 className="text-3xl font-bold">{indicator.name}</h1>
        <p className="mt-1 text-muted-foreground">
          {indicator.code}
          {indicator.unit ? ` — ${indicator.unit}` : ''}
        </p>
        {indicator.description && <p className="mt-4">{indicator.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Time Series Data</CardTitle>
        </CardHeader>
        <CardContent>
          <IndicatorDataView data={dataResult.data} unit={indicator.unit} />
        </CardContent>
      </Card>
    </div>
  );
}
