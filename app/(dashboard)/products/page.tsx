'use client';

import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Package, AlertCircle } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import {
  DataTable,
  DataTableRow,
  DataTableCell as TableCell,
} from '@/components/shared/data-table';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { ProductFormModal } from '@/components/products/product-form-modal';
import { PRODUCTS, CATEGORIES } from '@/lib/mock-data';
import { stockLevel, type Product } from '@/lib/types';
import { currency, stockBadgeClass, stockLabel } from '@/lib/format';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const PAGE_SIZE = 6;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Product | undefined>();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const q =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const c = category === 'all' || p.category === category;
      return q && c;
    });
  }, [products, query, category]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleSubmit = (data: Omit<Product, 'id' | 'image'> & { image?: string }) => {
    if (editing) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editing.id ? { ...p, ...data, image: data.image ?? p.image } : p
        )
      );
    } else {
      setProducts((prev) => [
        {
          id: 'p-' + Math.random().toString(36).slice(2, 7),
          ...data,
          image:
            data.image ??
            'https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800',
        },
        ...prev,
      ]);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(undefined);
    }
  };

  // Simulate a loading state toggle for the skeleton demo
  const triggerLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Products"
        description="Manage your catalog, pricing, and stock levels."
        action={{
          label: 'Add product',
          onClick: openAdd,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or SKU…"
            className="h-12 w-full rounded-pill border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
          />
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={category}
            onValueChange={(v) => {
              setCategory(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-12 w-44 rounded-pill border-mist bg-canvas">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={triggerLoad}
            className="hidden h-12 rounded-pill border-mist text-steel hover:bg-fog sm:flex"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="card-data overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-mist/60 p-5 last:border-0">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-pill" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card-data">
          <EmptyState
            icon={<Package className="h-6 w-6" />}
            title="No products found"
            description="Try adjusting your search or category filter, or add a new product to the catalog."
            action={
              <Button
                onClick={openAdd}
                className="rounded-pill bg-graphite text-white hover:bg-graphite/90"
              >
                <Plus className="h-4 w-4" />
                Add product
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'product', label: 'Product' },
              { key: 'sku', label: 'SKU' },
              { key: 'category', label: 'Category' },
              { key: 'purchase', label: 'Purchase', className: 'text-right' },
              { key: 'selling', label: 'Selling', className: 'text-right' },
              { key: 'stock', label: 'Stock', className: 'text-right' },
              { key: 'actions', label: '', className: 'text-right' },
            ]}
          >
            {pageItems.map((p) => {
              const level = stockLevel(p.stock);
              return (
                <DataTableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-10 w-10 rounded-lg object-cover"
                      />
                      <span className="font-medium text-graphite">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-steel">{p.sku}</TableCell>
                  <TableCell className="text-steel">{p.category}</TableCell>
                  <TableCell className="text-right text-steel">
                    {currency(p.purchasePrice)}
                  </TableCell>
                  <TableCell className="text-right font-medium text-graphite">
                    {currency(p.sellingPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        'inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium ' +
                        stockBadgeClass(level)
                      }
                    >
                      {p.stock} · {stockLabel(level)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-steel transition-colors hover:bg-fog hover:text-graphite"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-steel transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </DataTableRow>
              );
            })}
          </DataTable>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            className="mt-6"
          />
        </>
      )}

      <ProductFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(undefined)}
      >
        <AlertDialogContent className="rounded-data border-mist">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 font-heading text-xl font-normal text-graphite">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete product?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-token">
              {deleteTarget?.name} will be removed from the catalog. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-pill border-mist text-steel hover:bg-fog">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="rounded-pill bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
