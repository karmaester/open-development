import Link from 'next/link';
import { ProposalCard } from '@/components/domain/proposal-card';
import { EmptyState } from '@/components/data-display/empty-state';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ROUTES } from '@/lib/constants';
import { ProposalStatus } from '@opendevelopment/shared-types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchProposals(params: Record<string, string>) {
  const url = new URL(`${API_BASE}/api/v1/proposals`);
  for (const [k, v] of Object.entries(params)) {
    if (v) url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), { cache: 'no-store' });
  if (!res.ok) return { data: [], meta: { page: 1, pageSize: 20, totalCount: 0, totalPages: 0 } };
  return res.json();
}

const STATUSES = Object.values(ProposalStatus);

export default async function ProposalsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const result = await fetchProposals(searchParams);

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Community hypotheses about indicator correlations</p>
        </div>
        <Link href={ROUTES.newProposal}>
          <Button>New Proposal</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href={ROUTES.proposals}>
          <Badge variant={!searchParams.status ? 'default' : 'outline'}>All</Badge>
        </Link>
        {STATUSES.map((status) => (
          <Link key={status} href={`${ROUTES.proposals}?status=${status}`}>
            <Badge variant={searchParams.status === status ? 'default' : 'outline'}>
              {status.replace(/_/g, ' ')}
            </Badge>
          </Link>
        ))}
      </div>

      {result.data.length === 0 ? (
        <EmptyState title="No proposals found" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {result.data.map((proposal: any) => (
            <ProposalCard key={proposal.id} proposal={proposal} />
          ))}
        </div>
      )}
    </div>
  );
}
