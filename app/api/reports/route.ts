import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || 'weekly'; // daily | weekly | monthly

  try {
    await dbConnect();
    const products = await Product.find({});

    const multiplier = period === 'daily' ? 1/7 : period === 'monthly' ? 4 : 1;

    const discounted = products.filter((p) =>
      ['Discount', 'Bundle Offer'].includes(p.recoveryStage || '')
    );
    const donated = products.filter((p) => p.isDispatched);
    const recycled = products.filter((p) => p.recoveryStage === 'Recycle / Compost');
    const critical = products.filter((p) => p.status === 'Critical');

    const revenueSaved = Math.round(
      products
        .filter((p) => p.status !== 'Safe' || p.isDispatched)
        .reduce((s, p) => s + p.price * p.stock * 0.65, 0) * multiplier
    );

    const foodRescued = Math.round(
      donated.reduce((s, p) => s + p.stock * 0.4, 0) * multiplier
    );

    const report = {
      period,
      generatedAt: new Date().toISOString(),
      summary: {
        revenueSaved,
        foodRescued,
        productsDiscounted: Math.round(discounted.length * multiplier),
        productsDonated: Math.round(donated.length * multiplier),
        productsRecycled: Math.round(recycled.length * multiplier),
        criticalProductsHandled: Math.round(critical.length * multiplier),
        co2Avoided: +(foodRescued * 2.5).toFixed(1),
        mealsServed: Math.round(foodRescued * 4),
      },
      byCategory: Object.entries(
        products.reduce((acc, p) => {
          if (!acc[p.category]) acc[p.category] = { products: 0, value: 0, rescued: 0 };
          acc[p.category].products++;
          acc[p.category].value += p.price * p.stock;
          if (p.isDispatched || p.status !== 'Safe') acc[p.category].rescued++;
          return acc;
        }, {} as Record<string, { products: number; value: number; rescued: number }>)
      ).map(([category, data]) => ({
        category,
        totalProducts: data.products,
        totalValue: Math.round(data.value * multiplier),
        rescued: Math.round(data.rescued * multiplier),
      })),
    };

    return NextResponse.json({ success: true, data: report });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
