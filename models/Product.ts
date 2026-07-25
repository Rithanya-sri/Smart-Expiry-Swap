import mongoose, { Schema, Document, Model } from 'mongoose';

export type RecoveryStage =
  | 'Normal Sale'
  | 'Discount'
  | 'Bundle Offer'
  | 'Transfer To Branch'
  | 'Notify Customers'
  | 'NGO Donation'
  | 'Recycle / Compost';

export interface IProduct extends Document {
  name: string;
  sku: string;
  category: string;
  stock: number;
  unit: string;
  price: number;
  expiryDate: Date;
  manufactureDate: Date;
  branch: string;
  location: string;
  status: 'Safe' | 'Near Expiry' | 'Critical';
  supplier: string;
  recoveryStage: RecoveryStage;
  isDispatched: boolean;
  dispatchedToNGO?: string;
  discount?: number;
  recoveryScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: 'Units' },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    manufactureDate: { type: Date, required: true },
    branch: { type: String, required: true },
    location: { type: String, required: true, default: 'Main Warehouse' },
    status: {
      type: String,
      required: true,
      enum: ['Safe', 'Near Expiry', 'Critical'],
      default: 'Safe',
    },
    supplier: { type: String, required: true },
    recoveryStage: {
      type: String,
      required: true,
      enum: ['Normal Sale', 'Discount', 'Bundle Offer', 'Transfer To Branch', 'Notify Customers', 'NGO Donation', 'Recycle / Compost'],
      default: 'Normal Sale',
    },
    isDispatched: { type: Boolean, default: false },
    dispatchedToNGO: { type: String },
    discount: { type: Number, min: 0, max: 100 },
    recoveryScore: { type: Number, min: 0, max: 100 },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of the model during Next.js hot reload
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
