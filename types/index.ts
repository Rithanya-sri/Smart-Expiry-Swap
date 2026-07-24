export type RiskLevel = "critical" | "warning" | "safe" | "expired";

export type ProductCategory =
  | "Dairy & Eggs"
  | "Fresh Produce"
  | "Bakery & Deli"
  | "Pharmaceuticals"
  | "Pantry & Canned"
  | "Meat & Seafood";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  location: string;
  supplier: string;
  status: RiskLevel;
  rescuedByNGO?: string;
  isDispatched?: boolean;
}

export interface NGO {
  id: string;
  name: string;
  category: "Food Bank" | "Community Kitchen" | "Shelter" | "Medical Aid" | "Animal Rescue";
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  verified: boolean;
  activeDispatches: number;
  totalRescuedKg: number;
  capacityLevel: "High" | "Medium" | "Full";
  hasColdStorage: boolean;
  rating: number;
  avatarUrl: string;
}

export interface Customer {
  id: string;
  name: string;
  type: "Supermarket Chain" | "Wholesale Distributor" | "Local Organic Market" | "Pharmacy Chain";
  contactName: string;
  email: string;
  phone: string;
  totalItemsDonated: number;
  totalValueSaved: number;
  impactScore: number;
  tier: "Platinum" | "Gold" | "Silver";
  joinDate: string;
  status: "Active" | "Pending" | "Inactive";
}

export interface ExpiryTrendData {
  month: string;
  rescued: number;
  waste: number;
  valueSaved: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: "swap" | "dispatch" | "alert" | "customer";
  description: string;
  actor: string;
}
