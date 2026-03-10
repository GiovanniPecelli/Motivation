import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Crown, Users, Search, Mail, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yvggfomvwhymodadcbtq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2Z2dmb212d2h5bW9kYWRjYnRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjE5MTMsImV4cCI6MjA4ODczNzkxM30.QqD2uwh3-25db-71VC43YbeMV3pcvmBLa_J8KOrIdo0'
const supabase = createClient(supabaseUrl, supabaseKey)

interface User {
  id: string
  email: string
  full_name: string | null
  role: 'customer' | 'host'
  created_at: string
  last_sign_in_at?: string
}

export function ManageUsers() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()
  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Fetch da Supabase
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching users:', fetchError)
        setError('Errore nel caricamento degli utenti')
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Errore nel caricamento degli utenti')
    } finally {
      setLoading(false)
    }
  }

  // Filtra utenti in base alla ricerca
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="h-6 w-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900">Gestisci Utenti</h1>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {users.length} utenti registrati
              </span>
            </div>
            <Link
              to="/host/products"
              className="text-gray-600 hover:text-gray-900"
            >
              ← Torna ai Prodotti
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Clienti</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'customer').length}
                </p>
                <p className="text-sm text-gray-500">Account cliente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                <Crown className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Host</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'host').length}
                </p>
                <p className="text-sm text-gray-500">Account host</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totale Utenti</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <p className="text-sm text-gray-500">Registrati</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca utenti per nome o email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Caricamento utenti...</h3>
              <p className="text-gray-500">Stiamo caricando gli utenti registrati</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-900 mb-2">Errore</h3>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={loadUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Riprova
              </button>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nessun utente registrato</h3>
              <p className="text-gray-500">
                Non ci sono ancora utenti registrati sulla piattaforma
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    {/* User Info */}
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">
                            {user.full_name || 'Nessun nome'}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'host' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role === 'host' ? 'Host' : 'Cliente'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Registrato il {new Date(user.created_at).toLocaleDateString('it-IT')}
                        </div>
                      </div>
                    </div>

                    {/* User ID */}
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        ID: {user.id.slice(0, 8)}...
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {users.length > 0 && filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">Nessun utente trovato per "{searchQuery}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
