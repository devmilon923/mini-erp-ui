"use client";
import { ReactNode, useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/provider/auth";

export function ProtectRoute({
  children,
  roles,
}: {
  children: ReactNode;
  roles: string[];
}) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isMounted) {
      if (!user) {
        router.push("/login");
      } else if (!roles.includes(user.role)) {
        router.push("/unauthorized");
      }
    }
  }, [isLoading, user, router, isMounted]);

  if (!isMounted || (isLoading && !user)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <div className="animate-pulse text-sm font-medium text-muted-foreground">
            Restoring session...
          </div>
        </div>
      </div>
    );
  }

  if (user && roles.includes(user.role)) {
    return <>{children}</>;
  }

  return null;
}
