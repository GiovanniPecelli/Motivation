import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Crown, Plus, Edit2, Trash2, Package } from 'lucide-react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'

interface Collection {
  id: string
  name: string
  description?: string
  image_url?: string
  banner_url?: string
  product_count: number
  display_order: number
  created_at: string
  updated_at: string
}

export function ManageCollections() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()
  const navigate = useNavigate()
  
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    display_order: 0,
    image_url: '',
    banner_url: ''
  })

  useEffect(() => {
    if (profile && isHost) {
      fetchCollections()
    }
  }, [profile, isHost])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error

      setCollections(data || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
      setMessage('Error loading collections')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const collectionData = {
        name: formData.name,
        description: formData.description,
        display_order: formData.display_order,
        image_url: formData.image_url,
        banner_url: formData.banner_url
      }

      if (editingCollection) {
        const { error } = await supabase
          .from('collections')
          .update(collectionData)
          .eq('id', editingCollection.id)

        if (error) throw error
        setMessage('Collection updated successfully')
      } else {
        const { error } = await supabase
          .from('collections')
          .insert(collectionData)

        if (error) throw error
        setMessage('Collection created successfully')
      }

      resetForm()
      fetchCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
      setMessage('Error saving collection')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection)
    setFormData({
      name: collection.name,
      description: collection.description || '',
      display_order: collection.display_order,
      image_url: collection.image_url || '',
      banner_url: collection.banner_url || ''
    })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection?')) return

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .eq('id', id)

      if (error) throw error

      setMessage('Collection deleted successfully')
      fetchCollections()
    } catch (error) {
      console.error('Error deleting collection:', error)
      setMessage('Error deleting collection')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      display_order: 0,
      image_url: '',
      banner_url: ''
    })
    setEditingCollection(null)
  }

  if (!profile || !isHost) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Gestione Collezioni</h1>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {message}
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">
            {editingCollection ? 'Edit Collection' : 'New Collection'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter URL of an existing image</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Large Banner URL
              </label>
              <input
                type="url"
                value={formData.banner_url}
                onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                placeholder="https://example.com/banner.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Enter URL of a large banner</p>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : (editingCollection ? 'Update' : 'Create')}
              </button>
              
              {editingCollection && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Collections List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Existing Collections</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No collections found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {collections.map((collection) => (
                <div key={collection.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {collection.image_url && (
                        <img
                          src={collection.image_url}
                          alt={collection.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{collection.name}</h3>
                        {collection.description && (
                          <p className="text-gray-600 mt-1">{collection.description}</p>
                        )}
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Order: {collection.display_order}</span>
                          <span>Products: {collection.product_count}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(collection)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(collection.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
