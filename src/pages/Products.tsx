import { useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import { Filter, Grid, List, Search } from 'lucide-react';

export function Products() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search query
  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Search */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary-900 mb-2">
            All Products
          </h1>
          <p className="text-primary-600 mb-6">
            Discover our complete collection of athletic apparel and accessories
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-12 border border-primary-200 rounded-lg focus:outline-none focus:border-accent-500 focus:ring-2 focus:ring-accent-500/20"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-primary-400" />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-primary-600">
                Searching for: "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-primary-900">Filters</h3>
                <button
                  className="lg:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-5 w-5" />
                </button>
              </div>

              <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Categories */}
                <div>
                  <h4 className="font-medium text-primary-900 mb-3">Categories</h4>
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
                  <h4 className="font-medium text-primary-900 mb-3">Price</h4>
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
                  <h4 className="font-medium text-primary-900 mb-3">Size</h4>
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
                  <h4 className="font-medium text-primary-900 mb-3">Color</h4>
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
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-primary-600">
                {filteredProducts.length} products found
                {searchQuery && ` for "${searchQuery}"`}
              </div>
              
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-primary-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-accent-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                
                <div className="flex border border-primary-300 rounded">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-accent-500 text-white' : 'text-primary-600'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-accent-500 text-white' : 'text-primary-600'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-primary-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary-900 mb-2">
                  No products found
                </h3>
                <p className="text-primary-600">
                  {searchQuery 
                    ? `No products match "${searchQuery}". Try a different search term.`
                    : 'No products available at the moment.'
                  }
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-accent-600 hover:text-accent-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}

            {/* Products */}
            {filteredProducts.length > 0 && (
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

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button className="px-3 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">
                  Previous
                </button>
                <button className="px-3 py-2 bg-accent-500 text-white rounded">1</button>
                <button className="px-3 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">2</button>
                <button className="px-3 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">3</button>
                <button className="px-3 py-2 border border-primary-300 rounded text-primary-600 hover:bg-primary-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
