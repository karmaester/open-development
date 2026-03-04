import Link from 'next/link';
import { BarChart3, Database, FileText, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/data-display/stat-card';
import { SDG_GOALS } from '@opendevelopment/shared-types';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  return (
    <div className="container py-8">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">OpenDevelopment</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          Aggregating, visualizing, and cross-correlating development data from authoritative
          sources worldwide.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href={ROUTES.indicators}>
            <Button size="lg">Browse Indicators</Button>
          </Link>
          <Link href={ROUTES.proposals}>
            <Button variant="outline" size="lg">
              View Proposals
            </Button>
          </Link>
        </div>
      </section>

      <section className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Data Sources"
          value="6"
          description="International organizations"
          icon={Database}
        />
        <StatCard
          title="Indicators"
          value="20"
          description="Development metrics"
          icon={BarChart3}
        />
        <StatCard title="Countries" value="56" description="Across all regions" icon={Globe} />
        <StatCard title="Proposals" value="2" description="Community hypotheses" icon={FileText} />
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">SDG Goals</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {SDG_GOALS.map((goal) => (
            <Link key={goal.number} href={`${ROUTES.indicators}?sdgGoal=${goal.number}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm">
                    <span
                      className="mr-2 inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: goal.color }}
                    />
                    SDG {goal.number}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 pt-0">
                  <p className="line-clamp-2 text-xs text-muted-foreground">{goal.name}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
