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

export const mockProducts: Product[] = [];
