import { Link } from 'react-router-dom';

export function TermsConditions() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600">
                By accessing and using the Motivation website and purchasing our products, you accept and agree to be bound 
                by these Terms & Conditions. If you do not agree to these terms, please do not use our website or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Products and Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Product Information</h3>
                  <p className="text-gray-600">
                    We strive to provide accurate product descriptions, pricing, and availability information. 
                    However, we do not warrant that product descriptions or other content of our site are accurate, 
                    complete, reliable, current, or error-free.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Pricing and Availability</h3>
                  <p className="text-gray-600">
                    Prices are subject to change without notice. We reserve the right to modify or discontinue 
                    products at any time without liability. All prices are displayed in EUR and include VAT where applicable.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Product Images</h3>
                  <p className="text-gray-600">
                    Product images on our website are for illustrative purposes only and may not precisely reflect 
                    the actual color, size, or appearance of the product.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Orders and Payment</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Order Acceptance</h3>
                  <p className="text-gray-600">
                    Your receipt of an electronic order confirmation does not signify our acceptance of your order, 
                    nor does it constitute confirmation of our offer to sell. We reserve the right at any time after 
                    receipt of your order to accept or decline your order for any reason.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Payment Terms</h3>
                  <p className="text-gray-600">
                    Payment must be received in full before goods are shipped. We accept payment through secure 
                    third-party payment processors. You agree to provide current, complete, and accurate purchase 
                    information for all purchases.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Order Cancellation</h3>
                  <p className="text-gray-600">
                    You may cancel your order within 2 hours of placement without penalty. After this period, 
                    cancellation requests will be evaluated on a case-by-case basis.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipping and Delivery</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Delivery Times</h3>
                  <p className="text-gray-600">
                    Estimated delivery times are provided in good faith but are not guaranteed. We are not 
                    liable for any delays in delivery.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Risk of Loss</h3>
                  <p className="text-gray-600">
                    Risk of loss and title for all merchandise ordered on this website pass to you when the 
                    merchandise is delivered to the shipping carrier.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Shipping Restrictions</h3>
                  <p className="text-gray-600">
                    We currently ship only within Italy and the European Union. We reserve the right to limit 
                    or refuse shipments to certain areas.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Returns and Refunds</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Return Policy</h3>
                  <p className="text-gray-600">
                    You may return unused items in their original packaging within 30 days of delivery for a 
                    full refund or exchange. Items must be unworn, unwashed, and in the same condition as received.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Return Process</h3>
                  <p className="text-gray-600">
                    To initiate a return, please contact our customer service team. You will be responsible for 
                    return shipping costs unless the return is due to our error.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Refund Processing</h3>
                  <p className="text-gray-600">
                    Refunds will be processed within 14 days of receiving the returned item. Refunds will be 
                    issued to the original payment method.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Intellectual Property</h2>
              <p className="text-gray-600">
                All content included on this site, such as text, graphics, logos, images, and software, is the 
                property of Motivation and protected by international copyright and trademark laws. 
                You may not use, reproduce, or distribute any content without our express written permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Conduct</h2>
              <p className="text-gray-600">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use the website for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the website or servers</li>
                <li>Post or transmit harmful, threatening, or abusive content</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600">
                In no event shall Motivation, our directors, employees, or affiliates be liable for any indirect, 
                incidental, special, or consequential damages arising out of or in connection with your use of 
                our website or products. Our total liability to you for any cause of action whatsoever shall not 
                exceed the amount paid by you for the product(s) at issue.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Indemnification</h2>
              <p className="text-gray-600">
                You agree to indemnify and hold Motivation and our affiliates harmless from any claim, demand, 
                or damage, including reasonable attorneys' fees, asserted by any third party due to or arising 
                out of your breach of these Terms or your violation of any law or rights of a third party.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy and Data Protection</h2>
              <p className="text-gray-600">
                Your privacy is important to us. Please review our 
                <Link to="/privacy" className="text-primary-600 hover:text-primary-700">Privacy Policy</Link> 
                and 
                <Link to="/cookie-policy" className="text-primary-600 hover:text-primary-700">Cookie Policy</Link> 
                to understand how we collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dispute Resolution</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Governing Law</h3>
                  <p className="text-gray-600">
                    These Terms shall be governed by and construed in accordance with the laws of Italy, 
                    without regard to its conflict of law provisions.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-xl font-medium text-gray-700 mb-2">Jurisdiction</h3>
                  <p className="text-gray-600">
                    Any dispute arising from these terms shall be subject to the exclusive jurisdiction of 
                    the courts of Rome, Italy.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Electronic Communications</h2>
              <p className="text-gray-600">
                By visiting our website or sending emails to us, you communicate with us electronically. 
                You consent to receive communications from us electronically. We will communicate with you by 
                email or by posting notices on this website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Changes to Terms</h2>
              <p className="text-gray-600">
                We reserve the right to modify these Terms at any time. If we make material changes, 
                we will notify you by email or by posting a notice on our website prior to the effective date 
                of the changes. Your continued use of the website after such changes constitutes acceptance 
                of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600">
                If you have any questions about these Terms & Conditions, please contact us:
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
                These Terms & Conditions were last updated on {new Date().toLocaleDateString()}
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
