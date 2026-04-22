import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema<IProduct> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Grains & Pulses',
        'Dairy & Eggs',
        'Fruits',
        'Vegetables',
        'Snacks',
        'Beverages',
        'Household',
        'Spices',
      ],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'],
      default: 'piece',
    },
    stock: {
      type: Number,
      required: true,
      default: 100,
      min: [0, 'Stock cannot be negative'],
    },
  },
  {
    timestamps: true,
  }
);

// Guard against model recompilation during hot reloads
const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
