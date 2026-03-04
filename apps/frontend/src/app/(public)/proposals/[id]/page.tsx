import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/data-display/status-badge';
import { CommentList } from '@/components/domain/comment-list';
import { ProposalComments } from './proposal-comments';
import { formatDate } from '@/lib/format';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchProposal(id: string) {
  const res = await fetch(`${API_BASE}/api/v1/proposals/${id}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

export default async function ProposalDetailPage({ params }: { params: { id: string } }) {
  const proposal = await fetchProposal(params.id);
  if (!proposal) notFound();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <StatusBadge status={proposal.status} />
          <span className="text-sm text-muted-foreground">{formatDate(proposal.createdAt)}</span>
        </div>
        <h1 className="text-3xl font-bold">{proposal.title}</h1>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Hypothesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic">&ldquo;{proposal.hypothesis}&rdquo;</p>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{proposal.description}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <CommentList comments={proposal.comments || []} />
          <div className="mt-6">
            <ProposalComments proposalId={params.id} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
