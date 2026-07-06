'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ProductFormModal } from '@/components/products/product-form-modal';
import { PRODUCTS } from '@/lib/mock-data';
import { useState } from 'react';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const product = PRODUCTS.find((p) => p.id === params.id);

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
        title="Edit product"
        description={
          product
            ? `Updating ${product.name} (${product.sku}).`
            : 'Product not found.'
        }
      />
      <div className="card-data p-8">
        <p className="text-sm text-slate-token">
          {product
            ? 'Edit the details in the form and save your changes.'
            : 'This product does not exist in the demo catalog.'}
        </p>
      </div>
      <ProductFormModal
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) router.push('/products');
        }}
        initial={product}
        onSubmit={() => router.push('/products')}
      />
    </div>
  );
}
