import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import { logger } from '@/lib/logger';

/**
 * Realistic Indian Grocery Seed Data — 24 products
 *
 * Image strategy: All images use Unsplash with ?auto=format&fit=crop&w=400&q=80
 * Every URL has been selected from a reliable, publicly cached Unsplash photo.
 * Pricing reflects approximate real-world Indian grocery market (April 2024).
 */
const indianGroceryProducts = [

  // ── GRAINS & PULSES ───────────────────────────────────────────────────────
  {
    name: 'India Gate Basmati Rice',
    description: 'Premium aged long-grain basmati rice from the foothills of Himalayas. Aromatic, fluffy, and perfect for biryani and pulao.',
    price: 145,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
    category: 'Grains & Pulses',
    unit: 'per kg',
    stock: 150,
  },
  {
    name: 'Aashirvaad Whole Wheat Atta',
    description: 'Stone-ground 100% whole wheat flour for soft rotis and chapatis. MP Sharbati wheat sourced directly from farmers.',
    price: 295,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=400&q=80',
    category: 'Grains & Pulses',
    unit: 'per 5 kg',
    stock: 80,
  },
  {
    name: 'Toor Dal (Arhar Dal)',
    description: 'High-protein split pigeon peas, ideal for everyday dal tadka, sambar, and rasam. Uniform size, no stones.',
    price: 165,
    image: 'https://images.unsplash.com/photo-1612257997264-e0f580a85a5c?auto=format&fit=crop&w=400&q=80',
    category: 'Grains & Pulses',
    unit: 'per kg',
    stock: 200,
  },
  {
    name: 'Chana Dal (Split Bengal Gram)',
    description: 'Yellow split chickpeas with a rich, nutty flavour. Great for dal, halwa, and besan flour preparation.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1515543904379-3d757afe72e4?auto=format&fit=crop&w=400&q=80',
    category: 'Grains & Pulses',
    unit: 'per 500 g',
    stock: 180,
  },
  {
    name: 'Masoor Dal (Red Lentils)',
    description: 'Quick-cooking red lentils, rich in iron and protein. No soaking needed — ready in 15 minutes.',
    price: 85,
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80',
    category: 'Grains & Pulses',
    unit: 'per 500 g',
    stock: 175,
  },

  // ── DAIRY & EGGS ─────────────────────────────────────────────────────────
  {
    name: 'Amul Gold Full Cream Milk',
    description: 'Standardised full cream milk with 6% fat content. Pasteurised and homogenised for consistent richness.',
    price: 68,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
    category: 'Dairy & Eggs',
    unit: 'per litre',
    stock: 120,
  },
  {
    name: 'Amul Butter (Salted)',
    description: "India's most loved butter. Made from fresh cream, lightly salted. Perfect for rotis, toast, and cooking.",
    price: 62,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
    category: 'Dairy & Eggs',
    unit: 'per 100 g',
    stock: 130,
  },
  {
    name: 'Amul Paneer',
    description: 'Fresh, soft paneer from pure cow milk. Ideal for palak paneer, paneer butter masala, and grilling.',
    price: 90,
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=400&q=80',
    category: 'Dairy & Eggs',
    unit: 'per 200 g',
    stock: 100,
  },
  {
    name: 'Farm Fresh Eggs',
    description: 'Free-range country eggs from hens reared on a natural grain diet. Rich yolk, superior taste, high protein.',
    price: 92,
    image: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?auto=format&fit=crop&w=400&q=80',
    category: 'Dairy & Eggs',
    unit: 'per dozen',
    stock: 200,
  },

  // ── FRUITS ───────────────────────────────────────────────────────────────
  {
    name: 'Alphonso Mangoes (Hapus)',
    description: 'The king of mangoes! GI-tagged Ratnagiri Alphonso with a deep orange colour, zero fibre, and intense sweetness.',
    price: 420,
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
    category: 'Fruits',
    unit: 'per dozen',
    stock: 60,
  },
  {
    name: 'Bananas (Elaichi Kela)',
    description: 'Small, fragrant Elaichi bananas from Maharashtra — sweeter and creamier than regular bananas. Great for infants.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    category: 'Fruits',
    unit: 'per dozen',
    stock: 150,
  },
  {
    name: 'Pomegranate (Bhagwa)',
    description: 'Bhagwa variety pomegranate from Solapur — ruby red arils, sweet-tangy flavour, and rich in antioxidants.',
    price: 110,
    image: 'https://images.unsplash.com/photo-1615485925763-86ad8a4e4c77?auto=format&fit=crop&w=400&q=80',
    category: 'Fruits',
    unit: 'per piece (400–500 g)',
    stock: 80,
  },
  {
    name: 'Watermelon',
    description: 'Sweet, juicy summer watermelon — 90% water content. Chilled and served — the perfect heat buster.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?auto=format&fit=crop&w=400&q=80',
    category: 'Fruits',
    unit: 'per kg',
    stock: 90,
  },

  // ── VEGETABLES ───────────────────────────────────────────────────────────
  {
    name: 'Fresh Tomatoes (Tamatar)',
    description: 'Vine-ripened hybrid tomatoes from Nashik. Firm texture, balanced acidity — the backbone of every Indian curry.',
    price: 40,
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=400&q=80',
    category: 'Vegetables',
    unit: 'per kg',
    stock: 200,
  },
  {
    name: 'Onions (Pyaaz)',
    description: 'Red Nashik onions — the foundation of Indian cooking. Strong pungency, excellent shelf life, and uniform size.',
    price: 35,
    image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=400&q=80',
    category: 'Vegetables',
    unit: 'per kg',
    stock: 300,
  },
  {
    name: 'Baby Spinach (Palak)',
    description: 'Tender baby spinach leaves — washed and ready to cook. Packed with iron, folate, and vitamins A & C.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
    category: 'Vegetables',
    unit: 'per 250 g pack',
    stock: 120,
  },
  {
    name: 'Green Capsicum (Shimla Mirch)',
    description: 'Crisp, bitter-sweet green bell peppers from Himachal Pradesh. Essential for kadai dishes and Indo-Chinese recipes.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80',
    category: 'Vegetables',
    unit: 'per 500 g',
    stock: 100,
  },

  // ── SNACKS ───────────────────────────────────────────────────────────────
  {
    name: "Haldiram's Aloo Bhujia",
    description: "India's Most-Loved Snack™. Crispy thin sev made from gram flour and potato — seasoned with ajwain, chilli, and black pepper.",
    price: 50,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
    category: 'Snacks',
    unit: 'per 200 g pack',
    stock: 250,
  },
  {
    name: 'Parle-G Glucose Biscuits',
    description: 'The original G-man! World-famous glucose biscuit, loved since 1939. Dunk in chai for peak experience.',
    price: 10,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80',
    category: 'Snacks',
    unit: 'per pack (100 g)',
    stock: 400,
  },

  // ── BEVERAGES ────────────────────────────────────────────────────────────
  {
    name: 'Tata Tea Premium',
    description: 'Bold CTC tea from the best Assam gardens. Rich, brisk, and full-bodied — brews a strong, reddish-amber cup.',
    price: 130,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=400&q=80',
    category: 'Beverages',
    unit: 'per 250 g pack',
    stock: 175,
  },
  {
    name: 'Bisleri Mineral Water',
    description: 'Purest drinking water, sourced from natural springs and purified through 10-stage mineralisation. Always safe.',
    price: 20,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80',
    category: 'Beverages',
    unit: 'per 1 L bottle',
    stock: 300,
  },

  // ── HOUSEHOLD ────────────────────────────────────────────────────────────
  {
    name: 'Surf Excel Easy Wash',
    description: 'Removes tough stains like turmeric, chocolate, and mud in just one wash. Low-foam formula for hand wash.',
    price: 115,
    image: 'https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=400&q=80',
    category: 'Household',
    unit: 'per 500 g pack',
    stock: 120,
  },
  {
    name: 'Vim Dishwash Bar',
    description: 'Powerful grease-cutting dishwash bar with lemon and salt. Removes stubborn curry stains from utensils effortlessly.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=400&q=80',
    category: 'Household',
    unit: 'per 300 g bar',
    stock: 200,
  },

  // ── SPICES ───────────────────────────────────────────────────────────────
  {
    name: 'MDH Garam Masala',
    description: 'A royal blend of 13 whole spices — clove, cardamom, cinnamon, peppercorn, bay leaf and more. Hand-blended in small batches.',
    price: 75,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
    category: 'Spices',
    unit: 'per 100 g pack',
    stock: 200,
  },
  {
    name: 'Everest Turmeric Powder (Haldi)',
    description: 'Pure, vibrant Sangli turmeric — high curcumin content, deep yellow colour, earthy aroma. No added colour.',
    price: 55,
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?auto=format&fit=crop&w=400&q=80',
    category: 'Spices',
    unit: 'per 200 g pack',
    stock: 180,
  },
];

// POST /api/seed - Seed the database with Indian grocery products
export async function POST() {
  try {
    await dbConnect();

    // Clear all existing products before re-seeding
    await Product.deleteMany({});

    // Insert fresh seed data
    const products = await Product.insertMany(indianGroceryProducts);

    logger.info('POST /api/seed', `Seeded ${products.length} products successfully`);

    return NextResponse.json(
      {
        success: true,
        message: `✅ Database seeded with ${products.length} realistic Indian grocery products!`,
        count: products.length,
        categories: [...new Set(indianGroceryProducts.map(p => p.category))],
      },
      { status: 201 }
    );
  } catch (error) {
    logger.error('POST /api/seed', 'Failed to seed database', error);
    return NextResponse.json(
      { success: false, message: 'Failed to seed database. Check server logs.' },
      { status: 500 }
    );
  }
}

// GET /api/seed - Check seed status
export async function GET() {
  try {
    await dbConnect();
    const count = await Product.countDocuments();
    return NextResponse.json(
      {
        success: true,
        message: `Database has ${count} products. POST to /api/seed to reseed.`,
        count,
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error('GET /api/seed', 'Failed to check seed status', error);
    return NextResponse.json(
      { success: false, message: 'Failed to check seed status.' },
      { status: 500 }
    );
  }
}
