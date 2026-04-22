import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { logger } from '@/lib/logger';

// GET /api/products - Fetch all products with optional category filter
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const filter = category && category !== 'All' ? { category } : {};

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();

    logger.info('GET /api/products', `Returned ${products.length} products${category ? ` [category: ${category}]` : ''}`);

    return NextResponse.json(
      { success: true, data: products },
      { status: 200 }
    );
  } catch (error) {
    logger.error('GET /api/products', 'Failed to fetch products', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products. Please try again.' },
      { status: 500 }
    );
  }
}
