'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { createProposal } from '@/lib/api/proposals';
import { ROUTES } from '@/lib/constants';

export default function NewProposalPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Sign in required</h1>
        <p className="mt-2 text-muted-foreground">You must be signed in to create a proposal.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    try {
      const proposal = await createProposal({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        indicatorAId: formData.get('indicatorAId') as string,
        indicatorBId: formData.get('indicatorBId') as string,
        hypothesis: formData.get('hypothesis') as string,
      });
      router.push(ROUTES.proposal(proposal.id));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-3xl font-bold">New Proposal</h1>

      <Card>
        <CardHeader>
          <CardTitle>Propose a Correlation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required minLength={5} maxLength={200} />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" required minLength={20} rows={4} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="indicatorAId">Indicator A (UUID)</Label>
                <Input
                  id="indicatorAId"
                  name="indicatorAId"
                  required
                  placeholder="Indicator A ID"
                />
              </div>
              <div>
                <Label htmlFor="indicatorBId">Indicator B (UUID)</Label>
                <Input
                  id="indicatorBId"
                  name="indicatorBId"
                  required
                  placeholder="Indicator B ID"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="hypothesis">Hypothesis</Label>
              <Textarea
                id="hypothesis"
                name="hypothesis"
                required
                minLength={10}
                rows={3}
                placeholder="e.g., GDP growth correlates positively with life expectancy"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Proposal'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
