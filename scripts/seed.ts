import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Next.js uses Next.js specific path resolution. For a raw script, we use dotenv.
// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Must import Product AFTER configuring dotenv if the model relies on env vars, 
// but it's safe to import here. We use the raw mongoose schema without Next.js caching.
const ProductSchema = new mongoose.Schema(
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
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const mockProducts = [
  // Vegetables
  {
    name: 'Organic Carrots',
    category: 'Vegetables',
    stock: 120,
    price: 2.99,
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    manufactureDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Safe',
    supplier: 'Green Valley Farms',
  },
  {
    name: 'Fresh Spinach',
    category: 'Vegetables',
    stock: 45,
    price: 3.49,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    manufactureDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    branch: 'Uptown Market',
    status: 'Near Expiry',
    supplier: 'Local Greens Co.',
  },
  // Milk
  {
    name: 'Whole Milk 1 Gallon',
    category: 'Milk',
    stock: 80,
    price: 4.29,
    expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Safe',
    supplier: 'Happy Cow Dairy',
  },
  {
    name: 'Almond Milk Unsweetened',
    category: 'Milk',
    stock: 60,
    price: 5.49,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    branch: 'Westside Superstore',
    status: 'Safe',
    supplier: 'Nutty Farms',
  },
  // Bread
  {
    name: 'Whole Wheat Loaf',
    category: 'Bread',
    stock: 25,
    price: 2.49,
    expiryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    manufactureDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    branch: 'Uptown Market',
    status: 'Critical',
    supplier: 'Sunrise Bakery',
  },
  {
    name: 'French Baguette',
    category: 'Bread',
    stock: 15,
    price: 3.00,
    expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Near Expiry',
    supplier: 'Artisan Breads',
  },
  // Snacks
  {
    name: 'Potato Chips - Sea Salt',
    category: 'Snacks',
    stock: 200,
    price: 1.99,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    branch: 'Westside Superstore',
    status: 'Safe',
    supplier: 'SnackCo',
  },
  {
    name: 'Mixed Nuts Roasted',
    category: 'Snacks',
    stock: 150,
    price: 6.99,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Safe',
    supplier: 'Nutty Farms',
  },
  // Beverages
  {
    name: 'Orange Juice 100%',
    category: 'Beverages',
    stock: 50,
    price: 4.99,
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    branch: 'Uptown Market',
    status: 'Safe',
    supplier: 'Citrus Fresh',
  },
  {
    name: 'Sparkling Water 12-Pack',
    category: 'Beverages',
    stock: 300,
    price: 5.99,
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    branch: 'Westside Superstore',
    status: 'Safe',
    supplier: 'Aqua Bubbles',
  },
  // Frozen Foods
  {
    name: 'Frozen Mixed Berries',
    category: 'Frozen Foods',
    stock: 85,
    price: 7.49,
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Safe',
    supplier: 'Frosty Farms',
  },
  {
    name: 'Frozen Pizza Margherita',
    category: 'Frozen Foods',
    stock: 40,
    price: 6.99,
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    branch: 'Uptown Market',
    status: 'Safe',
    supplier: 'Italia Frozen',
  },
  // Household Items
  {
    name: 'Paper Towels 6-Roll',
    category: 'Household Items',
    stock: 400,
    price: 12.99,
    expiryDate: new Date(Date.now() + 1000 * 24 * 60 * 60 * 1000), // No real expiry, arbitrarily far
    manufactureDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    branch: 'Westside Superstore',
    status: 'Safe',
    supplier: 'CleanCo',
  },
  {
    name: 'Dish Soap',
    category: 'Household Items',
    stock: 250,
    price: 3.49,
    expiryDate: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    branch: 'Downtown Fresh',
    status: 'Safe',
    supplier: 'CleanCo',
  },
  // Personal Care
  {
    name: 'Mint Toothpaste',
    category: 'Personal Care',
    stock: 180,
    price: 4.29,
    expiryDate: new Date(Date.now() + 500 * 24 * 60 * 60 * 1000),
    manufactureDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    branch: 'Uptown Market',
    status: 'Safe',
    supplier: 'SmileBright',
  },
];

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('ERROR: MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    console.log('Inserting seed products...');
    await Product.insertMany(mockProducts);
    console.log(`Successfully seeded ${mockProducts.length} products.`);

    console.log('Closing database connection...');
    await mongoose.connection.close();
    console.log('Connection closed. Seeding complete!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
