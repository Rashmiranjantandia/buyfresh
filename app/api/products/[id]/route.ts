import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { logger } from '@/lib/logger';

// GET /api/products/[id] - Fetch a single product by MongoDB ObjectId
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    // Basic ObjectId format check (24 hex chars) to avoid Mongoose cast errors
    if (!id || !/^[a-f\d]{24}$/i.test(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid product ID format' },
        { status: 400 }
      );
    }

    const product = await Product.findById(id).lean();

    if (!product) {
      logger.warn('GET /api/products/[id]', `Product not found: ${id}`);
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    logger.info('GET /api/products/[id]', `Fetched product: ${(product as { name: string }).name}`);

    return NextResponse.json(
      { success: true, data: product },
      { status: 200 }
    );
  } catch (error) {
    logger.error('GET /api/products/[id]', 'Failed to fetch product', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch product. Please try again.' },
      { status: 500 }
    );
  }
}
