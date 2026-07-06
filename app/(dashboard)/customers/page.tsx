'use client';

import { useMemo, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Users, Mail, Phone } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import {
  DataTable,
  DataTableRow,
  DataTableCell as TableCell,
} from '@/components/shared/data-table';
import { Pagination } from '@/components/shared/pagination';
import { EmptyState } from '@/components/shared/empty-state';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { CUSTOMERS } from '@/lib/mock-data';
import type { Customer } from '@/lib/types';
import { currency } from '@/lib/format';

const PAGE_SIZE = 5;

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(CUSTOMERS);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Customer | undefined>();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filtered = useMemo(
    () =>
      customers.filter(
        (c) =>
          !query ||
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.email.toLowerCase().includes(query.toLowerCase())
      ),
    [customers, query]
  );

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openAdd = () => {
    setEditing(undefined);
    setName('');
    setEmail('');
    setPhone('');
    setModalOpen(true);
  };
  const openEdit = (c: Customer) => {
    setEditing(c);
    setName(c.name);
    setEmail(c.email);
    setPhone(c.phone);
    setModalOpen(true);
  };

  const save = () => {
    if (!name.trim() || !email.trim()) return;
    if (editing) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === editing.id ? { ...c, name, email, phone } : c))
      );
    } else {
      setCustomers((prev) => [
        {
          id: 'c-' + Math.random().toString(36).slice(2, 7),
          name,
          email,
          phone,
          totalPurchases: 0,
        },
        ...prev,
      ]);
    }
    setModalOpen(false);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setCustomers((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setDeleteTarget(undefined);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customers"
        description="Manage customer records and purchase history."
        action={{
          label: 'Add customer',
          onClick: openAdd,
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
          placeholder="Search by name or email…"
          className="h-12 w-full rounded-pill border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card-data">
          <EmptyState
            icon={<Users className="h-6 w-6" />}
            title="No customers found"
            description="Adjust your search or add a new customer record."
            action={
              <Button
                onClick={openAdd}
                className="rounded-pill bg-graphite text-white hover:bg-graphite/90"
              >
                <Plus className="h-4 w-4" />
                Add customer
              </Button>
            }
          />
        </div>
      ) : (
        <>
          <DataTable
            columns={[
              { key: 'name', label: 'Customer' },
              { key: 'contact', label: 'Contact' },
              { key: 'phone', label: 'Phone' },
              { key: 'purchases', label: 'Total purchases', className: 'text-right' },
              { key: 'actions', label: '', className: 'text-right' },
            ]}
          >
            {pageItems.map((c) => (
              <DataTableRow key={c.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-fog text-xs font-medium text-graphite">
                        {c.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-graphite">{c.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-steel">{c.email}</TableCell>
                <TableCell className="text-steel">{c.phone}</TableCell>
                <TableCell className="text-right font-medium text-graphite">
                  {currency(c.totalPurchases)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => openEdit(c)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-steel transition-colors hover:bg-fog hover:text-graphite"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(c)}
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
            className="mt-6"
          />
        </>
      )}

      {/* Add/Edit modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md border-mist p-0 sm:rounded-data">
          <DialogHeader className="border-b border-mist p-6">
            <DialogTitle className="font-heading text-2xl font-normal tracking-tight text-graphite">
              {editing ? 'Edit customer' : 'Add customer'}
            </DialogTitle>
            <DialogDescription className="text-slate-token">
              {editing
                ? 'Update the contact details below.'
                : 'Create a new customer record.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 p-6">
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
                Name <span className="text-ember">*</span>
              </Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="h-11 rounded-xl border-mist bg-canvas"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
                Email <span className="text-ember">*</span>
              </Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-11 rounded-xl border-mist bg-canvas pl-11"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
                Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="h-11 rounded-xl border-mist bg-canvas pl-11"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 border-t border-mist p-6">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              className="rounded-pill text-steel hover:bg-fog"
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              className="rounded-pill bg-graphite px-6 text-white hover:bg-graphite/90"
            >
              {editing ? 'Save changes' : 'Add customer'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(undefined)}
      >
        <AlertDialogContent className="rounded-data border-mist">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading text-xl font-normal text-graphite">
              Delete customer?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-token">
              {deleteTarget?.name} will be removed. This action cannot be undone.
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
