import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/data-display/empty-state';
import { formatDate } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchNews(params: Record<string, string>) {
  const url = new URL(`${API_BASE}/api/v1/news`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { data: [], meta: { totalCount: 0 } };
  return res.json();
}

export default async function NewsPage({ searchParams }: { searchParams: Record<string, string> }) {
  const result = await fetchNews(searchParams);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-3xl font-bold">News</h1>
      <p className="mb-8 text-muted-foreground">Latest development news and updates</p>

      {result.data.length === 0 ? (
        <EmptyState title="No news items" />
      ) : (
        <div className="space-y-4">
          {result.data.map((item: any) => (
            <a key={item.id} href={item.url} target="_blank" rel="noopener noreferrer">
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{item.source}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(item.publishedAt)}
                    </span>
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </CardHeader>
                {item.summary && (
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{item.summary}</p>
                  </CardContent>
                )}
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
