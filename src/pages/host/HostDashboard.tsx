import { useAuth } from '../../contexts/AuthContext'
import { useSimpleRole } from '../../contexts/SimpleRoleContext'
import { Crown, ArrowLeft, Package, Users, TrendingUp, DollarSign } from 'lucide-react'
import { Link, Navigate } from 'react-router-dom'

export function HostDashboard() {
  const { profile } = useAuth()
  const { isHost } = useSimpleRole()

  if (!profile || !isHost) {
    return <Navigate to="/" />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Host</h1>
          </div>
          <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Torna al sito
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Prodotti</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Utenti</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Vendite</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Fatturato</p>
                <p className="text-2xl font-bold">-</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Azioni Rapide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/host/products"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Package className="h-5 w-5 mr-3 text-blue-500" />
              <div>
                <p className="font-medium">Gestisci Prodotti</p>
                <p className="text-sm text-gray-500">Aggiungi, modifica o elimina prodotti</p>
              </div>
            </Link>
            <Link
              to="/host/users"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-3 text-green-500" />
              <div>
                <p className="font-medium">Gestisci Utenti</p>
                <p className="text-sm text-gray-500">Visualizza e gestisci gli utenti</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
