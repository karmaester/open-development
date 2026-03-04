import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/constants';

interface IndicatorCardProps {
  indicator: {
    id: string;
    code: string;
    name: string;
    category: string;
    sdgGoal?: number | null;
    unit?: string | null;
  };
}

export function IndicatorCard({ indicator }: IndicatorCardProps) {
  return (
    <Link href={ROUTES.indicator(indicator.id)}>
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
  );
}
