/**
 * lib/recovery-engine.ts
 *
 * Rule-based Product Recovery Engine.
 * This module is designed so the `getProductRecommendation` function
 * can be swapped out with a Gemini API call at any time without
 * changing the UI or the AIRecommendation type contract.
 */

export interface RecoveryProductInput {
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: string; // ISO or YYYY-MM-DD string
  status: string;
}

export interface AIRecommendation {
  recoveryScore: number;
  recommendedAction:
    | "Continue Normal Sale"
    | "Apply Discount"
    | "Bundle With Another Product"
    | "Transfer To Another Branch"
    | "Notify Nearby Customers"
    | "Donate To NGO"
    | "Recycle / Compost";
  reason: string;
  estimatedRevenueRecovered: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
}

/** The full pipeline, in order. The recommended action will be highlighted. */
export const RECOVERY_PIPELINE = [
  "Continue Normal Sale",
  "Apply Discount",
  "Bundle With Another Product",
  "Transfer To Another Branch",
  "Notify Nearby Customers",
  "Donate To NGO",
  "Recycle / Compost",
] as const;

function daysUntilExpiry(expiryDateStr: string): number {
  const expiry = new Date(expiryDateStr);
  const now = new Date();
  // Normalize to start of day
  expiry.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  return Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatRevenue(amount: number, totalValue: number, pct: number): string {
  const recovered = Math.round(amount);
  const total = Math.round(totalValue);
  return `₹${recovered.toLocaleString("en-IN")} (${pct}% of ₹${total.toLocaleString("en-IN")})`;
}

/**
 * Rule-based recommendation engine.
 * Replace this function body with a Gemini API call to upgrade to AI.
 */
export function getProductRecommendation(
  product: RecoveryProductInput
): AIRecommendation {
  const days = daysUntilExpiry(product.expiryDate);
  const totalValue = product.stock * product.price;

  // ── Expired ──────────────────────────────────────────────────────────────
  if (days < 0) {
    return {
      recoveryScore: 20,
      recommendedAction: "Recycle / Compost",
      reason:
        "Product has passed its expiry date. It cannot be sold or donated. Safe disposal via recycling or composting is the only viable option.",
      estimatedRevenueRecovered: formatRevenue(0, totalValue, 0),
      priority: "Urgent",
    };
  }

  // ── 0–2 days ─────────────────────────────────────────────────────────────
  if (days <= 2) {
    const recovered = totalValue * 0.6;
    return {
      recoveryScore: 90,
      recommendedAction: "Apply Discount",
      reason: `Only ${days} day${days === 1 ? "" : "s"} until expiry. Apply an immediate 40–50% discount to drive rapid sell-through and recover maximum revenue before the deadline.`,
      estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 60),
      priority: "Urgent",
    };
  }

  // ── 3–5 days ─────────────────────────────────────────────────────────────
  if (days <= 5) {
    const recovered = totalValue * 0.75;
    return {
      recoveryScore: 80,
      recommendedAction: "Bundle With Another Product",
      reason: `${days} days remaining. Bundling with a complementary product (e.g., bread + spread) increases perceived value and accelerates sales without a steep discount.`,
      estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 75),
      priority: "High",
    };
  }

  // ── 6–7 days (warning zone) ───────────────────────────────────────────────
  if (days <= 7) {
    const recovered = totalValue * 0.8;
    return {
      recoveryScore: 75,
      recommendedAction: "Notify Nearby Customers",
      reason: `${days} days remaining. Push targeted notifications to customers who previously purchased this category. Flash deals can move stock quickly with minimal margin loss.`,
      estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 80),
      priority: "High",
    };
  }

  // ── High stock + safe expiry → transfer ──────────────────────────────────
  if (product.stock > 100 && days > 30) {
    const recovered = totalValue * 0.9;
    return {
      recoveryScore: 75,
      recommendedAction: "Transfer To Another Branch",
      reason: `High stock of ${product.stock} units with ${days} days until expiry. Redistribution to a higher-demand branch can sell through inventory at full price before it enters the warning zone.`,
      estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 90),
      priority: "Medium",
    };
  }

  // ── 8–30 days ────────────────────────────────────────────────────────────
  if (days <= 30) {
    const recovered = totalValue * 0.85;
    return {
      recoveryScore: 85,
      recommendedAction: "Apply Discount",
      reason: `${days} days remaining with current stock. A moderate 15–20% discount will accelerate sell-through while preserving significant revenue before stock enters the critical window.`,
      estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 85),
      priority: "Medium",
    };
  }

  // ── Safe — > 30 days ─────────────────────────────────────────────────────
  const recovered = totalValue * 0.98;
  return {
    recoveryScore: 100,
    recommendedAction: "Continue Normal Sale",
    reason: `Product has ${days} days until expiry with healthy stock levels. No intervention required. Continue regular sales at standard pricing.`,
    estimatedRevenueRecovered: formatRevenue(recovered, totalValue, 98),
    priority: "Low",
  };
}
