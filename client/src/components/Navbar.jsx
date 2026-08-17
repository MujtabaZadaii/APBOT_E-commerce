import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, ShoppingBag, User, Heart, Package, ChevronRight, Sparkles, LogOut, SlidersHorizontal, Info, Mail, HelpCircle } from 'lucide-react';
import ProfileDropdown from './ProfileDropdown';
export default function Navbar({
  bagCount = 0,
  favCount = 0,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenCart,
  onOpenSearch,
  onOpenProfile,
  onOpenWishlist,
  onOpenTracking,
  onOpenOrders,
  onGoHome,
  onOpenProducts,
  onOpenAbout,
  onOpenFaq,
  onOpenContact
}) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const prevBagCount = useRef(bagCount);
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        setIsCompressed(true);
      } else {
        setIsCompressed(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);
  useEffect(() => {
    if (bagCount !== prevBagCount.current) {
      setBagPulse(true);
      const timer = setTimeout(() => setBagPulse(false), 400);
      prevBagCount.current = bagCount;
      return () => clearTimeout(timer);
    }
  }, [bagCount]);
  const handleHomeClick = (e) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoHome) onGoHome();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoHome) onGoHome();
    setTimeout(() => {
      const el = document.querySelector(targetId);
      if (el) {
        if (window.lenis) {
          window.lenis.scrollTo(el, { offset: -90, duration: 1.2 });
        } else {
          const topPos = el.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: topPos, behavior: 'smooth' });
        }
      }
    }, 80);
  };
  return (
    <>
      <nav className={`sable-nav ${isCompressed ? 'compressed' : ''}`}>
        <div className="wrap bar">
          {}
          <ul className="desktop-links">
            <li><a href="#home" onClick={handleHomeClick}>HOME</a></li>
            <li>
              <a 
                href="#shop" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenProducts) onOpenProducts();
                  else handleAnchorClick(e, '#shop');
                }}
              >
                PRODUCTS
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenAbout) onOpenAbout();
                }}
              >
                ABOUT
              </a>
            </li>
            <li>
              <a 
                href="#faq" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenFaq) onOpenFaq();
                  else handleAnchorClick(e, '#faq');
                }}
              >
                FAQ
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                onClick={(e) => {
                  e.preventDefault();
                  if (onOpenContact) onOpenContact();
                }}
              >
                CONTACT
              </a>
            </li>
          </ul>
          {}
          <div className="mobile-menu-trigger">
            <button 
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-toggle-btn"
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
              <span className="mobile-menu-label">MENU</span>
            </button>
          </div>
          {}
          <div 
            className="mk brand-logo" 
            onClick={handleHomeClick}
            style={{ cursor: 'pointer' }}
            title="SABLE Home"
          >
            SABLE
          </div>
          {}
          <div className="util">
            <span 
              onClick={onOpenSearch} 
              style={{ cursor: 'pointer' }} 
              className="nav-util-item desktop-search"
            >
              Search
            </span>
            <span
              onClick={onOpenSearch}
              style={{ cursor: 'pointer' }}
              className="mobile-search-btn"
              aria-label="Search"
            >
              <Search size={18} />
            </span>
            {currentUser ? (
              <ProfileDropdown
                currentUser={currentUser}
                favCount={favCount}
                onOpenProfile={onOpenProfile}
                onOpenWishlist={onOpenWishlist}
                onOpenTracking={onOpenTracking}
                onOpenOrders={onOpenOrders}
                onSignOut={onSignOut}
              />
            ) : (
              <span
                onClick={onOpenAuth}
                style={{ cursor: 'pointer' }}
                className="nav-util-item desktop-account"
              >
                Account
              </span>
            )}
            <a
              href="#shop"
              onClick={(e) => {
                e.preventDefault();
                onOpenCart();
              }}
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              className={`bag-link ${bagPulse ? 'pulse' : ''}`}
            >
              <ShoppingBag size={16} />
              <span>Bag (<b id="bagn" style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>{bagCount}</b>)</span>
            </a>
          </div>
        </div>
      </nav>
      {}
      <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
        <div 
          className="mobile-nav-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        <div className="mobile-nav-content">
          {}
          <div className="mobile-nav-header">
            <span className="mobile-nav-logo" onClick={handleHomeClick}>SABLE</span>
            <button 
              type="button" 
              className="mobile-nav-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          {}
          <div className="mobile-nav-body">
            <div className="mobile-nav-section">
              <span className="mobile-nav-subtitle">NAVIGATION</span>
              <ul className="mobile-nav-links">
                <li>
                  <a href="#home" onClick={handleHomeClick}>
                    <span>HOME</span>
                    <ChevronRight size={16} />
                  </a>
                </li>
                <li>
                  <a 
                    href="#shop" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (onOpenProducts) onOpenProducts();
                      else handleAnchorClick(e, '#shop');
                    }}
                  >
                    <span>PRODUCTS</span>
                    <ChevronRight size={16} />
                  </a>
                </li>
                <li>
                  <a 
                    href="#about" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (onOpenAbout) onOpenAbout();
                    }}
                  >
                    <span>ABOUT SABLE</span>
                    <ChevronRight size={16} />
                  </a>
                </li>
                <li>
                  <a 
                    href="#faq" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (onOpenFaq) onOpenFaq();
                      else handleAnchorClick(e, '#faq');
                    }}
                  >
                    <span>FAQ</span>
                    <ChevronRight size={16} />
                  </a>
                </li>
                <li>
                  <a 
                    href="#contact" 
                    onClick={(e) => {
                      e.preventDefault();
                      setIsMobileMenuOpen(false);
                      if (onOpenContact) onOpenContact();
                    }}
                  >
                    <span>CONTACT US</span>
                    <ChevronRight size={16} />
                  </a>
                </li>
              </ul>
            </div>
            {}
            <div className="mobile-nav-section">
              <span className="mobile-nav-subtitle">CLIENT SERVICES</span>
              <div className="mobile-action-grid">
                <button 
                  type="button"
                  className="mobile-action-card"
                  onClick={() => { setIsMobileMenuOpen(false); onOpenSearch(); }}
                >
                  <Search size={18} />
                  <span>Search Catalog</span>
                </button>
                <button 
                  type="button"
                  className="mobile-action-card"
                  onClick={() => { setIsMobileMenuOpen(false); onOpenCart(); }}
                >
                  <ShoppingBag size={18} />
                  <span>Bag ({bagCount})</span>
                </button>
                <button 
                  type="button"
                  className="mobile-action-card"
                  onClick={() => { setIsMobileMenuOpen(false); onOpenWishlist(); }}
                >
                  <Heart size={18} />
                  <span>Wishlist ({favCount})</span>
                </button>
                <button 
                  type="button"
                  className="mobile-action-card"
                  onClick={() => { setIsMobileMenuOpen(false); onOpenTracking(); }}
                >
                  <Package size={18} />
                  <span>Order Tracking</span>
                </button>
              </div>
              {}
              <div className="mobile-user-section">
                {currentUser ? (
                  <div className="mobile-user-box">
                    <div className="mobile-user-info">
                      <div className="mobile-user-avatar">
                        {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <div className="mobile-user-name">{currentUser.name || 'SABLE Member'}</div>
                        <div className="mobile-user-email">{currentUser.email}</div>
                      </div>
                    </div>
                    <div className="mobile-user-actions">
                      <button 
                        type="button" 
                        onClick={() => { setIsMobileMenuOpen(false); onOpenProfile(); }}
                        className="mobile-user-btn"
                      >
                        Profile Settings
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsMobileMenuOpen(false); onOpenOrders(); }}
                        className="mobile-user-btn"
                      >
                        My Orders
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setIsMobileMenuOpen(false); onSignOut(); }}
                        className="mobile-user-btn logout"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button" 
                    className="mobile-auth-btn"
                    onClick={() => { setIsMobileMenuOpen(false); onOpenAuth(); }}
                  >
                    <User size={18} />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </div>
          </div>
          {}
          <div className="mobile-nav-footer">
            <div className="mobile-nav-badge">
              <Sparkles size={14} color="#C5A059" />
              <span>SABLE HAUTE COUTURE • LONDON</span>
            </div>
            <div className="mobile-nav-currency">GBP (£) | UNITED KINGDOM</div>
          </div>
        </div>
      </div>
    </>
  );
}
