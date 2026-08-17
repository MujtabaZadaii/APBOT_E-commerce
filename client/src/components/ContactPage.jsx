import React, { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage({ onBack }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
    }, 4000);
  };

  return (
    <div className="contact-page-wrap">
      {/* Top Breadcrumb & Navigation */}
      <div className="wrap contact-page-nav">
        <button type="button" onClick={onBack} className="contact-back-btn">
          <ArrowLeft size={16} />
          <span>RETURN TO STORE</span>
        </button>
        <span className="contact-page-badge">MAYFAIR CONCIERGE DIVISION</span>
      </div>

      {/* Hero Banner Section */}
      <div className="contact-page-hero">
        <div className="contact-hero-overlay" />
        <div className="wrap contact-hero-container">
          <span className="contact-hero-sub">PRIVATE CLIENT SERVICES</span>
          <h1 className="contact-hero-headline">CLIENT CONCIERGE & ATELIER</h1>
          <p className="contact-hero-subhead">
            Our London Atelier team and client concierge are at your service for bespoke sizing consultations, 
            private showroom appointments, and order assistance.
          </p>
        </div>
      </div>

      {/* Main Body */}
      <div className="wrap contact-page-body">
        <div className="contact-grid">
          
          {/* Left Column: Direct Info Cards */}
          <div className="contact-left-col">
            <div className="contact-section-header">
              <span className="contact-section-tag">DIRECT CHANNELS</span>
              <h2 className="contact-section-title">MAYFAIR HEADQUARTERS</h2>
            </div>

            <div className="contact-cards-stack">
              <div className="contact-card">
                <div className="contact-card-icon"><MapPin size={22} /></div>
                <div className="contact-card-content">
                  <h3>FLAGSHIP ATELIER</h3>
                  <p>14 Bruton Street, Mayfair, London W1J 6LX, United Kingdom</p>
                  <span className="contact-card-extra">Private appointments available upon request</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon"><Mail size={22} /></div>
                <div className="contact-card-content">
                  <h3>EMAIL CONCIERGE</h3>
                  <p>concierge@sable-couture.com</p>
                  <span className="contact-card-extra">Priority response within 2 hours</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon"><Phone size={22} /></div>
                <div className="contact-card-content">
                  <h3>TELEPHONE DIRECT</h3>
                  <p>+44 20 7946 0912</p>
                  <span className="contact-card-extra">Mon&ndash;Fri, 9:00am &ndash; 6:00pm GMT</span>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon"><Clock size={22} /></div>
                <div className="contact-card-content">
                  <h3>OPERATING HOURS</h3>
                  <p>Atelier: Mon&ndash;Sat 10:00am &ndash; 7:00pm GMT</p>
                  <p>AI Assistant (ApBot): 24/7 Real-Time Availability</p>
                </div>
              </div>
            </div>

            {/* Atelier Map / Image Card */}
            <div className="contact-atelier-preview">
              <img 
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800" 
                alt="SABLE Mayfair Storefront" 
              />
              <div className="contact-preview-badge">
                <Sparkles size={14} className="gold-icon" />
                <span>VISIT OUR MAYFAIR SHOWROOM</span>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="contact-right-col">
            <div className="contact-form-container">
              {submitted ? (
                <div className="contact-submitted-view">
                  <CheckCircle2 size={54} className="contact-check-icon" />
                  <h2>INQUIRY TRANSMITTED</h2>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. Your message has been received by our Mayfair Concierge Manager. 
                    We will contact you at <strong>{formData.email}</strong> shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-main-form">
                  <div className="contact-form-header">
                    <span className="contact-form-tag">CONCIERGE INQUIRY</span>
                    <h2>SEND A DIRECT MESSAGE</h2>
                  </div>

                  <div className="contact-form-group">
                    <label>FULL NAME</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Lord Sterling"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      placeholder="sterling@maison.com"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="contact-form-group">
                    <label>INQUIRY TYPE</label>
                    <select 
                      value={formData.subject}
                      onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Bespoke Order">Bespoke Fitting & Sizing Consultation</option>
                      <option value="Order Tracking">Order & Delivery Status</option>
                      <option value="Showroom Visit">Mayfair Showroom Appointment</option>
                    </select>
                  </div>

                  <div className="contact-form-group">
                    <label>MESSAGE</label>
                    <textarea 
                      rows={5}
                      placeholder="Please detail your request or preferred appointment time..."
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="contact-main-submit-btn">
                    <Send size={16} />
                    <span>TRANSMIT INQUIRY TO CONCIERGE</span>
                  </button>

                  <div className="contact-form-security-note">
                    <ShieldCheck size={14} />
                    <span>All client inquiries are transmitted via 256-bit encrypted SSL protocols.</span>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
