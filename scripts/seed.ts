import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sku: { type: String, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, default: 'Units' },
    price: { type: Number, required: true, min: 0 },
    expiryDate: { type: Date, required: true },
    manufactureDate: { type: Date, required: true },
    branch: { type: String, required: true },
    location: { type: String, required: true },
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
    discount: { type: Number },
    recoveryScore: { type: Number },
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const d = (days: number) => new Date(Date.now() + days * 86400000);
const md = (days: number) => new Date(Date.now() - days * 86400000);

function status(days: number): 'Safe' | 'Near Expiry' | 'Critical' {
  if (days <= 3) return 'Critical';
  if (days <= 7) return 'Near Expiry';
  return 'Safe';
}

function recoveryStage(days: number, stock: number): string {
  if (days < 0) return 'Recycle / Compost';
  if (days <= 1) return 'NGO Donation';
  if (days <= 3) return 'Discount';
  if (days <= 5) return 'Bundle Offer';
  if (days <= 7) return 'Notify Customers';
  if (stock > 100 && days > 30) return 'Transfer To Branch';
  return 'Normal Sale';
}

function recoveryScore(days: number): number {
  if (days < 0) return 10;
  if (days <= 2) return 90;
  if (days <= 5) return 80;
  if (days <= 7) return 75;
  if (days <= 30) return 85;
  return 100;
}

const mockProducts = [
  // ─── FRESH PRODUCE (8) ───
  { name: 'Organic Hass Avocados (4pc)', sku: 'PR-0001', category: 'Fresh Produce', stock: 85, unit: 'Packs', price: 4.80, expiryDays: 2, mfgDays: 3, branch: 'Downtown Fresh', location: 'Produce Bay 1', supplier: 'Fresh Harvest Co' },
  { name: 'Baby Spinach Leaves 250g', sku: 'PR-0002', category: 'Fresh Produce', stock: 70, unit: 'Bags', price: 3.10, expiryDays: 1, mfgDays: 4, branch: 'Uptown Market', location: 'Produce Bay 3', supplier: 'Fresh Harvest Co' },
  { name: 'Roma Tomatoes 1kg', sku: 'PR-0003', category: 'Fresh Produce', stock: 110, unit: 'Bags', price: 2.50, expiryDays: 5, mfgDays: 2, branch: 'Eastside Hub', location: 'Produce Bay 2', supplier: 'SunRipe Foods' },
  { name: 'Mixed Salad Greens 200g', sku: 'PR-0004', category: 'Fresh Produce', stock: 55, unit: 'Bags', price: 3.75, expiryDays: 3, mfgDays: 2, branch: 'Westside Superstore', location: 'Produce Bay 4', supplier: 'Green Valley Farms' },
  { name: 'Organic Broccoli Head', sku: 'PR-0005', category: 'Fresh Produce', stock: 45, unit: 'Units', price: 2.99, expiryDays: 6, mfgDays: 1, branch: 'Downtown Fresh', location: 'Produce Bay 1', supplier: 'Green Valley Farms' },
  { name: 'Strawberry Pack 500g', sku: 'PR-0006', category: 'Fresh Produce', stock: 60, unit: 'Packs', price: 5.50, expiryDays: 4, mfgDays: 2, branch: 'Uptown Market', location: 'Produce Bay 2', supplier: 'Fresh Harvest Co' },
  { name: 'Sweet Corn 4-Pack', sku: 'PR-0007', category: 'Fresh Produce', stock: 90, unit: 'Packs', price: 3.20, expiryDays: 18, mfgDays: 1, branch: 'Eastside Hub', location: 'Produce Bay 3', supplier: 'SunRipe Foods' },
  { name: 'Mango Alphonso 6pc Box', sku: 'PR-0008', category: 'Fresh Produce', stock: 40, unit: 'Boxes', price: 8.99, expiryDays: 30, mfgDays: 5, branch: 'Westside Superstore', location: 'Produce Bay 1', supplier: 'Fresh Harvest Co' },

  // ─── DAIRY & EGGS (8) ───
  { name: 'Organic Whole Milk 1L', sku: 'DY-0001', category: 'Dairy & Eggs', stock: 140, unit: 'Cartons', price: 3.50, expiryDays: 1, mfgDays: 2, branch: 'Downtown Fresh', location: 'Cold Unit 2', supplier: 'Green Pastures Farm' },
  { name: 'Greek Yogurt Vanilla 500g', sku: 'DY-0002', category: 'Dairy & Eggs', stock: 95, unit: 'Tubs', price: 4.20, expiryDays: 4, mfgDays: 3, branch: 'Uptown Market', location: 'Cold Unit 1', supplier: 'Alpine Dairy' },
  { name: 'Cheddar Cheese Block 400g', sku: 'DY-0003', category: 'Dairy & Eggs', stock: 65, unit: 'Blocks', price: 6.80, expiryDays: 14, mfgDays: 10, branch: 'Eastside Hub', location: 'Cold Unit 3', supplier: 'Alpine Dairy' },
  { name: 'Free Range Eggs 12pc', sku: 'DY-0004', category: 'Dairy & Eggs', stock: 120, unit: 'Cartons', price: 5.20, expiryDays: 20, mfgDays: 5, branch: 'Westside Superstore', location: 'Cold Unit 1', supplier: 'Sunny Farms' },
  { name: 'Butter Unsalted 250g', sku: 'DY-0005', category: 'Dairy & Eggs', stock: 80, unit: 'Blocks', price: 4.50, expiryDays: 7, mfgDays: 7, branch: 'Downtown Fresh', location: 'Cold Unit 2', supplier: 'Green Pastures Farm' },
  { name: 'Paneer Fresh 200g', sku: 'DY-0006', category: 'Dairy & Eggs', stock: 50, unit: 'Packs', price: 3.99, expiryDays: 2, mfgDays: 1, branch: 'Uptown Market', location: 'Cold Unit 4', supplier: 'Amul Foods' },
  { name: 'Mozzarella Ball 125g', sku: 'DY-0007', category: 'Dairy & Eggs', stock: 35, unit: 'Packs', price: 4.80, expiryDays: 5, mfgDays: 4, branch: 'Eastside Hub', location: 'Cold Unit 2', supplier: 'Alpine Dairy' },
  { name: 'Low Fat Yogurt Plain 400g', sku: 'DY-0008', category: 'Dairy & Eggs', stock: 75, unit: 'Tubs', price: 3.20, expiryDays: 45, mfgDays: 3, branch: 'Westside Superstore', location: 'Cold Unit 3', supplier: 'Amul Foods' },

  // ─── BAKERY & DELI (7) ───
  { name: 'Artisan Sourdough Loaf', sku: 'BK-0001', category: 'Bakery & Deli', stock: 60, unit: 'Loaves', price: 5.20, expiryDays: 1, mfgDays: 1, branch: 'Downtown Fresh', location: 'Bakery Rack A', supplier: 'Daily Crust Bakery' },
  { name: 'Whole Wheat Sandwich Loaf', sku: 'BK-0002', category: 'Bakery & Deli', stock: 45, unit: 'Loaves', price: 2.90, expiryDays: 2, mfgDays: 2, branch: 'Uptown Market', location: 'Bakery Rack B', supplier: 'Sunrise Bakery' },
  { name: 'Butter Croissants 6pc', sku: 'BK-0003', category: 'Bakery & Deli', stock: 30, unit: 'Packs', price: 4.50, expiryDays: 1, mfgDays: 1, branch: 'Eastside Hub', location: 'Bakery Rack A', supplier: 'Daily Crust Bakery' },
  { name: 'Blueberry Muffins 4pc', sku: 'BK-0004', category: 'Bakery & Deli', stock: 40, unit: 'Packs', price: 3.80, expiryDays: 3, mfgDays: 1, branch: 'Westside Superstore', location: 'Bakery Rack C', supplier: 'Sunrise Bakery' },
  { name: 'Pita Bread 6pc', sku: 'BK-0005', category: 'Bakery & Deli', stock: 55, unit: 'Packs', price: 2.20, expiryDays: 6, mfgDays: 2, branch: 'Downtown Fresh', location: 'Bakery Rack B', supplier: 'Artisan Breads' },
  { name: 'Smoked Salmon Deli Slices 100g', sku: 'BK-0006', category: 'Bakery & Deli', stock: 25, unit: 'Packs', price: 9.99, expiryDays: 4, mfgDays: 3, branch: 'Uptown Market', location: 'Deli Counter', supplier: 'Ocean Fresh Deli' },
  { name: 'French Baguette', sku: 'BK-0007', category: 'Bakery & Deli', stock: 20, unit: 'Loaves', price: 3.00, expiryDays: 1, mfgDays: 1, branch: 'Eastside Hub', location: 'Bakery Rack A', supplier: 'Artisan Breads' },

  // ─── MEAT & SEAFOOD (6) ───
  { name: 'Grass-Fed Beef Mince 500g', sku: 'ME-0001', category: 'Meat & Seafood', stock: 45, unit: 'Packs', price: 8.90, expiryDays: 3, mfgDays: 2, branch: 'Downtown Fresh', location: 'Cold Storage Room C', supplier: 'Prime Cut Meats' },
  { name: 'Chicken Breast Boneless 1kg', sku: 'ME-0002', category: 'Meat & Seafood', stock: 70, unit: 'Packs', price: 7.50, expiryDays: 2, mfgDays: 1, branch: 'Uptown Market', location: 'Cold Storage Room A', supplier: 'Prime Cut Meats' },
  { name: 'Fresh Atlantic Salmon 500g', sku: 'ME-0003', category: 'Meat & Seafood', stock: 30, unit: 'Fillets', price: 12.50, expiryDays: 2, mfgDays: 1, branch: 'Eastside Hub', location: 'Seafood Counter', supplier: 'Ocean Fresh Deli' },
  { name: 'Pork Sausages 400g', sku: 'ME-0004', category: 'Meat & Seafood', stock: 55, unit: 'Packs', price: 5.99, expiryDays: 5, mfgDays: 2, branch: 'Westside Superstore', location: 'Cold Storage Room B', supplier: 'Prime Cut Meats' },
  { name: 'Lamb Chops 600g', sku: 'ME-0005', category: 'Meat & Seafood', stock: 20, unit: 'Packs', price: 14.99, expiryDays: 4, mfgDays: 2, branch: 'Downtown Fresh', location: 'Cold Storage Room C', supplier: 'Prime Cut Meats' },
  { name: 'Prawns Large 500g', sku: 'ME-0006', category: 'Meat & Seafood', stock: 35, unit: 'Packs', price: 11.99, expiryDays: 3, mfgDays: 1, branch: 'Uptown Market', location: 'Seafood Counter', supplier: 'Ocean Fresh Deli' },

  // ─── PANTRY & CANNED (5) ───
  { name: 'Organic Tomato Puree 400g', sku: 'PT-0001', category: 'Pantry & Canned', stock: 310, unit: 'Cans', price: 1.95, expiryDays: 90, mfgDays: 30, branch: 'Eastside Hub', location: 'Warehouse Shelf B2', supplier: 'SunRipe Foods' },
  { name: 'Chickpeas in Brine 400g', sku: 'PT-0002', category: 'Pantry & Canned', stock: 200, unit: 'Cans', price: 1.50, expiryDays: 365, mfgDays: 60, branch: 'Westside Superstore', location: 'Warehouse Shelf C3', supplier: 'Harvest Select' },
  { name: 'Extra Virgin Olive Oil 500ml', sku: 'PT-0003', category: 'Pantry & Canned', stock: 150, unit: 'Bottles', price: 9.99, expiryDays: 180, mfgDays: 90, branch: 'Downtown Fresh', location: 'Warehouse Shelf A1', supplier: 'MediterraCo' },
  { name: 'Basmati Rice 5kg', sku: 'PT-0004', category: 'Pantry & Canned', stock: 80, unit: 'Bags', price: 12.99, expiryDays: 365, mfgDays: 120, branch: 'Uptown Market', location: 'Warehouse Shelf D4', supplier: 'Harvest Select' },
  { name: 'Dark Chocolate 70% 100g', sku: 'PT-0005', category: 'Pantry & Canned', stock: 220, unit: 'Bars', price: 2.99, expiryDays: 120, mfgDays: 15, branch: 'Eastside Hub', location: 'Warehouse Shelf E2', supplier: 'Cocoa Origin' },

  // ─── BEVERAGES (5) ───
  { name: 'Orange Juice Fresh 1L', sku: 'BV-0001', category: 'Beverages', stock: 80, unit: 'Bottles', price: 4.99, expiryDays: 5, mfgDays: 3, branch: 'Downtown Fresh', location: 'Cold Aisle 1', supplier: 'Citrus Fresh' },
  { name: 'Cold Brew Coffee 330ml', sku: 'BV-0002', category: 'Beverages', stock: 60, unit: 'Cans', price: 3.50, expiryDays: 7, mfgDays: 5, branch: 'Uptown Market', location: 'Cold Aisle 2', supplier: 'Brew Masters' },
  { name: 'Coconut Water 500ml', sku: 'BV-0003', category: 'Beverages', stock: 120, unit: 'Cartons', price: 2.80, expiryDays: 30, mfgDays: 10, branch: 'Westside Superstore', location: 'Cold Aisle 3', supplier: 'TropiCo' },
  { name: 'Sparkling Water 12-Pack', sku: 'BV-0004', category: 'Beverages', stock: 300, unit: 'Packs', price: 5.99, expiryDays: 365, mfgDays: 10, branch: 'Eastside Hub', location: 'Warehouse Shelf F1', supplier: 'Aqua Bubbles' },
  { name: 'Green Tea Kombucha 400ml', sku: 'BV-0005', category: 'Beverages', stock: 45, unit: 'Bottles', price: 4.20, expiryDays: 14, mfgDays: 7, branch: 'Downtown Fresh', location: 'Cold Aisle 4', supplier: 'Brew Masters' },

  // ─── FROZEN FOODS (5) ───
  { name: 'Frozen Peas & Corn 500g', sku: 'FZ-0001', category: 'Frozen Foods', stock: 100, unit: 'Bags', price: 2.50, expiryDays: 180, mfgDays: 30, branch: 'Downtown Fresh', location: 'Freezer Bay 1', supplier: 'Frosty Farms' },
  { name: 'Frozen Margherita Pizza', sku: 'FZ-0002', category: 'Frozen Foods', stock: 55, unit: 'Units', price: 6.99, expiryDays: 120, mfgDays: 20, branch: 'Uptown Market', location: 'Freezer Bay 2', supplier: 'Italia Frozen' },
  { name: 'Ice Cream Vanilla 1L', sku: 'FZ-0003', category: 'Frozen Foods', stock: 40, unit: 'Tubs', price: 5.50, expiryDays: 90, mfgDays: 15, branch: 'Eastside Hub', location: 'Freezer Bay 3', supplier: 'Creamland' },
  { name: 'Frozen Mixed Berries 400g', sku: 'FZ-0004', category: 'Frozen Foods', stock: 85, unit: 'Bags', price: 7.49, expiryDays: 180, mfgDays: 15, branch: 'Westside Superstore', location: 'Freezer Bay 1', supplier: 'Frosty Farms' },
  { name: 'Frozen Fish Fingers 400g', sku: 'FZ-0005', category: 'Frozen Foods', stock: 65, unit: 'Boxes', price: 4.99, expiryDays: 150, mfgDays: 25, branch: 'Downtown Fresh', location: 'Freezer Bay 2', supplier: 'Ocean Fresh Deli' },

  // ─── PERSONAL CARE & PHARMA (6) ───
  { name: 'Vitamin C 1000mg 60 Tabs', sku: 'PH-0001', category: 'Pharmaceuticals', stock: 120, unit: 'Bottles', price: 14.50, expiryDays: 6, mfgDays: 180, branch: 'Uptown Market', location: 'Pharma Shelf 3', supplier: 'MediHealth Labs' },
  { name: 'Paracetamol 500mg 16 Tabs', sku: 'PH-0002', category: 'Pharmaceuticals', stock: 200, unit: 'Strips', price: 2.99, expiryDays: 14, mfgDays: 365, branch: 'Eastside Hub', location: 'Pharma Shelf 1', supplier: 'MediHealth Labs' },
  { name: 'Antacid Chewable 20pc', sku: 'PH-0003', category: 'Pharmaceuticals', stock: 80, unit: 'Packs', price: 5.50, expiryDays: 30, mfgDays: 180, branch: 'Westside Superstore', location: 'Pharma Shelf 2', supplier: 'PharmaCure' },
  { name: 'Hand Sanitizer 250ml', sku: 'PH-0004', category: 'Pharmaceuticals', stock: 300, unit: 'Bottles', price: 3.99, expiryDays: 365, mfgDays: 60, branch: 'Downtown Fresh', location: 'Health Aisle A', supplier: 'SafeGuard' },
  { name: 'Multivitamin Daily 30pc', sku: 'PH-0005', category: 'Pharmaceuticals', stock: 90, unit: 'Bottles', price: 18.99, expiryDays: 5, mfgDays: 365, branch: 'Uptown Market', location: 'Pharma Shelf 4', supplier: 'MediHealth Labs' },
  { name: 'Sunscreen SPF50 100ml', sku: 'PH-0006', category: 'Pharmaceuticals', stock: 60, unit: 'Tubes', price: 12.99, expiryDays: 120, mfgDays: 90, branch: 'Eastside Hub', location: 'Health Aisle B', supplier: 'DermaCare' },

  // ─── SNACKS (6) ───
  { name: 'Potato Chips Sea Salt 150g', sku: 'SN-0001', category: 'Snacks', stock: 200, unit: 'Bags', price: 1.99, expiryDays: 90, mfgDays: 30, branch: 'Westside Superstore', location: 'Snack Aisle 1', supplier: 'SnackCo' },
  { name: 'Mixed Nuts Roasted 200g', sku: 'SN-0002', category: 'Snacks', stock: 150, unit: 'Bags', price: 6.99, expiryDays: 180, mfgDays: 20, branch: 'Downtown Fresh', location: 'Snack Aisle 2', supplier: 'Nutty Farms' },
  { name: 'Dark Chocolate Granola Bar', sku: 'SN-0003', category: 'Snacks', stock: 180, unit: 'Bars', price: 1.50, expiryDays: 60, mfgDays: 10, branch: 'Uptown Market', location: 'Snack Aisle 1', supplier: 'HealthBite' },
  { name: 'Rice Crackers Sesame 100g', sku: 'SN-0004', category: 'Snacks', stock: 95, unit: 'Packs', price: 2.30, expiryDays: 5, mfgDays: 20, branch: 'Eastside Hub', location: 'Snack Aisle 3', supplier: 'SnackCo' },
  { name: 'Protein Bar Peanut 50g', sku: 'SN-0005', category: 'Snacks', stock: 110, unit: 'Bars', price: 2.80, expiryDays: 90, mfgDays: 15, branch: 'Westside Superstore', location: 'Snack Aisle 2', supplier: 'HealthBite' },
  { name: 'Popcorn Caramel 80g', sku: 'SN-0006', category: 'Snacks', stock: 70, unit: 'Bags', price: 1.80, expiryDays: 45, mfgDays: 5, branch: 'Downtown Fresh', location: 'Snack Aisle 1', supplier: 'SnackCo' },
];

async function seedDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) { console.error('MONGODB_URI not set'); process.exit(1); }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});

    const docs = mockProducts.map((p) => {
      const days = p.expiryDays;
      return {
        name: p.name,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        unit: p.unit,
        price: p.price,
        expiryDate: d(days),
        manufactureDate: md(p.mfgDays),
        branch: p.branch,
        location: p.location,
        status: status(days),
        supplier: p.supplier,
        recoveryStage: recoveryStage(days, p.stock),
        isDispatched: false,
        recoveryScore: recoveryScore(days),
      };
    });

    // Mark a few as dispatched for demo
    docs[0].isDispatched = true;
    (docs[0] as any).dispatchedToNGO = 'Metro Harvest Food Bank';
    docs[16].isDispatched = true;
    (docs[16] as any).dispatchedToNGO = 'Hope Shelter & Community Kitchen';

    await Product.insertMany(docs);
    console.log(`✅ Seeded ${docs.length} products successfully.`);

    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
