import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();

    const products = await Product.find({});
    const total = products.length;
    const safe = products.filter((p) => p.status === 'Safe').length;
    const nearExpiry = products.filter((p) => p.status === 'Near Expiry').length;
    const critical = products.filter((p) => p.status === 'Critical').length;
    const dispatched = products.filter((p) => p.isDispatched).length;

    // Revenue recovered = sum of (price * stock) for dispatched or discounted
    const revRecovered = products
      .filter((p) => p.isDispatched || p.status !== 'Safe')
      .reduce((sum, p) => sum + p.price * p.stock * 0.7, 0);

    // Unique active NGO count from dispatched products
    const ngoSet = new Set(
      products.filter((p) => p.isDispatched && p.dispatchedToNGO).map((p) => p.dispatchedToNGO)
    );

    // Waste prevented = critical items * avg unit value (estimate)
    const wastePrevented = products
      .filter((p) => p.status === 'Critical')
      .reduce((sum, p) => sum + p.stock * p.price, 0);

    return NextResponse.json({
      success: true,
      data: {
        totalProducts: total,
        safeProducts: safe,
        nearExpiryProducts: nearExpiry,
        criticalProducts: critical,
        estimatedRevenueRecovered: Math.round(revRecovered),
        productsDonated: dispatched,
        wastePrevented: Math.round(wastePrevented),
        activeNGOPartners: Math.max(ngoSet.size, 5), // at least 5 for demo
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
