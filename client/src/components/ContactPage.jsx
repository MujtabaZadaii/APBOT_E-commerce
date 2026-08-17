import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageSquare, MapPin, User, ListFilter, Edit3, ArrowRight, Plus, Minus, CheckCircle2 } from 'lucide-react';
import './ContactPage.css';
export default function ContactPage({ onBack, onOpenApBot }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
  };
  const faqs = [
    {
      q: 'HOW LONG DOES SHIPPING TAKE?',
      a: 'Standard domestic shipping takes 2-4 business days. Express international courier delivery takes 3-5 business days globally.'
    },
    {
      q: 'WHAT IS YOUR RETURN POLICY?',
      a: 'We offer a 30-day complimentary return window for unworn garments with original security tags attached.'
    },
    {
      q: 'DO YOU OFFER INTERNATIONAL SHIPPING?',
      a: 'Yes, SABLE ships worldwide to over 120 countries via DHL Express & FedEx Luxury Courier.'
    },
    {
      q: 'HOW CAN I TRACK MY ORDER?',
      a: 'You can use our interactive Order Tracking modal or ask ApBot AI Concierge anytime with your Order ID.'
    }
  ];
  return (
    <div className="sable-contact-page">
      {}
      <div className="sable-contact-hero">
        <div className="wrap sable-contact-hero-grid">
          <div className="sable-contact-hero-left">
            <span className="sable-eyebrow">CONTACT</span>
            <h1 className="sable-contact-title">
              WE'RE HERE<br />FOR YOU
            </h1>
            <p className="sable-contact-hero-desc">
              Have a question, need style advice, or want to collaborate? Our team is always ready to assist you.
            </p>
            <a href="#send-message" className="sable-contact-hero-link">
              <span>GET IN TOUCH</span>
              <div className="sable-arrow-circle"><ArrowRight size={14} /></div>
            </a>
          </div>
          <div className="sable-contact-hero-right">
            <img 
              src="/images/sable_contact_boutique.png" 
              alt="SABLE Flagship Boutique Storefront" 
              className="sable-boutique-img"
            />
          </div>
        </div>
      </div>
      {/* 2. 4 CONTACT CARDS STRIP */}
      <div className="sable-contact-cards-strip">
        <div className="wrap sable-contact-cards-grid">
          {/* Email Us */}
          <div className="sable-c-card">
            <div className="sable-c-card-icon"><Mail size={20} /></div>
            <h3>EMAIL US</h3>
            <p>For general inquiries<br />or support.</p>
            <a href="mailto:hello@sable.com" className="sable-c-link">
              hello@sable.com <ArrowRight size={14} />
            </a>
          </div>
          {/* Call Us */}
          <div className="sable-c-card">
            <div className="sable-c-card-icon"><Phone size={20} /></div>
            <h3>CALL US</h3>
            <p>Mon &ndash; Fri | 9AM &ndash; 6PM<br />(PKT)</p>
            <a href="tel:+923001234567" className="sable-c-link">
              +92 300 1234567 <ArrowRight size={14} />
            </a>
          </div>
          {/* Live Chat */}
          <div className="sable-c-card" onClick={onOpenApBot} style={{ cursor: 'pointer' }}>
            <div className="sable-c-card-icon"><MessageSquare size={20} /></div>
            <h3>LIVE CHAT</h3>
            <p>Chat with our team<br />for quick help.</p>
            <span className="sable-c-link">
              START CHAT <ArrowRight size={14} />
            </span>
          </div>
          {/* Visit Us */}
          <div className="sable-c-card">
            <div className="sable-c-card-icon"><MapPin size={20} /></div>
            <h3>VISIT US</h3>
            <p>SABLE Flagship Store<br />Clifton 5, Karachi<br />Pakistan</p>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="sable-c-link">
              VIEW MAP <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
      {/* 3. SEND A MESSAGE SECTION */}
      <div id="send-message" className="sable-message-section">
        <div className="wrap sable-message-grid">
          {/* Left Form */}
          <div className="sable-msg-left">
            <span className="sable-eyebrow">SEND A MESSAGE</span>
            <h2 className="sable-msg-heading">
              WE'D LOVE TO<br />HEAR FROM YOU
            </h2>
            {submitted ? (
              <div className="sable-form-success">
                <CheckCircle2 size={48} color="#D8C5A2" />
                <h3>MESSAGE TRANSMITTED</h3>
                <p>Thank you, {formData.name}. Our team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="sable-contact-form">
                <div className="sable-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <User size={16} className="sable-input-icon" />
                </div>
                <div className="sable-input-wrapper">
                  <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <Mail size={16} className="sable-input-icon" />
                </div>
                <div className="sable-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Subject" 
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  />
                  <ListFilter size={16} className="sable-input-icon" />
                </div>
                <div className="sable-input-wrapper">
                  <textarea 
                    rows={4}
                    placeholder="Your Message" 
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                  <Edit3 size={16} className="sable-input-icon textarea-icon" />
                </div>
                <button type="submit" className="sable-gold-btn">
                  <span>SEND MESSAGE</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
          {}
          <div className="sable-msg-right">
            <img 
              src="/images/sable_contact_model.png" 
              alt="SABLE Luxury Model" 
              className="sable-portrait-img"
            />
            <div className="sable-quote-overlay">
              <span className="sable-quote-mark">“</span>
              <blockquote className="sable-quote-text">
                True luxury is not about logos, it's about how it makes you feel.
              </blockquote>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="sable-faq-strip">
        <div className="wrap">
          <div className="sable-faq-header">
            <span className="sable-faq-line" />
            <span className="sable-faq-title">FREQUENTLY ASKED QUESTIONS</span>
            <span className="sable-faq-line" />
          </div>
          <div className="sable-faq-horizontal-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="sable-faq-col">
                <div 
                  className="sable-faq-q-box" 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                >
                  <span className="sable-faq-q-text">{faq.q}</span>
                  <div className="sable-faq-toggle">
                    {openFaq === idx ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </div>
                {openFaq === idx && (
                  <div className="sable-faq-a-box">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {}
      <div className="sable-newsletter-bar">
        <div className="wrap sable-news-container">
          <div className="sable-news-left">
            <h3>STAY IN THE KNOW</h3>
            <p>Be the first to know about new collections, exclusive offers, and more.</p>
          </div>
          <div className="sable-news-right">
            {subscribed ? (
              <span className="sable-subscribed-text">✓ YOU ARE NOW SUBSCRIBED TO SABLE</span>
            ) : (
              <form onSubmit={handleSubscribe} className="sable-news-form">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  required
                />
                <button type="submit" className="sable-gold-btn news-btn">
                  <span>SUBSCRIBE</span>
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
