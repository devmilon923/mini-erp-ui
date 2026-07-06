'use client';

import { cn } from '@/lib/utils';

type Props = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 px-6 py-16 text-center',
        className
      )}
    >
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-fog text-slate-token">
          {icon}
        </div>
      )}
      <div className="space-y-1">
        <p className="font-heading text-lg font-normal text-graphite">{title}</p>
        {description && (
          <p className="mx-auto max-w-sm text-sm text-slate-token">{description}</p>
        )}
      </div>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
