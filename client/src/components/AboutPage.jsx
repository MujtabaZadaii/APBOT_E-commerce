import React, { useEffect } from 'react';
import { Sparkles, Shield, Compass, Award, HeartHandshake, ArrowLeft, ArrowRight } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage({ onBack, onOpenShop }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="about-page-wrap">
      {/* Top Breadcrumb & Navigation */}
      <div className="wrap about-page-nav">
        <button type="button" onClick={onBack} className="about-back-btn">
          <ArrowLeft size={16} />
          <span>RETURN TO STORE</span>
        </button>
        <span className="about-page-badge">THE MAISON SABLE</span>
      </div>

      {/* Hero Banner Section */}
      <div className="about-page-hero">
        <div className="about-hero-overlay" />
        <div className="wrap about-hero-container">
          <span className="about-hero-sub">ESTABLISHED IN LONDON • MAYFAIR ATELIER</span>
          <h1 className="about-hero-headline">ARCHITECTURAL LUXURY & COUTURE</h1>
          <p className="about-hero-subhead">
            SABLE was founded on the principle that luxury clothing should be a sculptural extension of the wearer. 
            Crafted in strictly limited numbers of 100 units per piece to guarantee exclusivity and combat mass-market waste.
          </p>
        </div>
      </div>

      {/* Brand Statistics Bar */}
      <div className="about-stats-bar">
        <div className="wrap about-stats-grid">
          <div className="about-stat-item">
            <span className="about-stat-num">100</span>
            <span className="about-stat-lbl">LIMITED UNITS PER RUN</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-num">280gsm</span>
            <span className="about-stat-lbl">CUSTOM SINGLE JERSEY COTTON</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-num">100%</span>
            <span className="about-stat-lbl">ORGANIC & ETHICAL MATERIALS</span>
          </div>
          <div className="about-stat-item">
            <span className="about-stat-num">MAYFAIR</span>
            <span className="about-stat-lbl">LONDON FLAGSHIP ATELIER</span>
          </div>
        </div>
      </div>

      {/* Main Narrative & Craftsmanship Section */}
      <div className="wrap about-page-body">
        <div className="about-story-grid">
          <div className="about-story-text">
            <span className="about-section-tag">OUR HERITAGE</span>
            <h2 className="about-story-title">THE PHILOSOPHY OF RESTRAINT</h2>
            <p>
              In an era dominated by fast fashion and ephemeral micro-trends, SABLE represents a deliberate return to architectural minimalism. 
              Our design ethos centers around mathematical pattern construction, uncompromised fabric weights, and tactile refinement.
            </p>
            <p>
              Every outerwear piece, tailored jacket, and essential knit is developed over months of iteration in our Mayfair atelier. 
              We work exclusively with century-old mills in England, Italy, and Japan to source long-staple combed cottons, heavyweight wool suiting, and raw cashmeres.
            </p>
          </div>

          <div className="about-story-image">
            <div className="about-img-frame">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000" 
                alt="SABLE Atelier Studio" 
              />
              <div className="about-img-caption">SABLE ATELIER • LONDON</div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="about-pillars-section">
          <div className="about-pillars-header">
            <span className="about-section-tag">CORE PRINCIPLES</span>
            <h2 className="about-story-title">THE FOUR PILLARS OF SABLE</h2>
          </div>

          <div className="about-pillars-flex">
            <div className="about-pillar-box">
              <div className="about-pillar-num">01</div>
              <div className="about-pillar-icon"><Compass size={28} /></div>
              <h3>MINIMALIST ARCHITECTURE</h3>
              <p>Panels and seams designed with mathematical precision to achieve boxy, relaxed drapes that hold structure over decades.</p>
            </div>

            <div className="about-pillar-box">
              <div className="about-pillar-num">02</div>
              <div className="about-pillar-icon"><Shield size={28} /></div>
              <h3>STRICT LIMITED EDITIONS</h3>
              <p>We restrict every garment to 100 individually numbered units globally, eradicating overproduction and preserving rarity.</p>
            </div>

            <div className="about-pillar-box">
              <div className="about-pillar-num">03</div>
              <div className="about-pillar-icon"><Award size={28} /></div>
              <h3>SUSTAINABLE MATERIALS</h3>
              <p>Zero-waste pattern cuts, GOTS-certified organic cottons, and biodegradable packaging for an uncompromised eco-footprint.</p>
            </div>

            <div className="about-pillar-box">
              <div className="about-pillar-num">04</div>
              <div className="about-pillar-icon"><HeartHandshake size={28} /></div>
              <h3>APBOT AI CONCIERGE</h3>
              <p>Our proprietary deep-learning AI assistant brings bespoke fit guidance, styling recommendations, and instant ordering to luxury e-commerce.</p>
            </div>
          </div>
        </div>

        {/* Executive Editorial Statement */}
        <div className="about-quote-card">
          <Sparkles className="about-quote-star" size={24} />
          <blockquote className="about-editorial-quote">
            "True luxury does not shout or rely on overt branding. It commands respect through immaculate proportions, 
            heavyweight tactile substance, and quiet confidence."
          </blockquote>
          <div className="about-quote-author-info">
            <span className="about-author-name">MUJTABA ZADAI</span>
            <span className="about-author-title">FOUNDER & CREATIVE DIRECTOR, SABLE</span>
          </div>
        </div>

        {/* Call to Action Banner */}
        <div className="about-cta-banner">
          <h2>EXPLORE THE CURRENT ARCHIVE</h2>
          <p>Discover our latest collection of outerwear, tailoring, essentials, and accessories.</p>
          <button 
            type="button" 
            className="about-cta-action-btn"
            onClick={() => {
              if (onOpenShop) onOpenShop();
              else onBack();
            }}
          >
            <span>VIEW ALL PRODUCTS</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
