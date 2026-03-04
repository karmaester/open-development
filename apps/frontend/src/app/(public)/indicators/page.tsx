import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/data-display/empty-state';
import { ROUTES } from '@/lib/constants';
import { INDICATOR_CATEGORIES, SDG_GOALS } from '@opendevelopment/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchIndicators(params: Record<string, string>) {
  const url = new URL(`${API_BASE}/api/v1/indicators`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { data: [], meta: { page: 1, pageSize: 20, totalCount: 0, totalPages: 0 } };
  return res.json();
}

export default async function IndicatorsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await fetchIndicators(searchParams);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Indicators</h1>
          <p className="text-muted-foreground">
            Browse {result.meta.totalCount} development indicators
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={ROUTES.indicators}>
          <Badge variant={!searchParams.category && !searchParams.sdgGoal ? 'default' : 'outline'}>
            All
          </Badge>
        </Link>
        {INDICATOR_CATEGORIES.map((cat) => (
          <Link key={cat.id} href={`${ROUTES.indicators}?category=${cat.id}`}>
            <Badge variant={searchParams.category === cat.id ? 'default' : 'outline'}>
              {cat.label}
            </Badge>
          </Link>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {SDG_GOALS.map((goal) => (
          <Link key={goal.number} href={`${ROUTES.indicators}?sdgGoal=${goal.number}`}>
            <Badge
              variant={searchParams.sdgGoal === String(goal.number) ? 'default' : 'outline'}
              className="text-xs"
            >
              SDG {goal.number}
            </Badge>
          </Link>
        ))}
      </div>

      {result.data.length === 0 ? (
        <EmptyState title="No indicators found" description="Try adjusting your filters." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((indicator: any) => (
            <Link key={indicator.id} href={ROUTES.indicator(indicator.id)}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{indicator.category}</Badge>
                    {indicator.sdgGoal && <Badge variant="outline">SDG {indicator.sdgGoal}</Badge>}
                  </div>
                  <CardTitle className="text-base">{indicator.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {indicator.code}
                    {indicator.unit ? ` (${indicator.unit})` : ''}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
