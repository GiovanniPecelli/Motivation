import { Product, Category } from '../types';

export const categories: Category[] = [
  {
    id: '1',
    name: 'MEN',
    slug: 'men',
    subcategories: [
      { id: '1-1', name: 'T-Shirts & Tanks', slug: 't-shirts-tanks' },
      { id: '1-2', name: 'Pants & Shorts', slug: 'pants-shorts' },
      { id: '1-3', name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
      { id: '1-4', name: 'Motivation Pro', slug: 'motivation-pro' },
    ]
  },
  {
    id: '2',
    name: 'WOMEN',
    slug: 'women',
    subcategories: [
      { id: '2-1', name: 'Leggings & Shorts', slug: 'leggings-shorts' },
      { id: '2-2', name: 'Sports Bras & Tops', slug: 'sports-bras-tops' },
      { id: '2-3', name: 'T-Shirts & Crop Tops', slug: 't-shirts-crop-tops' },
      { id: '2-4', name: 'Hoodies & Sweatshirts', slug: 'hoodies-sweatshirts' },
      { id: '2-5', name: 'Motivation Pro', slug: 'motivation-pro' },
    ]
  },
  {
    id: '3',
    name: 'ACCESSORIES',
    slug: 'accessories',
    subcategories: [
      { id: '3-1', name: 'Wrist Wraps & Tape', slug: 'wrist-wraps-tape' },
      { id: '3-2', name: 'Knee & Elbow Sleeves', slug: 'knee-elbow-sleeves' },
      { id: '3-3', name: 'Grips & Straps', slug: 'grips-straps' },
      { id: '3-4', name: 'Belts & Lever Belts', slug: 'belts-lever-belts' },
      { id: '3-5', name: 'Socks & Lifestyle', slug: 'socks-lifestyle' },
      { id: '3-6', name: 'Backpacks', slug: 'backpacks' },
      { id: '3-7', name: 'Patches', slug: 'patches' },
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Motivation Performance T-Shirt',
    price: 29.99,
    originalPrice: 39.99,
    images: ['/api/placeholder/400/500'],
    category: 'MEN',
    subcategory: 'T-Shirts & Tanks',
    description: 'High-performance t-shirt designed for intense training sessions',
    colors: ['Black', 'White', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    isSale: true
  },
  {
    id: '2',
    name: 'Motivation Sports Bra',
    price: 34.99,
    images: ['/api/placeholder/400/500'],
    category: 'WOMEN',
    subcategory: 'Sports Bras & Tops',
    description: 'Supportive sports bra for medium to high impact activities',
    colors: ['Black', 'Pink', 'Purple'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isNew: true
  },
  {
    id: '3',
    name: 'Motivation Training Backpack',
    price: 79.99,
    images: ['/api/placeholder/400/500'],
    category: 'ACCESSORIES',
    subcategory: 'Backpacks',
    description: 'Durable backpack with multiple compartments for gym essentials',
    colors: ['Black', 'Gray'],
    inStock: true,
    isNew: true
  },
  {
    id: '4',
    name: 'Motivation Lever Belt',
    price: 89.99,
    images: ['/api/placeholder/400/500'],
    category: 'ACCESSORIES',
    subcategory: 'Belts & Lever Belts',
    description: 'Professional-grade lever belt for heavy lifting',
    colors: ['Black', 'Blue'],
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: '5',
    name: 'Motivation Training Shorts',
    price: 24.99,
    originalPrice: 34.99,
    images: ['/api/placeholder/400/500'],
    category: 'MEN',
    subcategory: 'Pants & Shorts',
    description: 'Comfortable training shorts with moisture-wicking fabric',
    colors: ['Black', 'Gray', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
    isSale: true
  },
  {
    id: '6',
    name: 'Motivation Leggings',
    price: 44.99,
    images: ['/api/placeholder/400/500'],
    category: 'WOMEN',
    subcategory: 'Leggings & Shorts',
    description: 'High-waisted leggings with compression fit',
    colors: ['Black', 'Charcoal'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
    isNew: true
  },
  {
    id: '7',
    name: 'Motivation Wrist Wraps',
    price: 19.99,
    images: ['/api/placeholder/400/500'],
    category: 'ACCESSORIES',
    subcategory: 'Wrist Wraps & Tape',
    description: 'Supportive wrist wraps for heavy lifting',
    colors: ['Black', 'Red', 'Blue'],
    inStock: true
  },
  {
    id: '8',
    name: 'Motivation Hoodie',
    price: 54.99,
    images: ['/api/placeholder/400/500'],
    category: 'MEN',
    subcategory: 'Hoodies & Sweatshirts',
    description: 'Comfortable hoodie perfect for warm-up and recovery',
    colors: ['Black', 'Gray', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  }
];
