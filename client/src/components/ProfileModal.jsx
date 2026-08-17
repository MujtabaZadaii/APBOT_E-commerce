import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { X, MapPin, ArrowRight, Check } from 'lucide-react';
const API_BASE_URL = 'http://localhost:5000/api/user';
export default function ProfileModal({ isOpen, onClose, currentUser, onUpdateAddress }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    postcode: '',
    country: 'United Kingdom',
    phone: ''
  });
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  useEffect(() => {
    if (currentUser?.address) {
      setAddress({
        street: currentUser.address.street || '',
        city: currentUser.address.city || '',
        postcode: currentUser.address.postcode || '',
        country: currentUser.address.country || 'United Kingdom',
        phone: currentUser.address.phone || ''
      });
    } else {
      setAddress({
        street: '',
        city: '',
        postcode: '',
        country: 'United Kingdom',
        phone: ''
      });
    }
  }, [currentUser, isOpen]);
  useEffect(() => {
    if (isOpen && backdropRef.current && modalRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      gsap.fromTo(modalRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.28, ease: 'power3.out' });
    }
  }, [isOpen]);
  if (!isOpen) return null;
  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
    setSavedSuccess(false);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser?.email) {
        await fetch(`${API_BASE_URL}/address`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentUser.email, address })
        });
      }
    } catch (err) {
      console.warn('API error, saving locally:', err);
    }
    setSaving(false);
    setSavedSuccess(true);
    onUpdateAddress(address);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };
  return (
    <div
      ref={backdropRef}
      id="profile-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 320,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(12px)',
        display: 'grid',
        placeItems: 'center',
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={(e) => {
        if (e.target.id === 'profile-backdrop') onClose();
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
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '36px' }}>
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
              MANAGE SHIPPING ADDRESS
            </h2>
            <p style={{ fontSize: '12px', color: '#666666', margin: 0 }}>
              Your saved address is used automatically at checkout.
            </p>
          </div>
        </div>
        {}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                letterSpacing: '0.16em',
                fontWeight: '600',
                textTransform: 'uppercase',
                color: '#555555',
                marginBottom: '4px'
              }}
            >
              STREET ADDRESS
            </label>
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
              placeholder="e.g. 18 Redchurch Street"
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #C0BCB4',
                padding: '8px 0',
                fontSize: '14px',
                color: '#101010',
                outline: 'none',
                transition: 'border-color 0.2s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
              onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
            />
          </div>
          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#555555',
                  marginBottom: '4px'
                }}
              >
                CITY / TOWN
              </label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="e.g. London"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #C0BCB4',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#101010',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
              />
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#555555',
                  marginBottom: '4px'
                }}
              >
                POSTAL CODE
              </label>
              <input
                type="text"
                name="postcode"
                value={address.postcode}
                onChange={handleChange}
                placeholder="e.g. E2 7DP"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #C0BCB4',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#101010',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
              />
            </div>
          </div>
          {}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#555555',
                  marginBottom: '4px'
                }}
              >
                COUNTRY
              </label>
              <select
                name="country"
                value={address.country}
                onChange={handleChange}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #C0BCB4',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#101010',
                  outline: 'none',
                  cursor: 'pointer',
                  borderRadius: 0,
                  fontFamily: 'inherit'
                }}
              >
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Canada">Canada</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="United Arab Emirates">United Arab Emirates</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '10px',
                  letterSpacing: '0.16em',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  color: '#555555',
                  marginBottom: '4px'
                }}
              >
                PHONE NUMBER
              </label>
              <input
                type="text"
                name="phone"
                value={address.phone}
                onChange={handleChange}
                placeholder="e.g. +44 20 7946 0912"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid #C0BCB4',
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#101010',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => (e.target.style.borderBottomColor = '#101010')}
                onBlur={(e) => (e.target.style.borderBottomColor = '#C0BCB4')}
              />
            </div>
          </div>
          {}
          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: '12px',
              width: '100%',
              height: '52px',
              backgroundColor: savedSuccess ? '#15803D' : '#101010',
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
              cursor: saving ? 'wait' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {saving ? (
              'SAVING...'
            ) : savedSuccess ? (
              <>
                <Check size={16} /> ADDRESS SAVED
              </>
            ) : (
              <>
                SAVE SHIPPING ADDRESS
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
