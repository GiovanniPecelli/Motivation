import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { mockProducts } from '../data/mockData';
import gallery1 from '../assets/siteimages/openart-image_-dOJt8BC_1772402269171_raw.jpg';
import gallery2 from '../assets/siteimages/openart-image_6IHGUOok_1772403408299_raw.png';
import gallery3 from '../assets/siteimages/openart-image_OFs7NMsA_1772403133129_raw.png';
import gallery4 from '../assets/siteimages/openart-image_Q5I1jzY0_1772403171787_raw.png';
import gallery5 from '../assets/siteimages/openart-image__VGrzHG4_1772402548373_raw.png';
import logowhite from '../assets/logowhite.png';

export function Home() {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="mb-8">
              <img 
                src={logowhite} 
                alt="MOTIVATION" 
                className="h-16 md:h-20 w-auto mb-6 bg-transparent"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-black font-display mb-6">
              WE MAKE YOU
              <span className="block text-accent-500">MOTIVATED</span>
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Driven by your goals. Quality gear for everyone chasing their ambitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/products" className="btn-secondary inline-flex items-center justify-center">
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hook Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-display font-black text-primary-900 mb-6">
              UNLEASH YOUR POTENTIAL
            </h2>
            <p className="text-xl text-primary-600 mb-8">
              Every workout is a step towards greatness. Our gear is engineered to push your limits and amplify your performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-600">01</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Train Harder</h3>
                <p className="text-primary-600">Premium materials for maximum performance</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-600">02</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Recover Faster</h3>
                <p className="text-primary-600">Advanced compression technology</p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-accent-600">03</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Achieve More</h3>
                <p className="text-primary-600">Designed for champions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-black text-primary-900 mb-4">
              MOTIVATION IN EVERY FIELD
            </h2>
            <p className="text-xl text-primary-600">
              From the gym to the classroom, from the stage to the office - discover how people everywhere are pushing their limits
            </p>
          </div>
          
          {/* New Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left Column - Vertical */}
            <div className="lg:col-span-5 space-y-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow relative">
                <img 
                  src={gallery1} 
                  alt="Stay focused on your goals" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">Stay Focused</h3>
                    <p className="text-sm opacity-90">Every goal matters, big or small</p>
                  </div>
                </div>
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden group hover:shadow-lg transition-shadow relative">
                <img 
                  src={gallery2} 
                  alt="Reach higher in your journey" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-2">Reach Higher</h3>
                    <p className="text-sm opacity-90">No limits, just possibilities</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Column - Call to Action */}
            <div className="lg:col-span-7">
              <div className="h-full rounded-lg overflow-hidden relative group hover:shadow-xl transition-shadow">
                <img 
                  src={gallery3} 
                  alt="Start your journey with motivation" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex items-center justify-center p-8">
                  <div className="text-center z-10 max-w-md text-white">
                    <h3 className="text-3xl font-bold mb-4">
                      START YOUR JOURNEY
                    </h3>
                    <p className="text-lg mb-6 opacity-90">
                      Every goal begins with a single step. Take yours today with gear that supports your ambition.
                    </p>
                    <Link to="/products" className="btn-primary bg-accent-600 hover:bg-accent-700 text-white inline-flex items-center">
                      Shop Collection
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-display font-black text-primary-900 mb-6">
                  OUR VISION
                </h2>
                <p className="text-primary-600 mb-4">
                  To become the global leader in athletic performance wear, empowering every athlete to reach their full potential through innovative design and uncompromising quality.
                </p>
                <p className="text-primary-600">
                  We envision a world where every workout is enhanced by gear that understands the athlete's needs and pushes the boundaries of what's possible.
                </p>
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={gallery4} 
                  alt="Our vision for the future" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* Mission */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-display font-black text-primary-900 mb-6">
                  OUR MISSION
                </h2>
                <p className="text-primary-600 mb-4">
                  To engineer premium athletic apparel that combines cutting-edge technology with superior comfort, helping athletes of all levels achieve their personal best.
                </p>
                <p className="text-primary-600">
                  We're committed to sustainability, innovation, and creating products that make a real difference in athletic performance.
                </p>
              </div>
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={gallery5} 
                  alt="Our mission in action" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews & Contact Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Reviews */}
            <div>
              <h2 className="text-3xl font-display font-black text-primary-900 mb-8">
                WHAT ATHLETES SAY
              </h2>
              <div className="space-y-6">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-primary-200 rounded-full mr-4"></div>
                      <div>
                        <h4 className="font-semibold text-primary-900">Athlete {review}</h4>
                        <p className="text-sm text-primary-600">Verified Customer</p>
                      </div>
                    </div>
                    <p className="text-primary-700">
                      "Motivation gear has completely transformed my training sessions. The quality and comfort are unmatched."
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <h2 className="text-3xl font-display font-black text-primary-900 mb-8">
                GET IN TOUCH
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Name</label>
                    <input type="text" className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Email</label>
                    <input type="email" className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-2">Message</label>
                    <textarea rows={4} className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500"></textarea>
                  </div>
                  <button type="submit" className="btn-primary w-full">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-display font-black text-primary-900">
                Featured Products
              </h2>
              <p className="text-primary-600 mt-2">Our best-selling items right now</p>
            </div>
            <Link to="/products" className="nav-link flex items-center">
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
