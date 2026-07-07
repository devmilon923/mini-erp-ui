"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ProductFormModal } from "@/components/products/product-form-modal";
import { useState } from "react";

export default function AddProductPage() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  return (
    <div className="space-y-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-steel transition-colors hover:text-graphite"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
      <PageHeader
        title="Add product"
        description="Create a new catalog entry with pricing and stock details."
      />
      <div className="card-data p-8">
        <p className="text-sm text-slate-token">
          Use the form below to add a product. Changes are saved to local state
          for this demo.
        </p>
      </div>
      <ProductFormModal
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) router.push("/products");
        }}
        onSubmit={() => router.push("/products")}
      />
    </div>
  );
}
