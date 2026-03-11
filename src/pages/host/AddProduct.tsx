import { useState, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Plus, Trash2, Upload, Crown, Image as ImageIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { ProductVariant } from '../../types'

interface UploadedImage {
  url: string;
  name: string;
  size: number;
  type: string;
  variantId?: string;
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
  
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [variants, setVariants] = useState<ProductVariant[]>([
    { id: '', color: 'Black', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  if (!profile || !isHost) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only accessible to Hosts</p>
        </div>
      </div>
    )
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
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
      setSubmitError('Error uploading images')
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
                variantId: variants[variantIndex].color
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
            images: [...updated[variantIndex].images, ...results.map(r => r.url)]
          }
          return updated
        })
      })
      .catch(error => {
        console.error('Error uploading variant images:', error)
        setSubmitError('Error uploading variant images')
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
    setVariants(prev => [...prev, { id: '', color: '', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    setVariants(prev => {
      const newVariants = [...prev]
      newVariants[index] = { ...newVariants[index], [field]: value }
      return newVariants
    })
  }

  const addColorToAllVariants = (color: string, color_hex: string) => {
    setVariants(prev => [...prev, { id: '', color, color_hex, stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    setSubmitSuccess('')

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      
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

      const { data: product, error: productError } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single()

      if (productError) {
        console.error('Error inserting product:', productError)
        setSubmitError('Error saving product')
        return
      }

      // Update variants with product_id
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

      const { error: variantError } = await supabase
        .from('product_variants')
        .insert(variantData)

      if (variantError) throw variantError
      else {
        setSubmitSuccess('Product and variants added successfully!')
        
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
          { id: '', color: 'Black', color_hex: '#000000', stock_s: 0, stock_m: 0, stock_l: 0, stock_xl: 0, images: [] }
        ])
      }
    } catch (error) {
      console.error('Error:', error)
      setSubmitError('Error saving product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
              </div>
            </div>
            <Link
              to="/host/products"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Manage Products
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g.: Motivation Pro T-shirt"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Describe the product..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (€) *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="t-shirts">T-Shirt</option>
                    <option value="hoodies">Hoodies</option>
                    <option value="sweatshirts">Sweatshirts</option>
                    <option value="pants">Pants</option>
                    <option value="shorts">Shorts</option>
                    <option value="jackets">Jackets</option>
                    <option value="jeans">Jeans</option>
                    <option value="shirts">Shirts</option>
                    <option value="polo">Polo</option>
                    <option value="tank-tops">Tank Tops</option>
                    <option value="sportswear">Sportswear</option>
                    <option value="underwear">Underwear</option>
                    <option value="socks">Socks</option>
                    <option value="accessories">Accessories</option>
                    <option value="shoes">Shoes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory
                  </label>
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select subcategory</option>
                    {formData.category === 't-shirts' && (
                      <>
                        <option value="basic-t-shirt">Basic T-Shirt</option>
                        <option value="graphic-t-shirt">Graphic T-Shirt</option>
                        <option value="v-neck">V-Neck</option>
                        <option value="long-sleeve">Long Sleeve</option>
                        <option value="oversized">Oversized</option>
                        <option value="crop-top">Crop Top</option>
                      </>
                    )}
                    {formData.category === 'hoodies' && (
                      <>
                        <option value="zip-hoodie">Zip Hoodie</option>
                        <option value="pullover-hoodie">Pullover Hoodie</option>
                        <option value="oversized-hoodie">Oversized Hoodie</option>
                        <option value="kangaroo-pocket">Kangaroo Pocket Hoodie</option>
                      </>
                    )}
                    {formData.category === 'sweatshirts' && (
                      <>
                        <option value="crewneck">Crewneck Sweatshirt</option>
                        <option value="v-neck-sweatshirt">V-Neck Sweatshirt</option>
                        <option value="zip-sweatshirt">Zip Sweatshirt</option>
                        <option value="cardigan">Cardigan</option>
                      </>
                    )}
                    {formData.category === 'pants' && (
                      <>
                        <option value="jeans-pants">Jeans Pants</option>
                        <option value="chinos">Chinos</option>
                        <option value="cargo-pants">Cargo Pants</option>
                        <option value="joggers">Joggers</option>
                        <option value="dress-pants">Dress Pants</option>
                        <option value="leggings">Leggings</option>
                      </>
                    )}
                    {formData.category === 'shorts' && (
                      <>
                        <option value="denim-shorts">Denim Shorts</option>
                        <option value="cargo-shorts">Cargo Shorts</option>
                        <option value="athletic-shorts">Athletic Shorts</option>
                        <option value="dress-shorts">Dress Shorts</option>
                      </>
                    )}
                    {formData.category === 'jackets' && (
                      <>
                        <option value="leather-jacket">Leather Jacket</option>
                        <option value="denim-jacket">Denim Jacket</option>
                        <option value="bomber-jacket">Bomber</option>
                        <option value="winter-jacket">Winter Jacket</option>
                        <option value="windbreaker">Windbreaker</option>
                        <option value="blazer">Blazer</option>
                      </>
                    )}
                    {formData.category === 'jeans' && (
                      <>
                        <option value="skinny-jeans">Skinny Jeans</option>
                        <option value="slim-jeans">Slim Jeans</option>
                        <option value="regular-jeans">Regular Jeans</option>
                        <option value="bootcut-jeans">Bootcut Jeans</option>
                        <option value="relaxed-jeans">Relaxed Jeans</option>
                        <option value="distressed-jeans">Distressed Jeans</option>
                      </>
                    )}
                    {formData.category === 'shirts' && (
                      <>
                        <option value="dress-shirt">Dress Shirt</option>
                        <option value="casual-shirt">Casual Shirt</option>
                        <option value="flannel-shirt">Flannel Shirt</option>
                        <option value="linen-shirt">Linen Shirt</option>
                        <option value="oxford-shirt">Oxford Shirt</option>
                      </>
                    )}
                    {formData.category === 'polo' && (
                      <>
                        <option value="classic-polo">Classic Polo</option>
                        <option value="sport-polo">Sport Polo</option>
                        <option value="long-sleeve-polo">Long Sleeve Polo</option>
                      </>
                    )}
                    {formData.category === 'tank-tops' && (
                      <>
                        <option value="athletic-tank">Athletic Tank</option>
                        <option value="casual-tank">Casual Tank</option>
                        <option value="muscle-tank">Muscle Tank</option>
                      </>
                    )}
                    {formData.category === 'sportswear' && (
                      <>
                        <option value="training">Training</option>
                        <option value="running">Running</option>
                        <option value="yoga">Yoga</option>
                        <option value="fitness">Fitness</option>
                        <option value="team-sport">Team Sport</option>
                      </>
                    )}
                    {formData.category === 'accessories' && (
                      <>
                        <option value="caps">Caps/Hats</option>
                        <option value="scarf">Scarves</option>
                        <option value="gloves">Gloves</option>
                        <option value="belts">Belts</option>
                        <option value="bags">Bags/Backpacks</option>
                        <option value="wallets">Wallets</option>
                        <option value="sunglasses">Sunglasses</option>
                        <option value="watches">Watches</option>
                        <option value="jewelry">Jewelry</option>
                      </>
                    )}
                    {formData.category === 'shoes' && (
                      <>
                        <option value="sneakers">Sneakers</option>
                        <option value="running-shoes">Running Shoes</option>
                        <option value="basketball-shoes">Basketball Shoes</option>
                        <option value="boots">Boots</option>
                        <option value="sandals">Sandals</option>
                        <option value="formal-shoes">Formal Shoes</option>
                        <option value="slippers">Slippers</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Tags *
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g.: cotton, summer, casual, printed, made-in-italy"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technical Specifications and Materials
                  </label>
                  <textarea
                    name="specifications"
                    value={formData.specifications || ''}
                    onChange={handleInputChange}
                    rows={6}
                    placeholder="Enter technical specifications, one per line:

Composition: 100% Organic Cotton
Weight: 180g/m²
Fit: Regular Fit
Washing: 30°C Machine Washable
Made in: Italy
Certification: OEKO-TEX Standard 100
Color: Black (Yarn-dyed)
Print: Eco-friendly Screen Print
Label: Embroidered"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one specification per line. They will be automatically formatted on the product page.
                  </p>
                </div>

                <div className="md:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Product Variants</h3>
                      <button
                        type="button"
                        onClick={addVariant}
                        className="flex items-center px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Variant
                      </button>
                    </div>

                    <div className="space-y-6">
                      {variants.map((variant, variantIndex) => (
                        <div key={variantIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Stock S</label>
                                <input
                                  type="number"
                                  value={variant.stock_s}
                                  onChange={(e) => updateVariant(variantIndex, 'stock_s', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Stock M</label>
                                <input
                                  type="number"
                                  value={variant.stock_m}
                                  onChange={(e) => updateVariant(variantIndex, 'stock_m', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Stock L</label>
                                <input
                                  type="number"
                                  value={variant.stock_l}
                                  onChange={(e) => updateVariant(variantIndex, 'stock_l', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Stock XL</label>
                                <input
                                  type="number"
                                  value={variant.stock_xl}
                                  onChange={(e) => updateVariant(variantIndex, 'stock_xl', parseInt(e.target.value) || 0)}
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                                />
                              </div>
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

                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between mb-3">
                               <h4 className="text-sm font-medium text-gray-900">
                                 Images for {variant.color}
                               </h4>
                               <div className="flex items-center space-x-2">
                                 <div className="w-6 h-6 rounded border border-gray-300" style={{ backgroundColor: variant.color_hex }}></div>
                                 <span className="text-xs text-gray-500">{variant.images.length} images</span>
                              </div>
                            </div>

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
                                  Images for {variant.color}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Click to add specific images for this variant
                                </p>
                              </label>
                            </div>

                            {variant.images.length > 0 && (
                              <div className="grid grid-cols-4 gap-2">
                                {variant.images.map((image, imageIndex) => (
                                  <div key={imageIndex} className="relative group">
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                      <img
                                        src={image}
                                        alt={`${variant.color} ${imageIndex + 1}`}
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

                    <div className="mt-4 flex space-x-4">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Add color to all sizes</label>
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Color"
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
                            Add
                          </button>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images
                  </label>
                  <div className="space-y-4">
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
                          Upload Product Images
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Click or drag images here. Formats: JPG, PNG, GIF. Max 5MB per file.
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
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="h-4 w-4 mr-2" />
                              Select Images
                            </>
                          )}
                        </button>
                      </label>
                    </div>

                    {uploadedImages.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Uploaded images ({uploadedImages.length}/10):</p>
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

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Or enter image URLs:</p>
                      <div className="flex items-center space-x-2">
                        <input
                          type="url"
                          placeholder="https://example.com/image.jpg"
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
                          Add URL
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <Link
                  to="/host/products"
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Product
                    </>
                  )}
                </button>
              </div>

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

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Variant Images Guide</h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <ImageIcon className="h-8 w-8 text-blue-600 mb-2" />
                  <h4 className="font-medium text-blue-900">Images per Variant</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Each variant (color+size) can have its specific images.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900">How it Works</h4>
                  <div className="text-sm text-green-700 mt-2 space-y-2">
                    <p>1. <strong>Create variant:</strong> Choose color and size</p>
                    <p>2. <strong>Upload images:</strong> Upload photos specific to that variant</p>
                    <p>3. <strong>Display:</strong> When the user selects a color, they will see the corresponding images</p>
                    <p>4. <strong>Amazon Style:</strong> Experience similar to major e-commerce sites</p>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-900">Best Practices</h4>
                  <div className="text-sm text-yellow-700 mt-2 space-y-1">
                    <p>• At least 3 images per variant</p>
                    <p>• Front, back, details photos</p>
                    <p>• Consistent background for each color</p>
                    <p>• Square images 800x800px</p>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-900">Flow Example</h4>
                  <div className="text-sm text-purple-700 mt-2 space-y-1">
                    <p><strong>T-shirt Black M:</strong> Black t-shirt photos</p>
                    <p><strong>T-shirt White M:</strong> White t-shirt photos</p>
                    <p><strong>User clicks "White":</strong> Will only see white photos</p>
                    <p><strong>User clicks "Black":</strong> Will only see black photos</p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-900">Optimized Storage</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Images are uploaded to Supabase Storage, not the database. Optimized performance and unlimited space.
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
