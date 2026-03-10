import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Crown, Package, Plus, Edit2, Trash2, Search, Filter, X, Minus, Plus as PlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

interface Product {
  id: string
  title: string
  description: string
  price: number
  category: string
  is_active: boolean
  created_at: string
  variants?: {
    id: string
    color: string
    color_hex: string
    stock_s: number
    stock_m: number
    stock_l: number
    stock_xl: number
    images: string[]
  }[]
}

export function ManageProducts() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    if (profile && isHost) {
      fetchProducts()
    }
  }, [profile, isHost])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      
      // Fetch products created by this host
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('created_by', profile?.id)
        .order('created_at', { ascending: false })

      if (productsError) {
        console.error('Error fetching products:', productsError)
        return
      }

      // Fetch variants for each product
      const productsWithVariants = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: variantsData } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id)

          const totalStock = (variantsData || []).reduce((sum, v) => 
            sum + v.stock_s + v.stock_m + v.stock_l + v.stock_xl, 0
          )

          return {
            ...product,
            variants: variantsData || [],
            totalStock
          }
        })
      )

      setProducts(productsWithVariants)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questo prodotto?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)

      if (error) throw error

      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Errore durante l\'eliminazione')
    }
  }

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !currentStatus })
        .eq('id', productId)

      if (error) throw error

      await fetchProducts()
    } catch (error) {
      console.error('Error updating product:', error)
      alert('Errore durante l\'aggiornamento')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Gestisci Prodotti</h1>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {products.length} prodotti
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/host/dashboard"
                className="text-gray-600 hover:text-gray-900"
              >
                ← Dashboard
              </Link>
              <Link
                to="/host/add-product"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Prodotto
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cerca prodotti..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtri
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Tutte le categorie</option>
                  <option value="men">Uomo</option>
                  <option value="women">Donna</option>
                  <option value="accessories">Accessori</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Tutti gli stati</option>
                  <option value="active">Attivo</option>
                  <option value="inactive">Inattivo</option>
                  <option value="out-of-stock">Esaurito</option>
                </select>
                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500">
                  <option value="">Ordina per</option>
                  <option value="name">Nome</option>
                  <option value="price">Prezzo</option>
                  <option value="created">Data creazione</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Caricamento prodotti...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun prodotto</h3>
              <p className="text-gray-500 mb-6">
                Inizia aggiungendo il tuo primo prodotto per vedere qui l'elenco
              </p>
              <Link
                to="/host/add-product"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Prodotto
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prodotto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prezzo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Azioni
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => {
                    const mainImage = product.variants?.[0]?.images?.[0] || '/placeholder-product.jpg'
                    const totalStock = product.variants?.reduce((sum, v) => 
                      sum + v.stock_s + v.stock_m + v.stock_l + v.stock_xl, 0
                    ) || 0
                    
                    return (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img className="h-10 w-10 rounded object-cover" src={mainImage} alt={product.title} />
                            </div>
                            <div className="ml-4">
                              <Link to={`/products/${product.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                {product.title}
                              </Link>
                              <div className="text-sm text-gray-500">{product.variants?.length || 0} colori</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          €{product.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {totalStock > 0 ? (
                            <span className="text-green-600">{totalStock} disponibili</span>
                          ) : (
                            <span className="text-red-600">Esaurito</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleProductStatus(product.id, product.is_active)}
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              product.is_active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {product.is_active ? 'Attivo' : 'Inattivo'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Link 
                              to={`/products/${product.id}`}
                              className="text-blue-600 hover:text-blue-900"
                              title="Vedi pagina prodotto"
                            >
                              <Package className="h-4 w-4" />
                            </Link>
                            <Link 
                              to={`/host/edit-product/${product.id}`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Modifica prodotto"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Link>
                            <button 
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina prodotto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Stock Management Modal */}
      {isStockModalOpen && editingProduct && (
        <StockModal 
          product={editingProduct}
          onClose={() => {
            setIsStockModalOpen(false)
            setEditingProduct(null)
          }}
          onSave={() => {
            fetchProducts()
            setIsStockModalOpen(false)
            setEditingProduct(null)
          }}
        />
      )}
    </div>
  )
}

// Stock Modal Component
function StockModal({ product, onClose, onSave }: { 
  product: Product
  onClose: () => void
  onSave: () => void
}) {
  const [variants, setVariants] = useState(product.variants || [])
  const [saving, setSaving] = useState(false)

  const updateStock = (variantId: string, size: string, delta: number) => {
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v
      
      const key = `stock_${size.toLowerCase()}` as keyof typeof v
      const currentValue = (v[key] as number) || 0
      const newValue = Math.max(0, currentValue + delta)
      
      return { ...v, [key]: newValue }
    }))
  }

  const setStock = (variantId: string, size: string, value: number) => {
    setVariants(prev => prev.map(v => {
      if (v.id !== variantId) return v
      
      const key = `stock_${size.toLowerCase()}` as keyof typeof v
      return { ...v, [key]: Math.max(0, value) }
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      for (const variant of variants) {
        const { error } = await supabase
          .from('product_variants')
          .update({
            stock_s: variant.stock_s,
            stock_m: variant.stock_m,
            stock_l: variant.stock_l,
            stock_xl: variant.stock_xl
          })
          .eq('id', variant.id)

        if (error) throw error
      }
      onSave()
    } catch (error) {
      console.error('Error saving stock:', error)
      alert('Errore durante il salvataggio')
    } finally {
      setSaving(false)
    }
  }

  const sizes = ['S', 'M', 'L', 'XL']

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Gestisci Stock: {product.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {variants.map(variant => (
            <div key={variant.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <div 
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: variant.color_hex || '#ccc' }}
                />
                <h3 className="font-medium">{variant.color}</h3>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {sizes.map(size => {
                  const key = `stock_${size.toLowerCase()}` as keyof typeof variant
                  const value = (variant[key] as number) || 0
                  
                  return (
                    <div key={size} className="text-center">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Taglia {size}
                      </label>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => updateStock(variant.id, size, -1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={value}
                          onChange={(e) => setStock(variant.id, size, parseInt(e.target.value) || 0)}
                          className="w-16 text-center border rounded py-1"
                          min="0"
                        />
                        <button
                          onClick={() => updateStock(variant.id, size, 1)}
                          className="p-1 rounded bg-gray-100 hover:bg-gray-200"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Annulla
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Salvataggio...' : 'Salva Stock'}
          </button>
        </div>
      </div>
    </div>
  )
}
