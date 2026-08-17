import React, { useEffect } from 'react';
import { Play, ArrowUpRight, ArrowRight } from 'lucide-react';
import './AboutPage.css';
export default function AboutPage({ onBack, onOpenShop }) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);
  return (
    <div className="sable-about-page">
      {}
      <div className="sable-about-hero">
        <div className="sable-hero-left">
          <div className="sable-scroll-indicator">
            <span className="sable-scroll-line" />
            <span>SCROLL</span>
          </div>
          <div className="sable-hero-content">
            <span className="sable-eyebrow">ABOUT SABLE</span>
            <h1 className="sable-hero-heading">
              Built on<br />Timelessness.
            </h1>
            <span className="sable-hero-subtag">NOT TRENDS.</span>
            <p className="sable-hero-paragraph">
              SABLE was born from a singular belief &mdash; that true style doesn't chase seasons, it defines them.
            </p>
          </div>
        </div>
        <div className="sable-hero-right">
          <img 
            src="/images/sable_about_hero.png" 
            alt="SABLE Editorial Model" 
            className="sable-hero-img"
          />
          <div className="sable-film-btn" onClick={() => alert('SABLE Atelier Film (1:24)')}>
            <div className="sable-film-icon">
              <Play size={18} fill="#FFFFFF" color="#FFFFFF" />
            </div>
            <div className="sable-film-text">
              <span className="sable-film-title">OUR STORY</span>
              <span className="sable-film-time">WATCH FILM - 1:24</span>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="sable-philosophy-section">
        <div className="wrap sable-philosophy-grid">
          <div className="sable-craft-img-wrap">
            <img 
              src="/images/sable_about_craft.png" 
              alt="Artisan Craftsmanship" 
              className="sable-craft-img"
            />
          </div>
          <div className="sable-philosophy-content">
            <span className="sable-eyebrow">OUR PHILOSOPHY</span>
            <h2 className="sable-section-heading">
              Less Noise.<br />More Meaning.
            </h2>
            <p className="sable-philosophy-desc">
              We design essential pieces for people who understand quiet confidence &mdash; those who prefer substance over hype and craft over compromise.
            </p>
            <div className="sable-philosophy-pillars">
              <div className="sable-pillar-col">
                <span className="sable-pillar-num">01</span>
                <h3>Timeless Design</h3>
                <p>Pieces made to last, season after season.</p>
              </div>
              <div className="sable-pillar-col">
                <span className="sable-pillar-num">02</span>
                <h3>Exquisite Craftsmanship</h3>
                <p>Precision in every stitch and structure.</p>
              </div>
              <div className="sable-pillar-col">
                <span className="sable-pillar-num">03</span>
                <h3>Conscious Future</h3>
                <p>Smarter materials. Lower footprint.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="sable-stats-strip">
        <div className="wrap sable-stats-flex">
          <div className="sable-stat-box">
            <span className="sable-stat-tag">ESTD</span>
            <span className="sable-stat-val">2021</span>
          </div>
          <div className="sable-stat-box">
            <span className="sable-stat-val">4</span>
            <span className="sable-stat-lbl">Signature<br />Collections</span>
          </div>
          <div className="sable-stat-box">
            <span className="sable-stat-val">50K+</span>
            <span className="sable-stat-lbl">Global<br />Community</span>
          </div>
          <div className="sable-stat-box">
            <span className="sable-stat-val">12</span>
            <span className="sable-stat-lbl">Countries<br />Worldwide</span>
          </div>
        </div>
      </div>
      {}
      <div className="sable-categories-showcase">
        <div className="wrap sable-cat-grid">
          <div className="sable-cat-card" onClick={onOpenShop}>
            <img src="/images/sable_grid_outerwear.png" alt="Outerwear" />
            <div className="sable-cat-card-overlay">
              <div className="sable-cat-meta">
                <span className="sable-cat-title">OUTERWEAR</span>
                <span className="sable-cat-sub">Designed for Movement <ArrowUpRight size={14} /></span>
              </div>
            </div>
          </div>
          <div className="sable-cat-card" onClick={onOpenShop}>
            <img src="/images/sable_grid_tailoring.png" alt="Tailoring" />
            <div className="sable-cat-card-overlay">
              <div className="sable-cat-meta">
                <span className="sable-cat-title">TAILORING</span>
                <span className="sable-cat-sub">Refined Structure <ArrowUpRight size={14} /></span>
              </div>
            </div>
          </div>
          <div className="sable-cat-card" onClick={onOpenShop}>
            <img src="/images/sable_grid_knitwear.png" alt="Knitwear" />
            <div className="sable-cat-card-overlay">
              <div className="sable-cat-meta">
                <span className="sable-cat-title">KNITWEAR</span>
                <span className="sable-cat-sub">Quiet Luxury <ArrowUpRight size={14} /></span>
              </div>
            </div>
          </div>
          <div className="sable-cat-card" onClick={onOpenShop}>
            <img src="/images/sable_grid_archive.png" alt="Archive" />
            <div className="sable-cat-card-overlay">
              <div className="sable-cat-meta">
                <span className="sable-cat-title">ARCHIVE</span>
                <span className="sable-cat-sub">Where Legacy Lives <ArrowUpRight size={14} /></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {}
      <div className="sable-sustainability-section">
        <div className="wrap sable-sustainability-grid">
          <div className="sable-sust-img-wrap">
            <img src="/images/sable_grid_archive.png" alt="Sustainability" />
          </div>
          <div className="sable-sust-content">
            <span className="sable-eyebrow">SUSTAINABILITY</span>
            <h2 className="sable-section-heading">A Smarter Tomorrow.</h2>
            <p className="sable-sust-desc">
              We are committed to responsible creation &mdash; selecting better materials, reducing waste, and designing pieces that respect both people and the planet.
            </p>
            <button type="button" className="sable-btn-outline" onClick={onOpenShop}>
              <span>OUR INITIATIVES</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
      {}
      <div className="sable-community-cta">
        <div className="wrap sable-comm-container">
          <div className="sable-comm-left">
            <span className="sable-eyebrow">JOIN THE JOURNEY</span>
            <h2 className="sable-comm-title">
              More Than a Brand.<br /><i>A Community.</i>
            </h2>
          </div>
          <div className="sable-comm-right">
            <p>
              Be part of a global movement that values authenticity, expression and modern elegance.
            </p>
            <button type="button" className="sable-comm-btn" onClick={onOpenShop}>
              <span>EXPLORE COLLECTIONS</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
