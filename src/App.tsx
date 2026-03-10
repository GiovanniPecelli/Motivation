import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SimpleRoleProvider } from './contexts/SimpleRoleContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Gallery } from './pages/Gallery';
import { AddProductSimple } from './pages/host/AddProductSimple';
import { EditProduct } from './pages/host/EditProduct';
import { ManageProducts } from './pages/host/ManageProducts';
import { HostDashboard } from './pages/host/HostDashboard';
import { UsersManagement } from './pages/host/UsersManagement';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <SimpleRoleProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/gallery" element={<Gallery />} />
                  
                  {/* Host routes */}
                  <Route path="/host/dashboard" element={<HostDashboard />} />
                  <Route path="/host/add-product" element={<AddProductSimple />} />
                  <Route path="/host/edit-product/:id" element={<EditProduct />} />
                  <Route path="/host/products" element={<ManageProducts />} />
                  <Route path="/host/users" element={<UsersManagement />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </SimpleRoleProvider>
    </AuthProvider>
  )
}

export default App;
