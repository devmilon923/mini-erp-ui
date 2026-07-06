'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (p: number) => void;
  className?: string;
};

export function Pagination({ page, pageCount, onPageChange, className }: Props) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 border-t border-mist pt-4',
        className
      )}
    >
      <p className="text-xs text-slate-token">
        Page {page} of {pageCount}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center rounded-full text-steel transition-colors hover:bg-fog disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              'flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-sm transition-colors',
              p === page
                ? 'bg-graphite text-white'
                : 'text-steel hover:bg-fog'
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(pageCount, page + 1))}
          disabled={page === pageCount}
          className="flex h-8 w-8 items-center justify-center rounded-full text-steel transition-colors hover:bg-fog disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
