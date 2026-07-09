"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Pencil, Trash2, Tag, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import {
  DataTable,
  DataTableRow,
  DataTableCell as TableCell,
} from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { CategoryFormModal } from "@/components/categories/category-form-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Category } from "@/lib/types";

const PAGE_SIZE = 6;

const INITIAL_CATEGORIES: Category[] = [
  { id: "c-001", name: "Electronics", status: "active" },
  { id: "c-002", name: "Apparel", status: "active" },
  { id: "c-003", name: "Home Goods", status: "draft" },
  { id: "c-004", name: "Office", status: "disabled" },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Category | undefined>();

  const filtered = useMemo(() => {
    return categories.filter((category) => {
      const matchesQuery =
        !query ||
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.status.toLowerCase().includes(query.toLowerCase());
      return matchesQuery;
    });
  }, [categories, query]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditing(undefined);
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    setModalOpen(true);
  };

  const handleSubmit = (data: Omit<Category, "id">) => {
    console.log("Category submitted:", data);
    if (editing) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editing.id ? { ...category, ...data } : category,
        ),
      );
    } else {
      setCategories((prev) => [
        {
          id: "c-" + Math.random().toString(36).slice(2, 7),
          ...data,
        },
        ...prev,
      ]);
    }
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setCategories((prev) =>
        prev.filter((category) => category.id !== deleteTarget.id),
      );
      setDeleteTarget(undefined);
    }
  };

  const triggerLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Categories"
        description="Manage your inventory categories and their current status."
        action={{
          label: "Add category",
          onClick: openAdd,
          icon: <Plus className="h-4 w-4" />,
        }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or status…"
            className="h-12 w-full rounded-pill border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
          />
        </div>
        <Button
          variant="outline"
          onClick={triggerLoad}
          className="hidden h-12 rounded-pill border-mist text-steel hover:bg-fog sm:flex"
        >
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="card-data overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-mist/60 p-5 last:border-0"
            >
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
            icon={<Tag className="h-6 w-6" />}
            title="No categories found"
            description="Try a different search term or create a new category."
            action={
              <Button
                onClick={openAdd}
                className="rounded-pill bg-graphite text-white hover:bg-graphite/90"
              >
                <Plus className="h-4 w-4" />
                Add category
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: "name", label: "Category" },
              { key: "status", label: "Status" },
              { key: "actions", label: "", className: "text-right" },
            ]}
          >
            {pageItems.map((category) => (
              <DataTableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-fog text-graphite">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-medium text-graphite">
                      {category.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium ${
                      category.status === "active"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : category.status === "disabled"
                          ? "border-rose-200 bg-rose-50 text-rose-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                    }`}
                  >
                    {category.status === "draft"
                      ? "Draft"
                      : category.status === "active"
                        ? "Active"
                        : "Disabled"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(category)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-steel transition-colors hover:bg-fog hover:text-graphite"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(category)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-steel transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </DataTableRow>
            ))}
          </DataTable>
          <Pagination
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
          />
        </>
      )}

      <CategoryFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        initial={editing}
        onSubmit={handleSubmit}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The category will be removed from
              the list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
