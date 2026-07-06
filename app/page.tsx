"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";
import {
  Search,
  ShoppingBag,
  ArrowRight,
  Boxes,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { PRODUCTS, CATEGORIES } from "@/lib/mock-data";
import { stockLevel, type Product } from "@/lib/types";
import { currency, stockBadgeClass, stockLabel } from "@/lib/format";
import { Pagination } from "@/components/shared/pagination";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_SIZE = 8;

export default function StorefrontPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Simulate image loading skeletons
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase());
      const matchesCat = category === "all" || p.category === category;
      return matchesQuery && matchesCat;
    });
  }, [query, category]);

  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-canvas">
      {/* ---------- Navbar ---------- */}
      <header className="sticky top-0 z-40 border-b border-mist bg-canvas/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite">
              <Boxes className="h-4 w-4 text-white" />
            </div>
            <span className="font-heading text-xl font-normal tracking-tight text-graphite">
              MiniERP
            </span>
          </Link>
          <nav className="hidden items-center gap-1 rounded-pill bg-ash px-1.5 py-1.5 sm:flex">
            <Link
              href="/"
              className="rounded-pill bg-canvas px-4 py-1.5 text-sm font-medium text-graphite shadow-sm"
            >
              Home
            </Link>
            <a
              href="#catalog"
              className="rounded-pill px-4 py-1.5 text-sm text-steel transition-colors hover:text-graphite"
            >
              Products
            </a>
            <a
              href="#about"
              className="rounded-pill px-4 py-1.5 text-sm text-steel transition-colors hover:text-graphite"
            >
              About
            </a>
          </nav>
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-pill bg-graphite px-5 text-sm font-medium text-white transition-colors hover:bg-graphite/90"
          >
            Login
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="border-b border-mist">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-pill border border-mist bg-fog px-3 py-1 text-xs font-medium uppercase tracking-wider text-steel">
              <Zap className="h-3.5 w-3.5 text-ember" />
              Inventory &amp; Sales Console
            </span>
            <h1 className="display-headline max-w-xl">
              Precision commerce,
              <br />
              <span className="text-ember">measured</span> in detail.
            </h1>
            <p className="max-w-md text-base leading-relaxed text-steel">
              A catalog built for operators who count every unit, every margin,
              and every minute. Browse the storefront, then step into the
              console to run the numbers.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#catalog"
                className="inline-flex h-12 items-center gap-2 rounded-pill bg-graphite px-7 text-sm font-medium text-white transition-all hover:bg-graphite/90 hover:gap-3"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse products
              </a>
              <Link
                href="/dashboard"
                className="link-ember text-sm font-medium text-graphite"
              >
                Open the console →
              </Link>
            </div>
            <div className="flex items-center gap-6 pt-4 text-xs text-slate-token">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                12 live SKUs
              </span>
              <span className="inline-flex items-center gap-2">
                <Boxes className="h-4 w-4 text-brass" />6 categories
              </span>
            </div>
          </div>

          {/* Asymmetric feature card — signature MiniERP shape */}
          <div className="relative hidden lg:block">
            <div className="card-asymmetric absolute -right-4 top-8 h-72 w-72 bg-ivory" />
            <div className="card-asymmetric relative overflow-hidden border border-mist bg-canvas">
              <img
                src={PRODUCTS[0].image}
                alt={PRODUCTS[0].name}
                className="h-80 w-full object-cover"
              />
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-token">
                    Featured
                  </p>
                  <p className="font-heading text-lg text-graphite">
                    {PRODUCTS[0].name}
                  </p>
                </div>
                <p className="font-heading text-2xl text-graphite">
                  {currency(PRODUCTS[0].sellingPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Catalog ---------- */}
      <section id="catalog" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-ember">
            Catalog
          </p>
          <h2 className="font-heading text-3xl font-normal tracking-tight text-graphite sm:text-4xl">
            All products
          </h2>
        </div>

        {/* Search + category filter */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-token" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search products or SKU…"
              className="h-12 w-full rounded-pill border border-mist bg-canvas pl-11 pr-4 text-sm text-graphite placeholder:text-slate-token focus:border-graphite/30 focus:outline-none focus:ring-2 focus:ring-graphite/10"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <FilterChip
              active={category === "all"}
              onClick={() => {
                setCategory("all");
                setPage(1);
              }}
            >
              All
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c}
                active={category === c}
                onClick={() => {
                  setCategory(c);
                  setPage(1);
                }}
              >
                {c}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="card-data flex flex-col items-center justify-center gap-3 py-20 text-center">
            <Search className="h-10 w-10 text-slate-token" />
            <p className="font-heading text-lg text-graphite">
              No products found
            </p>
            <p className="text-sm text-slate-token">
              Try a different search term or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((p) => (
              <ProductCard key={p.id} product={p} loading={loading} />
            ))}
          </div>
        )}

        <Pagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
          className="mt-8"
        />
      </section>

      {/* ---------- Footer ---------- */}
      <footer id="about" className="border-t border-mist bg-fog">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite">
                  <Boxes className="h-4 w-4 text-white" />
                </div>
                <span className="font-heading text-lg text-graphite">
                  MiniERP
                </span>
              </div>
              <p className="max-w-xs text-sm text-steel">
                A precision inventory and sales console for modern commerce.
              </p>
            </div>
            <FooterCol
              title="Store"
              links={["Home", "Products", "Categories", "New arrivals"]}
            />
            <FooterCol
              title="Console"
              links={["Dashboard", "Inventory", "Sales", "Customers"]}
            />
            <FooterCol
              title="Company"
              links={["About", "Contact", "Careers", "Press"]}
            />
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-mist pt-6 sm:flex-row">
            <p className="text-xs text-slate-token">
              © 2026 MiniERP. All rights reserved.
            </p>
            <p className="text-xs text-slate-token">UI demo — mock data only</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "shrink-0 rounded-pill px-4 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-graphite text-white"
          : "bg-ash text-steel hover:text-graphite")
      }
    >
      {children}
    </button>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-wider text-graphite">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a
              href="#"
              className="text-sm text-steel transition-colors hover:text-graphite"
            >
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductCard({
  product,
  loading,
}: {
  product: Product;
  loading: boolean;
}) {
  const level = stockLevel(product.stock);
  return (
    <article className="card-data group overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-fog">
        {loading ? (
          <Skeleton className="h-full w-full" />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <span
          className={
            "absolute left-3 top-3 inline-flex items-center rounded-pill border px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm " +
            stockBadgeClass(level)
          }
        >
          {stockLabel(level)}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <h3 className="font-heading text-base font-normal text-graphite">
              {product.name}
            </h3>
            <p className="text-xs text-slate-token">{product.category}</p>
          </div>
          <p className="font-heading text-xl text-graphite">
            {currency(product.sellingPrice)}
          </p>
        </div>
        <p className="text-xs text-slate-token">SKU {product.sku}</p>
      </div>
    </article>
  );
}
