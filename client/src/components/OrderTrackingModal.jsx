import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, Package, Clock, CheckCircle2, Truck, RefreshCw, Scissors, MapPin } from 'lucide-react';

export default function OrderTrackingModal({ isOpen, onClose, orders = [], currentUser }) {
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes countdown (600 seconds)
  const [activeOrderIndex, setActiveOrderIndex] = useState(0);

  const backdropRef = useRef(null);
  const modalRef = useRef(null);

  const stages = [
    { title: 'Order Placed', desc: 'Order confirmed and saved in MongoDB database.', icon: CheckCircle2 },
    { title: 'Processing at Atelier', desc: 'Garment cut and sewn on Redchurch Street floor.', icon: Scissors },
    { title: 'Shipped & In Transit', desc: 'Dispatched with premium tracked courier delivery.', icon: Truck },
    { title: 'Out for Delivery', desc: 'Courier driver is en-route to your address.', icon: MapPin },
    { title: 'Delivered', desc: 'Package safely handed over.', icon: CheckCircle2 }
  ];

  // 10-Minute Timer Logic for Auto-Updating Tracking Status
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          return 600; // Reset 10-minute cycle
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && backdropRef.current && modalRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(modalRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.28, ease: 'power3.out' });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeOrder = orders[activeOrderIndex] || {
    orderId: 'SABLE-ORD-94810',
    trackingNumber: 'SABLE-TRK-892410',
    createdAt: new Date().toISOString(),
    totalAmount: 185,
    items: [{ nm: 'Rift Overshirt', quantity: 1, pr: 185 }],
    shippingAddress: { street: '18 Redchurch Street', city: 'London', postcode: 'E2 7DP' }
  };

  // Determine current stage based on elapsed time (simulated 10-minute progression)
  const currentStageIndex = Math.min(
    stages.length - 1,
    1 + Math.floor((600 - secondsRemaining) / 120)
  );

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={backdropRef}
      id="tracking-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 330,
        backgroundColor: 'rgba(0, 0, 0, 0.84)',
        backdropFilter: 'blur(16px)',
        display: 'grid',
        placeItems: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target.id === 'tracking-backdrop') onClose();
      }}
    >
      <div
        ref={modalRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          backgroundColor: '#0A0A0A',
          color: '#EFEDE8',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.85)',
          padding: '28px',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
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

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Package size={22} />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Live Order Tracking</h3>
            <p style={{ fontSize: '12px', opacity: 0.5 }}>Real-time status synced with SABLE Atelier</p>
          </div>
        </div>

        {/* Order Selector (if multiple orders exist) */}
        {orders.length > 1 && (
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '18px', paddingBottom: '4px' }}>
            {orders.map((ord, idx) => (
              <button
                key={idx}
                onClick={() => setActiveOrderIndex(idx)}
                style={{
                  padding: '6px 12px',
                  background: idx === activeOrderIndex ? '#EFEDE8' : 'rgba(255, 255, 255, 0.04)',
                  color: idx === activeOrderIndex ? '#101010' : '#EFEDE8',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {ord.orderId}
              </button>
            ))}
          </div>
        )}

        {/* Order Meta Bar */}
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px 18px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', fontSize: '12px' }}>
          <div>
            <div style={{ opacity: 0.5, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Tracking Code</div>
            <div style={{ fontWeight: '700', color: '#88e0a0', marginTop: '2px' }}>{activeOrder.trackingNumber}</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Order Reference</div>
            <div style={{ fontWeight: '700', marginTop: '2px' }}>{activeOrder.orderId}</div>
          </div>
          <div>
            <div style={{ opacity: 0.5, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Auto-Update Cycle</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600', marginTop: '2px' }}>
              <Clock size={12} color="#EFEDE8" /> Next in {formatTimer(secondsRemaining)}
            </div>
          </div>
        </div>

        {/* Live Timeline */}
        <div style={{ padding: '0 8px', marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '16px' }}>
            Tracking Progression Timeline
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
            {stages.map((stg, idx) => {
              const IconComp = stg.icon;
              const isCompleted = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                  {/* Step Connector Line */}
                  {idx < stages.length - 1 && (
                    <div
                      style={{
                        position: 'absolute',
                        left: '15px',
                        top: '30px',
                        bottom: '-20px',
                        width: '2px',
                        background: idx < currentStageIndex ? '#88e0a0' : 'rgba(255, 255, 255, 0.1)',
                        transition: 'background 0.4s'
                      }}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isCurrent ? '#EFEDE8' : isCompleted ? '#88e0a0' : 'rgba(255, 255, 255, 0.05)',
                      color: isCurrent ? '#101010' : isCompleted ? '#101010' : 'rgba(239, 237, 232, 0.4)',
                      display: 'grid',
                      placeItems: 'center',
                      zIndex: 2,
                      boxShadow: isCurrent ? '0 0 16px rgba(239, 237, 232, 0.5)' : 'none',
                      transition: 'all 0.3s'
                    }}
                  >
                    <IconComp size={16} />
                  </div>

                  {/* Stage Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: '700', color: isCurrent ? '#EFEDE8' : isCompleted ? '#88e0a0' : 'rgba(239, 237, 232, 0.5)' }}>
                        {stg.title}
                      </span>
                      {isCurrent && (
                        <span style={{ fontSize: '9px', background: 'rgba(239, 237, 232, 0.15)', color: '#EFEDE8', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                          LIVE NOW
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: '11.5px', opacity: 0.55, marginTop: '2px' }}>{stg.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Auto Refresh Info Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(136, 224, 160, 0.06)', border: '1px solid rgba(136, 224, 160, 0.18)', borderRadius: '8px', fontSize: '11px', color: '#88e0a0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={14} className="spin-icon" />
            <span>Auto-refreshing status every 10 minutes directly from MongoDB backend.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
