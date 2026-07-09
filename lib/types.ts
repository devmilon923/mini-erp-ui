export type Role = "admin" | "manager" | "employee";

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  image: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  avatar?: string;
};

export type Category = {
  id: string;
  name: string;
  status: "draft" | "active" | "disabled";
};

export type SaleItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
};

export type Sale = {
  id: string;
  date: string;
  customerName: string;
  items: SaleItem[];
  grandTotal: number;
};

export type StockLevel = "in" | "low" | "out";

export const stockLevel = (qty: number): StockLevel =>
  qty <= 0 ? "out" : qty < 5 ? "low" : "in";
