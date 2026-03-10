import { ShoppingCart } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'

export function CartIcon() {
  const { cartCount } = useCart()

  return (
    <div className="relative">
      <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-gray-900 cursor-pointer" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount > 99 ? '99+' : cartCount}
        </span>
      )}
    </div>
  )
}
