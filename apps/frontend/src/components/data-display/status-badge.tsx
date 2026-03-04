import { Badge } from '@/components/ui/badge';

const STATUS_COLORS: Record<
  string,
  'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
> = {
  DRAFT: 'secondary',
  SUBMITTED: 'default',
  UNDER_REVIEW: 'warning',
  APPROVED: 'success',
  REJECTED: 'destructive',
  IMPLEMENTED: 'success',
  PENDING: 'secondary',
  RUNNING: 'warning',
  COMPLETED: 'success',
  FAILED: 'destructive',
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_COLORS[status] || 'outline';
  return <Badge variant={variant}>{status.replace(/_/g, ' ')}</Badge>;
}
