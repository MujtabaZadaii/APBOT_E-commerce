import React, { useEffect } from 'react';
import { X, Sparkles, Shield, Compass, Award, HeartHandshake } from 'lucide-react';
import './AboutModal.css';

export default function AboutModal({ isOpen, onClose, onOpenShop }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="about-modal-overlay">
      <div className="about-modal-backdrop" onClick={onClose} />
      
      <div className="about-modal-content">
        {/* Header */}
        <div className="about-modal-header">
          <div className="about-header-badge">
            <Sparkles size={14} className="gold-icon" />
            <span>THE SABLE MAISON</span>
          </div>
          <button type="button" className="about-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>
        </div>

        {/* Hero Banner Section */}
        <div className="about-hero">
          <div className="about-hero-bg" />
          <div className="about-hero-text">
            <span className="about-hero-sub">ESTABLISHED IN LONDON</span>
            <h1 className="about-hero-title">ARCHITECTURAL LUXURY & COUTURE</h1>
            <p className="about-hero-desc">
              SABLE was born out of a desire to create timeless, sculptural silhouettes that transcend seasonal trends. 
              Crafted in limited numbers in our London Atelier.
            </p>
          </div>
        </div>

        {/* Brand Pillars Grid */}
        <div className="about-body">
          <div className="about-section-header">
            <span className="about-tag">PHILOSOPHY</span>
            <h2 className="about-heading">CRAFTED FOR DISTINCTION</h2>
          </div>

          <div className="about-pillars-grid">
            <div className="about-pillar-card">
              <div className="about-pillar-icon"><Compass size={24} /></div>
              <h3>MINIMALIST ARCHITECTURE</h3>
              <p>Every seam and panel is calculated with mathematical precision to create razor-sharp silhouettes with effortless drape.</p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon"><Shield size={24} /></div>
              <h3>LIMITED EDITION RUNS</h3>
              <p>We produce in strictly limited quantities of 100 units per piece, eliminating overproduction and ensuring rarity.</p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon"><Award size={24} /></div>
              <h3>SUSTAINABLE LUXURY</h3>
              <p>Utilizing 100% organic long-staple cottons, ethically sourced wools, and zero-waste pattern-cutting techniques.</p>
            </div>

            <div className="about-pillar-card">
              <div className="about-pillar-icon"><HeartHandshake size={24} /></div>
              <h3>AI-POWERED ASSISTANCE</h3>
              <p>ApBot, our proprietary AI concierge, brings personalized haute-couture styling & bespoke fit intelligence to e-commerce.</p>
            </div>
          </div>

          {/* Editorial Quote Section */}
          <div className="about-quote-box">
            <blockquote className="about-quote">
              "True luxury does not shout; it commands attention through immaculate proportions, flawless touch, and uncompromising integrity."
            </blockquote>
            <span className="about-quote-author">&mdash; SABLE CREATIVE DIRECTOR</span>
          </div>

          {/* Call to Action */}
          <div className="about-cta-box">
            <h3>DISCOVER THE CURRENT ARCHIVE</h3>
            <p>Explore our curated collection of architectural outerwear, tailoring, and essentials.</p>
            <button 
              type="button" 
              className="about-cta-btn" 
              onClick={() => {
                onClose();
                if (onOpenShop) onOpenShop();
              }}
            >
              EXPLORE COLLECTION
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="about-modal-footer">
          <span>SABLE HAUTE COUTURE • MAYFAIR, LONDON</span>
          <span>© 2026 SABLE ALL RIGHTS RESERVED</span>
        </div>
      </div>
    </div>
  );
}
