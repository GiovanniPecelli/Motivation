import { Link } from 'react-router-dom';
import { Instagram, Youtube } from 'lucide-react';
import logowhite from '../assets/logowhite.png';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <img 
              src={logowhite} 
              alt="Motivation" 
              className="h-8 w-auto mb-4 bg-transparent"
            />
            <p className="text-primary-300 mb-4">
              Driven by your goals. Quality gear for everyone chasing their ambitions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84.02 8.75.08 1.72-.38 3.49-1.32 4.94-1.17 1.85-3.08 3.21-5.22 3.34-1.93.13-3.96-.49-5.33-1.9-1.43-1.46-2.02-3.63-1.58-5.59.42-1.86 1.67-3.5 3.31-4.38 1.43-.75 3.09-.88 4.65-.48.01 1.41-.02 2.83-.03 4.25-.92-.31-1.96-.4-2.92-.13-1.56.43-2.78 1.88-2.88 3.51-.15 1.57.79 3.16 2.27 3.78 1.45.62 3.21.31 4.36-.73.69-.63 1.05-1.53 1.03-2.44-.02-3.92-.01-7.83-.01-11.75 1.4.01 2.8.01 4.19 0z"/>
                </svg>
              </a>
              <a href="#" className="text-primary-300 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/new-arrivals" className="text-primary-300 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="text-primary-300 hover:text-white transition-colors">Best Sellers</Link></li>
              <li><Link to="/sale" className="text-primary-300 hover:text-white transition-colors">Sale</Link></li>
              <li><Link to="/gift-card" className="text-primary-300 hover:text-white transition-colors">Gift Card</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-primary-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="text-primary-300 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-primary-300 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-primary-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-primary-300 mb-4">Subscribe for exclusive offers and new arrivals</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg text-primary-900 focus:outline-none"
              />
              <button className="bg-accent-600 hover:bg-accent-700 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-300 text-sm">
            © 2024 Motivation. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-primary-300 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-primary-300 hover:text-white text-sm transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
