import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { Gallery } from './pages/Gallery';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { SimpleRoleProvider } from './contexts/SimpleRoleContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <SimpleRoleProvider>
        <CartProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/men" element={<Products />} />
                  <Route path="/women" element={<Products />} />
                  <Route path="/accessories" element={<Products />} />
                  <Route path="/new-arrivals" element={<Products />} />
                  <Route path="/best-sellers" element={<Products />} />
                  <Route path="/sale" element={<Products />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </CartProvider>
      </SimpleRoleProvider>
    </AuthProvider>
  );
}

export default App;
