import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, User } from 'lucide-react';
import { categories } from '../data/mockData';
import logoRemoveBg from '../assets/logo-removebg-preview.png';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState<string | null>(null);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Top Banner */}
        <div className="bg-primary-900 text-white text-center py-2 text-sm">
          FREE SHIPPING ON ORDERS OVER $50 | EASY RETURNS
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={logoRemoveBg} 
              alt="Motivation" 
              className="h-8 w-auto bg-transparent"
            />
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-10 border border-primary-200 rounded-lg focus:outline-none focus:border-accent-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-primary-400" />
            </div>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors">
              <User className="h-6 w-6 text-primary-700" />
            </button>
            <button className="p-2 hover:bg-primary-50 rounded-lg transition-colors relative">
              <ShoppingCart className="h-6 w-6 text-primary-700" />
              <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
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
        <nav className="hidden md:flex border-t border-primary-100">
          <div className="flex space-x-8">
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
          <div className="md:hidden border-t border-primary-100 py-4">
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
    </header>
  );
}
