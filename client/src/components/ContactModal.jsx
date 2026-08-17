import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import './ContactModal.css';

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setSubmitted(false);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      onClose();
    }, 2500);
  };

  return (
    <div className="contact-modal-overlay">
      <div className="contact-modal-backdrop" onClick={onClose} />
      
      <div className="contact-modal-content">
        {/* Header */}
        <div className="contact-modal-header">
          <span className="contact-header-title">CLIENT SERVICES & CONCIERGE</span>
          <button type="button" className="contact-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        <div className="contact-modal-body">
          {/* Left Contact Info Column */}
          <div className="contact-info-col">
            <span className="contact-tag">DIRECT INQUIRIES</span>
            <h2 className="contact-heading">ATELIER CONCIERGE</h2>
            <p className="contact-subtext">
              Our client relations team is available to assist with bespoke orders, styling consultations, and order status.
            </p>

            <div className="contact-detail-cards">
              <div className="contact-detail-card">
                <MapPin className="contact-icon" size={20} />
                <div>
                  <h4>MAYFAIR ATELIER</h4>
                  <p>14 Bruton Street, Mayfair, London W1J 6LX, UK</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <Mail className="contact-icon" size={20} />
                <div>
                  <h4>EMAIL SERVICES</h4>
                  <p>concierge@sable-couture.com</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <Phone className="contact-icon" size={20} />
                <div>
                  <h4>PRIVATE CLIENT PHONE</h4>
                  <p>+44 20 7946 0912 (Mon&ndash;Fri, 9am&ndash;6pm GMT)</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <Clock className="contact-icon" size={20} />
                <div>
                  <h4>RESPONSE TIMELINE</h4>
                  <p>Inquiries reviewed within 2 hours during business operations.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Column */}
          <div className="contact-form-col">
            {submitted ? (
              <div className="contact-success-box">
                <CheckCircle2 size={48} className="contact-success-icon" />
                <h3>INQUIRY TRANSMITTED</h3>
                <p>Thank you, {formData.name}. Our concierge client manager will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h3 className="contact-form-title">TRANSMIT AN INQUIRY</h3>
                
                <div className="contact-field-group">
                  <label>FULL NAME</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Lord Sterling" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="contact-field-group">
                  <label>EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    placeholder="sterling@maison.com" 
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="contact-field-group">
                  <label>INQUIRY TYPE</label>
                  <select 
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bespoke Order">Bespoke Fitting & Sizing</option>
                    <option value="Order Tracking">Order & Shipping Status</option>
                    <option value="VIP Membership">VIP Membership & Perks</option>
                  </select>
                </div>

                <div className="contact-field-group">
                  <label>MESSAGE</label>
                  <textarea 
                    rows={4}
                    placeholder="How may our concierge assist your purchase today?"
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="contact-submit-btn">
                  <Send size={16} />
                  <span>SEND CONCIERGE MESSAGE</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="contact-modal-footer">
          <span>SABLE HAUTE COUTURE • CONCIERGE DIVISION</span>
          <span>MAYFAIR • LONDON</span>
        </div>
      </div>
    </div>
  );
}
