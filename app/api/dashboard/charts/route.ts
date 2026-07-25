import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({});

    // ── Category breakdown ────────────────────────────────────────────────
    const catMap: Record<string, number> = {};
    products.forEach((p) => {
      catMap[p.category] = (catMap[p.category] || 0) + 1;
    });

    const COLORS: Record<string, string> = {
      'Fresh Produce': '#10b981',
      'Dairy & Eggs': '#3b82f6',
      'Bakery & Deli': '#f59e0b',
      'Meat & Seafood': '#f43f5e',
      'Pantry & Canned': '#8b5cf6',
      Beverages: '#06b6d4',
      'Frozen Foods': '#64748b',
      Pharmaceuticals: '#a78bfa',
      Snacks: '#fb923c',
    };

    const categoryBreakdown = Object.entries(catMap).map(([name, value]) => ({
      name,
      value,
      color: COLORS[name] || '#6b7280',
    }));

    // ── Inventory status ─────────────────────────────────────────────────
    const inventoryStatus = [
      { name: 'Safe', value: products.filter((p) => p.status === 'Safe').length, color: '#10b981' },
      { name: 'Near Expiry', value: products.filter((p) => p.status === 'Near Expiry').length, color: '#f59e0b' },
      { name: 'Critical', value: products.filter((p) => p.status === 'Critical').length, color: '#f43f5e' },
    ];

    // ── Recovery actions distribution ─────────────────────────────────────
    const stageMap: Record<string, number> = {};
    products.forEach((p) => {
      const stage = p.recoveryStage || 'Normal Sale';
      stageMap[stage] = (stageMap[stage] || 0) + 1;
    });

    const recoveryActions = Object.entries(stageMap).map(([name, value]) => ({ name, value }));

    // ── Monthly waste reduction (simulated 6-month trend) ─────────────────
    const now = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyWasteReduction = Array.from({ length: 6 }, (_, i) => {
      const idx = ((now.getMonth() - 5 + i) + 12) % 12;
      const factor = 0.5 + i * 0.1;
      return {
        month: months[idx],
        rescued: Math.round(1200 + i * 650 + Math.random() * 200),
        waste: Math.round(180 - i * 25 + Math.random() * 20),
        valueSaved: Math.round(14200 + i * 7600 + Math.random() * 1000),
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        categoryBreakdown,
        inventoryStatus,
        recoveryActions,
        monthlyWasteReduction,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
