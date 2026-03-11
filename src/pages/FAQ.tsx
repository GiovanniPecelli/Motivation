export function FAQ() {
  const faqs = [
    {
      question: "Where is my order?",
      answer: "To track your order or receive updates on shipping status, we invite you to contact us directly via our contact form. We will be happy to provide you with all the necessary information."
    },
    {
      question: "Can I modify or cancel my order?",
      answer: "If you need to change the shipping address or cancel an order you just placed, please write to us as soon as possible through the contact form. We will try to fulfill your request before the order is processed."
    },
    {
      question: "What is your return policy?",
      answer: "We accept returns within 14 days of receiving the product. To start a return or size exchange procedure, contact us via the contact form indicating your order number."
    },
    {
      question: "Do you ship internationally?",
      answer: "We currently ship throughout Italy. For special international shipments, please contact us to receive a personalized quote and check feasibility."
    },
    {
      question: "Are payments secure?",
      answer: "Absolutely yes. All payments are securely managed through Stripe, the global leader in online payments. Your sensitive data never passes through our servers and is protected by the highest security standards."
    },
    {
      question: "How can I collaborate with Motivation?",
      answer: "We are always looking for motivated people! If you are an athlete or influencer and want to propose a collaboration, write to us via the contact form telling us your story."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b pb-4">Frequently Asked Questions (FAQ)</h1>
          
          <div className="space-y-8">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-100 pb-6 last:border-0">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary-50 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-primary-900 mb-4">Didn't find the answer?</h2>
            <p className="text-primary-700 mb-6 text-lg">
              Our team is always at your disposal to help you with any doubts or requests.
            </p>
            <a 
              href="/#contact" 
              className="inline-block bg-primary-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-primary-800 transition-colors shadow-md"
            >
              Write to us via Contact Form
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
