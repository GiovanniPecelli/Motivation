import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useSimpleRole } from '../contexts/SimpleRoleContext';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

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
  is_featured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [isFeatured, setIsFeatured] = useState(product.is_featured);
  const { isHost } = useSimpleRole();
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  
  const selectedVariant = product.variants[selectedVariantIndex];
  const mainImage = (selectedVariant?.images && selectedVariant.images.length > 0) 
    ? selectedVariant.images[0] 
    : '/placeholder-product.jpg';
  
  const totalStock = selectedVariant ? 
    (selectedVariant.stock_s || 0) + (selectedVariant.stock_m || 0) + (selectedVariant.stock_l || 0) + (selectedVariant.stock_xl || 0) : 0;

  const handleQuickAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!selectedVariant || totalStock <= 0) return;

    // Find first size with stock (prefer M)
    let size = '';
    if (selectedVariant.stock_m > 0) size = 'M';
    else if (selectedVariant.stock_s > 0) size = 'S';
    else if (selectedVariant.stock_l > 0) size = 'L';
    else if (selectedVariant.stock_xl > 0) size = 'XL';

    if (!size) return;

    try {
      const { error } = await addToCart(product.id, selectedVariant.id, size, 1);
      if (error) {
        showNotification('Error adding to cart: ' + (error.message || error), 'error');
      } else {
        showNotification(`Added ${product.title} (${selectedVariant.color}, ${size}) to cart!`, 'success');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Error adding to cart', 'error');
    }
  };

  const handleToggleFeatured = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const newFeaturedStatus = !isFeatured;
      const { error } = await supabase
        .from('products')
        .update({ is_featured: newFeaturedStatus })
        .eq('id', product.id);

      if (error) throw error;
      setIsFeatured(newFeaturedStatus);
    } catch (error) {
      console.error('Error toggling featured status:', error);
      showNotification('Error updating product', 'error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="block relative">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square bg-gray-100 overflow-hidden relative">
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {totalStock === 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
        </Link>

        {isHost && (
          <button 
            className={`absolute top-3 left-3 z-30 p-2.5 rounded-full shadow-xl backdrop-blur-md transition-all duration-300 border-2 ${
              isFeatured 
                ? 'bg-yellow-400 border-yellow-300 text-white scale-110 hover:scale-115' 
                : 'bg-white/90 border-transparent text-gray-400 hover:text-yellow-500 hover:scale-110'
            }`}
            onClick={handleToggleFeatured}
            title={isFeatured ? "Remove from featured products" : "Mark as featured"}
          >
            <Star className={`h-5 w-5 ${isFeatured ? 'fill-current' : ''}`} />
            <span className="sr-only">{isFeatured ? 'Featured' : 'Mark as featured'}</span>
          </button>
        )}

        <div className={`absolute bottom-3 right-3 flex flex-col gap-2 transition-opacity duration-300 ${isHost ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <button 
            className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 transition-all text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleQuickAdd}
            disabled={totalStock === 0}
            title="Add to cart"
          >
            <ShoppingCart className={`h-5 w-5 ${totalStock > 0 ? 'text-gray-700' : 'text-gray-400'}`} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {product.category}
        </p>
        
        <Link to={`/products/${product.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        <p className="text-lg font-bold text-gray-900 mb-3">
          €{product.price.toFixed(2)}
        </p>

        {product.variants.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Colors:</span>
            <div className="flex gap-1.5">
              {product.variants.map((variant, index) => {
                const isSelected = index === selectedVariantIndex;
                const hasStock = (variant.stock_s || 0) + (variant.stock_m || 0) + (variant.stock_l || 0) + (variant.stock_xl || 0) > 0;
                
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
                    title={`${variant.color} ${!hasStock ? '(Out of stock)' : ''}`}
                    disabled={!hasStock}
                  />
                );
              })}
            </div>
          </div>
        )}

        {totalStock > 0 && totalStock < 5 && (
          <p className="text-xs text-red-600 mt-2">
            Only {totalStock} available
          </p>
        )}
      </div>
    </div>
  );
}
