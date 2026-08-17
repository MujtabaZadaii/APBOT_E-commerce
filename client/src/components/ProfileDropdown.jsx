import React, { useState, useRef, useEffect } from 'react';
import { User, ChevronDown, ChevronRight, Package, Heart, Truck, LogOut } from 'lucide-react';
export default function ProfileDropdown({
  currentUser,
  favCount = 0,
  onOpenProfile,
  onOpenWishlist,
  onOpenTracking,
  onOpenOrders,
  onSignOut
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const defaultAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLzg71mkC9h8hkEEmJPzML1MOXvRDYpO2543Jlyc-moLlVV4kUtMmfdf8&s=10';
  const userAvatar = currentUser?.avatar || defaultAvatar;
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const menuItems = [
    {
      label: 'MY PROFILE',
      icon: User,
      action: () => onOpenProfile(),
      showChevron: true
    },
    {
      label: 'MY ORDERS',
      icon: Package,
      action: () => (onOpenOrders ? onOpenOrders() : onOpenTracking()),
      showChevron: true
    },
    {
      label: 'WISHLIST',
      icon: Heart,
      action: () => onOpenWishlist(),
      showChevron: true,
      badge: favCount > 0 ? favCount : null
    },
    {
      label: 'TRACK ORDER',
      icon: Truck,
      action: () => onOpenTracking(),
      showChevron: true
    },
    {
      label: 'SIGN OUT',
      icon: LogOut,
      action: () => onSignOut(),
      showChevron: false
    }
  ];
  return (
    <div ref={menuRef} style={{ position: 'relative', display: 'inline-block' }}>
      {}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User account menu"
        style={{
          background: 'none',
          border: 'none',
          color: '#101010',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 0',
          outline: 'none'
        }}
      >
        <img
          src={userAvatar}
          alt={currentUser?.name || 'User'}
          style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            objectFit: 'cover',
            filter: 'grayscale(100%)',
            border: '1px solid rgba(16, 16, 16, 0.2)'
          }}
        />
        <ChevronDown
          size={11}
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.3, 1)'
          }}
        />
      </button>
      {}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 14px)',
            right: 0,
            width: '310px',
            backgroundColor: 'rgba(247, 245, 240, 0.98)',
            color: '#101010',
            borderRadius: '16px',
            border: '1px solid rgba(16, 16, 16, 0.1)',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.14), 0 4px 12px rgba(0, 0, 0, 0.04)',
            padding: '24px 20px',
            zIndex: 200,
            backdropFilter: 'blur(16px)',
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <img
              src={userAvatar}
              alt={currentUser?.name}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                objectFit: 'cover',
                filter: 'grayscale(100%)',
                boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3
                style={{
                  fontFamily: '"Bodoni MT", "Didot", "Times New Roman", serif',
                  fontSize: '19px',
                  fontWeight: '500',
                  color: '#101010',
                  margin: '0 0 2px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  lineHeight: '1.2'
                }}
              >
                {currentUser?.name || 'User Profile'}
              </h3>
              <p
                style={{
                  fontSize: '11.5px',
                  color: '#666666',
                  margin: '0 0 8px 0',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentUser?.email}
              </p>
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenProfile();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontSize: '9.5px',
                  letterSpacing: '0.14em',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  color: '#101010',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                VIEW PROFILE
                <ChevronRight size={12} />
              </button>
            </div>
          </div>
          {}
          <div style={{ height: '1px', background: 'rgba(16, 16, 16, 0.08)', margin: '18px 0 10px 0' }} />
          {}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={item.label}>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      item.action();
                    }}
                    style={{
                      width: '100%',
                      padding: '13px 6px',
                      background: 'none',
                      border: 'none',
                      color: '#101010',
                      font: '500 11px/1 Archivo, sans-serif',
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(16, 16, 16, 0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <IconComponent size={18} style={{ opacity: 0.85, strokeWidth: 1.6 }} />
                      <span>{item.label}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {item.badge && (
                        <span
                          style={{
                            fontSize: '9px',
                            background: '#101010',
                            color: '#ffffff',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            fontWeight: '600'
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.showChevron && <ChevronRight size={14} style={{ opacity: 0.4 }} />}
                    </div>
                  </button>
                  {index < menuItems.length - 1 && (
                    <div style={{ height: '1px', background: 'rgba(16, 16, 16, 0.05)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
