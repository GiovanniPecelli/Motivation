import { Link } from 'react-router-dom';

export function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
              <p className="text-gray-600">
                At Motivation, we respect your privacy and are committed to protecting your personal data. 
                This Privacy Policy explains how we collect, use, and protect your information when you visit our website 
                and purchase our products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Personal Information</h3>
                  <p className="text-gray-600">
                    When you create an account, make a purchase, or contact us, we may collect:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Name, email address, and contact information</li>
                    <li>Shipping and billing addresses</li>
                    <li>Payment information (processed securely by Stripe)</li>
                    <li>Account preferences and order history</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Technical Information</h3>
                  <p className="text-gray-600">
                    We automatically collect certain technical information when you visit our website:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>IP address and browser type</li>
                    <li>Device information and operating system</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referral source and click patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
              <p className="text-gray-600">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send you order confirmations and shipping updates</li>
                <li>Personalize your shopping experience</li>
                <li>Improve our website and products</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Legal Basis for Processing</h2>
              <p className="text-gray-600">
                We process your personal data based on the following legal grounds:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Contract Necessity:</strong> To fulfill our obligations under your purchase agreement</li>
                <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                <li><strong>Consent:</strong> For marketing communications and non-essential cookies</li>
                <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Sharing and Third Parties</h2>
              <p className="text-gray-600">
                We may share your information with trusted third parties to provide our services:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Payment Processors:</strong> To securely process payments (Stripe, PayPal)</li>
                <li><strong>Shipping Services:</strong> To deliver your orders (courier services)</li>
                <li><strong>Analytics Providers:</strong> To understand user behavior (Google Analytics)</li>
                <li><strong>Marketing Platforms:</strong> To manage email campaigns (with consent)</li>
              </ul>
              <p className="text-gray-600 mt-4">
                We ensure all third parties provide adequate protection for your personal data and process it only 
                according to our instructions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-600">
                We implement appropriate technical and organizational measures to protect your personal data, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>SSL encryption for all data transmissions</li>
                <li>Secure payment processing through PCI-compliant providers</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and employee training on data protection</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-600">
                Under applicable data protection laws, you have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Transfer your data to another service</li>
                <li><strong>Objection:</strong> Object to processing of your data</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Data Retention</h2>
              <p className="text-gray-600">
                We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, 
                including for legal, accounting, or reporting requirements. Specific retention periods include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Order data: 7 years for tax and legal purposes</li>
                <li>Account information: Until you request deletion</li>
                <li>Marketing data: Until you withdraw consent</li>
                <li>Analytics data: 26 months (anonymized thereafter)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">International Data Transfers</h2>
              <p className="text-gray-600">
                Your personal data may be transferred to and processed in countries outside the European Economic Area. 
                We ensure adequate protection through appropriate safeguards such as:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Standard Contractual Clauses (SCCs)</li>
                <li>Adequacy decisions from the European Commission</li>
                <li>Compliance with GDPR requirements</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600">
                We use cookies and similar technologies to enhance your experience. Please refer to our 
                <Link to="/cookie-policy" className="text-primary-600 hover:text-primary-700">Cookie Policy</Link> 
                for detailed information about how we use cookies and your choices regarding them.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Children's Privacy</h2>
              <p className="text-gray-600">
                Our website and services are not intended for individuals under the age of 16. 
                We do not knowingly collect personal information from children under 16. 
                If you believe we have collected such information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to This Policy</h2>
              <p className="text-gray-600">
                We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                We will notify you of any material changes by posting the updated policy on our website and updating the "last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg mt-4">
                <p className="text-gray-700"><strong>Email:</strong> motivation.officialstore@gmail.com</p>
                <p className="text-gray-700 mt-2">
                  <a href="/#contact" className="text-primary-600 hover:text-primary-700 underline">
                    Or use our contact form →
                  </a>
                </p>
              </div>
            </section>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                This Privacy Policy was last updated on {new Date().toLocaleDateString()}
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
