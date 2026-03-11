import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Crown, ChevronDown, ShoppingBag, Users } from 'lucide-react';
import logoRemoveBg from '../assets/logo-removebg-preview.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSimpleRole } from '../contexts/SimpleRoleContext';
import { CartDrawer } from './Cart/CartDrawer';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const adminPanelRef = useRef<HTMLDivElement>(null)
  const { profile } = useAuth()
  const { cartCount } = useCart()
  const { isHost } = useSimpleRole()
  const navigate = useNavigate();

  // Close admin panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminPanelRef.current && !adminPanelRef.current.contains(event.target as Node)) {
        setIsAdminPanelOpen(false)
      }
    }

    if (isAdminPanelOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAdminPanelOpen])

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 w-full">
      {/* Top Banner - Full Width */}
      <div className="bg-primary-900 text-white text-center py-3 text-sm w-full">
        <span className="font-medium tracking-wide">PUSH YOUR LIMITS • EXCEED YOUR EXPECTATIONS • UNLOCK YOUR POTENTIAL</span>
      </div>

      <div className="w-full px-4">

        {/* Main Header */}
        <div className="flex items-center justify-between py-4 w-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src={logoRemoveBg}
                alt="Motivation"
                className="h-10 w-auto"
              />
              <div className="hidden md:flex items-center">
                <div className="h-8 w-px bg-gray-300 mr-3"></div>
                <span className="text-2xl font-bold tracking-wider text-primary-900 font-sans uppercase">
                  MOTIVATION
                </span>
              </div>
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {profile ? (
              <div className="flex items-center space-x-2">
                {/* Admin Panel Dropdown - Solo per Host */}
                {isHost && (
                  <div className="relative" ref={adminPanelRef}>
                    <button
                      onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                      className="flex items-center space-x-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg transition-colors border border-yellow-300"
                      title="Admin Panel"
                    >
                      <Crown className="h-5 w-5 text-yellow-700" />
                      <span className="hidden md:block text-sm font-medium text-yellow-800">
                        Admin Panel
                      </span>
                      <ChevronDown className="h-4 w-4 text-yellow-600" />
                    </button>
                    
                    {isAdminPanelOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Store Management</p>
                        </div>
                        <Link
                          to="/host/products"
                          onClick={() => setIsAdminPanelOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                          Manage Products
                        </Link>
                        <Link
                          to="/host/users"
                          onClick={() => setIsAdminPanelOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Users className="h-4 w-4 mr-3 text-gray-400" />
                          Manage Users
                        </Link>
                        <Link
                          to="/host/collections"
                          onClick={() => setIsAdminPanelOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                          Manage Collections
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                {/* CTA Scopri Prodotti */}
                <Link 
                  to="/products" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                >
                  Discover Products
                </Link>
                
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                  title="Profile"
                >
                  <User className="h-6 w-6 text-primary-700" />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {profile.full_name || profile.email}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      {isHost ? 'Host' : 'Customer'}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <>
                <Link 
                  to="/products" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-sm"
                >
                  Discover Products
                </Link>
                <button 
                  onClick={() => navigate('/auth')}
                  className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Login"
                >
                  <User className="h-6 w-6 text-primary-700" />
                  <span className="hidden md:block text-sm font-medium text-primary-700">
                    Login
                  </span>
                </button>
              </>
            )}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors relative"
              title="Cart"
            >
              <ShoppingCart className="h-6 w-6 text-primary-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>
            <button
              className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
