import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(expiryDate);
  target.setHours(0, 0, 0, 0);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getExpiryStatus(expiryDate: string): {
  label: string;
  variant: "critical" | "warning" | "safe" | "expired";
  days: number;
} {
  const days = getDaysUntilExpiry(expiryDate);
  if (days < 0) {
    return { label: `Expired (${Math.abs(days)}d ago)`, variant: "expired", days };
  } else if (days <= 3) {
    return { label: `${days} ${days === 1 ? "day" : "days"} left`, variant: "critical", days };
  } else if (days <= 7) {
    return { label: `${days} days left`, variant: "warning", days };
  } else {
    return { label: `${days} days left`, variant: "safe", days };
  }
}
