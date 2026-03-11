import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import gallery2 from '../assets/siteimages/openart-image_6IHGUOok_1772403408299_raw.png';
import gallery3 from '../assets/siteimages/openart-image_OFs7NMsA_1772403133129_raw.png';
import gallery4 from '../assets/siteimages/openart-image_Q5I1jzY0_1772403171787_raw.png';
import logowhite from '../assets/logowhite.png';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export function Home() {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(4);

      if (productsError) throw productsError;

      const productsWithVariants = await Promise.all(
        (productsData || []).map(async (product) => {
          const { data: variantsData, error: variantsError } = await supabase
            .from('product_variants')
            .select('*')
            .eq('product_id', product.id);

          if (variantsError) console.error('Variants error:', variantsError);

          return {
            ...product,
            variants: variantsData || []
          };
        })
      );

      setFeaturedProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      // Construct and trigger mailto link
      const recipient = 'motivation.officialstore@gmail.com';
      const subject = encodeURIComponent(`Messaggio da ${formData.name} - Motivation Store`);
      const body = encodeURIComponent(
        `Nome: ${formData.name}\n\n` +
        `Messaggio:\n${formData.message}`
      );
      
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      
      setSubmitMessage('Opening your email client... Thank you for reaching out!');
      setFormData({ name: '', message: '' });
      
      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(''), 5000);
    } catch (error) {
      console.error('Error preparing email:', error);
      setSubmitMessage('Error preparing the message. Please try again later.');
      setTimeout(() => setSubmitMessage(''), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-70"
          style={{
            backgroundImage: 'url(https://res.cloudinary.com/dr7jw0v7u/image/upload/v1773245747/openart-image_1773245281795_48a4e940_1773245281893_d0b74854_wdhcz0.png)'
          }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/55 to-primary-800/55" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
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
              Driven by your goals. Premium gear for everyone chasing their ambitions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products" className="btn-primary inline-flex items-center justify-center">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#about" className="btn-secondary inline-flex items-center justify-center">
                About Us
              </a>
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
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent-600">01</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Built for Ambition</h3>
                <p className="text-primary-600">Where purpose-driven design meets peak performance</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent-600">02</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Purpose in Motion</h3>
                <p className="text-primary-600">Every piece designed to amplify your personal journey</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-accent-600">03</span>
                </div>
                <h3 className="font-semibold text-primary-900 mb-2">Vision Beyond Limits</h3>
                <p className="text-primary-600">Where innovation meets ambition, dreams become reality</p>
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
                  src="https://res.cloudinary.com/dr7jw0v7u/image/upload/v1773262317/openart-image_1773261758039_7e150243_1773261758132_ceecc43a_irpmmc.png" 
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
              <div className="h-[62.5rem] rounded-lg overflow-hidden relative group hover:shadow-xl transition-shadow">
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
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Vision & Mission - Stacked */}
            <div className="space-y-12">
              {/* Vision */}
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
              
              {/* Mission */}
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
            </div>
            
            {/* Vision Image */}
            <div className="space-y-6">
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <img 
                  src={gallery4} 
                  alt="Our vision for the future" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Contact */}
            <div id="contact">
              <h2 className="text-3xl font-display font-black text-primary-900 mb-8">
                GET IN TOUCH
              </h2>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                {submitMessage && (
                  <div className={`mb-4 p-3 rounded-lg text-center ${
                    submitMessage.includes('Opening') 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {submitMessage}
                  </div>
                )}
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-primary-700 mb-2">Name *</label>
                    <input 
                      id="contact-name"
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500" 
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-primary-700 mb-2">Message *</label>
                    <textarea 
                      id="contact-message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={4} 
                      className="w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:border-accent-500"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-primary-600">Loading products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-primary-50 rounded-lg">
              <p className="text-primary-600">No featured products at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
