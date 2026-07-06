'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, Plus, Receipt, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import {
  DataTable,
  DataTableRow,
  DataTableCell as TableCell,
} from '@/components/shared/data-table';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { SALES } from '@/lib/mock-data';
import { currency } from '@/lib/format';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const PAGE_SIZE = 5;

export default function SalesPage() {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [viewSale, setViewSale] = useState<(typeof SALES)[number] | undefined>();

  const filtered = useMemo(
    () =>
      SALES.filter(
        (s) =>
          !query ||
          s.id.toLowerCase().includes(query.toLowerCase()) ||
          s.customerName.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales"
        description="A record of completed transactions across all customers."
        action={{
          label: 'New sale',
          href: '/sales/create',
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search by sale ID or customer…"
          className="h-12 w-full rounded-pill border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-data">
          <EmptyState
            icon={<Receipt className="h-6 w-6" />}
            title="No sales found"
            description="Try a different search, or record a new sale."
            action={
              <Link
                href="/sales/create"
                className="inline-flex h-10 items-center gap-2 rounded-pill bg-graphite px-5 text-sm font-medium text-white hover:bg-graphite/90"
              >
                <Plus className="h-4 w-4" />
                New sale
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'id', label: 'Sale ID' },
              { key: 'date', label: 'Date' },
              { key: 'customer', label: 'Customer' },
              { key: 'items', label: 'Items', className: 'text-right' },
              { key: 'total', label: 'Grand total', className: 'text-right' },
              { key: 'actions', label: '', className: 'text-right' },
            ]}
          >
            {pageItems.map((s) => (
              <DataTableRow key={s.id}>
                <TableCell className="font-medium">{s.id}</TableCell>
                <TableCell className="text-steel">{s.date}</TableCell>
                <TableCell>{s.customerName}</TableCell>
                <TableCell className="text-right text-steel">
                  {s.items.length}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {currency(s.grandTotal)}
                </TableCell>
                <TableCell className="text-right">
                  <button
                    onClick={() => setViewSale(s)}
                    className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-mist px-3 text-xs font-medium text-steel transition-colors hover:bg-fog hover:text-graphite"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>
                </TableCell>
              </DataTableRow>
            ))}
          </DataTable>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}

      {/* Sale detail dialog */}
      <Dialog open={Boolean(viewSale)} onOpenChange={(o) => !o && setViewSale(undefined)}>
        <DialogContent className="max-w-lg border-mist p-0 sm:rounded-data">
          <DialogHeader className="border-b border-mist p-6">
            <DialogTitle className="flex items-center justify-between font-heading text-2xl font-normal tracking-tight text-graphite">
              {viewSale?.id}
              <span className="text-sm font-normal text-slate-token">
                {viewSale?.date}
              </span>
            </DialogTitle>
            <DialogDescription className="text-slate-token">
              {viewSale?.customerName}
            </DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-mist/60">
            {viewSale?.items.map((it, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div>
                  <p className="text-sm font-medium text-graphite">{it.name}</p>
                  <p className="text-xs text-slate-token">
                    {currency(it.price)} × {it.qty}
                  </p>
                </div>
                <p className="text-sm font-medium text-graphite">
                  {currency(it.price * it.qty)}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-mist p-6">
            <span className="font-heading text-lg font-normal text-graphite">
              Grand total
            </span>
            <span className="font-heading text-2xl font-normal text-graphite">
              {viewSale && currency(viewSale.grandTotal)}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
