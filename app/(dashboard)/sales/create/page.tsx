'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  ShoppingCart,
  User,
} from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Combobox } from '@/components/shared/combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CUSTOMERS, PRODUCTS } from '@/lib/mock-data';
import { currency } from '@/lib/format';
import { cn } from '@/lib/utils';

type Row = {
  id: string;
  productId: string;
  qty: number;
};

let rowId = 3;

export default function CreateSalePage() {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<string>();
  const [rows, setRows] = useState<Row[]>([
    { id: 'r-1', productId: '', qty: 1 },
  ]);

  const customerOptions = useMemo(
    () =>
      CUSTOMERS.map((c) => ({
        value: c.id,
        label: c.name,
        hint: c.email,
      })),
    []
  );

  const productOptions = useMemo(
    () =>
      PRODUCTS.map((p) => ({
        value: p.id,
        label: p.name,
        hint: `${currency(p.sellingPrice)} · ${p.stock} in stock`,
      })),
    []
  );

  const lineItems = rows
    .map((r) => {
      const product = PRODUCTS.find((p) => p.id === r.productId);
      if (!product) return null;
      return { row: r, product, lineTotal: product.sellingPrice * r.qty };
    })
    .filter(Boolean) as { row: Row; product: (typeof PRODUCTS)[number]; lineTotal: number }[];

  const subtotal = lineItems.reduce((s, x) => s + x.lineTotal, 0);
  const itemCount = lineItems.reduce((s, x) => s + x.row.qty, 0);
  const hasStockWarning = lineItems.some((x) => x.row.qty > x.product.stock);
  const hasEmptyRow = rows.some((r) => !r.productId || r.qty < 1);
  const canComplete = Boolean(customerId) && lineItems.length > 0 && !hasStockWarning && !hasEmptyRow;

  const addRow = () =>
    setRows((prev) => [...prev, { id: 'r-' + rowId++, productId: '', qty: 1 }]);

  const removeRow = (id: string) =>
    setRows((prev) => prev.filter((r) => r.id !== id));

  const updateRow = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const complete = () => {
    if (!canComplete) return;
    router.push('/sales');
  };

  return (
    <div className="space-y-8">
      <Link
        href="/sales"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-steel transition-colors hover:text-graphite"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sales
      </Link>
      <PageHeader
        title="Create sale"
        description="Select a customer and build the order line by line."
      />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Left — form */}
        <div className="space-y-6">
          {/* Customer */}
          <section className="card-data p-6">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-ember" />
              <h2 className="font-heading text-lg font-normal text-graphite">
                Customer
              </h2>
            </div>
            <Combobox
              options={customerOptions}
              value={customerId}
              onValueChange={setCustomerId}
              placeholder="Search and select a customer…"
              searchPlaceholder="Type a name or email…"
              emptyText="No customers found."
            />
          </section>

          {/* Line items */}
          <section className="card-data p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-ember" />
                <h2 className="font-heading text-lg font-normal text-graphite">
                  Line items
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={addRow}
                className="rounded-pill border-mist text-steel hover:bg-fog"
              >
                <Plus className="h-4 w-4" />
                Add row
              </Button>
            </div>

            <div className="space-y-3">
              {rows.map((row) => {
                const product = PRODUCTS.find((p) => p.id === row.productId);
                const lineTotal = product ? product.sellingPrice * row.qty : 0;
                const overStock = product && row.qty > product.stock;
                const out = product && product.stock <= 0;

                return (
                  <div
                    key={row.id}
                    className="rounded-xl border border-mist bg-fog/40 p-3"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="flex-1">
                        <Combobox
                          options={productOptions}
                          value={row.productId}
                          onValueChange={(v) => updateRow(row.id, { productId: v })}
                          placeholder="Select a product…"
                          searchPlaceholder="Search products…"
                          emptyText="No products found."
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative w-24">
                          <Input
                            type="number"
                            min={1}
                            value={row.qty}
                            onChange={(e) =>
                              updateRow(row.id, {
                                qty: Number(e.target.value) || 0,
                              })
                            }
                            className="h-11 rounded-xl border-mist bg-canvas pr-3 text-center"
                          />
                        </div>
                        <div className="hidden w-24 text-right sm:block">
                          <p className="text-xs text-slate-token">Line total</p>
                          <p className="font-medium text-graphite">
                            {currency(lineTotal)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeRow(row.id)}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-mist bg-canvas text-steel transition-colors hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove row"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stock validation UI */}
                    {product && (overStock || out) && (
                      <div
                        className={cn(
                          'mt-3 flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium',
                          out
                            ? 'bg-destructive/10 text-destructive'
                            : 'bg-warning/10 text-warning'
                        )}
                      >
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                        {out
                          ? `${product.name} is out of stock.`
                          : `Only ${product.stock} units of ${product.name} are available — requested ${row.qty}.`}
                      </div>
                    )}
                  </div>
                );
              })}

              {rows.length === 0 && (
                <div className="rounded-xl border border-dashed border-mist bg-fog/40 px-4 py-8 text-center text-sm text-slate-token">
                  No line items yet. Add a product to begin.
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right — sticky summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="card-data overflow-hidden">
            <div className="border-b border-mist p-6">
              <h2 className="font-heading text-xl font-normal text-graphite">
                Order summary
              </h2>
            </div>
            <div className="space-y-3 p-6">
              {lineItems.length === 0 ? (
                <p className="text-sm text-slate-token">
                  Add products to see the live total.
                </p>
              ) : (
                lineItems.map((x) => (
                  <div
                    key={x.row.id}
                    className="flex items-start justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-graphite">
                        {x.product.name}
                      </p>
                      <p className="text-xs text-slate-token">
                        {currency(x.product.sellingPrice)} × {x.row.qty}
                      </p>
                    </div>
                    <p className="font-medium text-graphite">
                      {currency(x.lineTotal)}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="space-y-3 border-t border-mist p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-token">Items</span>
                <span className="font-medium text-graphite">{itemCount}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-token">Subtotal</span>
                <span className="font-medium text-graphite">
                  {currency(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-mist pt-3">
                <span className="font-heading text-lg font-normal text-graphite">
                  Grand total
                </span>
                <span className="font-heading text-2xl font-normal text-graphite">
                  {currency(subtotal)}
                </span>
              </div>

              {/* Validation status */}
              {!customerId && (
                <p className="flex items-center gap-2 text-xs text-slate-token">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Select a customer to continue.
                </p>
              )}
              {hasStockWarning && (
                <p className="flex items-center gap-2 text-xs text-warning">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  One or more items exceed available stock.
                </p>
              )}
              {canComplete && (
                <p className="flex items-center gap-2 text-xs text-success">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Ready to complete.
                </p>
              )}

              <Button
                onClick={complete}
                disabled={!canComplete}
                className="h-12 w-full rounded-pill bg-graphite text-white hover:bg-graphite/90 disabled:opacity-40"
              >
                Complete sale
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
