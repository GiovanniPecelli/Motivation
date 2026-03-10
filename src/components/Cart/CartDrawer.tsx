import React from 'react'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../../contexts/CartContext'
import { formatPrice } from '../../utils/format'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cartItems, loading, updateQuantity, removeFromCart, cartTotal } = useCart()

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeFromCart(productId)
    } else {
      await updateQuantity(productId, newQuantity)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Carrello</h2>
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
                <div className="text-gray-500">Caricamento...</div>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500 mb-4">Il tuo carrello è vuoto</div>
                <button
                  onClick={onClose}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Continua lo shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                      {item.products.image_urls && item.products.image_urls.length > 0 ? (
                        <img
                          src={item.products.image_urls[0]}
                          alt={item.products.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">{item.products.name}</h3>
                      <p className="text-gray-600 text-sm">{formatPrice(item.products.price)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                        disabled={item.quantity >= item.products.stock_quantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-1 hover:bg-red-100 text-red-600 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Totale:</span>
                <span className="font-bold text-lg">{formatPrice(cartTotal)}</span>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Procedi al checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
