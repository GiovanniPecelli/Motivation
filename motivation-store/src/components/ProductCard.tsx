import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { cn } from '../utils/cn';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className={cn("product-card group", className)}>
      <div className="relative">
        {/* Product Image */}
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square bg-primary-50 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-accent-600 text-white text-xs px-2 py-1 rounded">
              NEW
            </span>
          )}
          {product.isSale && (
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-primary-50 transition-colors">
            <Heart className="h-4 w-4 text-primary-700" />
          </button>
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-primary-50 transition-colors">
            <ShoppingCart className="h-4 w-4 text-primary-700" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <p className="text-xs text-primary-500 uppercase tracking-wide mb-1">
            {product.category}
          </p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-primary-900 hover:text-accent-600 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary-900">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-primary-500 line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 3).map((color, index) => (
              <div
                key={index}
                className={cn(
                  "w-4 h-4 rounded-full border-2 border-white shadow-sm",
                  color.toLowerCase() === 'black' && "bg-black",
                  color.toLowerCase() === 'white' && "bg-white",
                  color.toLowerCase() === 'gray' && "bg-gray-400",
                  color.toLowerCase() === 'navy' && "bg-blue-900",
                  color.toLowerCase() === 'pink' && "bg-pink-400",
                  color.toLowerCase() === 'purple' && "bg-purple-400",
                  color.toLowerCase() === 'blue' && "bg-blue-400",
                  color.toLowerCase() === 'red' && "bg-red-500",
                  color.toLowerCase() === 'charcoal' && "bg-gray-700"
                )}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-primary-500">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
