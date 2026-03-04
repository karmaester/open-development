'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { UserRole } from '@opendevelopment/shared-types';
import { ROUTES } from '@/lib/constants';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="container py-12">Loading...</div>;

  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">Admin access required.</p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex gap-8">
        <nav className="w-48 space-y-1">
          <Link href={ROUTES.admin} className="block rounded-md px-3 py-2 text-sm hover:bg-accent">
            Dashboard
          </Link>
          <Link
            href={ROUTES.adminUsers}
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            Users
          </Link>
          <Link
            href={ROUTES.adminEtl}
            className="block rounded-md px-3 py-2 text-sm hover:bg-accent"
          >
            ETL Runs
          </Link>
        </nav>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
