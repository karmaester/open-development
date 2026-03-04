'use client';

import { useAuth } from '@/hooks/use-auth';
import { CommentForm } from '@/components/domain/comment-form';
import { addComment } from '@/lib/api/proposals';

export function ProposalComments({ proposalId }: { proposalId: string }) {
  const { user } = useAuth();

  if (!user) {
    return <p className="text-sm text-muted-foreground">Sign in to comment.</p>;
  }

  return (
    <CommentForm
      onSubmit={async (content) => {
        await addComment(proposalId, content);
        window.location.reload();
      }}
    />
  );
}
