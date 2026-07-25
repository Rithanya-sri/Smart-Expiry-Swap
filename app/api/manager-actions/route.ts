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

    // Products requiring immediate action (critical, not dispatched)
    const immediateAction = products
      .filter((p) => p.status === 'Critical' && !p.isDispatched)
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        sku: p.sku,
        category: p.category,
        stock: p.stock,
        unit: p.unit,
        value: +(p.price * p.stock).toFixed(2),
        daysLeft: daysLeft(p.expiryDate),
        branch: p.branch,
        recoveryStage: p.recoveryStage,
        recoveryScore: p.recoveryScore,
      }));

    // Waiting for NGO pickup (dispatched but not yet confirmed)
    const ngoPickup = products
      .filter((p) => p.isDispatched)
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        stock: p.stock,
        unit: p.unit,
        ngo: p.dispatchedToNGO,
        daysLeft: daysLeft(p.expiryDate),
        branch: p.branch,
        value: +(p.price * p.stock).toFixed(2),
      }));

    // Transferred products
    const transferred = products
      .filter((p) => p.recoveryStage === 'Transfer To Branch')
      .map((p) => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
        stock: p.stock,
        unit: p.unit,
        branch: p.branch,
        daysLeft: daysLeft(p.expiryDate),
      }));

    // Revenue recovered
    const recoveredRevenue = products
      .filter((p) => p.isDispatched || (p.status !== 'Safe' && p.recoveryStage !== 'Recycle / Compost'))
      .reduce((s, p) => s + p.price * p.stock * 0.7, 0);

    // Pending tasks
    const pendingTasks = [
      ...products.filter((p) => p.status === 'Critical' && !p.isDispatched).map((p) => ({
        id: `task-${p._id}`,
        type: 'urgent',
        title: `Apply discount to ${p.name}`,
        product: p.name,
        branch: p.branch,
        daysLeft: daysLeft(p.expiryDate),
        priority: 'Urgent' as const,
      })),
      ...products.filter((p) => p.status === 'Near Expiry' && !p.isDispatched).slice(0, 3).map((p) => ({
        id: `task-nge-${p._id}`,
        type: 'warning',
        title: `Schedule ${p.recoveryStage} for ${p.name}`,
        product: p.name,
        branch: p.branch,
        daysLeft: daysLeft(p.expiryDate),
        priority: 'High' as const,
      })),
    ];

    return NextResponse.json({
      success: true,
      data: {
        immediateAction,
        ngoPickup,
        transferred,
        recoveredRevenue: Math.round(recoveredRevenue),
        pendingTasks,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
