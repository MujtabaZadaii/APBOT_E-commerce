import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Package, ArrowRight, ExternalLink, Copy, Check, Clock, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api/orders';
export default function MyOrdersModal({
  isOpen,
  onClose,
  currentUser,
  userOrders = [],
  onOpenTrackingPage,
  onAddToCart
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.email) {
        setLoading(true);
        fetch(`${API_BASE_URL}/user/${encodeURIComponent(currentUser.email)}`)
          .then(res => res.json())
          .then(dbOrders => {
            if (Array.isArray(dbOrders)) {
              const map = new Map();
              [...dbOrders, ...userOrders].forEach(o => {
                if (o && (o.orderId || o._id)) {
                  map.set(o.orderId || o._id, o);
                }
              });
              setOrders(Array.from(map.values()));
            } else {
              setOrders(userOrders);
            }
            setLoading(false);
          })
          .catch(() => {
            setOrders(userOrders);
            setLoading(false);
          });
      } else {
        setOrders(userOrders);
      }
      if (backdropRef.current && modalRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo(modalRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' });
      }
    }
  }, [isOpen, currentUser, userOrders]);
  if (!isOpen) return null;
  const handleCopyCode = (orderId) => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(orderId);
    setTimeout(() => setCopiedId(null), 2000);
  };
  const handleReorder = (items) => {
    if (items && Array.isArray(items)) {
      items.forEach(item => {
        onAddToCart(item);
      });
    }
  };
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Delivered':
        return { bg: '#E6F4EA', color: '#137333', border: '#CEEAD6' };
      case 'In Transit':
      case 'Out for Delivery':
        return { bg: '#E8F0FE', color: '#1A73E8', border: '#D2E3FC' };
      default:
        return { bg: '#F1F3F4', color: '#3C4043', border: '#E8EAED' };
    }
  };
  return (
    <div
      ref={backdropRef}
      id="myorders-backdrop"
      data-lenis-prevent="true"
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 330,
        backgroundColor: 'rgba(0, 0, 0, 0.68)',
        backdropFilter: 'blur(14px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target.id === 'myorders-backdrop') onClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          backgroundColor: '#F7F5F0',
          color: '#101010',
          borderRadius: '4px',
          border: '1px solid rgba(16, 16, 16, 0.1)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.3)',
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Archivo, system-ui, sans-serif'
        }}
      >
        {}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: '#101010',
            cursor: 'pointer',
            opacity: 0.6,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.6')}
        >
          <X size={20} />
        </button>
        {}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '1px solid rgba(16, 16, 16, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Package size={20} strokeWidth={1.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2
                style={{
                  fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                  fontSize: '24px',
                  fontWeight: '400',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: 0,
                  color: '#101010'
                }}
              >
                MY ORDERS
              </h2>
              <span
                style={{
                  fontSize: '10px',
                  letterSpacing: '0.12em',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  background: '#101010',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '10px'
                }}
              >
                {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#666666', margin: '4px 0 0 0' }}>
              View your past order records, delivery status, and tracking information.
            </p>
          </div>
        </div>
        {}
        <div
          className="no-scrollbar"
          style={{
            flex: 1,
            overflowY: 'auto',
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}
        >
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', fontSize: '11px', letterSpacing: '0.16em', color: '#666' }}>
              LOADING ORDER HISTORY...
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                padding: '60px 20px',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '4px',
                border: '1px solid rgba(16, 16, 16, 0.08)'
              }}
            >
              <Package size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#101010', marginBottom: '6px' }}>
                No past orders found
              </h3>
              <p style={{ fontSize: '12px', color: '#666666', maxWidth: '280px', margin: '0 auto 20px auto' }}>
                When you place an order, your complete receipt and live tracking details will appear here.
              </p>
              <button
                onClick={onClose}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#101010',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                EXPLORE COLLECTION
              </button>
            </div>
          ) : (
            orders.map((order, idx) => {
              const orderId = order.orderId || `SBL-${10000 + idx}`;
              const trackingStatus = order.trackingStatus || 'Order Placed';
              const badgeStyle = getStatusBadgeStyle(trackingStatus);
              const items = order.items || [];
              const dateStr = order.createdAt
                ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                : 'Recent Order';
              return (
                <div
                  key={orderId}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '4px',
                    border: '1px solid rgba(16, 16, 16, 0.1)',
                    overflow: 'hidden',
                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.03)'
                  }}
                >
                  {}
                  <div
                    style={{
                      padding: '16px 20px',
                      backgroundColor: '#FAF9F6',
                      borderBottom: '1px solid rgba(16, 16, 16, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#666', fontWeight: '600' }}>
                          ORDER ID:
                        </span>
                        <strong style={{ fontSize: '13px', letterSpacing: '0.06em', color: '#101010' }}>
                          {orderId}
                        </strong>
                        <button
                          onClick={() => handleCopyCode(orderId)}
                          title="Copy Order ID"
                          style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: '2px' }}
                        >
                          {copiedId === orderId ? <Check size={12} color="#137333" /> : <Copy size={12} />}
                        </button>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888' }}>&bull;</span>
                      <span style={{ fontSize: '11px', color: '#666' }}>{dateStr}</span>
                    </div>
                    {}
                    <div
                      style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        backgroundColor: badgeStyle.bg,
                        color: badgeStyle.color,
                        border: `1px solid ${badgeStyle.border}`,
                        fontSize: '10px',
                        fontWeight: '700',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: badgeStyle.color }}></span>
                      {trackingStatus}
                    </div>
                  </div>
                  {}
                  <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {items.map((item, iIdx) => {
                      const name = item.name || item.nm;
                      const price = item.price || item.pr;
                      const img = item.img || (item.images && item.images[0]);
                      const quantity = item.quantity || 1;
                      return (
                        <div
                          key={iIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '14px',
                            paddingBottom: iIdx < items.length - 1 ? '12px' : '0',
                            borderBottom: iIdx < items.length - 1 ? '1px dashed rgba(16, 16, 16, 0.08)' : 'none'
                          }}
                        >
                          {img ? (
                            <img
                              src={img}
                              alt={name}
                              style={{ width: '48px', height: '58px', objectFit: 'cover', borderRadius: '4px', background: '#f5f5f5' }}
                            />
                          ) : (
                            <div style={{ width: '48px', height: '58px', background: '#efeeeb', borderRadius: '4px', display: 'grid', placeItems: 'center' }}>
                              <Package size={16} color="#888" />
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h4 style={{ fontSize: '13px', fontWeight: '600', color: '#101010', margin: '0 0 2px 0' }}>
                              {name}
                            </h4>
                            <div style={{ fontSize: '11px', color: '#666' }}>
                              Qty: {quantity} {item.size ? `| Size: ${item.size}` : ''}
                            </div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: '#101010' }}>
                            £{(Number(price) * quantity).toFixed(2)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {}
                  <div
                    style={{
                      padding: '14px 20px',
                      backgroundColor: '#FAF9F6',
                      borderTop: '1px solid rgba(16, 16, 16, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px'
                    }}
                  >
                    <div style={{ fontSize: '13px', color: '#101010' }}>
                      <span style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#666', textTransform: 'uppercase', marginRight: '6px' }}>TOTAL PAID:</span>
                      <strong>£{Number(order.totalAmount || order.total || 0).toFixed(2)}</strong>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {items.length > 0 && (
                        <button
                          onClick={() => handleReorder(items)}
                          style={{
                            padding: '8px 14px',
                            background: 'transparent',
                            color: '#101010',
                            border: '1px solid rgba(16, 16, 16, 0.2)',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <ShoppingBag size={12} />
                          RE-ORDER
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onClose();
                          onOpenTrackingPage(order);
                        }}
                        style={{
                          padding: '8px 14px',
                          background: '#101010',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '600',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Truck size={12} />
                        TRACK &rarr;
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
