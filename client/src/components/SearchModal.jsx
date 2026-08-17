import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Search, X, ShoppingBag } from 'lucide-react';
import { PRODUCTS } from '../data/products';
export default function SearchModal({ isOpen, onClose, onAddToCart }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const displayedProducts = query.trim()
    ? PRODUCTS.filter(
        (p) =>
          p.nm.toLowerCase().includes(query.toLowerCase()) ||
          p.ct.toLowerCase().includes(query.toLowerCase())
      )
    : PRODUCTS.slice(0, 3); 
  const resultsContainerRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      if (backdropRef.current && modalRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
        gsap.fromTo(modalRef.current, { opacity: 0, y: -24, scale: 0.98 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out' });
      }
    } else {
      setQuery('');
    }
  }, [isOpen]);
  useEffect(() => {
    if (isOpen && resultsContainerRef.current) {
      const items = resultsContainerRef.current.querySelectorAll('.search-result-item');
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }
        );
      }
    }
  }, [isOpen, displayedProducts]);
  const handleClose = () => {
    if (backdropRef.current && modalRef.current) {
      gsap.to(modalRef.current, { opacity: 0, y: -16, duration: 0.2, ease: 'power2.in' });
      gsap.to(backdropRef.current, { opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: onClose });
    } else {
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div
      ref={backdropRef}
      id="search-backdrop"
      data-lenis-prevent="true"
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 350,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'clamp(20px, 4vw, 60px) 16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target.id === 'search-backdrop') handleClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#0A0A0A',
          color: '#EFEDE8',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0,0,0,0.85)'
        }}
      >
        {}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Search size={18} color="rgba(239, 237, 232, 0.5)" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search outerwear, knitwear, tailoring..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              color: '#EFEDE8',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'Archivo, sans-serif'
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: 'rgba(239, 237, 232, 0.5)', cursor: 'pointer', fontSize: '12px' }}
            >
              Clear
            </button>
          )}
          <button
            onClick={handleClose}
            aria-label="Close search"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#EFEDE8',
              width: '30px',
              height: '30px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center'
            }}
          >
            <X size={15} />
          </button>
        </div>
        {}
        <div ref={resultsContainerRef} className="no-scrollbar" data-lenis-prevent="true" style={{ maxHeight: '60vh', overflowY: 'auto', padding: '16px 20px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.45, marginBottom: '12px' }}>
            {query.trim() ? `Search Results (${displayedProducts.length})` : 'Featured Collection (3 Items)'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayedProducts.length === 0 ? (
              <div style={{ padding: '24px 0', textAlign: 'center', opacity: 0.5, fontSize: '13px' }}>
                No items found for "{query}"
              </div>
            ) : (
              displayedProducts.map((product) => (
                <div
                  key={product.id}
                  className="search-result-item"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '50px 1fr auto',
                    gap: '14px',
                    alignItems: 'center',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ width: '50px', height: '64px', borderRadius: '4px', overflow: 'hidden', background: '#1A1A1A' }}>
                    <img src={product.img} alt={product.nm} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{product.nm}</div>
                    <div style={{ fontSize: '10.5px', color: 'rgba(239, 237, 232, 0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {product.ct}
                    </div>
                    <div style={{ fontSize: '12.5px', fontWeight: '600', marginTop: '2px' }}>£{product.pr}</div>
                  </div>
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      handleClose();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '8px 14px',
                      background: '#EFEDE8',
                      color: '#101010',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    <ShoppingBag size={13} />
                    <span>Add</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
