import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  stock: number;
  price: number;
  expiryDate: Date;
  manufactureDate: Date;
  branch: string;
  status: 'Safe' | 'Near Expiry' | 'Critical';
  supplier: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    manufactureDate: { type: Date, required: true },
    branch: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Safe', 'Near Expiry', 'Critical'],
      default: 'Safe',
    },
    supplier: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of the model during Next.js hot reload
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
