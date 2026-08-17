import React, { useState } from 'react';
import { ShoppingBag, Truck, RotateCcw, Shirt, CreditCard, User, HelpCircle, Plus, Minus, Headphones, ArrowRight } from 'lucide-react';
import './FaqSection.css';

export default function FaqSection({ onOpenContact }) {
  const [activeCategory, setActiveCategory] = useState('ORDERS');
  const [openQuestionIdx, setOpenQuestionIdx] = useState(0);

  const categories = [
    { id: 'ORDERS', name: 'ORDERS', icon: <ShoppingBag size={18} />, count: 4 },
    { id: 'SHIPPING', name: 'SHIPPING', icon: <Truck size={18} />, count: 4 },
    { id: 'RETURNS', name: 'RETURNS', icon: <RotateCcw size={18} />, count: 3 },
    { id: 'PRODUCTS', name: 'PRODUCTS', icon: <Shirt size={18} />, count: 4 },
    { id: 'PAYMENTS', name: 'PAYMENTS', icon: <CreditCard size={18} />, count: 3 },
    { id: 'ACCOUNT', name: 'ACCOUNT', icon: <User size={18} />, count: 3 },
    { id: 'OTHER', name: 'OTHER', icon: <HelpCircle size={18} />, count: 3 },
  ];

  const faqData = {
    ORDERS: [
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive a confirmation email with a tracking link. You can also track your order anytime from the "Track Order" section in your account or ask ApBot AI Concierge.'
      },
      {
        q: 'Can I cancel or modify my order after placing it?',
        a: 'Orders are processed quickly in our atelier. If you need to make changes, please contact client services within 1 hour of placing your order.'
      },
      {
        q: 'What should I do if I receive a damaged item?',
        a: 'In the rare event of receiving a damaged item, please notify us within 48 hours of delivery. We will arrange a complimentary pickup and immediate replacement.'
      },
      {
        q: 'Do you offer order confirmation via SMS?',
        a: 'Yes, if you provide your phone number at checkout, we will send real-time dispatch and delivery updates directly to your mobile device.'
      }
    ],
    SHIPPING: [
      {
        q: 'How long does shipping take?',
        a: 'Standard domestic delivery takes 2-4 business days. Express courier delivery takes 1-2 business days. International shipping takes 3-5 business days.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, SABLE ships worldwide to over 120 countries via DHL Express & FedEx Luxury Courier with full transit insurance.'
      },
      {
        q: 'What are the delivery charges?',
        a: 'We offer complimentary standard shipping on all global orders over £150. For orders under £150, standard shipping is £10.'
      },
      {
        q: 'Will I have to pay import duties & taxes?',
        a: 'All duties and taxes are calculated and included at checkout for seamless delivery with no unexpected fees upon arrival.'
      }
    ],
    RETURNS: [
      {
        q: 'What is your return policy?',
        a: 'We operate a 30-day complimentary return policy for unworn items in original condition with security tags attached.'
      },
      {
        q: 'How do I return an item?',
        a: 'You can initiate a return through your account dashboard or by contacting client services to receive a prepaid DHL shipping label.'
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 3 business days of receiving and inspecting your returned item back at our Mayfair Atelier.'
      }
    ],
    PRODUCTS: [
      {
        q: 'Are the products authentic & limited edition?',
        a: 'Yes, every SABLE garment is crafted in strictly limited runs of 100 individually numbered units in our London Atelier.'
      },
      {
        q: 'How do I know my correct size?',
        a: 'Each product page includes exact measurements. You can also consult ApBot AI Concierge for tailored sizing advice based on your height and weight.'
      },
      {
        q: 'How should I care for my wool and cashmere garments?',
        a: 'We recommend professional dry cleaning or hand washing in cold water with specialized wool detergent, lying flat to dry.'
      },
      {
        q: 'Will sold-out items be restocked?',
        a: 'Because our pieces are produced in limited runs of 100, sold-out items are rarely restocked to preserve exclusivity.'
      }
    ],
    PAYMENTS: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept Visa, Mastercard, American Express, Apple Pay, Google Pay, and Klarna flexible installment options.'
      },
      {
        q: 'Is my payment information secure?',
        a: 'All transactions are encrypted via 256-bit SSL technology. SABLE does not store your credit card details on our servers.'
      },
      {
        q: 'Do you offer installment payment plans?',
        a: 'Yes, through Klarna you can split your total purchase into 3 interest-free monthly payments at checkout.'
      }
    ],
    ACCOUNT: [
      {
        q: 'How do I create a SABLE account?',
        a: 'Click "Account" in the main navigation bar and select "Sign Up". You can also create an account during checkout.'
      },
      {
        q: 'How do I reset my password?',
        a: 'Click "Sign In" and select "Forgot Password" to receive a password reset link sent to your registered email address.'
      },
      {
        q: 'What are the benefits of having an account?',
        a: 'Account holders enjoy faster checkout, saved shipping addresses, order tracking history, and early access to limited collection drops.'
      }
    ],
    OTHER: [
      {
        q: 'How can I contact customer support?',
        a: 'Our Mayfair client concierge is available via email at concierge@sable-couture.com, telephone at +44 20 7946 0912, or 24/7 via ApBot AI.'
      },
      {
        q: 'Can I visit your London showroom?',
        a: 'Yes, our flagship atelier is located at 14 Bruton Street, Mayfair, London. Private appointments can be booked via Contact Us.'
      },
      {
        q: 'Do you offer bespoke or custom tailoring?',
        a: 'We offer made-to-measure alterations for select outerwear and tailoring pieces at our London Atelier.'
      }
    ]
  };

  const currentQuestions = faqData[activeCategory] || [];

  return (
    <section id="faq" className="sable-faq-layout-section">
      <div className="wrap">
        
        {/* Section Header */}
        <div className="sable-faq-header-block">
          <span className="sable-faq-eyebrow">CLIENT INTELLIGENCE</span>
          <h2 className="sable-faq-main-title">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="sable-faq-main-subtitle">
            Find answers to common inquiries regarding orders, shipping, returns, products, and client services.
          </p>
        </div>

        <div className="sable-faq-main-grid">
          {/* Left Sidebar Menu */}
          <div className="sable-faq-sidebar">
            <div className="sable-faq-tabs-stack">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={`sable-faq-tab-btn ${activeCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenQuestionIdx(0);
                  }}
                >
                  <div className="sable-faq-tab-left">
                    <span className="sable-faq-tab-icon">{cat.icon}</span>
                    <span className="sable-faq-tab-name">{cat.name}</span>
                  </div>
                  <span className="sable-faq-tab-count">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Support Card */}
            <div className="sable-faq-support-card">
              <div className="sable-support-headset-circle">
                <Headphones size={22} color="#D8C5A2" />
              </div>
              <h3 className="sable-support-title">Still need help?</h3>
              <p className="sable-support-desc">Our support team is here for you.</p>
              <button 
                type="button" 
                className="sable-support-contact-btn"
                onClick={() => {
                  if (onOpenContact) onOpenContact();
                }}
              >
                <span>CONTACT US</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Right Accordion List */}
          <div className="sable-faq-accordion-container">
            <div className="sable-faq-list-stack">
              {currentQuestions.map((item, idx) => {
                const isOpen = openQuestionIdx === idx;
                return (
                  <div key={idx} className={`sable-faq-row ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="sable-faq-row-btn"
                      onClick={() => setOpenQuestionIdx(isOpen ? null : idx)}
                    >
                      <h3 className="sable-faq-row-question">{item.q}</h3>
                      <span className="sable-faq-row-toggle">
                        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="sable-faq-row-answer">
                        <p>{item.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
