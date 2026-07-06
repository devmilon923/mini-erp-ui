'use client';

import { cn } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

type Props = {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: { value: string; direction: 'up' | 'down' };
  accent?: boolean;
  className?: string;
};

export function StatCard({ label, value, icon, trend, accent, className }: Props) {
  return (
    <div
      className={cn(
        'card-data group relative flex flex-col gap-6 p-6 transition-all hover:border-mist/0 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl',
            accent ? 'bg-ember/10 text-ember' : 'bg-fog text-steel'
          )}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-1 text-xs font-medium',
              trend.direction === 'up' ? 'text-success' : 'text-destructive'
            )}
          >
            {trend.direction === 'up' ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <div className="font-heading text-4xl font-normal tracking-tight text-graphite">
          {value}
        </div>
        <div className="text-xs font-medium uppercase tracking-wider text-slate-token">
          {label}
        </div>
      </div>
    </div>
  );
}
