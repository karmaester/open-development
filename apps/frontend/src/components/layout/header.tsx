'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants';
import { UserRole } from '@opendevelopment/shared-types';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link href={ROUTES.home} className="mr-6 flex items-center space-x-2 font-bold">
          OpenDevelopment
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href={ROUTES.indicators} className="hover:text-foreground/80">
            Indicators
          </Link>
          <Link href={ROUTES.proposals} className="hover:text-foreground/80">
            Proposals
          </Link>
          <Link href={ROUTES.dataSources} className="hover:text-foreground/80">
            Data Sources
          </Link>
          <Link href={ROUTES.correlations} className="hover:text-foreground/80">
            Correlations
          </Link>
          <Link href={ROUTES.news} className="hover:text-foreground/80">
            News
          </Link>
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          {user ? (
            <>
              {user.role === UserRole.ADMIN && (
                <Link href={ROUTES.admin}>
                  <Button variant="ghost" size="sm">
                    Admin
                  </Button>
                </Link>
              )}
              <span className="text-sm text-muted-foreground">{user.displayName}</span>
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link href={ROUTES.login}>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href={ROUTES.register}>
                <Button size="sm">Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
