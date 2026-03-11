import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/format'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-500">Loading your cart...</div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">Your cart is empty</div>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.product_variants?.images && item.product_variants.images.length > 0 ? (
                        <img
                          src={item.product_variants.images[0]}
                          alt={item.products.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center p-2">
                          No variant image
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-gray-900 truncate">{item.products.title}</h3>
                      {item.product_variants && (
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-gray-500">Size: {item.size}</span>
                          <span className="text-xs text-gray-500">Color: {item.product_variants.color}</span>
                          <div 
                            className="w-2 h-2 rounded-full border border-gray-300"
                            style={{ backgroundColor: item.product_variants.color_hex }}
                          />
                        </div>
                      )}
                      <p className="text-blue-600 font-semibold text-sm mt-1">{formatPrice(item.products.price)}</p>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-3 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-2">
                <span className="font-bold text-gray-900">Total:</span>
                <span className="font-bold text-xl text-blue-600">{formatPrice(cartTotal)}</span>
              </div>
              <Link 
                to="/checkout"
                onClick={onClose}
                className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-blue-700 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-200 text-center block"
              >
                Proceed to checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
