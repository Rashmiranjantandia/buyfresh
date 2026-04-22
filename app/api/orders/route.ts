import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Cart from '@/models/Cart';
import { logger } from '@/lib/logger';

// POST /api/orders - Place a new order
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { customerName, phone, address, items, totalAmount, sessionId } = body;

    // --- Validation ---
    if (!customerName || !phone || !address || !items || totalAmount === undefined) {
      logger.warn('POST /api/orders', 'Missing required fields in request body');
      return NextResponse.json(
        { success: false, message: 'All fields are required: name, phone, address, items, totalAmount' },
        { status: 400 }
      );
    }

    // Indian mobile number validation (10 digits, starts 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      logger.warn('POST /api/orders', `Invalid phone number: ${phone}`);
      return NextResponse.json(
        { success: false, message: 'Please enter a valid 10-digit Indian mobile number' },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      logger.warn('POST /api/orders', 'Order submitted with no items');
      return NextResponse.json(
        { success: false, message: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    if (customerName.trim().length < 2) {
      return NextResponse.json(
        { success: false, message: 'Customer name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (address.trim().length < 10) {
      return NextResponse.json(
        { success: false, message: 'Please enter a complete delivery address (min 10 characters)' },
        { status: 400 }
      );
    }

    // Create order — store sessionId so it can be fetched in order history
    const order = await Order.create({
      sessionId: sessionId || null,   // links order to guest session
      userId: null,                   // null until auth is implemented
      customerName: customerName.trim(),
      phone,
      address: address.trim(),
      items,
      totalAmount,
      status: 'pending',
    });

    logger.info('POST /api/orders', `Order created: ${order._id} for session ${(sessionId || 'unknown').slice(0, 8)}… · ₹${totalAmount}`);

    // Clear the user's cart after successful order
    if (sessionId) {
      await Cart.findOneAndUpdate({ sessionId }, { items: [] });
      logger.info('POST /api/orders', `Cart cleared after order for session ${sessionId.slice(0, 8)}…`);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order placed successfully!',
        data: {
          orderId: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('POST /api/orders', 'Failed to place order', error);
    return NextResponse.json(
      { success: false, message: 'Failed to place order. Please try again.' },
      { status: 500 }
    );
  }
}

// GET /api/orders?sessionId=xxx - Fetch orders for a specific session (order history)
// Future: GET /api/orders?userId=xxx — when auth is added
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    // Future: const userId = searchParams.get('userId');

    // STRICT ISOLATION: sessionId is required. Never return all orders.
    if (!sessionId) {
      logger.warn('GET /api/orders', 'Request missing sessionId — rejected to prevent data leak');
      return NextResponse.json(
        { success: false, message: 'Session ID is required to fetch order history' },
        { status: 400 }
      );
    }

    const orders = await Order.find({ sessionId })
      .sort({ createdAt: -1 })
      .lean();

    logger.info('GET /api/orders', `Fetched ${orders.length} orders for session ${sessionId.slice(0, 8)}…`);

    return NextResponse.json({ success: true, data: orders }, { status: 200 });
  } catch (error) {
    logger.error('GET /api/orders', 'Failed to fetch orders', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch order history. Please try again.' },
      { status: 500 }
    );
  }
}
