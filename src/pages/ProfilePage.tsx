import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'
import { User, ShoppingBag, Settings, LogOut, Edit2, Save, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ProfilePage() {
  const { profile, signOut, updateProfile } = useAuth()
  const { cartCount, cartTotal } = useCart()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    full_name: '',
    email: ''
  })
  const [updateError, setUpdateError] = useState('')
  const [updateSuccess, setUpdateSuccess] = useState('')

  // If no profile, don't render anything (redirect handled by AuthContext)
  if (!profile) {
    return null
  }

  const handleEditClick = () => {
    setEditForm({
      full_name: profile.full_name || '',
      email: profile.email || ''
    })
    setIsEditing(true)
    setUpdateError('')
    setUpdateSuccess('')
  }

  const handleSaveClick = async () => {
    setUpdateError('')
    setUpdateSuccess('')
    
    const { error } = await updateProfile({
      full_name: editForm.full_name || null
    })
    
    if (error) {
      setUpdateError(error.message || 'Errore durante l\'aggiornamento')
    } else {
      setUpdateSuccess('Profilo aggiornato con successo!')
      setIsEditing(false)
    }
  }

  const handleCancelClick = () => {
    setIsEditing(false)
    setEditForm({
      full_name: profile.full_name || '',
      email: profile.email || ''
    })
    setUpdateError('')
    setUpdateSuccess('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Il Mio Profilo</h1>
              <p className="text-gray-600">Gestisci il tuo account</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gray-200 mb-4">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.full_name || 'Cliente'}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Registrato dal {new Date(profile.created_at).toLocaleDateString('it-IT')}
                </p>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Nome</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.full_name}
                            onChange={(e) => setEditForm({...editForm, full_name: e.target.value})}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Inserisci nome"
                          />
                        ) : (
                          profile.full_name || 'Non specificato'
                        )}
                      </span>
                      {!isEditing && (
                        <button
                          onClick={handleEditClick}
                          className="text-blue-600 hover:text-blue-700"
                          title="Modifica"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Inserisci email"
                          />
                        ) : (
                          profile.email
                        )}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ruolo</span>
                    <span className="text-sm font-medium text-gray-900">
                      {profile.role === 'host' ? 'Host' : 'Cliente'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cliente dal</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(profile.created_at).toLocaleDateString('it-IT')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Stato</span>
                    <span className="text-sm font-medium text-green-600">Attivo</span>
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                    <button
                      onClick={handleCancelClick}
                      className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Annulla
                    </button>
                    <button
                      onClick={handleSaveClick}
                      className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Salva
                    </button>
                  </div>
                )}

                {updateSuccess && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded text-sm">
                    {updateSuccess}
                  </div>
                )}

                {updateError && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
                    {updateError}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                    <ShoppingBag className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Carrello</p>
                    <p className="text-2xl font-bold text-gray-900">{cartCount} articoli</p>
                    <p className="text-sm text-gray-500">€{cartTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Ordini</p>
                    <p className="text-2xl font-bold text-gray-900">0</p>
                    <p className="text-sm text-gray-500">Storico acquisti</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Azioni Rapide</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/products"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <ShoppingBag className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Visualizza Carrello</span>
                </Link>
                <button className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <Settings className="h-5 w-5 text-gray-400 mr-3" />
                  <span className="text-sm font-medium text-gray-900">Impostazioni</span>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Attività Recente</h3>
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nessuna attività recente</p>
                <p className="text-sm text-gray-400 mt-2">
                  Inizia ad aggiungere prodotti per vedere qui le statistiche
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
