'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

type Props = {
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: React.ReactNode;
    variant?: 'primary' | 'outline';
  };
  className?: string;
};

export function PageHeader({ title, description, action, className }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-normal tracking-tight text-graphite sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-xl text-sm text-slate-token">{description}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0">
          {action.href ? (
            <Link
              href={action.href}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-pill px-5 text-sm font-medium transition-all',
                action.variant === 'outline'
                  ? 'border border-mist bg-canvas text-graphite hover:bg-fog'
                  : 'bg-graphite text-white hover:bg-graphite/90'
              )}
            >
              {action.icon}
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className={cn(
                'inline-flex h-11 items-center gap-2 rounded-pill px-5 text-sm font-medium transition-all',
                action.variant === 'outline'
                  ? 'border border-mist bg-canvas text-graphite hover:bg-fog'
                  : 'bg-graphite text-white hover:bg-graphite/90'
              )}
            >
              {action.icon}
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
