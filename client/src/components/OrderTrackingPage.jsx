import React, { useState, useEffect } from 'react';
import { Package, Copy, CheckCircle2, Truck, Check, Search, AlertCircle } from 'lucide-react';
import Navbar from './Navbar';
const API_BASE_URL = 'http://localhost:5000/api/orders';
export default function OrderTrackingPage({
  isOpen,
  onClose,
  defaultOrder,
  orders = [],
  currentUser,
  bagCount = 0,
  favCount = 0,
  onOpenAuth,
  onSignOut,
  onOpenCart,
  onOpenSearch,
  onOpenProfile,
  onOpenWishlist
}) {
  const [searchCode, setSearchCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(600);
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (currentOrder?.orderId) {
            advanceOrderStatus(currentOrder);
          }
          return 600;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, currentOrder]);
  useEffect(() => {
    if (isOpen) {
      if (defaultOrder) {
        setCurrentOrder(defaultOrder);
        setSearchCode(defaultOrder.orderId || defaultOrder.trackingNumber || '');
        setErrorMsg('');
      } else {
        setCurrentOrder(null);
        setSearchCode('');
        setErrorMsg('');
      }
    }
  }, [isOpen, defaultOrder]);
  if (!isOpen) return null;
  const advanceOrderStatus = async (ord) => {
    const statusSequence = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentIndex = statusSequence.indexOf(ord.trackingStatus || 'Order Placed');
    const nextIndex = Math.min(statusSequence.length - 1, currentIndex + 1);
    const nextStatus = statusSequence[nextIndex];
    const updatedOrder = { ...ord, trackingStatus: nextStatus };
    setCurrentOrder(updatedOrder);
    try {
      await fetch(`${API_BASE_URL}/update-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: ord.orderId, trackingStatus: nextStatus })
      });
    } catch (err) {
      console.warn('Status sync fallback:', err);
    }
  };
  const handleTrackSearch = async (e) => {
    e.preventDefault();
    if (!searchCode.trim()) return;
    setErrorMsg('');
    setLoading(true);
    const query = searchCode.trim();
    const localFound = orders.find(
      (o) =>
        (o.orderId && o.orderId.toLowerCase() === query.toLowerCase()) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase() === query.toLowerCase())
    );
    if (localFound) {
      setCurrentOrder(localFound);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/track/${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data) {
        setCurrentOrder(data);
        setErrorMsg('');
      } else {
        setErrorMsg(data.message || `No order found with tracking code "${query}"`);
        setCurrentOrder(null);
      }
    } catch (err) {
      setErrorMsg(`No active record found for "${query}". Please verify your Tracking ID.`);
      setCurrentOrder(null);
    }
    setLoading(false);
  };
  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const getDynamicTimelineDates = (orderDateStr) => {
    const baseDate = orderDateStr ? new Date(orderDateStr) : new Date();
    const isValid = !isNaN(baseDate.getTime());
    const origin = isValid ? baseDate : new Date();
    const formatDate = (d) =>
      d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const formatTime = (d) =>
      d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const step1Date = formatDate(origin);
    const step1Time = formatTime(origin);
    const step2Obj = new Date(origin.getTime() + 10 * 60 * 1000);
    const step2Date = formatDate(step2Obj);
    const step2Time = formatTime(step2Obj);
    const step3Obj = new Date(origin.getTime() + 24 * 60 * 60 * 1000);
    step3Obj.setHours(9, 40, 0, 0);
    const step3Date = formatDate(step3Obj);
    const step3Time = formatTime(step3Obj);
    const step4Obj = new Date(origin.getTime() + 48 * 60 * 60 * 1000);
    step4Obj.setHours(8, 30, 0, 0);
    const step4Date = formatDate(step4Obj);
    const step4Time = formatTime(step4Obj);
    const step5Obj = new Date(origin.getTime() + 72 * 60 * 60 * 1000);
    const step5Date = formatDate(step5Obj);
    return {
      placed: { date: step1Date, time: step1Time },
      processing: { date: step2Date, time: step2Time },
      shipped: { date: step3Date, time: step3Time },
      outForDelivery: { date: step4Date, time: step4Time },
      delivered: { date: step5Date, time: 'Before 08:00 PM' }
    };
  };
  const dates = getDynamicTimelineDates(currentOrder?.createdAt);
  const statusSequence = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  const activeStatusIndex = currentOrder
    ? Math.max(0, statusSequence.indexOf(currentOrder.trackingStatus || 'Out for Delivery'))
    : 3;
  return (
    <div
      id="tracking-page-backdrop"
      data-lenis-prevent="true"
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 380,
        backgroundColor: '#EFEDE8',
        color: '#101010',
        overflowY: 'auto',
        fontFamily: 'Archivo, sans-serif'
      }}
    >
      {}
      <div style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <Navbar
          bagCount={bagCount}
          favCount={favCount}
          currentUser={currentUser}
          onOpenAuth={onOpenAuth}
          onSignOut={onSignOut}
          onOpenCart={onOpenCart}
          onOpenSearch={onOpenSearch}
          onOpenProfile={onOpenProfile}
          onOpenWishlist={onOpenWishlist}
          onOpenTracking={() => {}}
        />
      </div>
      {}
      <div
        style={{
          padding: '10px clamp(18px, 4vw, 60px)',
          backgroundColor: '#E4E1DC',
          borderBottom: '1px solid rgba(16, 16, 16, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px'
        }}
      >
        <span style={{ opacity: 0.6, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          SABLE Atelier &bull; Real-Time Order Logistics
        </span>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#101010',
            fontWeight: '600',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          &larr; Back to Shop
        </button>
      </div>
      {}
      <main style={{ maxWidth: '1080px', margin: '0 auto', padding: 'clamp(24px, 4vw, 50px) 20px 80px' }}>
        {}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: '400', fontFamily: 'Georgia, serif', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '6px' }}>
            TRACK YOUR ORDER
          </h1>
          <p style={{ fontSize: '13px', opacity: 0.6, letterSpacing: '0.02em' }}>
            Enter your tracking ID or Order Code to get real-time status updates on your purchase.
          </p>
        </div>
        {}
        <form
          onSubmit={handleTrackSearch}
          style={{
            display: 'flex',
            maxWidth: '620px',
            margin: '0 auto 36px',
            gap: '12px'
          }}
        >
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(16, 16, 16, 0.15)',
              borderRadius: '8px',
              padding: '0 16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}
          >
            <Package size={18} color="rgba(16, 16, 16, 0.5)" />
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. SBL-82941 or TRK...)"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              style={{
                width: '100%',
                height: '48px',
                border: 'none',
                background: 'none',
                outline: 'none',
                fontSize: '13px',
                color: '#101010'
              }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: '#101010',
              color: '#EFEDE8',
              border: 'none',
              borderRadius: '8px',
              padding: '0 28px',
              font: '600 11px/1 Archivo, sans-serif',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {loading ? 'SEARCHING...' : 'TRACK ORDER'}
          </button>
        </form>
        {}
        {errorMsg && (
          <div style={{ maxWidth: '620px', margin: '0 auto 28px', padding: '12px 16px', borderRadius: '8px', backgroundColor: 'rgba(255, 80, 80, 0.08)', border: '1px solid rgba(255, 80, 80, 0.25)', color: '#d32f2f', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}
        {}
        {!currentOrder && !errorMsg && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid rgba(16, 16, 16, 0.08)',
              padding: '48px 24px',
              textAlign: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
              maxWidth: '620px',
              margin: '0 auto'
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#F3F2EE', color: 'rgba(16,16,16,0.4)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
              <Search size={22} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>No Order Selected</h3>
            <p style={{ fontSize: '12.5px', opacity: 0.6, maxWidth: '34ch', margin: '0 auto 20px', lineHeight: 1.4 }}>
              Enter your Tracking ID above or select a recent order to view live status.
            </p>
            {orders.length > 0 && (
              <div>
                <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '10px' }}>
                  YOUR RECENT ORDERS
                </div>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {orders.map((ord, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentOrder(ord);
                        setSearchCode(ord.orderId || ord.trackingNumber);
                      }}
                      style={{
                        padding: '8px 14px',
                        background: '#101010',
                        color: '#EFEDE8',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        letterSpacing: '0.08em',
                        cursor: 'pointer'
                      }}
                    >
                      {ord.orderId} ({ord.totalAmount ? `£${ord.totalAmount}` : 'View'})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {}
        {currentOrder && (
          <>
            {}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(16, 16, 16, 0.08)',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2f5e8', color: '#16a34a', display: 'grid', placeItems: 'center' }}>
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700' }}>Order Found!</div>
                  <div style={{ fontSize: '11.5px', opacity: 0.55 }}>
                    Status: <strong>{currentOrder.trackingStatus || 'Out for Delivery'}</strong> &bull; Auto-sync in {formatTimer(secondsRemaining)}
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tracking ID</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '700' }}>
                  <span>{currentOrder.orderId || 'SBL-82941'}</span>
                  <button
                    onClick={() => handleCopyCode(currentOrder.orderId || 'SBL-82941')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6 }}
                    title="Copy Code"
                  >
                    {copied ? <Check size={13} color="#16a34a" /> : <Copy size={13} />}
                  </button>
                </div>
                <div style={{ fontSize: '10.5px', opacity: 0.5 }}>Placed on {dates.placed.date}</div>
              </div>
            </div>
            {}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid rgba(16, 16, 16, 0.08)',
                padding: '28px 24px',
                marginBottom: '24px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', position: 'relative', textAlign: 'center' }}>
                {}
                <div
                  style={{
                    position: 'absolute',
                    top: '22px',
                    left: '10%',
                    right: '10%',
                    height: '2px',
                    background: `linear-gradient(to right, #101010 0%, #101010 ${(activeStatusIndex / 4) * 100}%, #dcd9d3 ${(activeStatusIndex / 4) * 100}%, #dcd9d3 100%)`,
                    zIndex: 1,
                    transition: 'background 0.5s'
                  }}
                />
                {}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#101010', color: '#EFEDE8', display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase' }}>ORDER PLACED</div>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '2px', fontWeight: '600' }}>{dates.placed.date}</div>
                  <div style={{ fontSize: '10px', opacity: 0.6 }}>{dates.placed.time}</div>
                </div>
                {}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: activeStatusIndex >= 1 ? '#101010' : '#F3F2EE', color: activeStatusIndex >= 1 ? '#EFEDE8' : 'rgba(16,16,16,0.3)', display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                    <Package size={20} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: activeStatusIndex >= 1 ? 1 : 0.4 }}>PROCESSING</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex >= 1 ? 0.7 : 0.4, marginTop: '2px', fontWeight: '600' }}>{dates.processing.date}</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex >= 1 ? 0.6 : 0.4 }}>{dates.processing.time}</div>
                </div>
                {}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: activeStatusIndex >= 2 ? '#101010' : '#F3F2EE', color: activeStatusIndex >= 2 ? '#EFEDE8' : 'rgba(16,16,16,0.3)', display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                    <Truck size={20} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: activeStatusIndex >= 2 ? 1 : 0.4 }}>SHIPPED</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex >= 2 ? 0.7 : 0.4, marginTop: '2px', fontWeight: '600' }}>{dates.shipped.date}</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex >= 2 ? 0.6 : 0.4 }}>{dates.shipped.time}</div>
                </div>
                {}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: activeStatusIndex === 3 ? '#dcfce7' : activeStatusIndex > 3 ? '#101010' : '#F3F2EE', border: activeStatusIndex === 3 ? '2px solid #16a34a' : 'none', color: activeStatusIndex === 3 ? '#16a34a' : activeStatusIndex > 3 ? '#EFEDE8' : 'rgba(16,16,16,0.3)', display: 'grid', placeItems: 'center', marginBottom: '10px', boxShadow: activeStatusIndex === 3 ? '0 0 0 6px rgba(22, 163, 74, 0.15)' : 'none' }}>
                    <Truck size={20} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.08em', textTransform: 'uppercase', color: activeStatusIndex === 3 ? '#16a34a' : 'inherit', opacity: activeStatusIndex >= 3 ? 1 : 0.4 }}>OUT FOR DELIVERY</div>
                  <div style={{ fontSize: '10px', fontWeight: '600', color: activeStatusIndex === 3 ? '#16a34a' : 'inherit', opacity: activeStatusIndex >= 3 ? 0.7 : 0.4, marginTop: '2px' }}>{dates.outForDelivery.date}</div>
                  <div style={{ fontSize: '10px', color: activeStatusIndex === 3 ? '#16a34a' : 'inherit', opacity: activeStatusIndex >= 3 ? 0.6 : 0.4 }}>{dates.outForDelivery.time}</div>
                </div>
                {}
                <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: activeStatusIndex === 4 ? '#101010' : '#F3F2EE', color: activeStatusIndex === 4 ? '#EFEDE8' : 'rgba(16,16,16,0.3)', display: 'grid', placeItems: 'center', marginBottom: '10px' }}>
                    <Check size={20} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: activeStatusIndex === 4 ? 1 : 0.4 }}>DELIVERED</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex === 4 ? 0.7 : 0.4, marginTop: '2px' }}>{activeStatusIndex === 4 ? 'Delivered' : 'Expected'}</div>
                  <div style={{ fontSize: '10px', opacity: activeStatusIndex === 4 ? 0.6 : 0.4 }}>{dates.delivered.date}</div>
                </div>
              </div>
            </div>
            {}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 16, 16, 0.08)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    ORDER DETAILS
                  </div>
                  {(currentOrder.items || []).map((item, idx) => {
                    const itemName = item.name || item.nm || 'SABLE Luxury Piece';
                    const itemPrice = item.price !== undefined ? item.price : (item.pr !== undefined ? item.pr : 0);
                    const itemImg = item.image || item.img || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80';
                    return (
                      <div key={idx} style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '14px' }}>
                        <div style={{ width: '64px', height: '78px', borderRadius: '6px', background: '#1A1A1A', overflow: 'hidden' }}>
                          <img src={itemImg} alt={itemName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700' }}>{itemName}</div>
                          <div style={{ fontSize: '12.5px', fontWeight: '600', marginTop: '2px' }}>£{typeof itemPrice === 'number' ? itemPrice.toFixed(2) : itemPrice}</div>
                          <div style={{ fontSize: '11px', opacity: 0.55, marginTop: '4px' }}>
                            Size: {item.size || 'Standard'} &bull; Qty: {item.quantity || 1}
                          </div>
                          {item.color && <div style={{ fontSize: '11px', opacity: 0.55 }}>Color: {item.color}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div style={{ borderTop: '1px solid rgba(16, 16, 16, 0.08)', paddingTop: '14px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', opacity: 0.7 }}>Total Amount</span>
                  <strong style={{ fontSize: '16px', fontWeight: '700' }}>£{(currentOrder.totalAmount || 0).toFixed(2)}</strong>
                </div>
              </div>
              {}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid rgba(16, 16, 16, 0.08)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '16px' }}>
                    DELIVERY INFORMATION
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'center' }}>
                      <span style={{ opacity: 0.55 }}>Courier Partner</span>
                      <span style={{ fontWeight: '600' }}>{currentOrder.courier || 'SABLE Express Logistics'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'center' }}>
                      <span style={{ opacity: 0.55 }}>Tracking Number</span>
                      <span style={{ fontWeight: '600', letterSpacing: '0.04em' }}>{currentOrder.trackingNumber || currentOrder.orderId || 'SBL-52077'}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'flex-start' }}>
                      <span style={{ opacity: 0.55 }}>Delivery Address</span>
                      <div style={{ fontWeight: '500', lineHeight: 1.4 }}>
                        {typeof currentOrder.shippingAddress === 'string' && currentOrder.shippingAddress.trim() ? (
                          currentOrder.shippingAddress.split(',').map((part, pIdx) => (
                            <div key={pIdx}>{pIdx === 0 ? <strong>{part.trim()}</strong> : part.trim()}</div>
                          ))
                        ) : typeof currentOrder.shippingAddress === 'object' && currentOrder.shippingAddress !== null ? (
                          <>
                            <div><strong>{currentOrder.shippingAddress.name || currentOrder.userName || 'Customer'}</strong></div>
                            {currentOrder.shippingAddress.street && <div>{currentOrder.shippingAddress.street}</div>}
                            {currentOrder.shippingAddress.city && <div>{currentOrder.shippingAddress.city} {currentOrder.shippingAddress.postcode || ''}</div>}
                            {currentOrder.shippingAddress.country && <div>{currentOrder.shippingAddress.country}</div>}
                          </>
                        ) : (
                          <div><strong>{currentOrder.userName || 'Valued Customer'}</strong><br/>Standard Priority Delivery</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(16, 16, 16, 0.08)', paddingTop: '14px', marginTop: '14px', display: 'grid', gridTemplateColumns: '120px 1fr', gap: '10px', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', opacity: 0.55 }}>Estimated Delivery</span>
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: '700' }}>{dates.delivered.date}</div>
                    <div style={{ fontSize: '10.5px', opacity: 0.5 }}>{dates.delivered.time}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
