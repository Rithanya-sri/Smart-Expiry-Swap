import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await dbConnect();
    const products = await Product.find({}).sort({ expiryDate: 1 });

    const notifications: {
      id: string;
      type: 'expiry' | 'ai' | 'ngo' | 'inventory' | 'transfer';
      title: string;
      message: string;
      severity: 'critical' | 'warning' | 'info' | 'success';
      timestamp: string;
      read: boolean;
    }[] = [];

    let idCounter = 1;

    // Product Near Expiry notifications
    products
      .filter((p) => p.status === 'Critical' && !p.isDispatched)
      .slice(0, 5)
      .forEach((p) => {
        const days = Math.ceil(
          (new Date(p.expiryDate).getTime() - Date.now()) / 86400000
        );
        notifications.push({
          id: `notif-${idCounter++}`,
          type: 'expiry',
          title: 'Product Near Expiry',
          message: `${p.name} (${p.stock} ${p.unit}) expires in ${Math.max(days, 0)} day${days === 1 ? '' : 's'}. Immediate action required.`,
          severity: 'critical',
          timestamp: new Date(Date.now() - idCounter * 1000 * 60 * 15).toISOString(),
          read: false,
        });
      });

    // AI Recommendation notifications
    products
      .filter((p) => p.status === 'Near Expiry')
      .slice(0, 3)
      .forEach((p) => {
        notifications.push({
          id: `notif-${idCounter++}`,
          type: 'ai',
          title: 'AI Recommendation Generated',
          message: `Recovery strategy for "${p.name}": ${p.recoveryStage} recommended. Estimated 75% revenue recovery.`,
          severity: 'warning',
          timestamp: new Date(Date.now() - idCounter * 1000 * 60 * 30).toISOString(),
          read: false,
        });
      });

    // NGO Accepted notifications
    products
      .filter((p) => p.isDispatched)
      .slice(0, 2)
      .forEach((p) => {
        notifications.push({
          id: `notif-${idCounter++}`,
          type: 'ngo',
          title: 'NGO Accepted Pickup',
          message: `${p.dispatchedToNGO} confirmed pickup for ${p.name} (${p.stock} ${p.unit}). Dispatch en route.`,
          severity: 'success',
          timestamp: new Date(Date.now() - idCounter * 1000 * 60 * 60).toISOString(),
          read: true,
        });
      });

    // Inventory Updated
    notifications.push({
      id: `notif-${idCounter++}`,
      type: 'inventory',
      title: 'Inventory Updated',
      message: `${products.length} products synced across 4 branches. ${products.filter(p => p.status === 'Critical').length} critical items flagged.`,
      severity: 'info',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: true,
    });

    // Transfer Completed
    notifications.push({
      id: `notif-${idCounter++}`,
      type: 'transfer',
      title: 'Transfer Completed',
      message: 'Batch of Frozen Peas & Corn (100 Bags) successfully transferred from Downtown Fresh to Eastside Hub.',
      severity: 'success',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: true,
    });

    return NextResponse.json({ success: true, data: notifications });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
