import { useState } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { supabase } from '../lib/supabaseClient';
import { Product } from '../types';
import { useEffect } from 'react';

export function Gallery() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (productsError) throw productsError;

      const productsWithVariants = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: variantsData } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id);

          return {
            ...product,
            variants: variantsData || []
          };
        })
      );

      setProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-black text-primary-900 mb-4">
            MOTIVATION IN ACTION
          </h1>
          <p className="text-xl text-primary-600 mb-8">
            Explore our complete collection of athletic gear and see how athletes worldwide are pushing their limits with Motivation
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products, categories, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500"
                />
                <Search className="absolute right-4 top-3.5 h-5 w-5 text-primary-400" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-primary-300 rounded px-4 py-3 focus:outline-none focus:border-accent-500"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="category">Category</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex border border-primary-300 rounded">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-accent-500 text-white' : 'text-primary-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 ${viewMode === 'list' ? 'bg-accent-500 text-white' : 'text-primary-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-3 border border-primary-300 rounded-lg text-primary-600 hover:bg-primary-50 flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {searchQuery && (
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-primary-600">Active filters:</span>
              <span className="px-3 py-1 bg-accent-100 text-accent-700 rounded-full text-sm">
                Search: "{searchQuery}"
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-sm text-primary-500 hover:text-primary-700"
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Filters Sidebar (Collapsible) */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <h4 className="font-semibold text-primary-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">MEN</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">WOMEN</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">ACCESSORIES</span>
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold text-primary-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">$0 - $25</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">$25 - $50</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">$50 - $100</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm">Over $100</span>
                  </label>
                </div>
              </div>

              {/* Size */}
              <div>
                <h4 className="font-semibold text-primary-900 mb-3">Size</h4>
                <div className="grid grid-cols-3 gap-2">
                  {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <label key={size} className="flex items-center justify-center">
                      <input type="checkbox" className="sr-only" />
                      <span className="border border-primary-300 rounded px-2 py-1 text-sm text-center cursor-pointer hover:border-accent-500">
                        {size}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div>
                <h4 className="font-semibold text-primary-900 mb-3">Color</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="w-4 h-4 bg-black rounded-full mr-2"></span>
                    <span className="text-sm">Black</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="w-4 h-4 bg-white border border-gray-300 rounded-full mr-2"></span>
                    <span className="text-sm">White</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="w-4 h-4 bg-gray-400 rounded-full mr-2"></span>
                    <span className="text-sm">Gray</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-primary-600">
            {filteredProducts.length} products found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-600"></div>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-primary-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-primary-900 mb-2">
              No products found
            </h3>
            <p className="text-primary-600 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn-primary"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-accent-500 text-white rounded">1</button>
              <button className="px-4 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">2</button>
              <button className="px-4 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">3</button>
              <button className="px-4 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
