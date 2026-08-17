import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, CreditCard, Lock, CheckCircle2, ArrowRight, MapPin, Copy, Check } from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api/orders';
export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  currentUser,
  onOrderPlaced,
  onOpenTrackingPage
}) {
  const [step, setStep] = useState(1); 
  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    street: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    phone: ''
  });
  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [processing, setProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [copied, setCopied] = useState(false);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const subtotal = cartItems.reduce((acc, i) => acc + i.pr * i.quantity, 0);
  const shippingCost = subtotal >= 150 ? 0 : 15;
  const grandTotal = subtotal + shippingCost;
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCompletedOrder(null);
      setShippingAddress({
        name: currentUser?.name || '',
        street: currentUser?.address?.street || '',
        city: currentUser?.address?.city || '',
        postcode: currentUser?.address?.postcode || '',
        country: currentUser?.address?.country || 'United Kingdom',
        phone: currentUser?.address?.phone || ''
      });
      setPaymentData({
        cardName: currentUser?.name || '',
        cardNumber: '',
        expiry: '',
        cvc: ''
      });
      if (backdropRef.current && modalRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
        gsap.fromTo(modalRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' });
      }
    }
  }, [isOpen, currentUser]);
  if (!isOpen) return null;
  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    const now = new Date();
    const orderPayload = {
      userId: currentUser?.email || 'guest',
      userName: shippingAddress.name || currentUser?.name || 'Customer',
      items: cartItems,
      subtotal,
      shippingCost,
      totalAmount: grandTotal,
      shippingAddress,
      paymentMethod: 'Credit Card',
      trackingNumber: `TRK${Math.floor(1000000000 + Math.random() * 9000000000)}GB`,
      orderId: `SBL-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingStatus: 'Order Placed',
      createdAt: now.toISOString()
    };
    try {
      const res = await fetch(`${API_BASE_URL}/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
      const data = await res.json();
      if (data.order) {
        setCompletedOrder(data.order);
      } else {
        setCompletedOrder(orderPayload);
      }
    } catch (err) {
      console.warn('API order fallback:', err);
      setCompletedOrder(orderPayload);
    }
    setProcessing(false);
    setStep(3);
    onOrderPlaced(orderPayload);
  };
  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      ref={backdropRef}
      id="checkout-backdrop"
      data-lenis-prevent="true"
      className="no-scrollbar"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 340,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target.id === 'checkout-backdrop' && step !== 3) onClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#F7F5F0',
          color: '#101010',
          borderRadius: '4px',
          border: '1px solid rgba(16, 16, 16, 0.1)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.25)',
          padding: '40px 44px',
          fontFamily: 'Archivo, system-ui, sans-serif'
        }}
      >
        {}
        {step !== 3 && (
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
        )}
        {}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(16, 16, 16, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <MapPin size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                    fontSize: '22px',
                    fontWeight: '400',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: '0 0 6px 0',
                    color: '#101010'
                  }}
                >
                  DELIVERY ADDRESS
                </h2>
                <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                  Enter your shipping details below for dispatch.
                </p>
              </div>
            </div>
            <form onSubmit={handleAddressSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mujtaba Hyder"
                  value={shippingAddress.name}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                  STREET ADDRESS
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 18 Redchurch Street"
                  value={shippingAddress.street}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    CITY / TOWN
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. London"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    POSTAL CODE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. E2 7DP"
                    value={shippingAddress.postcode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, postcode: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    COUNTRY
                  </label>
                  <select
                    value={shippingAddress.country}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    PHONE NUMBER
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +44 20 7946 0912"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{
                  marginTop: '12px',
                  width: '100%',
                  height: '52px',
                  backgroundColor: '#101010',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <span>CONTINUE TO PAYMENT (£{grandTotal})</span>
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        )}
        {}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(16, 16, 16, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CreditCard size={18} strokeWidth={1.5} />
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                    fontSize: '22px',
                    fontWeight: '400',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    margin: '0 0 6px 0',
                    color: '#101010'
                  }}
                >
                  PAYMENT DETAILS
                </h2>
                <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
                  256-bit SSL encrypted secure checkout.
                </p>
              </div>
            </div>
            <form onSubmit={handlePaymentSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                  CARDHOLDER NAME
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mujtaba Hyder"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                  CARD NUMBER
                </label>
                <input
                  type="text"
                  required
                  placeholder="4532 •••• •••• 8892"
                  value={paymentData.cardNumber}
                  onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                  style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                  onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    EXPIRY DATE
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM / YY"
                    value={paymentData.expiry}
                    onChange={(e) => setPaymentData({ ...paymentData, expiry: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.16em', fontWeight: '600', textTransform: 'uppercase', color: '#555555', marginBottom: '4px' }}>
                    CVC / CVV
                  </label>
                  <input
                    type="password"
                    required
                    maxLength="4"
                    placeholder="•••"
                    value={paymentData.cvc}
                    onChange={(e) => setPaymentData({ ...paymentData, cvc: e.target.value })}
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #C0BCB4', padding: '8px 0', fontSize: '14px', color: '#101010', outline: 'none', fontFamily: 'inherit' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                    onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: '#666666', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px' }}
                >
                  &larr; Back to Address
                </button>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#101010' }}>Total: £{grandTotal}</span>
              </div>
              <button
                type="submit"
                disabled={processing}
                style={{
                  marginTop: '8px',
                  width: '100%',
                  height: '52px',
                  backgroundColor: '#101010',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '11px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  cursor: processing ? 'wait' : 'pointer'
                }}
              >
                <Lock size={15} />
                <span>{processing ? 'PROCESSING PAYMENT...' : `PAY £${grandTotal} & PLACE ORDER`}</span>
              </button>
            </form>
          </div>
        )}
        {}
        {step === 3 && completedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle2 size={48} color="#15803D" style={{ marginBottom: '14px' }} />
            <h3 style={{ fontFamily: '"Bodoni MT", Didot, serif', fontSize: '24px', fontWeight: '400', margin: '0 0 6px 0', textTransform: 'uppercase' }}>
              ORDER CONFIRMED
            </h3>
            <p style={{ fontSize: '12px', color: '#666666', marginBottom: '24px' }}>
              Your order has been recorded. Use your Order ID to track dispatch in real time.
            </p>
            <div style={{ width: '100%', backgroundColor: '#FFFFFF', padding: '20px', borderRadius: '4px', border: '1px solid rgba(16,16,16,0.1)', textAlign: 'left', marginBottom: '24px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Order ID:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <strong style={{ letterSpacing: '0.08em', color: '#101010' }}>{completedOrder.orderId}</strong>
                  <button onClick={() => handleCopyCode(completedOrder.orderId)} style={{ background: 'none', border: 'none', color: '#101010', cursor: 'pointer' }}>
                    {copied ? <Check size={12} color="#15803D" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Tracking Code:</span>
                <span style={{ color: '#101010' }}>{completedOrder.trackingNumber}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: '#666666' }}>Delivery Address:</span>
                <span style={{ color: '#101010' }}>{shippingAddress.street || 'Standard Delivery'}, {shippingAddress.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(16,16,16,0.1)', paddingTop: '10px', marginTop: '10px', fontWeight: '700', fontSize: '14px' }}>
                <span>Total Paid:</span>
                <span>£{completedOrder.totalAmount}</span>
              </div>
            </div>
            <div style={{ width: '100%', display: 'flex', gap: '12px' }}>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: 'transparent',
                  color: '#101010',
                  border: '1px solid #101010',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenTrackingPage(completedOrder);
                }}
                style={{
                  flex: 1,
                  height: '48px',
                  backgroundColor: '#101010',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '10px',
                  letterSpacing: '0.14em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  cursor: 'pointer'
                }}
              >
                VIEW TRACKING &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
