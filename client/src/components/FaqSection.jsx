import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import './FaqSection.css';

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      category: 'SHIPPING & DELIVERY',
      icon: <Truck size={18} />,
      question: 'What are your delivery timelines & shipping charges?',
      answer: 'We offer complimentary standard shipping on all global orders over £150. Standard shipping takes 3-5 business days. Express courier delivery takes 1-2 business days.'
    },
    {
      category: 'RETURNS & EXCHANGES',
      icon: <RefreshCw size={18} />,
      question: 'What is SABLE’s return policy?',
      answer: 'We operate a 30-day complimentary return policy for unworn items with original security tags attached. Items can be returned via our online portal or directly at our Mayfair Atelier.'
    },
    {
      category: 'AUTHENTICITY & CRAFTSMANSHIP',
      icon: <ShieldCheck size={18} />,
      question: 'How are SABLE garments crafted & produced?',
      answer: 'Each garment is engineered in strictly limited runs of 100 units per silhouette in our London Atelier. We utilize 100% organic long-staple cottons, ethically sourced wools, and hand-finished blind stitching.'
    },
    {
      category: 'PAYMENT & RECURRING INQUIRIES',
      icon: <CreditCard size={18} />,
      question: 'Which payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, American Express, Apple Pay, and Klarna flexible installments. All online transactions are encrypted via 256-bit SSL protocols.'
    },
    {
      category: 'AI CONCIERGE & FIT ASSISTANCE',
      icon: <HelpCircle size={18} />,
      question: 'How does ApBot assist with bespoke styling & orders?',
      answer: 'ApBot is SABLE’s AI concierge. You can ask ApBot to search products, recommend complementary 3-piece outfits based on your height and weight, check real-time stock, track orders, or add pieces directly to your bag.'
    }
  ];

  return (
    <section id="faq" className="faq-section">
      <div className="wrap">
        <div className="faq-header">
          <span className="faq-tag">CLIENT INTELLIGENCE</span>
          <h2 className="faq-title">FREQUENTLY ASKED QUESTIONS</h2>
          <p className="faq-subtitle">
            Essential information regarding shipping, returns, limited runs, and ApBot client services.
          </p>
        </div>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`faq-item ${openIdx === idx ? 'open' : ''}`}
            >
              <button 
                type="button" 
                className="faq-question-btn"
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              >
                <div className="faq-q-left">
                  <span className="faq-cat-icon">{faq.icon}</span>
                  <div className="faq-q-text">
                    <span className="faq-cat-label">{faq.category}</span>
                    <h3 className="faq-q-title">{faq.question}</h3>
                  </div>
                </div>
                <div className="faq-toggle-icon">
                  {openIdx === idx ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>

              {openIdx === idx && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
