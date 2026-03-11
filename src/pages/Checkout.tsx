import { Link } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/format'
import { ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react'
import { useNotification } from '../contexts/NotificationContext'

export function Checkout() {
  const { cartItems, cartTotal } = useCart()
  const { showNotification } = useNotification()

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-blue-600 hover:text-blue-700 flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Order Summary</h1>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex space-x-4 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                    <img 
                      src={item.product_variants?.images?.[0] || '/placeholder.jpg'} 
                      alt={item.products.title}
                      className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">{item.products.title}</h3>
                      <p className="text-sm text-gray-500">
                        {item.product_variants?.color} / {item.size} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatPrice(item.products.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 p-6 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-blue-600">{formatPrice(cartTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment</h2>
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 space-y-6">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900">Secure Payment with Stripe</h4>
                  <p className="text-sm text-blue-800 opacity-80">
                    Your payment information is encrypted and processed securely by Stripe.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => showNotification('Stripe integration coming soon!', 'info')}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-100"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay with Stripe
                </button>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>Secure SSL connection</span>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">ACCEPTED CARDS</h4>
                <div className="flex gap-2">
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-500 uppercase tracking-wider">Visa</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-500 uppercase tracking-wider">Mastercard</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-500 uppercase tracking-wider">Amex</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-xs font-bold text-gray-500 uppercase tracking-wider">Apple Pay</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
