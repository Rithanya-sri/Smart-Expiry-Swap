import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ expiryDate: 1 });

    function daysLeft(date: Date) {
      return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    }

    // ── Top 5 at-risk products ────────────────────────────────────────────
    const atRisk = products
      .filter((p) => !p.isDispatched && p.status !== 'Safe')
      .slice(0, 5)
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        stock: p.stock,
        unit: p.unit,
        daysLeft: daysLeft(p.expiryDate),
        value: +(p.price * p.stock).toFixed(2),
        recoveryScore: p.recoveryScore || 80,
        status: p.status,
        branch: p.branch,
      }));

    // ── Highest revenue recovery opportunities ────────────────────────────
    const revenueOpportunities = products
      .filter((p) => !p.isDispatched && p.status !== 'Safe')
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        currentValue: +(p.price * p.stock).toFixed(2),
        recoverableValue: +(p.price * p.stock * 0.75).toFixed(2),
        recoveryPct: 75,
        action: p.recoveryStage || 'Discount',
        daysLeft: daysLeft(p.expiryDate),
      }))
      .sort((a, b) => b.recoverableValue - a.recoverableValue)
      .slice(0, 5);

    // ── Most waste-prone categories ───────────────────────────────────────
    const categoryWaste: Record<string, { count: number; value: number }> = {};
    products
      .filter((p) => p.status !== 'Safe')
      .forEach((p) => {
        if (!categoryWaste[p.category]) categoryWaste[p.category] = { count: 0, value: 0 };
        categoryWaste[p.category].count++;
        categoryWaste[p.category].value += p.price * p.stock;
      });

    const wasteProneCats = Object.entries(categoryWaste)
      .map(([name, data]) => ({
        name,
        atRiskCount: data.count,
        estimatedWaste: Math.round(data.value * 0.3),
        color: getColor(name),
      }))
      .sort((a, b) => b.estimatedWaste - a.estimatedWaste);

    // ── Weekly AI recommendations ─────────────────────────────────────────
    const weeklyRecs = [
      {
        id: 'rec-1',
        title: 'Flash Discount on Fresh Produce',
        description: `${products.filter(p => p.category === 'Fresh Produce' && p.status !== 'Safe').length} items in Fresh Produce are nearing expiry. A 30% flash discount campaign could recover ₹${Math.round(products.filter(p => p.category === 'Fresh Produce' && p.status !== 'Safe').reduce((s, p) => s + p.price * p.stock, 0) * 0.7).toLocaleString('en-IN')} in revenue.`,
        action: 'Apply Discount',
        impact: 'High',
        category: 'Fresh Produce',
      },
      {
        id: 'rec-2',
        title: 'Bundle Bakery Items with Deli Products',
        description: 'Cross-sell Artisan Sourdough with Smoked Salmon to create premium meal kits. Estimated 25% uplift in basket value.',
        action: 'Bundle Offer',
        impact: 'Medium',
        category: 'Bakery & Deli',
      },
      {
        id: 'rec-3',
        title: 'NGO Dispatch for Critical Dairy',
        description: `${products.filter(p => p.category === 'Dairy & Eggs' && p.status === 'Critical').length} Dairy products expire within 48 hours. Coordinate with Metro Harvest Food Bank for immediate pickup.`,
        action: 'NGO Donation',
        impact: 'Urgent',
        category: 'Dairy & Eggs',
      },
      {
        id: 'rec-4',
        title: 'Transfer Pharmaceuticals to High-Demand Branch',
        description: 'Near-expiry Vitamin C and Multivitamin stock at Uptown Market. Transfer to Westside Superstore which has 3x the footfall.',
        action: 'Transfer To Branch',
        impact: 'Medium',
        category: 'Pharmaceuticals',
      },
    ];

    // ── Recovery score distribution ───────────────────────────────────────
    const scoreBuckets = [
      { range: '0–20', label: 'Expired', count: 0, color: '#64748b' },
      { range: '21–50', label: 'Low', count: 0, color: '#f43f5e' },
      { range: '51–74', label: 'Medium', count: 0, color: '#f59e0b' },
      { range: '75–89', label: 'Good', count: 0, color: '#3b82f6' },
      { range: '90–100', label: 'Excellent', count: 0, color: '#10b981' },
    ];

    products.forEach((p) => {
      const s = p.recoveryScore || 50;
      if (s <= 20) scoreBuckets[0].count++;
      else if (s <= 50) scoreBuckets[1].count++;
      else if (s <= 74) scoreBuckets[2].count++;
      else if (s <= 89) scoreBuckets[3].count++;
      else scoreBuckets[4].count++;
    });

    return NextResponse.json({
      success: true,
      data: {
        atRisk,
        revenueOpportunities,
        wasteProneCats,
        weeklyRecs,
        scoreDistribution: scoreBuckets,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function getColor(cat: string): string {
  const map: Record<string, string> = {
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
  return map[cat] || '#6b7280';
}
