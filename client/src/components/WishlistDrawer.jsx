import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Heart, ShoppingBag, Trash2, Truck, RefreshCw, Lock, Headphones, ChevronDown } from 'lucide-react';
export default function WishlistDrawer({
  isOpen,
  onClose,
  favs = {},
  products = [],
  onToggleFav,
  onAddToCart,
  onProductSelect,
  currentUser
}) {
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);
  const favoritedProducts = products.filter((p) => favs[p._id || p.id]);
  useEffect(() => {
    if (isOpen && backdropRef.current && drawerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' }, '-=0.1');
      const items = drawerRef.current.querySelectorAll('.sable-wishlist-item');
      if (items.length > 0) {
        tl.fromTo(items,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        );
      }
    }
  }, [isOpen]);
  const handleAnimatedClose = () => {
    if (backdropRef.current && drawerRef.current) {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.in' },
        onComplete: onClose
      });
      tl.to(drawerRef.current, { x: '100%', duration: 0.24, ease: 'power3.in' })
        .to(backdropRef.current, { opacity: 0, duration: 0.16 }, '-=0.12');
    } else {
      onClose();
    }
  };
  if (!isOpen) return null;
  return (
    <div
      ref={backdropRef}
      id="wishlist-backdrop"
      data-lenis-prevent="true"
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 280,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}
      onClick={(e) => {
        if (e.target.id === 'wishlist-backdrop') handleAnimatedClose();
      }}
    >
      <div
        ref={drawerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: '#F7F5F0',
          color: '#101010',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-20px 0 60px rgba(0, 0, 0, 0.2)',
          fontFamily: 'Archivo, system-ui, sans-serif'
        }}
      >
        {}
        <div
          style={{
            padding: '24px 28px 20px',
            borderBottom: '1px solid rgba(16, 16, 16, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Heart size={20} strokeWidth={1.2} />
            <h3
              style={{
                fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                fontSize: '19px',
                fontWeight: '400',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                margin: 0
              }}
            >
              YOUR WISHLIST ({favoritedProducts.length})
            </h3>
          </div>
          <button
            onClick={handleAnimatedClose}
            aria-label="Close wishlist"
            style={{
              background: 'none',
              border: 'none',
              color: '#101010',
              cursor: 'pointer',
              opacity: 0.6,
              transition: 'opacity 0.2s',
              padding: '4px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
          >
            <X size={20} />
          </button>
        </div>
        {}
        <div
          style={{
            padding: '16px 28px',
            borderBottom: '1px solid rgba(16, 16, 16, 0.08)',
            backgroundColor: '#FAF9F6'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '12px',
              color: '#555555',
              marginBottom: '10px'
            }}
          >
            <span>
              Saved for <strong style={{ color: '#101010' }}>{currentUser?.name || 'guest'}</strong>
            </span>
            <button
              style={{
                background: 'none',
                border: 'none',
                fontSize: '10px',
                letterSpacing: '0.12em',
                fontWeight: '700',
                textTransform: 'uppercase',
                color: '#555555',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              OPTIONS <ChevronDown size={12} />
            </button>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '12px',
              color: '#444444',
              marginBottom: '10px'
            }}
          >
            <Truck size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} />
            <span>
              Complimentary shipping available on all orders over <strong style={{ color: '#101010' }}>£150</strong>
            </span>
          </div>
          {}
          <div
            style={{
              width: '100%',
              height: '3px',
              backgroundColor: '#E2DFD7',
              borderRadius: '2px',
              overflow: 'hidden'
            }}
          >
            <div
              style={{
                width: `${favoritedProducts.length > 0 ? 100 : 0}%`,
                height: '100%',
                backgroundColor: '#101010',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>
        {}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {favoritedProducts.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 32px'
              }}
            >
              <Heart size={72} strokeWidth={1} style={{ marginBottom: '24px', opacity: 0.85 }} />
              <h4
                style={{
                  fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                  fontSize: '18px',
                  fontWeight: '400',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#101010',
                  margin: '0 0 12px 0'
                }}
              >
                YOUR WISHLIST IS CURRENTLY EMPTY
              </h4>
              <p
                style={{
                  fontSize: '13px',
                  color: '#666666',
                  maxWidth: '260px',
                  lineHeight: '1.5',
                  margin: '0 0 32px 0'
                }}
              >
                Explore our new collection and add pieces to your wishlist.
              </p>
              <button
                onClick={handleAnimatedClose}
                style={{
                  backgroundColor: '#101010',
                  color: '#FFFFFF',
                  border: 'none',
                  height: '48px',
                  padding: '0 36px',
                  fontSize: '11px',
                  letterSpacing: '0.18em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#101010')}
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {favoritedProducts.map((product) => {
                const id = product._id || product.id;
                const name = product.nm || product.name;
                const price = product.pr || product.price;
                const image = product.img || (product.images && product.images[0]);
                const category = product.ct || product.category;
                return (
                  <div
                    key={id}
                    style={{
                      display: 'flex',
                      gap: '16px',
                      paddingBottom: '20px',
                      borderBottom: '1px solid rgba(16, 16, 16, 0.08)'
                    }}
                  >
                    <img
                      src={image}
                      alt={name}
                      style={{
                        width: '80px',
                        height: '100px',
                        objectFit: 'cover',
                        backgroundColor: '#efeeeb',
                        borderRadius: '2px',
                        flexShrink: 0,
                        cursor: 'pointer'
                      }}
                      onClick={() => {
                        if (onProductSelect) onProductSelect(id);
                        handleAnimatedClose();
                      }}
                    />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <span style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#777777' }}>
                              {category}
                            </span>
                            <h4
                              style={{
                                fontFamily: '"Bodoni MT", Didot, serif',
                                fontSize: '15px',
                                fontWeight: '400',
                                color: '#101010',
                                margin: '2px 0 4px 0',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                if (onProductSelect) onProductSelect(id);
                                handleAnimatedClose();
                              }}
                            >
                              {name}
                            </h4>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: '#101010', marginTop: '2px' }}>
                              £{Number(price).toFixed(2)}
                            </div>
                          </div>
                          <button
                            onClick={() => onToggleFav(id)}
                            aria-label="Remove item"
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#888888',
                              cursor: 'pointer',
                              padding: '2px',
                              transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#dc2626')}
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#888888')}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px' }}>
                        <button
                          onClick={() => {
                            onAddToCart({
                              id,
                              name,
                              price,
                              category,
                              images: [image]
                            });
                          }}
                          style={{
                            width: '100%',
                            height: '36px',
                            backgroundColor: '#101010',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '10px',
                            letterSpacing: '0.14em',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#101010')}
                        >
                          <ShoppingBag size={13} />
                          ADD TO BAG
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {}
        <div
          style={{
            padding: '18px 20px',
            borderTop: '1px solid rgba(16, 16, 16, 0.08)',
            backgroundColor: '#F3F0EA',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(16,16,16,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RefreshCw size={12} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#101010' }}>
                EASY RETURNS
              </div>
              <div style={{ fontSize: '9px', color: '#666666' }}>14-day return policy</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(16,16,16,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Lock size={12} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#101010' }}>
                SECURE PAYMENTS
              </div>
              <div style={{ fontSize: '9px', color: '#666666' }}>100% protected</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1px solid rgba(16,16,16,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Headphones size={12} strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ fontSize: '9px', fontWeight: '700', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#101010' }}>
                NEED HELP?
              </div>
              <div style={{ fontSize: '9px', color: '#666666' }}>Contact support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
