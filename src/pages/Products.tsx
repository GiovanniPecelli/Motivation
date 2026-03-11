import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, Package } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Variant {
  id: string;
  color: string;
  color_hex: string;
  images: string[];
  stock_s: number;
  stock_m: number;
  stock_l: number;
  stock_xl: number;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  tags?: string[];
  collection?: string;
  variants: Variant[];
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  product_count: number;
  display_order: number;
  created_at: string;
}

export function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [availableColors, setAvailableColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch products and collections
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with variants
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (productsError) {
        console.error('Products error:', productsError);
        throw productsError;
      }

      console.log('Products data:', productsData);
      console.log('Number of products:', productsData?.length || 0);

      // Fetch variants for each product
      const productsWithVariants = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id);

          if (variantsError) {
            console.error('Variants error for product', product.id, variantsError);
          }

          console.log('Variants for product', product.id, variantsData);

          return {
            ...product,
            variants: variantsData || []
          };
        })
      );

      setProducts(productsWithVariants);
      console.log('Final products with variants:', productsWithVariants);
      
      // Fetch collections separately
      const { data: collectionsData, error: collectionsError } = await supabase
        .from('collections')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (collectionsError) {
        console.error('Collections error:', collectionsError);
      } else {
        console.log('Collections data:', collectionsData);
        setCollections(collectionsData || []);
      }
      
      // Extract available tags and colors
      const allTags = new Set<string>();
      const allColors = new Set<string>();
      const collectionsMap = new Map<string, number>();

      productsWithVariants.forEach(product => {
        console.log('Processing product:', product.title, product);
        
        // Add hardcoded tags based on product title
        if (product.title.includes('Original Motivation')) {
          allTags.add('fitness');
          allTags.add('sport');
        } else if (product.title.includes('Motivation Pro')) {
          allTags.add('premium');
          allTags.add('professional');
        } else if (product.title.includes('Motivation Sport')) {
          allTags.add('workout');
          allTags.add('athletic');
        }
        
        // Count collections
        if (product.collection) {
          collectionsMap.set(product.collection, (collectionsMap.get(product.collection) || 0) + 1);
        }
        
        // Extract tags from database if available
        product.tags?.forEach((tag: string) => allTags.add(tag));
        
        // Extract colors from variants
        product.variants?.forEach((variant: Variant) => {
          console.log('Found variant color:', variant.color);
          // Only add colors that are not empty, null, or undefined
          if (variant.color && variant.color.trim() !== '') {
            allColors.add(variant.color.trim());
          }
        });
        
        // Debug: Show all variants for this product
        console.log(`All variants for ${product.title}:`, product.variants);
      });

      console.log('Available tags:', Array.from(allTags));
      console.log('Available colors:', Array.from(allColors));
      console.log('Collections:', Array.from(collectionsMap.entries()));

      setAvailableTags(Array.from(allTags).sort());
      setAvailableColors(Array.from(allColors).sort());
      
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on all criteria
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCollection = selectedCollection === '' || product.collection === selectedCollection;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.some(tag => product.tags?.includes(tag));
    
    const matchesColors = selectedColors.length === 0 ||
      selectedColors.some(color => 
        product.variants?.some(variant => variant.color === color)
      );

    return matchesSearch && matchesCollection && matchesTags && matchesColors;
  });

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Toggle color selection
  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) 
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCollection('');
    setSelectedTags([]);
    setSelectedColors([]);
    setSearchQuery('');
  };

  // Get color hex code
  const getColorHex = (colorName: string) => {
    const colorMap: Record<string, string> = {
      // Italian colors
      'Nero': '#000000',
      'Bianco': '#FFFFFF',
      'Grigio': '#808080',
      'Grigia': '#808080',
      'Blu': '#0000FF',
      'Rosso': '#FF0000',
      'Verde': '#008000',
      'Giallo': '#FFFF00',
      'Arancione': '#FFA500',
      'Viola': '#800080',
      'Rosa': '#FFC0CB',
      'Marrone': '#8B4513',
      'Beige': '#F5F5DC',
      // English colors
      'Black': '#000000',
      'White': '#FFFFFF',
      'Gray': '#808080',
      'Grey': '#808080',
      'Blue': '#0000FF',
      'Red': '#FF0000',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Orange': '#FFA500',
      'Purple': '#800080',
      'Pink': '#FFC0CB',
      'Brown': '#8B4513',
      // Common variations and abbreviations
      'Nera': '#000000',
      'Bianca': '#FFFFFF',
      'WHITE': '#FFFFFF',
      'BLACK': '#000000',
      'white': '#FFFFFF',
      'black': '#000000',
      'gray': '#808080',
      'grey': '#808080',
      'blue': '#0000FF',
      'red': '#FF0000',
      'green': '#008000',
      'yellow': '#FFFF00',
      'orange': '#FFA500',
      'purple': '#800080',
      'pink': '#FFC0CB',
      'brown': '#8B4513',
      'beige': '#F5F5DC',
      // Additional common colors
      'Silver': '#C0C0C0',
      'Gold': '#FFD700',
      'Navy': '#000080',
      'Teal': '#008080',
      'Lime': '#00FF00',
      'Cyan': '#00FFFF',
      'Magenta': '#FF00FF',
      'Olive': '#808000',
      'Maroon': '#800000',
      'Aqua': '#00FFFF',
      'Fuchsia': '#FF00FF',
    };
    return colorMap[colorName] || '#CCCCCC';
  };

  // Get featured collections (first 3)
  const featuredCollections = collections.slice(0, 3);
  const otherCollections = collections.slice(3);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            All Products
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover our complete collection of athletic apparel and accessories
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mb-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <Search className="absolute right-4 top-3.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-6">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              Filters
              {(selectedCollection || selectedTags.length > 0 || selectedColors.length > 0) && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {1 + selectedTags.length + selectedColors.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Featured Collections */}
        {featuredCollections.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Featured Collections
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {featuredCollections.map((collection) => (
                <div 
                  key={collection.id}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedCollection(collection.name)}
                >
                  {/* Banner Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    {collection.banner_url ? (
                      <img 
                        src={collection.banner_url} 
                        alt={collection.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <Package className="h-12 w-12 text-white opacity-50" />
                      </div>
                    )}
                    
                    {/* Overlay with collection name */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold mb-2">{collection.name}</h3>
                        <p className="text-sm opacity-90">{collection.product_count} products</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Collection Info */}
                  <div className="text-center">
                    <p className="text-gray-600 text-sm mb-2">
                      {collection.description}
                    </p>
                    <button
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedCollection === collection.name
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {selectedCollection === collection.name ? 'Selected' : 'Discover'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Collections Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Collections</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCollection('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCollection === '' 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All products
                  <span className="block text-xs opacity-75 mt-1">
                    {products.length} products
                  </span>
                </button>
                {otherCollections.map((collection) => (
                  <button
                    key={collection.id}
                    onClick={() => setSelectedCollection(collection.name)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCollection === collection.name 
                        ? 'bg-blue-500 text-white' 
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {collection.name}
                    <span className="block text-xs opacity-75 mt-1">
                      {collection.product_count} products
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className={`bg-white rounded-lg shadow-sm p-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {(selectedCollection || selectedTags.length > 0 || selectedColors.length > 0) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              {/* Tags Filter */}
              {availableTags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Tags</h4>
                  <div className="space-y-2">
                    {availableTags.map((tag) => (
                      <label key={tag} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="mr-2"
                        />
                        <span className="text-sm">{tag}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors Filter */}
              {availableColors.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
                  <div className="space-y-2">
                    {availableColors.filter(color => color && color.trim() !== '').map((color) => (
                      <label key={color} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedColors.includes(color)}
                          onChange={() => toggleColor(color)}
                          className="mr-2"
                        />
                        <span 
                          className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                          style={{ backgroundColor: getColorHex(color) }}
                        />
                        <span className="text-sm">{color}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>


          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600">
                  {loading ? 'Loading...' : (
                    <>
                      {filteredProducts.length} products
                      {searchQuery && ` for "${searchQuery}"`}
                      {selectedCollection && ` in ${selectedCollection}`}
                      {selectedTags.length > 0 && ` with ${selectedTags.join(', ')}`}
                      {selectedColors.length > 0 && ` in ${selectedColors.join(', ')}`}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* No Results */}
            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  The selected filters do not match any products.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading products...</p>
              </div>
            )}

            {/* Products */}
            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
