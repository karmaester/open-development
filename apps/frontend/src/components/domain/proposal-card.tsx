import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { ROUTES } from '@/lib/constants';
import { formatDate } from '@/lib/format';

interface ProposalCardProps {
  proposal: {
    id: string;
    title: string;
    description: string;
    status: string;
    createdAt: string;
  };
}

export function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <Link href={ROUTES.proposal(proposal.id)}>
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <StatusBadge status={proposal.status} />
            <span className="text-xs text-muted-foreground">{formatDate(proposal.createdAt)}</span>
          </div>
          <CardTitle className="text-base">{proposal.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{proposal.description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
