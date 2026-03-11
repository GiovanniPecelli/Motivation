import { Link } from 'react-router-dom';

export function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cookie Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">What Are Cookies</h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and understanding how you use our site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Cookies</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Essential Cookies</h3>
                  <p className="text-gray-600">
                    These cookies are necessary for the website to function and cannot be switched off in our systems. 
                    They are usually only set in response to actions made by you which amount to a request for services.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Performance Cookies</h3>
                  <p className="text-gray-600">
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. 
                    They help us to know which pages are the most and least popular and see how visitors move around the site.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Functional Cookies</h3>
                  <p className="text-gray-600">
                    These cookies enable the website to provide enhanced functionality and personalization. 
                    They may be set by us or by third party providers whose services we have added to our pages.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Marketing Cookies</h3>
                  <p className="text-gray-600">
                    These cookies may be set through our site by our advertising partners to build a profile of your interests 
                    and show you relevant adverts on other sites.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600">
                We use various third-party services that may set cookies on your device, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Payment processors for secure transactions</li>
                <li>Analytics services to understand user behavior</li>
                <li>Social media platforms for sharing functionality</li>
                <li>Advertising networks for targeted marketing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Managing Cookies</h2>
              <p className="text-gray-600">
                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer 
                and you can set most browsers to prevent them from being placed. However, if you do this, you may have to 
                manually adjust some preferences every time you visit a site and some services and functionality may not work.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-600">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Accept or reject non-essential cookies</li>
                <li>Withdraw consent at any time</li>
                <li>Access information about cookies we use</li>
                <li>Request deletion of your data collected via cookies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, 
                legal, or regulatory reasons. We will notify you of any changes by posting the new Cookie Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about this Cookie Policy, please contact us at:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p className="text-gray-700">Email: motivation.officialstore@gmail.com</p>
                <p className="text-gray-700 mt-2">
                  <a href="/#contact" className="text-primary-600 hover:text-primary-700 underline">
                    Or use our contact form →
                  </a>
                </p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                This policy was last updated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/" className="text-primary-600 hover:text-primary-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
