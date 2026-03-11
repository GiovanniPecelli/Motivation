import { Link } from 'react-router-dom';
import { Instagram, Youtube, Music } from 'lucide-react';
import logowhite from '../assets/logowhite.png';

export function Footer() {
  return (
    <footer className="bg-primary-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <a 
                href="https://www.instagram.com/motivationclothes_?igsh=MThpa2FqaWJ2N2hlaQ%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-pink-400 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@motivation.officialstore" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-gray-300 transition-colors"
                title="TikTok"
              >
                <Music className="h-5 w-5" />
              </a>
              <a 
                href="https://youtube.com/@pietromontioni?si=4R-fz2Lfxsnu9ZQb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary-300 hover:text-red-500 transition-colors"
                title="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li><a href="/#contact" className="text-primary-300 hover:text-white transition-colors">Contact Us</a></li>
              <li><Link to="/shipping" className="text-primary-300 hover:text-white transition-colors">Shipping</Link></li>
              <li><Link to="/returns" className="text-primary-300 hover:text-white transition-colors">Returns & Exchanges</Link></li>
              <li><Link to="/faq" className="text-primary-300 hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Empty space for balance */}
          <div></div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-300 text-sm">
            © 2024 Motivation. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/cookie-policy" className="text-primary-300 hover:text-white text-sm transition-colors">
              Cookie Policy
            </Link>
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
