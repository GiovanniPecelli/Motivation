import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Crown } from 'lucide-react';
import { categories } from '../data/mockData';
import logoRemoveBg from '../assets/logo-removebg-preview.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useSimpleRole } from '../contexts/SimpleRoleContext';
import { CartDrawer } from './Cart/CartDrawer';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState<string | null>(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { profile } = useAuth()
  const { cartCount } = useCart()
  const { isHost } = useSimpleRole()
  const navigate = useNavigate();

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
                      {isHost ? (
                        <>
                          <Crown className="h-3 w-3 mr-1 text-yellow-500" />
                          Host
                        </>
                      ) : (
                        'Cliente'
                      )}
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
        <nav className="hidden md:flex border-t border-primary-100 w-full">
          <div className="flex space-x-8 w-full justify-center">
            {categories.map((category) => (
              <div
                key={category.id}
                className="relative"
                onMouseEnter={() => setIsCategoryOpen(category.id)}
                onMouseLeave={() => setIsCategoryOpen(null)}
              >
                <button className="nav-link py-4 flex items-center space-x-1">
                  <span>{category.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isCategoryOpen === category.id && category.subcategories && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-lg min-w-[200px] py-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        to={`/${category.slug}/${subcategory.slug}`}
                        className="block px-4 py-2 text-primary-700 hover:bg-primary-50 hover:text-accent-600 transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-100 py-4 w-full">
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    className="w-full text-left nav-link py-2"
                    onClick={() => setIsCategoryOpen(
                      isCategoryOpen === category.id ? null : category.id
                    )}
                  >
                    {category.name}
                  </button>
                  {isCategoryOpen === category.id && category.subcategories && (
                    <div className="pl-4 space-y-2">
                      {category.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.id}
                          to={`/${category.slug}/${subcategory.slug}`}
                          className="block py-1 text-primary-600 hover:text-accent-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}
