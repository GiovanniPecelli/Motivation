export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
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
