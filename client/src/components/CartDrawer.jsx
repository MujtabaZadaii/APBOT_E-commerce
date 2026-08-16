import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, Truck, RefreshCw, Headphones, ChevronDown } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  currentUser
}) {
  const backdropRef = useRef(null);
  const drawerRef = useRef(null);

  const subtotal = cartItems.reduce((acc, item) => acc + (item.pr || item.price || 0) * item.quantity, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const freeShippingThreshold = 150;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingCost = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 15;
  const grandTotal = subtotal + shippingCost;

  useEffect(() => {
    if (isOpen && backdropRef.current && drawerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
        .fromTo(drawerRef.current, { x: '100%' }, { x: '0%', duration: 0.38, ease: 'power3.out' }, '-=0.1');

      const items = drawerRef.current.querySelectorAll('.sable-cart-item');
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
      id="cart-backdrop"
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
        if (e.target.id === 'cart-backdrop') handleAnimatedClose();
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
        {/* Drawer Header */}
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
            <ShoppingBag size={20} strokeWidth={1.2} />
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
              YOUR BAG ({totalItems})
            </h3>
          </div>
          <button
            onClick={handleAnimatedClose}
            aria-label="Close bag"
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

        {/* Sub-Header Shipping & User Banner */}
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
              Shipping as <strong style={{ color: '#101010' }}>{currentUser?.name || 'guest'}</strong>
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
              CHANGE <ChevronDown size={12} />
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
              {amountNeededForFreeShipping > 0 ? (
                <>
                  Add <strong style={{ color: '#101010' }}>£{amountNeededForFreeShipping.toFixed(0)}</strong> more for complimentary shipping
                </>
              ) : (
                <strong style={{ color: '#15803D' }}>You qualify for complimentary shipping!</strong>
              )}
            </span>
          </div>

          {/* Progress Bar Track */}
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
                width: `${shippingProgress}%`,
                height: '100%',
                backgroundColor: '#101010',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {cartItems.length === 0 ? (
            /* EMPTY STATE MATCHING SCREENSHOT */
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
              <ShoppingBag size={72} strokeWidth={1} style={{ marginBottom: '24px', opacity: 0.85 }} />

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
                YOUR BAG IS CURRENTLY EMPTY
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
                Explore our new collection and add pieces to your bag.
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
            /* CART ITEMS LIST */
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cartItems.map((item) => {
                const price = item.pr || item.price;
                const image = item.img || (item.images && item.images[0]);
                const name = item.nm || item.name;
                const category = item.ct || item.category;

                return (
                  <div
                    key={item.id}
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
                        flexShrink: 0
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
                                margin: '2px 0 4px 0'
                              }}
                            >
                              {name}
                            </h4>
                            {item.size && (
                              <span style={{ fontSize: '10px', color: '#666666', textTransform: 'uppercase' }}>
                                Size: {item.size}
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.id)}
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

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                        {/* Quantity Stepper */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #D5D1C8',
                            height: '32px',
                            backgroundColor: '#FFFFFF'
                          }}
                        >
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            style={{
                              width: '28px',
                              height: '100%',
                              background: 'none',
                              border: 'none',
                              color: '#101010',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{ width: '24px', textAlign: 'center', fontSize: '12px', fontWeight: '600' }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            style={{
                              width: '28px',
                              height: '100%',
                              background: 'none',
                              border: 'none',
                              color: '#101010',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Plus size={11} />
                          </button>
                        </div>

                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#101010' }}>
                          £{(price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Subtotal & Checkout Button (When items exist) */}
        {cartItems.length > 0 && (
          <div
            style={{
              padding: '20px 28px',
              borderTop: '1px solid rgba(16, 16, 16, 0.08)',
              backgroundColor: '#FAF9F6'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#555555' }}>
              <span>Subtotal</span>
              <span style={{ color: '#101010', fontWeight: '500' }}>£{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '16px', color: '#555555' }}>
              <span>Shipping</span>
              <span style={{ color: '#101010', fontWeight: '500' }}>
                {shippingCost === 0 ? 'Complimentary' : `£${shippingCost.toFixed(2)}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: '700', marginBottom: '20px', color: '#101010', borderTop: '1px solid rgba(16, 16, 16, 0.08)', paddingTop: '12px' }}>
              <span>Total</span>
              <span>£{grandTotal.toFixed(2)}</span>
            </div>

            <button
              onClick={() => {
                handleAnimatedClose();
                onCheckout();
              }}
              style={{
                width: '100%',
                height: '50px',
                backgroundColor: '#101010',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '11px',
                letterSpacing: '0.18em',
                fontWeight: '600',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#101010')}
            >
              <Lock size={15} />
              <span>PROCEED TO CHECKOUT &rarr;</span>
            </button>
          </div>
        )}

        {/* Bottom Trust Strip (Always visible matching screenshot) */}
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
