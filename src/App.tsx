import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SimpleRoleProvider } from './contexts/SimpleRoleContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Notification } from './components/Notification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AuthPage } from './pages/AuthPage';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Checkout } from './pages/Checkout';
import { Gallery } from './pages/Gallery';
import { CookiePolicy } from './pages/CookiePolicy';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsConditions } from './pages/TermsConditions';
import { AddProductSimple } from './pages/host/AddProductSimple';
import { EditProduct } from './pages/host/EditProduct';
import { ManageProducts } from './pages/host/ManageProducts';
import { ManageCollections } from './pages/host/ManageCollections';
import { UsersManagement } from './pages/host/UsersManagement';
import { ProfilePage } from './pages/ProfilePage';
import { ScrollToTop } from './components/ScrollToTop';
import { FAQ } from './pages/FAQ';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <SimpleRoleProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <Notification />
              <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/gallery" element={<Gallery />} />
                  
                  {/* Legal pages */}
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsConditions />} />
                  <Route path="/faq" element={<FAQ />} />
                  
                  {/* Host routes */}
                  <Route path="/host/add-product" element={<AddProductSimple />} />
                  <Route path="/host/edit-product/:id" element={<EditProduct />} />
                  <Route path="/host/products" element={<ManageProducts />} />
                  <Route path="/host/collections" element={<ManageCollections />} />
                  <Route path="/host/users" element={<UsersManagement />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </SimpleRoleProvider>
    </NotificationProvider>
  </AuthProvider>
  )
}

export default App;
