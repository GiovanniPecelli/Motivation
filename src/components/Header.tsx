import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Crown, ChevronDown, ShoppingBag, Users } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import logoRemoveBg from '../assets/logo-removebg-preview.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSimpleRole } from '../contexts/SimpleRoleContext';
import { CartDrawer } from './Cart/CartDrawer';

const supabaseUrl = 'https://yvggfomvwhymodadcbtq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z2dmb212d2h5bW9kYWRjYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE5MTMsImV4cCI6MjA4ODczNzkxM30.QqD2uwh3-25db-71VC43YbeMV3pcvmBLa_J8KOrIdo0'
const supabase = createClient(supabaseUrl, supabaseKey)

interface DynamicCategory {
  name: string
  slug: string
  count: number
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [dynamicCategories, setDynamicCategories] = useState<DynamicCategory[]>([])
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

  useEffect(() => {
    loadDynamicCategories()
  }, [])

  const loadDynamicCategories = async () => {
    try {
      // Fetch products and count by category
      const { data, error } = await supabase
        .from('products')
        .select('category')

      if (error) {
        console.error('Error loading categories:', error)
        return
      }

      if (!data) return

      // Category name mapping (slug -> display name)
      const categoryNames: Record<string, string> = {
        't-shirts': 'T-Shirt',
        'hoodies': 'Felpe',
        'pants': 'Pantaloni',
        'accessories': 'Accessori'
      }

      // Group by category and count
      const categoryMap = new Map<string, number>()
      
      data.forEach(product => {
        const categoryName = product.category
        categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
      })

      // Convert to array with display names
      const categories = Array.from(categoryMap.entries())
        .map(([slug, count]) => ({
          name: categoryNames[slug] || slug,
          slug: slug,
          count
        }))
        .sort((a, b) => b.count - a.count)

      setDynamicCategories(categories)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

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
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Gestione Negozio</p>
                        </div>
                        <Link
                          to="/host/products"
                          onClick={() => setIsAdminPanelOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ShoppingBag className="h-4 w-4 mr-3 text-gray-400" />
                          Gestisci Prodotti
                        </Link>
                        <Link
                          to="/host/users"
                          onClick={() => setIsAdminPanelOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Users className="h-4 w-4 mr-3 text-gray-400" />
                          Gestisci Utenti
                        </Link>
                      </div>
                    )}
                  </div>
                )}
                
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 p-2 hover:bg-primary-50 rounded-lg transition-colors group"
                  title="Profilo"
                >
                  <User className="h-6 w-6 text-primary-700" />
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-900 group-hover:text-primary-700">
                      {profile.full_name || profile.email}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center">
                      {isHost ? 'Host' : 'Cliente'}
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
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
            )}
            <button 
              onClick={() => setIsCartOpen(true)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors relative"
              title="Carrello"
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

        {/* Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-gray-100">
          {/* Link Tutti i Prodotti - fisso */}
          <Link 
            to="/products" 
            className="text-gray-700 hover:text-primary-700 transition-colors font-medium"
          >
            Tutti i Prodotti
          </Link>

          {/* Dynamic Categories */}
          {dynamicCategories.map((category) => (
            <div key={category.slug} className="relative group">
              <Link
                to={`/products?category=${category.slug}`}
                className="flex items-center text-gray-700 hover:text-primary-700 transition-colors font-medium"
              >
                {category.name}
                <span className="ml-1 text-xs text-gray-500">({category.count})</span>
              </Link>
            </div>
          ))}
        </nav>
      
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {/* Tutti i Prodotti - fisso */}
            <Link
              to="/products"
              className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-md font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Tutti i Prodotti
            </Link>

            {/* Dynamic Categories Mobile */}
            {dynamicCategories.map((category) => (
              <Link
                key={category.slug}
                to={`/products?category=${category.slug}`}
                className="block px-3 py-2 text-gray-700 hover:text-primary-700 hover:bg-gray-50 rounded-md font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name} ({category.count})
              </Link>
            ))}
          </div>
        </div>
      )}
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
