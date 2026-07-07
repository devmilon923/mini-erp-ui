"use client";

import { useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/mock-data";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Product;
  onSubmit: (data: Omit<Product, "id" | "image"> & { image?: string }) => void;
};

type Errors = Partial<
  Record<
    | "name"
    | "sku"
    | "category"
    | "purchasePrice"
    | "sellingPrice"
    | "stock"
    | "image",
    string
  >
>;

export function ProductFormModal({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [purchasePrice, setPurchasePrice] = useState(
    initial ? String(initial.purchasePrice) : "",
  );
  const [sellingPrice, setSellingPrice] = useState(
    initial ? String(initial.sellingPrice) : "",
  );
  const [stock, setStock] = useState(initial ? String(initial.stock) : "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const isEdit = Boolean(initial);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!name.trim()) e.name = "Product name is required";
    if (!sku.trim()) e.sku = "SKU is required";
    if (!category) e.category = "Select a category";
    if (!purchasePrice || isNaN(Number(purchasePrice)))
      e.purchasePrice = "Enter a valid price";
    if (!sellingPrice || isNaN(Number(sellingPrice)))
      e.sellingPrice = "Enter a valid price";
    if (!stock || isNaN(Number(stock))) e.stock = "Enter a valid quantity";
    if (!image) e.image = "Product image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    console.log({
      name,
      sku,
      category,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      image,
    });
    onSubmit({
      name,
      sku,
      category,
      purchasePrice: Number(purchasePrice),
      sellingPrice: Number(sellingPrice),
      stock: Number(stock),
      image,
    });
    onOpenChange(false);
  };

  // Drag-and-drop is UI-only; we simulate a "dropped" image with a placeholder.
  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    setDragOver(false);
    setImage(
      "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800",
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 border-mist p-0 sm:rounded-data">
        <DialogHeader className="space-y-1 border-b border-mist p-6">
          <DialogTitle className="font-heading text-2xl font-normal tracking-tight text-graphite">
            {isEdit ? "Edit product" : "Add product"}
          </DialogTitle>
          <DialogDescription className="text-slate-token">
            {isEdit
              ? "Update the product details below."
              : "Fill in the details to add a new product to the catalog."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {/* Image drop zone */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Product image <span className="text-ember">*</span>
            </Label>
            {image ? (
              <div className="relative overflow-hidden rounded-xl border border-mist">
                <img
                  src={image}
                  alt="Preview"
                  className="h-44 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-graphite/70 text-white backdrop-blur-sm transition-colors hover:bg-graphite"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={handleDrop as unknown as () => void}
                className={cn(
                  "flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
                  dragOver
                    ? "border-ember bg-ember/5"
                    : "border-mist bg-fog hover:border-graphite/30",
                  errors.image && "border-destructive/50 bg-destructive/5",
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-slate-token">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium text-graphite">
                  Drag &amp; drop or click to upload
                </p>
                <p className="text-xs text-slate-token">PNG, JPG up to 5MB</p>
              </div>
            )}
            {errors.image && (
              <p className="text-xs text-destructive">{errors.image}</p>
            )}
          </div>

          {/* Name + SKU */}
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Product name"
              required
              error={errors.name}
              value={name}
              onChange={setName}
              placeholder="e.g. Aurora Wireless Earbuds"
            />
            <FormField
              label="SKU"
              required
              error={errors.sku}
              value={sku}
              onChange={setSku}
              placeholder="AUR-EAR-001"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
              Category <span className="text-ember">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className={cn(
                  "h-11 rounded-xl border-mist bg-canvas",
                  errors.category && "border-destructive/50",
                )}
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-destructive">{errors.category}</p>
            )}
          </div>

          {/* Prices + stock */}
          <div className="grid gap-4 sm:grid-cols-3">
            <PriceField
              label="Purchase price"
              prefix="$"
              error={errors.purchasePrice}
              value={purchasePrice}
              onChange={setPurchasePrice}
              placeholder="0.00"
            />
            <PriceField
              label="Selling price"
              prefix="$"
              error={errors.sellingPrice}
              value={sellingPrice}
              onChange={setSellingPrice}
              placeholder="0.00"
            />
            <FormField
              label="Stock quantity"
              required
              error={errors.stock}
              value={stock}
              onChange={setStock}
              placeholder="0"
              type="number"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 border-t border-mist p-6">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-pill text-steel hover:bg-fog"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="rounded-pill bg-graphite px-6 text-white hover:bg-graphite/90"
          >
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function FormField({
  label,
  required,
  error,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
        {label} {required && <span className="text-ember">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-11 rounded-xl border-mist bg-canvas",
          error && "border-destructive/50 focus-visible:ring-destructive/20",
        )}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

function PriceField({
  label,
  prefix,
  error,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  prefix: string;
  error?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium uppercase tracking-wider text-slate-token">
        {label} <span className="text-ember">*</span>
      </Label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-token">
          {prefix}
        </span>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-11 rounded-xl border-mist bg-canvas pl-8",
            error && "border-destructive/50 focus-visible:ring-destructive/20",
          )}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
