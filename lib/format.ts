import type { StockLevel } from './types';

export const currency = (n: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);

export const stockBadgeClass = (level: StockLevel): string => {
  switch (level) {
    case 'in':
      return 'bg-success/10 text-success border-success/20';
    case 'low':
      return 'bg-warning/10 text-warning border-warning/30';
    case 'out':
      return 'bg-destructive/10 text-destructive border-destructive/20';
  }
};

export const stockLabel = (level: StockLevel): string =>
  level === 'in' ? 'In stock' : level === 'low' ? 'Low stock' : 'Out of stock';
