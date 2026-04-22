import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import { logger } from '@/lib/logger';

const ROUTE = 'GET /api/cart';

// GET /api/cart?sessionId=xxx - Fetch cart for a session
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      logger.warn(ROUTE, 'Request missing sessionId');
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ sessionId }).lean();
    logger.info(ROUTE, `Cart fetched for session ${sessionId.slice(0, 8)}… (${cart?.items?.length ?? 0} items)`);

    return NextResponse.json(
      { success: true, data: cart || { sessionId, items: [] } },
      { status: 200 }
    );
  } catch (error) {
    logger.error('GET /api/cart', 'Failed to fetch cart', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cart. Please try again.' },
      { status: 500 }
    );
  }
}

// POST /api/cart - Add or update item in cart
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { sessionId, productId, name, price, quantity, image, unit } = body;

    // --- Validation ---
    // sessionId + productId + quantity are always required
    if (!sessionId || !productId) {
      logger.warn('POST /api/cart', 'Missing sessionId or productId');
      return NextResponse.json(
        { success: false, message: 'sessionId and productId are required' },
        { status: 400 }
      );
    }

    if (typeof quantity !== 'number' || quantity < 0) {
      logger.warn('POST /api/cart', `Invalid quantity value: ${quantity}`);
      return NextResponse.json(
        { success: false, message: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    // name + price are only required when ADDING/UPDATING (quantity > 0)
    // quantity === 0 is a REMOVE operation — no item data needed
    if (quantity > 0 && (!name || price === undefined)) {
      logger.warn('POST /api/cart', 'Missing name or price for add/update operation');
      return NextResponse.json(
        { success: false, message: 'name and price are required when adding or updating an item' },
        { status: 400 }
      );
    }

    // Find existing cart or create new one
    let cart = await Cart.findOne({ sessionId });
    if (!cart) {
      cart = new Cart({ sessionId, items: [] });
      logger.info('POST /api/cart', `New cart created for session ${sessionId.slice(0, 8)}…`);
    }

    // Find index of product in the cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (quantity === 0) {
      // ✅ BUG FIX: Only splice if the item actually exists in the cart.
      // Previously: splice(-1) would remove the LAST item when product wasn't in cart.
      if (existingItemIndex > -1) {
        cart.items.splice(existingItemIndex, 1);
        logger.info('POST /api/cart', `Item removed: productId=${productId}`);
      }
      // else: item not in cart — nothing to remove, silently succeed
    } else if (existingItemIndex > -1) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity = quantity;
      logger.info('POST /api/cart', `Item qty updated: productId=${productId} qty=${quantity}`);
    } else {
      // Add new item to cart
      cart.items.push({ productId, name, price, quantity, image: image || '', unit: unit || 'piece' });
      logger.info('POST /api/cart', `Item added: productId=${productId} qty=${quantity}`);
    }

    await cart.save();

    return NextResponse.json(
      { success: true, data: cart },
      { status: 200 }
    );
  } catch (error) {
    logger.error('POST /api/cart', 'Failed to update cart', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update cart. Please try again.' },
      { status: 500 }
    );
  }
}

// DELETE /api/cart - Clear entire cart
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      logger.warn('DELETE /api/cart', 'Request missing sessionId');
      return NextResponse.json(
        { success: false, message: 'Session ID is required' },
        { status: 400 }
      );
    }

    await Cart.findOneAndUpdate({ sessionId }, { items: [] });
    logger.info('DELETE /api/cart', `Cart cleared for session ${sessionId.slice(0, 8)}…`);

    return NextResponse.json(
      { success: true, message: 'Cart cleared' },
      { status: 200 }
    );
  } catch (error) {
    logger.error('DELETE /api/cart', 'Failed to clear cart', error);
    return NextResponse.json(
      { success: false, message: 'Failed to clear cart. Please try again.' },
      { status: 500 }
    );
  }
}
