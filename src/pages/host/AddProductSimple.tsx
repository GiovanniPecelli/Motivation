import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Plus, Trash2, Upload, Crown, ChevronUp, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

import { ProductVariant } from '../../types'

const colors = [
  { name: 'Nero', hex: '#000000' },
  { name: 'Bianco', hex: '#FFFFFF' },
  { name: 'Rosso', hex: '#FF0000' },
  { name: 'Blu', hex: '#0000FF' },
  { name: 'Verde', hex: '#008000' },
  { name: 'Giallo', hex: '#FFFF00' },
  { name: 'Grigio', hex: '#808080' },
  { name: 'Arancione', hex: '#FFA500' },
]

export function AddProductSimple() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [collection, setCollection] = useState('')
  const [tags, setTags] = useState('')

  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: '', color: 'Nero', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }
  ])

  const [collections, setCollections] = useState<any[]>([])
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  // Fetch collections for dropdown
  useEffect(() => {
    if (profile && isHost) {
      fetchCollections()
    }
  }, [profile, isHost])

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('id, name, description')
        .order('name ASC')

      if (error) {
        console.error('Error fetching collections:', error)
      } else {
        setCollections(data || [])
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (!profile || !isHost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accesso Negato</h1>
          <p className="text-gray-600">Solo per Host</p>
        </div>
      </div>
    )
  }

  const uploadImages = async (variantIndex: number, files: FileList | null) => {
    if (!files || files.length === 0) return
    
    setUploadingIndex(variantIndex)
    
    try {
      const urls = await Promise.all(
        Array.from(files).map(async (file) => {
          const ext = file.name.split('.').pop()
          const name = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
          const path = `products/${variants[variantIndex].color.toLowerCase()}/${name}`

          const { error } = await supabase.storage.from('product-images').upload(path, file)
          if (error) throw error

          const { data } = supabase.storage.from('product-images').getPublicUrl(path)
          return data.publicUrl
        })
      )

      const newVariants = [...variants]
      newVariants[variantIndex].images = [...newVariants[variantIndex].images, ...urls]
      setVariants(newVariants)
      setMessage('Images uploaded!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Error uploading images')
    } finally {
      setUploadingIndex(null)
    }
  }

  const removeImage = (vIndex: number, imgIndex: number) => {
    const newVariants = [...variants]
    newVariants[vIndex].images.splice(imgIndex, 1)
    setVariants(newVariants)
  }

  const moveImageUp = (vIndex: number, imgIndex: number) => {
    if (imgIndex === 0) return
    const newVariants = [...variants]
    const images = newVariants[vIndex].images
    const temp = images[imgIndex]
    images[imgIndex] = images[imgIndex - 1]
    images[imgIndex - 1] = temp
    setVariants(newVariants)
  }

  const moveImageDown = (vIndex: number, imgIndex: number) => {
    const newVariants = [...variants]
    const images = newVariants[vIndex].images
    if (imgIndex >= images.length - 1) return
    const temp = images[imgIndex]
    images[imgIndex] = images[imgIndex + 1]
    images[imgIndex + 1] = temp
    setVariants(newVariants)
  }

  const addVariant = () => {
    setVariants([...variants, { id: '', color: '', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }])
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => {
      const newVariants = [...prev]
      newVariants[index] = { ...newVariants[index], [field]: value }
      return newVariants
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      if (!title || !price || !category) {
        throw new Error('Please fill name, price and category')
      }

      // Save product
      const { data: product, error: prodErr } = await supabase
        .from('products')
        .insert({
          title,
          description,
          price: parseFloat(price),
          category,
          collection: collection || null,
          tags: tags.split(',').map(t => t.trim()).filter(t => t),
          created_by: profile.id
        })
        .select()
        .single()

      if (prodErr) throw prodErr

      // Save variants
      const variantData = variants.map(v => ({
        product_id: product.id,
        color: v.color,
        color_hex: v.color_hex,
        stock_s: v.stock_s,
        stock_m: v.stock_m,
        stock_l: v.stock_l,
        stock_xl: v.stock_xl,
        images: v.images
      }))

      const { error: varErr } = await supabase.from('product_variants').insert(variantData)
      if (varErr) throw varErr

      setMessage('Prodotto creato con successo!')
      
      // Reset
      setTitle('')
      setDescription('')
      setPrice('')
      setCategory('')
      setTags('')
      setCollection('')
      setVariants([{ id: '', color: 'Nero', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }])

    } catch (err: any) {
      setMessage(err.message || 'Error during saving')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/host/collections" className="text-blue-600 hover:text-blue-800">
              📦 Manage Collections
            </Link>
            <Link to="/host/products" className="text-gray-600 hover:text-gray-900">← Back</Link>
          </div>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg ${message.includes('success') || message.includes('uploaded') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Info Base */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Info</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="eg: T-shirt Motivation Logo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (€) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="29.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  >
                    <option value="">Select</option>
                    <option value="t-shirts">T-Shirt</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="pants">Pants</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Describe the product..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="eg: t-shirt, summer, fitness, cotton"
                />
                <p className="text-xs text-gray-500 mt-1">Add tags to help product search</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection</label>
                <select
                  value={collection}
                  onChange={(e) => setCollection(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">No collection</option>
                  {collections.map((coll: any) => (
                    <option key={coll.id} value={coll.name}>
                      {coll.name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Add product to an existing collection</p>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Available Colors</h2>
              <button
                type="button"
                onClick={addVariant}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Color
              </button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, vIndex) => (
                <div key={vIndex} className="border border-gray-200 rounded-lg p-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: variant.color_hex }}
                      />
                      <select
                        value={variant.color}
                        onChange={(e) => {
                          const c = colors.find(x => x.name === e.target.value)
                          updateVariant(vIndex, 'color', e.target.value)
                          if (c) updateVariant(vIndex, 'color_hex', c.hex)
                        }}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="">Select color</option>
                        {colors.map(c => (
                          <option key={c.hex} value={c.name}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    {variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(vIndex)} className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-2">Quantity per size:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: 'stock_s', label: 'S' },
                        { key: 'stock_m', label: 'M' },
                        { key: 'stock_l', label: 'L' },
                        { key: 'stock_xl', label: 'XL' }
                      ].map(({ key, label }) => (
                        <div key={key} className="text-center">
                          <label className="block text-xs text-gray-500 mb-1">{label}</label>
                          <input
                            type="number"
                            value={variant[key as keyof ProductVariant] as number}
                            onChange={(e) => updateVariant(vIndex, key as keyof ProductVariant, parseInt(e.target.value) || 0)}
                            min="0"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Immagini */}
                  <div>
                    <label className="block text-xs text-gray-600 mb-2">Photos for {variant.color || 'color'}:</label>
                    
                    <input
                      ref={el => fileInputRefs.current[vIndex] = el}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => uploadImages(vIndex, e.target.files)}
                      className="hidden"
                    />
                    
                    <button
                      type="button"
                      onClick={() => fileInputRefs.current[vIndex]?.click()}
                      disabled={uploadingIndex === vIndex}
                      className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingIndex === vIndex ? 'Uploading...' : 'Upload Photos'}
                    </button>

                    {variant.images.length > 0 && (
                      <div className="mt-2 flex gap-2 flex-wrap">
                        {variant.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative group">
                            <img src={img} alt="" className="w-16 h-16 object-cover rounded" />
                            
                            {/* Reorder buttons */}
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => moveImageUp(vIndex, imgIndex)}
                                disabled={imgIndex === 0}
                                className="bg-blue-500 text-white rounded-full p-0.5 disabled:opacity-50"
                                title="Sposta su"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => moveImageDown(vIndex, imgIndex)}
                                disabled={imgIndex === variant.images.length - 1}
                                className="bg-blue-500 text-white rounded-full p-0.5 disabled:opacity-50"
                                title="Sposta giù"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeImage(vIndex, imgIndex)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                              title="Elimina"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end space-x-3">
            <Link to="/host/products" className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
              Annulla
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvataggio...' : 'Crea Prodotto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
