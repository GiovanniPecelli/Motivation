export interface ProductVariant {
  id: string;
  product_id?: string;
  color: string;
  color_hex: string;
  images: string[];
  stock_s: number;
  stock_m: number;
  stock_l: number;
  stock_xl: number;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  collection?: string;
  is_active?: boolean;
  is_featured?: boolean;
  created_at?: string;
  created_by?: string;
  variants: ProductVariant[];
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  product_count: number;
  display_order: number;
  created_at: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
