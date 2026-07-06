'use client';

import { cn } from '@/lib/utils';

type Props = {
  columns: { key: string; label: string; className?: string }[];
  children: React.ReactNode;
  className?: string;
};

export function DataTable({ columns, children, className }: Props) {
  return (
    <div className={cn('card-data overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-mist">
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={cn(
                    'px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-token',
                    c.className
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

export function DataTableRow({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-b border-mist/60 transition-colors last:border-0 hover:bg-fog/60',
        className
      )}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={cn('px-5 py-4 align-middle text-graphite', className)}>{children}</td>;
}
