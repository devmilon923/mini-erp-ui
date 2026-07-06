"use client";

import Link from "next/link";
import {
  Package,
  Users,
  Receipt,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import {
  DataTable,
  DataTableRow,
  DataTableCell as TableCell,
} from "@/components/shared/data-table";
import { PRODUCTS, CUSTOMERS, SALES, SALES_TREND } from "@/lib/mock-data";
import { stockLevel } from "@/lib/types";
import { currency, stockBadgeClass, stockLabel } from "@/lib/format";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const lowStock = PRODUCTS.filter((p) => stockLevel(p.stock) !== "in");
  const totalSales = SALES.reduce((s, x) => s + x.grandTotal, 0);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, Alex. You're viewing the console.`}
        action={{
          label: "New sale",
          href: "/sales/create",
          icon: <Receipt className="h-4 w-4" />,
        }}
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total products"
          value={String(PRODUCTS.length)}
          icon={<Package className="h-5 w-5" />}
          trend={{ value: "+3", direction: "up" }}
        />
        <StatCard
          label="Total customers"
          value={String(CUSTOMERS.length)}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: "+1", direction: "up" }}
        />
        <StatCard
          label="Total sales"
          value={currency(totalSales)}
          icon={<Receipt className="h-5 w-5" />}
          trend={{ value: "+12%", direction: "up" }}
          accent
        />
        <StatCard
          label="Low stock count"
          value={String(lowStock.length)}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: "2 critical", direction: "down" }}
        />
      </div>

      {/* Chart + low stock */}
      <div className="grid gap-6 lg:grid-cols-1">
        {/* Low stock list */}
        <div className="card-data flex flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-mist p-6 pb-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-token">
                Attention
              </p>
              <h2 className="font-heading text-xl font-normal text-graphite">
                Low stock items
              </h2>
            </div>
            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-xs font-medium text-ember"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex-1 divide-y divide-mist/60">
            {lowStock.map((p) => {
              const level = stockLevel(p.stock);
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 px-6 py-3.5 transition-colors hover:bg-fog/60"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-graphite">
                      {p.name}
                    </p>
                    <p className="text-xs text-slate-token">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={
                        "text-sm font-semibold " +
                        (level === "out" ? "text-destructive" : "text-warning")
                      }
                    >
                      {p.stock} left
                    </p>
                    <span
                      className={
                        "inline-flex items-center rounded-pill border px-2 py-0.5 text-[11px] font-medium " +
                        stockBadgeClass(level)
                      }
                    >
                      {stockLabel(level)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
