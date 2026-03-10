import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  tags?: string[]
  is_active: boolean
  created_at: string
}

interface ProductVariant {
  id: string
  product_id: string
  color: string
  color_hex: string
  stock_s: number
  stock_m: number
  stock_l: number
  stock_xl: number
  images: string[]
}

export function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { profile } = useAuth()
  
  const [product, setProduct] = useState<Product | null>(null)
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('M')
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const sizes = ['S', 'M', 'L', 'XL']

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setIsLoading(true)
      
      // Load product
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (productError) throw productError
      setProduct(productData)

      // Load variants
      const { data: variantsData, error: variantsError } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', id)

      if (variantsError) throw variantsError
      setVariants(variantsData || [])
      
      // Set first variant as default
      if (variantsData && variantsData.length > 0) {
        setSelectedVariant(variantsData[0])
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStockForSize = (variant: ProductVariant, size: string) => {
    switch (size) {
      case 'S': return variant.stock_s
      case 'M': return variant.stock_m
      case 'L': return variant.stock_l
      case 'XL': return variant.stock_xl
      default: return 0
    }
  }

  const getTotalStock = () => {
    if (!selectedVariant) return 0
    return selectedVariant.stock_s + selectedVariant.stock_m + selectedVariant.stock_l + selectedVariant.stock_xl
  }

  const getCurrentStock = () => {
    if (!selectedVariant) return 0
    return getStockForSize(selectedVariant, selectedSize)
  }

  const getCurrentImages = () => {
    return selectedVariant?.images || []
  }

  const handleAddToCart = async () => {
    if (!selectedVariant || !product || getCurrentStock() <= 0) return
    
    setIsAddingToCart(true)
    try {
      // Simplified add to cart
      console.log('Adding to cart:', {
        product_id: product.id,
        variant_id: selectedVariant.id,
        quantity,
        size: selectedSize,
        color: selectedVariant.color
      })
      alert('Aggiunto al carrello! (funzionalità in sviluppo)')
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Prodotto non trovato</h1>
          <Link to="/products" className="text-blue-600 hover:text-blue-800">
            Torna ai prodotti
          </Link>
        </div>
      </div>
    )
  }

  const currentImages = getCurrentImages()
  const currentStock = getCurrentStock()
  const totalStock = getTotalStock()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-gray-700">Prodotti</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {currentImages[selectedImageIndex] ? (
                <img
                  src={currentImages[selectedImageIndex]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-lg mx-auto mb-4"></div>
                    <p className="text-gray-500">Nessuna immagine disponibile</p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {currentImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {currentImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-colors ${
                      index === selectedImageIndex 
                        ? 'border-blue-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center text-sm text-gray-500">
                  <span className={`w-2 h-2 rounded-full mr-2 ${totalStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {totalStock > 0 ? 'Disponibile' : 'Non disponibile'}
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-gray-900">€{product.price.toFixed(2)}</span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-gray-700 leading-relaxed">
                {product.description}
              </div>
            )}

            {/* Color Selection */}
            {variants.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Colore</h3>
                <div className="flex flex-wrap gap-3">
                  {variants.map(variant => {
                    const variantTotalStock = variant.stock_s + variant.stock_m + variant.stock_l + variant.stock_xl
                    return (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant)
                          setSelectedImageIndex(0)
                        }}
                        disabled={variantTotalStock <= 0}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedVariant?.id === variant.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${variantTotalStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div 
                          className="w-6 h-6 rounded border border-gray-300"
                          style={{ backgroundColor: variant.color_hex || '#000000' }}
                        ></div>
                        <span className="text-sm font-medium">{variant.color}</span>
                        {variantTotalStock <= 0 && (
                          <span className="text-xs text-red-600">(Esaurito)</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {selectedVariant && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Taglia</h3>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => {
                    const sizeStock = getStockForSize(selectedVariant, size)
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        disabled={sizeStock <= 0}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          selectedSize === size
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        } ${sizeStock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span className="text-sm font-medium">{size}</span>
                        {sizeStock <= 0 && (
                          <span className="text-xs text-red-600 block">Esaurito</span>
                        )}
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Disponibilità taglia {selectedSize}: {currentStock} pezzi
                </p>
              </div>
            )}

            {/* Quantity */}
            {selectedVariant && currentStock > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Quantità</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    disabled={quantity >= currentStock}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={!selectedVariant || currentStock <= 0 || isAddingToCart}
                className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isAddingToCart ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                ) : (
                  <ShoppingCart className="h-5 w-5 mr-2" />
                )}
                {currentStock <= 0 ? 'Non Disponibile' : 'Aggiungi al Carrello'}
              </button>

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Truck className="h-4 w-4" />
                  <span>Spedizione gratuita</span>
                </div>
                <div className="flex items-center space-x-1">
                  <RotateCcw className="h-4 w-4" />
                  <span>Resi gratuiti</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4" />
                  <span>Garanzia 2 anni</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
