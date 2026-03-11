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
  const { profile, signOut } = useAuth()
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

      <div className="w-full px-4 relative">

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
              <div className="flex items-center">
                <div className="h-8 w-px bg-gray-300 mr-3 hidden md:block"></div>
                <span className="text-xl md:text-2xl font-bold tracking-wider text-primary-900 font-sans uppercase">
                  MOTIVATION
                </span>
              </div>
            </Link>
          </div>

          {/* Nav Links - Desktop Only */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors uppercase tracking-widest">
              Discover Products
            </Link>
            {isHost && (
              <div className="relative" ref={adminPanelRef}>
                <button
                  onClick={() => setIsAdminPanelOpen(!isAdminPanelOpen)}
                  className="flex items-center space-x-1 text-sm font-medium text-yellow-700 hover:text-yellow-800 transition-colors uppercase tracking-widest py-2"
                >
                  <Crown className="h-4 w-4 mr-1" />
                  Admin
                  <ChevronDown className="h-4 w-4" />
                </button>
                
                {isAdminPanelOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-3 z-50">
                    <div className="px-5 py-2 border-b border-gray-50 mb-2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Management</p>
                    </div>
                    <Link to="/host/products" onClick={() => setIsAdminPanelOpen(false)} className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <ShoppingBag className="h-4 w-4 mr-3 opacity-70" /> Manage Products
                    </Link>
                    <Link to="/host/users" onClick={() => setIsAdminPanelOpen(false)} className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <Users className="h-4 w-4 mr-3 opacity-70" /> Manage Users
                    </Link>
                    <Link to="/host/collections" onClick={() => setIsAdminPanelOpen(false)} className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                      <ShoppingBag className="h-4 w-4 mr-3 opacity-70" /> Manage Collections
                    </Link>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Desktop Profile */}
            {profile ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                >
                  <User className="h-6 w-6 text-primary-700" />
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {profile.full_name || profile.email}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <button 
                onClick={() => navigate('/auth')}
                className="hidden md:flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-lg transition-colors"
                title="Login"
              >
                <User className="h-6 w-6 text-primary-700" />
                <span className="text-sm font-medium text-primary-700">Login</span>
              </button>
            )}

            {/* Cart Icon */}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors relative"
              title="Cart"
            >
              <ShoppingCart className="h-6 w-6 text-primary-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-primary-50 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-7 w-7 text-primary-900" /> : <Menu className="h-7 w-7 text-primary-900" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed right-0 top-0 h-full w-[85%] max-w-sm bg-white z-[70] md:hidden transform transition-transform duration-500 ease-out shadow-2xl overflow-y-auto ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full uppercase tracking-wider">
          {/* Mobile Menu Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary-900 text-white">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-md">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-lg leading-tight">
                  {profile ? (profile.full_name || profile.email) : 'Welcome'}
                </p>
                <p className="text-xs text-white/70 tracking-widest mt-0.5">
                  {profile ? (isHost ? 'Administrator' : 'Valued Customer') : 'Join the Club'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsMenuOpen(false)}>
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Mobile Menu Links */}
          <div className="flex-1 p-6 space-y-8">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Shop & Profile</p>
              <Link to="/products" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <ShoppingBag className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-700">Discover Products</span>
              </Link>
              <button 
                onClick={() => { setIsCartOpen(true); setIsMenuOpen(false); }}
                className="w-full flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <ShoppingCart className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-700">My Cart ({cartCount})</span>
              </button>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group">
                <User className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-700">My Profile</span>
              </Link>
            </div>

            {isHost && (
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-yellow-600 uppercase tracking-[0.2em] px-2">Management</p>
                <div className="grid grid-cols-1 gap-2">
                  <Link to="/host/products" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <Crown className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Products Control</span>
                  </Link>
                  <Link to="/host/collections" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <ShoppingBag className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Collections</span>
                  </Link>
                  <Link to="/host/users" onClick={() => setIsMenuOpen(false)} className="flex items-center space-x-3 p-4 rounded-xl bg-yellow-50 border border-yellow-100">
                    <Users className="h-5 w-5 text-yellow-600" />
                    <span className="font-semibold text-yellow-900">Users Control</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {profile ? (
              <button 
                onClick={() => { signOut(); setIsMenuOpen(false); }}
                className="w-full py-4 px-6 rounded-xl bg-red-50 text-red-600 font-bold border border-red-100 active:scale-95 transition-transform uppercase tracking-widest text-xs"
              >
                Logout Account
              </button>
            ) : (
              <button 
                onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                className="w-full py-4 px-6 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-200 active:scale-95 transition-transform uppercase tracking-widest text-xs"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
