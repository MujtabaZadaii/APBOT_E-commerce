import React, { useState, useEffect, useRef } from 'react';
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
  onOpenOrders
}) {
  const [isCompressed, setIsCompressed] = useState(false);
  const [bagPulse, setBagPulse] = useState(false);
  const prevBagCount = useRef(bagCount);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > 50) {
        setIsCompressed(true);
      } else {
        setIsCompressed(false);
      }
      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Micro-interaction when bag count changes
  useEffect(() => {
    if (bagCount !== prevBagCount.current) {
      setBagPulse(true);
      const timer = setTimeout(() => setBagPulse(false), 400);
      prevBagCount.current = bagCount;
      return () => clearTimeout(timer);
    }
  }, [bagCount]);

  const handleAnchorClick = (e, targetId) => {
    e.preventDefault();
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`sable-nav ${isCompressed ? 'compressed' : ''}`}>
      <div className="wrap bar">
        <ul>
          <li><a href="#cats" onClick={(e) => handleAnchorClick(e, '#cats')}>Outerwear</a></li>
          <li><a href="#cats" onClick={(e) => handleAnchorClick(e, '#cats')}>Knitwear</a></li>
          <li><a href="#cats" onClick={(e) => handleAnchorClick(e, '#cats')}>Tailoring</a></li>
          <li><a href="#shop" onClick={(e) => handleAnchorClick(e, '#shop')}>Archive</a></li>
        </ul>

        <div className="mk">SABLE</div>

        <div className="util">
          <span onClick={onOpenSearch} style={{ cursor: 'pointer' }}>
            Search
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
            style={{ cursor: 'pointer' }}
            className={`bag-link ${bagPulse ? 'pulse' : ''}`}
          >
            Bag (<b id="bagn" style={{ display: 'inline-block', transition: 'transform 0.25s ease' }}>{bagCount}</b>)
          </a>
        </div>
      </div>
    </nav>
  );
}

