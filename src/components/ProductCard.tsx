import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Variant {
  id: string;
  color: string;
  color_hex: string;
  images: string[];
  stock_s: number;
  stock_m: number;
  stock_l: number;
  stock_xl: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  variants: Variant[];
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  
  const selectedVariant = product.variants[selectedVariantIndex];
  const mainImage = selectedVariant?.images[0] || '/placeholder-product.jpg';
  const totalStock = selectedVariant ? 
    selectedVariant.stock_s + selectedVariant.stock_m + selectedVariant.stock_l + selectedVariant.stock_xl : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick add to cart
    console.log('Quick add:', product.id, selectedVariant.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      {/* Product Image */}
      <Link to={`/products/${product.id}`} className="block relative">
        <div className="aspect-square bg-gray-100 overflow-hidden relative">
          <img
            src={mainImage}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Stock badge */}
          {totalStock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Esaurito
              </span>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
            onClick={handleQuickAdd}
            disabled={totalStock === 0}
          >
            <ShoppingCart className={`h-4 w-4 ${totalStock > 0 ? 'text-gray-700' : 'text-gray-400'}`} />
          </button>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <p className="text-lg font-bold text-gray-900 mb-3">
          €{product.price.toFixed(2)}
        </p>

        {/* Color Variants */}
        {product.variants.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Colori:</span>
            <div className="flex gap-1.5">
              {product.variants.map((variant, index) => {
                const isSelected = index === selectedVariantIndex;
                const hasStock = variant.stock_s + variant.stock_m + variant.stock_l + variant.stock_xl > 0;
                
                return (
                  <button
                    key={variant.id}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantIndex(index);
                    }}
                    className={`
                      w-6 h-6 rounded-full border-2 transition-all
                      ${isSelected ? 'border-blue-600 scale-110' : 'border-gray-200 hover:border-gray-400'}
                      ${!hasStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    style={{ backgroundColor: variant.color_hex || '#ccc' }}
                    title={`${variant.color} ${!hasStock ? '(Esaurito)' : ''}`}
                    disabled={!hasStock}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Stock info */}
        {totalStock > 0 && totalStock < 5 && (
          <p className="text-xs text-red-600 mt-2">
            Solo {totalStock} disponibili
          </p>
        )}
      </div>
    </div>
  );
}
