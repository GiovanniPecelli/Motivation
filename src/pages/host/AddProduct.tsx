import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Plus, Trash2, Upload, ImageIcon, Crown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

interface ProductVariant {
  id?: string
  size: string
  color: string
  color_hex: string
  supply: number
  sku?: string
  images: UploadedImage[] // Images specific to this variant
}

interface UploadedImage {
  url: string
  name: string
  size: number
  type: string
  variantId?: string // Optional: which variant this image belongs to
}

export function AddProduct() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    tags: '',
    specifications: ''
  })
  
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: 'S', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
    { size: 'M', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
    { size: 'L', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
    { size: 'XL', color: 'Nero', color_hex: '#000000', supply: 0, images: [] }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  if (!profile || !isHost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Accesso Negato</h1>
          <p className="text-gray-600">Questa pagina è accessibile solo agli Host</p>
        </div>
      </div>
    )
  }

  const categories = [
    { id: 'men', name: 'Uomo', subcategories: ['T-Shirts & Tanks', 'Pants & Shorts', 'Hoodies & Sweatshirts', 'Motivation Pro'] },
    { id: 'women', name: 'Donna', subcategories: ['Leggings & Shorts', 'Sports Bras & Tops', 'T-Shirts & Crop Tops', 'Hoodies & Sweatshirts', 'Motivation Pro'] },
    { id: 'accessories', name: 'Accessori', subcategories: ['Wrist Wraps & Tape', 'Knee & Elbow Sleeves', 'Grips & Straps', 'Belts & Lever Belts', 'Socks & Lifestyle', 'Backpacks', 'Patches'] }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const removeImageUrl = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    uploadImages(files)
  }

  const uploadImages = async (files: FileList) => {
    setIsUploading(true)
    const uploadPromises: Promise<UploadedImage>[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      const uploadPromise = new Promise<UploadedImage>((resolve, reject) => {
        supabase.storage
          .from('product-images')
          .upload(filePath, file)
          .then(({ error }) => {
            if (error) {
              reject(error)
            } else {
              // Get public URL
              const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)
              
              resolve({
                url: data.publicUrl,
                name: file.name,
                size: file.size,
                type: file.type
              })
            }
          })
          .catch(reject)
      })

      uploadPromises.push(uploadPromise)
    }

    try {
      const results = await Promise.all(uploadPromises)
      setUploadedImages(prev => [...prev, ...results])
    } catch (error) {
      console.error('Error uploading images:', error)
      setSubmitError('Errore durante il caricamento delle immagini')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const removeUploadedImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleVariantImageUpload = (variantIndex: number, files: FileList) => {
    setIsUploading(true)
    const uploadPromises: Promise<UploadedImage>[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `products/${fileName}`

      const uploadPromise = new Promise<UploadedImage>((resolve, reject) => {
        supabase.storage
          .from('product-images')
          .upload(filePath, file)
          .then(({ error }) => {
            if (error) {
              reject(error)
            } else {
              const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath)
              
              resolve({
                url: data.publicUrl,
                name: file.name,
                size: file.size,
                type: file.type,
                variantId: variants[variantIndex].color + variants[variantIndex].size
              })
            }
          })
          .catch(reject)
      })

      uploadPromises.push(uploadPromise)
    }

    Promise.all(uploadPromises)
      .then(results => {
        setVariants(prev => {
          const updated = [...prev]
          updated[variantIndex] = { 
            ...updated[variantIndex], 
            images: [...updated[variantIndex].images, ...results] 
          }
          return updated
        })
      })
      .catch(error => {
        console.error('Error uploading variant images:', error)
        setSubmitError('Errore durante il caricamento delle immagini della variante')
      })
      .finally(() => {
        setIsUploading(false)
      })
  }

  const removeVariantImage = (variantIndex: number, imageIndex: number) => {
    setVariants(prev => {
      const updated = [...prev]
      updated[variantIndex] = { 
        ...updated[variantIndex], 
        images: updated[variantIndex].images.filter((_, i) => i !== imageIndex) 
      }
      return updated
    })
  }

  const addVariant = () => {
    setVariants(prev => [...prev, { size: 'S', color: 'Nero', color_hex: '#000000', supply: 0, images: [] }])
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: string | number) => {
    setVariants(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const addColorToAllVariants = (color: string, color_hex: string) => {
    setVariants(prev => {
      const uniqueSizes = [...new Set(prev.map(v => v.size))]
      return uniqueSizes.map(size => ({ size, color, color_hex, supply: 0, images: [] }))
    })
  }

  const addSizeToAllVariants = (size: string) => {
    setVariants(prev => {
      const uniqueColors = [...new Set(prev.map(v => v.color))]
      return uniqueColors.map(color => ({ size, color, color_hex: prev.find(v => v.color === color)?.color_hex || '#000000', supply: 0, images: [] }))
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      // Convert tags string to array
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      
      // Prepare product data
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        subcategory: formData.subcategory,
        tags: tagsArray,
        images: uploadedImages.map(img => img.url),
        specifications: formData.specifications,
        created_by: profile.id
      }

      // Insert product first
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (productError) {
        console.error('Error inserting product:', productError)
        setSubmitError('Errore durante il salvataggio del prodotto')
        return
      }

      // Insert variants
      const variantsData = variants.map(variant => ({
        product_id: product.id,
        size: variant.size,
        color: variant.color,
        color_hex: variant.color_hex,
        supply: variant.supply,
        sku: `${formData.title.substring(0, 3).toUpperCase()}-${variant.color}-${variant.size}`.replace(/\s+/g, '-')
      }))

      const { error: variantsError } = await supabase
        .from('product_variants')
        .insert(variantsData)

      if (variantsError) {
        console.error('Error inserting variants:', variantsError)
        setSubmitError('Errore durante il salvataggio delle varianti')
      } else {
        setSubmitSuccess('Prodotto e varianti aggiunti con successo!')
        
        // Reset form
        setFormData({
          title: '',
          description: '',
          price: '',
          category: '',
          subcategory: '',
          tags: '',
          specifications: ''
        })
        setUploadedImages([])
        setVariants([
          { size: 'S', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
          { size: 'M', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
          { size: 'L', color: 'Nero', color_hex: '#000000', supply: 0, images: [] },
          { size: 'XL', color: 'Nero', color_hex: '#000000', supply: 0, images: [] }
        ])
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Errore durante il salvataggio del prodotto')
    } finally {
      setIsSubmitting(false)
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
                <h1 className="text-2xl font-bold text-gray-900">Aggiungi Prodotto</h1>
              </div>
            </div>
            <Link
              to="/host/products"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Gestisci Prodotti
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Titolo Prodotto */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titolo Prodotto *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Es: T-shirt Motivation Pro"
                  />
                </div>

                {/* Descrizione */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrizione *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Descrivi il prodotto..."
                  />
                </div>

                {/* Prezzo */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo (€) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="29.99"
                  />
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seleziona categoria</option>
                    <option value="t-shirts">T-Shirt</option>
                    <option value="hoodies">Felpe</option>
                    <option value="sweatshirts">Sweatshirts</option>
                    <option value="pants">Pantaloni</option>
                    <option value="shorts">Pantaloncini</option>
                    <option value="jackets">Giacche</option>
                    <option value="jeans">Jeans</option>
                    <option value="shirts">Camicie</option>
                    <option value="polo">Polo</option>
                    <option value="tank-tops">Canotte</option>
                    <option value="sportswear">Abbigliamento Sportivo</option>
                    <option value="underwear">Intimo</option>
                    <option value="socks">Calze</option>
                    <option value="accessories">Accessori</option>
                    <option value="shoes">Scarpe</option>
                  </select>
                </div>

                {/* Sottocategoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sottocategoria
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Seleziona sottocategoria</option>
                    {formData.category === 't-shirts' && (
                      <>
                        <option value="basic-t-shirt">T-Shirt Base</option>
                        <option value="graphic-t-shirt">T-Shirt Grafica</option>
                        <option value="v-neck">Scollatura a V</option>
                        <option value="long-sleeve">Manica Lunga</option>
                        <option value="oversized">Oversized</option>
                        <option value="crop-top">Crop Top</option>
                      </>
                    )}
                    {formData.category === 'hoodies' && (
                      <>
                        <option value="zip-hoodie">Felpa con Zip</option>
                        <option value="pullover-hoodie">Felpa Pullover</option>
                        <option value="oversized-hoodie">Felpa Oversized</option>
                        <option value="kangaroo-pocket">Felpa con Tasca Kangaroo</option>
                      </>
                    )}
                    {formData.category === 'sweatshirts' && (
                      <>
                        <option value="crewneck">Felpa Girocollo</option>
                        <option value="v-neck-sweatshirt">Felpa Scollatura V</option>
                        <option value="zip-sweatshirt">Felpa con Zip</option>
                        <option value="cardigan">Cardigan</option>
                      </>
                    )}
                    {formData.category === 'pants' && (
                      <>
                        <option value="jeans-pants">Pantaloni Jeans</option>
                        <option value="chinos">Chinos</option>
                        <option value="cargo-pants">Pantaloni Cargo</option>
                        <option value="joggers">Joggers</option>
                        <option value="dress-pants">Pantaloni Eleganti</option>
                        <option value="leggings">Leggings</option>
                      </>
                    )}
                    {formData.category === 'shorts' && (
                      <>
                        <option value="denim-shorts">Bermuda Jeans</option>
                        <option value="cargo-shorts">Bermuda Cargo</option>
                        <option value="athletic-shorts">Bermuda Sportivi</option>
                        <option value="dress-shorts">Bermuda Eleganti</option>
                      </>
                    )}
                    {formData.category === 'jackets' && (
                      <>
                        <option value="leather-jacket">Giacca di Pelle</option>
                        <option value="denim-jacket">Giacca di Jeans</option>
                        <option value="bomber-jacket">Bomber</option>
                        <option value="winter-jacket">Giacca Invernale</option>
                        <option value="windbreaker">Antivento</option>
                        <option value="blazer">Blazer</option>
                      </>
                    )}
                    {formData.category === 'jeans' && (
                      <>
                        <option value="skinny-jeans">Jeans Skinny</option>
                        <option value="slim-jeans">Jeans Slim</option>
                        <option value="regular-jeans">Jeans Regular</option>
                        <option value="bootcut-jeans">Jeans Bootcut</option>
                        <option value="relaxed-jeans">Jeans Relaxed</option>
                        <option value="distressed-jeans">Jeans Rotti</option>
                      </>
                    )}
                    {formData.category === 'shirts' && (
                      <>
                        <option value="dress-shirt">Camicia Elegante</option>
                        <option value="casual-shirt">Camicia Casual</option>
                        <option value="flannel-shirt">Camicia Flanella</option>
                        <option value="linen-shirt">Camicia di Lino</option>
                        <option value="oxford-shirt">Camicia Oxford</option>
                      </>
                    )}
                    {formData.category === 'polo' && (
                      <>
                        <option value="classic-polo">Polo Classica</option>
                        <option value="sport-polo">Polo Sportiva</option>
                        <option value="long-sleeve-polo">Polo Manica Lunga</option>
                      </>
                    )}
                    {formData.category === 'tank-tops' && (
                      <>
                        <option value="athletic-tank">Canotta Sportiva</option>
                        <option value="casual-tank">Canotta Casual</option>
                        <option value="muscle-tank">Canotta Bodybuilding</option>
                      </>
                    )}
                    {formData.category === 'sportswear' && (
                      <>
                        <option value="training">Training</option>
                        <option value="running">Running</option>
                        <option value="yoga">Yoga</option>
                        <option value="fitness">Fitness</option>
                        <option value="team-sport">Sport di Squadra</option>
                      </>
                    )}
                    {formData.category === 'accessories' && (
                      <>
                        <option value="caps">Berretti/Cappelli</option>
                        <option value="scarf">Sciarpe</option>
                        <option value="gloves">Guanti</option>
                        <option value="belts">Cinture</option>
                        <option value="bags">Borse/Zaini</option>
                        <option value="wallets">Portafogli</option>
                        <option value="sunglasses">Occhiali da Sole</option>
                        <option value="watches">Orologi</option>
                        <option value="jewelry">Gioielli</option>
                      </>
                    )}
                    {formData.category === 'shoes' && (
                      <>
                        <option value="sneakers">Sneakers</option>
                        <option value="running-shoes">Scarpe da Corsa</option>
                        <option value="basketball-shoes">Scarpe da Basket</option>
                        <option value="boots">Stivali</option>
                        <option value="sandals">Sandali</option>
                        <option value="formal-shoes">Scarpe Eleganti</option>
                        <option value="slippers">Pantofole</option>
                      </>
                    )}
                  </select>
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags per ricerca *
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="es: cotone, estate, casual, stampato, made-in-italy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separa i tags con virgola</p>
                </div>

                {/* Specifiche Tecniche */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifiche Tecniche e Materiali
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications || ''}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Inserisci le specifiche tecniche del prodotto, una per riga:

Composizione: 100% Cotone Organico
Peso: 180g/m²
Vestibilità: Regular Fit
Lavaggio: 30°C in lavatrice
Made in: Italy
Certificazioni: OEKO-TEX Standard 100
Colore: Nero (Tinto in filo)
Stampa: Serigrafia ecologica
Etichetta: Ricamata"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Inserisci una specifica per riga. Verranno formattate automaticamente nella pagina prodotto.
                  </p>
                </div>

                {/* Product Variants - Sizes, Colors, Supply */}
                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Varianti Prodotto</h3>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Aggiungi Variante
                      </button>
                    </div>

                    <div className="space-y-6">
                      {variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Taglia</label>
                              <select
                                value={variant.size}
                                onChange={(e) => updateVariant(variantIndex, 'size', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                              >
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                                <option value="3XL">3XL</option>
                              </select>
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Colore</label>
                              <input
                                type="text"
                                value={variant.color}
                                onChange={(e) => updateVariant(variantIndex, 'color', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Nero"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Colore Hex</label>
                              <input
                                type="text"
                                value={variant.color_hex}
                                onChange={(e) => updateVariant(variantIndex, 'color_hex', e.target.value)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                placeholder="#000000"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">Supply</label>
                              <input
                                type="number"
                                value={variant.supply}
                                onChange={(e) => updateVariant(variantIndex, 'supply', parseInt(e.target.value) || 0)}
                                className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                placeholder="0"
                                min="0"
                              />
                            </div>
                            
                            <div className="flex items-end">
                              <button
                                type="button"
                                onClick={() => removeVariant(variantIndex)}
                                className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {/* Variant Images Section */}
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-sm font-medium text-gray-900">
                                Immagini per {variant.color} - {variant.size}
                              </h4>
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: variant.color_hex }}></div>
                                <span className="text-xs text-gray-500">{variant.images.length} immagini</span>
                              </div>
                            </div>

                            {/* Upload Area for Variant */}
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center hover:border-gray-300 transition-colors mb-3">
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && handleVariantImageUpload(variantIndex, e.target.files)}
                                className="hidden"
                                id={`variant-images-${variantIndex}`}
                              />
                              <label htmlFor={`variant-images-${variantIndex}`} className="cursor-pointer">
                                <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs font-medium text-gray-900 mb-1">
                                  Immagini {variant.color} {variant.size}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Clicca per aggiungere immagini specifiche per questa variante
                                </p>
                              </label>
                            </div>

                            {/* Variant Images Preview */}
                            {variant.images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2">
                                {variant.images.map((image, imageIndex) => (
                                  <div key={imageIndex} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                      <img
                                        src={image.url}
                                        alt={`${variant.color} ${variant.size} ${imageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => removeVariantImage(variantIndex, imageIndex)}
                                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                      <Trash2 className="h-2 w-2" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-4 flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Aggiungi colore a tutte le taglie</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Colore"
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            id="colorInput"
                          />
                          <input
                            type="text"
                            placeholder="#000000"
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            id="colorHexInput"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const colorInput = document.getElementById('colorInput') as HTMLInputElement
                              const hexInput = document.getElementById('colorHexInput') as HTMLInputElement
                              if (colorInput && hexInput && colorInput.value) {
                                addColorToAllVariants(colorInput.value, hexInput.value || '#000000')
                                colorInput.value = ''
                                hexInput.value = ''
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Aggiungi
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Aggiungi taglia a tutti i colori</label>
                        <div className="flex space-x-2">
                          <select
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            id="sizeSelect"
                          >
                            <option value="">Seleziona</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                            <option value="3XL">3XL</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const sizeSelect = document.getElementById('sizeSelect') as HTMLSelectElement
                              if (sizeSelect && sizeSelect.value) {
                                addSizeToAllVariants(sizeSelect.value)
                                sizeSelect.value = ''
                              }
                            }}
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Aggiungi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Immagini */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Immagini Prodotto
                  </label>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900 mb-2">
                          Carica Immagini del Prodotto
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Clicca o trascina le immagini qui. Formati: JPG, PNG, GIF. Massimo 5MB per file.
                        </p>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center mx-auto"
                        >
                          {isUploading ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Caricamento...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Seleziona Immagini
                            </>
                          )}
                        </button>
                      </label>
                    </div>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Immagini caricate ({uploadedImages.length}/10):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                <img
                                  src={image.url}
                                  alt={image.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeUploadedImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                              <div className="mt-1 text-xs text-gray-500 truncate">
                                {image.name}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* URL Alternative */}
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Oppure inserisci URL immagini:</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          placeholder="https://esempio.com/immagine.jpg"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                          onKeyPress={(event) => {
                            if (event.key === 'Enter') {
                              event.preventDefault()
                              const input = event.currentTarget
                              if (input.value) {
                                setUploadedImages(prev => [...prev, {
                                  url: input.value,
                                  name: input.value,
                                  size: 0,
                                  type: 'image'
                                }])
                                input.value = ''
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={(event) => {
                            const input = event.currentTarget?.parentElement?.querySelector('input')
                            if (input && input.value) {
                              setUploadedImages(prev => [...prev, {
                                url: input.value,
                                name: input.value,
                                size: 0,
                                type: 'image'
                              }])
                              input.value = ''
                            }
                          }}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm"
                        >
                          Aggiungi URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="mt-8 flex justify-end space-x-4">
                <Link
                  to="/host/products"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annulla
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Salvataggio...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Salva Prodotto
                    </>
                  )}
                </button>
              </div>

              {/* Messages */}
              {submitSuccess && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
                  {submitSuccess}
                </div>
              )}

              {submitError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Guida Varianti Immagini</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <ImageIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-blue-900">Immagini per Variante</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Ogni variante (colore+taglia) può avere le sue immagini specifiche.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">Come Funziona</h4>
                  <div className="text-sm text-green-700 mt-2 space-y-2">
                    <p>1. <strong>Crea variante:</strong> Scegli colore e taglia</p>
                    <p>2. <strong>Upload immagini:</strong> Carica foto specifiche per quella variante</p>
                    <p>3. <strong>Visualizzazione:</strong> Quando l'utente seleziona il colore, vedrà le immagini corrispondenti</p>
                    <p>4. <strong>Style Amazon:</strong> Esperienza simile ai grandi e-commerce</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Best Practices</h4>
                  <div className="text-sm text-yellow-700 mt-2 space-y-1">
                    <p>• Almeno 3 immagini per variante</p>
                    <p>• Foto fronte, retro, dettagli</p>
                    <p>• Sfondo coerente per ogni colore</p>
                    <p>• Immagini quadrate 800x800px</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Esempio Flusso</h4>
                  <div className="text-sm text-purple-700 mt-2 space-y-1">
                    <p><strong>T-shirt Nero M:</strong> Foto t-shirt nera</p>
                    <p><strong>T-shirt Bianca M:</strong> Foto t-shirt bianca</p>
                    <p><strong>Utente clicca "Bianco":</strong> Vedrà solo foto bianche</p>
                    <p><strong>Utente clicca "Nero":</strong> Vedrà solo foto nere</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Storage Ottimizzato</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Le immagini sono caricate su Supabase Storage, non nel database. Performance ottimizzata e spazio illimitato.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
