import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { MessageSquare, X, Send, Package, RefreshCw, Minus, Mic, Plus, MapPin, Calendar, Truck, Bot, Volume2, VolumeX, Camera, ShoppingBag, Sparkles, Shirt, Scissors, Layers, Ruler, Tag, Headphones } from 'lucide-react';
const INITIAL_MESSAGES = [
  {
    role: 'assistant',
    content: "Welcome to SABLE Haute Couture. I am ApBot, your 24/7 personal AI Concierge. How may I assist you with our luxury collection, order tracking, sizing, or checkout today?"
  }
];
const ApBot = ({ currentUser, cartItems = [], onAddToCart, onRemoveFromCart, onClearCart, onOpenCart, onOpenCheckout, onOpenTracking, onOrderPlaced, favs = {}, onToggleFav, onOpenWishlist, onOpenAuth, onSignOut, onOpenProfile, onOpenOrders, onNavigate, onOpenSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem('sable_apbot_messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      setActionNotice('');
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognition.onstart = () => {
        setIsListening(true);
        setActionNotice("Listening... speak into your microphone");
      };
      recognition.onend = () => {
        setIsListening(false);
        setActionNotice('');
      };
      recognition.onerror = (err) => {
        console.error("Speech Recognition Error:", err);
        setIsListening(false);
        setActionNotice('');
      };
      recognition.onresult = (event) => {
        let textResult = '';
        for (let i = 0; i < event.results.length; i++) {
          textResult += event.results[i][0].transcript;
        }
        if (textResult) {
          setInput(textResult);
        }
      };
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
      setActionNotice('');
    }
  };
  const [conversationContext, setConversationContext] = useState(() => {
    try {
      const saved = localStorage.getItem('sable_apbot_context');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return { userId: currentUser?.email || 'guest' };
  });
  useEffect(() => {
    try {
      localStorage.setItem('sable_apbot_messages', JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
  }, [messages]);
  useEffect(() => {
    try {
      localStorage.setItem('sable_apbot_context', JSON.stringify(conversationContext));
    } catch (e) {
      console.error(e);
    }
  }, [conversationContext]);
  const handleResetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setConversationContext({ userId: currentUser?.email || 'guest' });
    try {
      localStorage.removeItem('sable_apbot_messages');
      localStorage.removeItem('sable_apbot_context');
    } catch (e) {
      console.error(e);
    }
  };
  const [actionNotice, setActionNotice] = useState('');
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const panelRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => {
    scrollToBottom();
    if (isSpeechEnabled && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'assistant' && lastMsg.content && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const cleanText = lastMsg.content.replace(/[\*\#\_]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isTyping, isSpeechEnabled]);
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setActionNotice("Scanning image with Visual AI...");
      setTimeout(() => {
        setActionNotice('');
        sendMessage(`visual search photo match ${file.name}`);
      }, 1200);
    }
  };
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [isOpen]);
  const handleClose = () => {
    setIsOpen(false);
  };
  const triggerActionFeedback = (text, callback) => {
    setActionNotice(text);
    setTimeout(() => {
      setActionNotice('');
      if (callback) callback();
    }, 1200);
  };
  const handlePaymentSubmit = async (paymentStr) => {
    setMessages(prev => [...prev, { role: 'user', content: paymentStr }]);
    setIsTyping(true);
    setActionNotice('Processing payment securely...');
    await new Promise(r => setTimeout(r, 1400));
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }
      const response = await fetch('http://localhost:5000/api/apbot/message', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: paymentStr,
          context: {
            ...conversationContext,
            cartItems
          }
        })
      });
      const data = await response.json();
      if (data.context) {
        setConversationContext(prev => ({ ...prev, ...data.context }));
      }
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(action => {
          if (action === 'place_order' && onOrderPlaced) {
            onOrderPlaced(data.data?.item || data.data?.order);
          }
        });
      }
      setIsTyping(false);
      setActionNotice('');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "Payment Successful! Your order has been confirmed." 
      }]);
      setIsTyping(true);
      setActionNotice('Generating shipping tracking label...');
      await new Promise(r => setTimeout(r, 1600));
      setIsTyping(false);
      setActionNotice('');
      if (data.data) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: `Here are your live parcel tracking details for Order #${data.data.item?.orderId || 'SBL'}:`,
          data: data.data
        }]);
      }
    } catch (error) {
      setIsTyping(false);
      setActionNotice('');
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Payment processing error. Please try again.' 
      }]);
    }
  };
  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage, time: timeStr }]);
    setIsTyping(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (currentUser?.token) {
        headers['Authorization'] = `Bearer ${currentUser.token}`;
      }
      const response = await fetch('http://localhost:5000/api/apbot/message', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          message: userMessage,
          context: {
            ...conversationContext,
            cartItems
          }
        })
      });
      const data = await response.json();
      if (data.context) {
        setConversationContext(prev => ({ ...prev, ...data.context }));
      }
      if (data.actions && data.actions.length > 0) {
        data.actions.forEach(action => {
          if (action === 'navigate' && onNavigate && data.data?.target) {
            onNavigate(data.data.target, data.data);
            handleClose();
          }
          if (action === 'login' && onOpenAuth) {
            onOpenAuth();
            handleClose();
          }
          if (action === 'logout' && onSignOut) onSignOut();
          if (action === 'open_search' && onOpenSearch) {
            onOpenSearch();
            handleClose();
          }
          if (action === 'open_profile' && onOpenProfile) {
            onOpenProfile();
            handleClose();
          }
          if (action === 'open_orders' && onOpenOrders) {
            onOpenOrders();
            handleClose();
          }
          if (action === 'open_cart' && onOpenCart) onOpenCart();
          if (action === 'open_checkout' && onOpenCheckout) onOpenCheckout();
          if (action === 'open_tracking' && onOpenTracking) onOpenTracking(data.data?.item);
          if (action === 'open_wishlist' && onOpenWishlist) onOpenWishlist();
          if (action === 'add_to_cart' && onAddToCart && data.data?.product) {
            const qty = data.data.quantity || 1;
            for(let i=0; i<qty; i++) {
                onAddToCart({ ...data.data.product, id: data.data.product._id }, false);
            }
          }
          if (action === 'remove_from_cart' && onRemoveFromCart && data.data?.productId) {
            onRemoveFromCart(data.data.productId);
          }
          if (action === 'clear_cart') {
            if (onClearCart) {
              onClearCart();
            } else if (onRemoveFromCart && cartItems.length > 0) {
              cartItems.forEach(item => onRemoveFromCart(item.id || item._id));
            }
          }
          if (action === 'wishlist_add' && onToggleFav && data.data?.product) {
            onToggleFav(data.data.product._id || data.data.product.id);
            triggerActionFeedback("Item saved to Wishlist!");
          }
          if (action === 'wishlist_remove' && onToggleFav && data.data?.productId) {
            if (favs[data.data.productId]) onToggleFav(data.data.productId);
          }
          if (action === 'place_order' && onOrderPlaced) {
            onOrderPlaced(data.data?.item || data.data?.order);
          }
        });
      }
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message,
        data: data.data
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'I seem to be experiencing a connection issue. Please try again in a moment.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleSend = async (e) => {
    e.preventDefault();
    sendMessage(input);
  };
  const handleProductAdd = (e, product) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart({ ...product, id: product._id }, false);
  };
  const renderData = (data) => {
    if (!data) return null;
    if (data.type === 'products' || data.type === 'product_list') {
      const itemsList = data.items || data.products || [];
      return (
        <>
          <div className="apbot-products">
            {itemsList.map(product => {
              const prodId = product._id || product.id;
              const prodImg = product.images?.[0] || product.img || 'https://via.placeholder.com/150';
              const prodPrice = typeof product.price === 'number' ? product.price.toFixed(2) : product.price;
              return (
                <div key={prodId} className="apbot-product-card" onClick={() => {
                  if (onNavigate) {
                    onNavigate('product', { id: prodId });
                    handleClose();
                  } else if (onAddToCart) {
                    onAddToCart({ ...product, id: prodId }, false);
                  }
                }}>
                  <div className="apbot-product-img-wrap">
                    <img src={prodImg} alt={product.name} />
                  </div>
                  <div className="apbot-product-info">
                    <span className="apbot-product-name">{product.name}</span>
                    <span className="apbot-product-price">£{prodPrice}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="apbot-product-hint">
            {data.hint || "Click any item to view full details, or let me know which piece you'd like me to add to your bag."}
          </p>
        </>
      );
    }
    if (data.type === 'product_detail' || data.type === 'product_info') {
        const prod = data.product || data.item;
        if (!prod) return null;
        return (
          <div className="apbot-product-info-card" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', overflow: 'hidden', marginTop: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={prod.img || prod.images?.[0]} alt={prod.nm || prod.name} style={{ width: '100%', height: 'auto', display: 'block' }} />
            <div style={{ padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>{prod.nm || prod.name}</h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#aaa', lineHeight: 1.4 }}>{prod.desc}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                    <span style={{ color: '#888' }}>Material:</span>
                    <span>{prod.material || 'Premium Material'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px' }}>
                    <span style={{ color: '#888' }}>Sizes:</span>
                    <span>{prod.sizes ? prod.sizes.join(', ') : 'Standard'}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onAddToCart && onAddToCart({ ...prod, id: prod._id, name: prod.nm || prod.name, price: prod.pr || prod.price, images: [prod.img || prod.images?.[0]] }, false)}
                    className="apbot-submit-btn" style={{ flex: 1 }}
                  >
                    Add to Bag
                  </button>
                  <button 
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate('product', { id: prod._id });
                        setIsOpen(false);
                      }
                    }}
                    className="apbot-submit-btn" style={{ flex: 1, background: 'transparent', border: '1px solid #fff' }}
                  >
                    View Details
                  </button>
                </div>
            </div>
          </div>
        );
    }
    if (data.type === 'cart_summary') {
      return (
        <div className="apbot-products">
          {data.items.map(product => (
            <div key={product._id} className="apbot-product-card">
              <div className="apbot-product-img-wrap">
                <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} />
              </div>
              <div className="apbot-product-info">
                <span className="apbot-product-name">{product.name}</span>
                <span className="apbot-product-price">
                  £{product.price.toFixed(2)} <span style={{ opacity: 0.6 }}>x{product.quantity}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (data.type === 'order') {
      const orderObj = data.item || {};
      const orderCode = orderObj.orderId || orderObj.trackingNumber || 'SBL-ORDER';
      const orderStatus = orderObj.trackingStatus || 'Order Placed';
      const steps = ['Order Placed', 'Processing', 'In Transit', 'Out for Delivery', 'Delivered'];
      const activeStepIdx = steps.findIndex(s => s.toLowerCase() === orderStatus.toLowerCase());
      const currentStepIdx = activeStepIdx !== -1 ? activeStepIdx : 0;
      return (
        <div className="apbot-order-card" style={{ marginTop: '12px', padding: '14px 16px', background: '#FFFFFF', borderRadius: '8px', border: '1px solid rgba(16, 16, 16, 0.12)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
          <div className="apbot-order-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(16,16,16,0.08)', paddingBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '13px', letterSpacing: '0.04em' }}>
              <Package size={16} />
              <span>{orderCode}</span>
            </div>
            {orderObj.totalAmount && (
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#101010' }}>£{orderObj.totalAmount.toFixed(2)}</span>
            )}
          </div>
          <div style={{ fontSize: '11px', color: '#555', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={13} style={{ color: '#101010' }} />
              <span><strong>Location:</strong> SABLE London Fulfillment Centre</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={13} style={{ color: '#101010' }} />
              <span><strong>Est. Delivery:</strong> 3-5 Business Days</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Truck size={13} style={{ color: '#16a34a' }} />
              <span><strong>Status:</strong> <strong style={{ color: '#16a34a' }}>{orderStatus}</strong></span>
            </div>
          </div>
          {}
          <div style={{ margin: '14px 0 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', background: 'rgba(16,16,16,0.1)', zIndex: 1, transform: 'translateY(-50%)' }} />
            <div style={{ position: 'absolute', top: '50%', left: 0, width: `${(currentStepIdx / (steps.length - 1)) * 100}%`, height: '2px', background: '#101010', zIndex: 2, transform: 'translateY(-50%)', transition: 'width 0.4s ease' }} />
            {steps.map((step, sIdx) => {
              const isDone = sIdx <= currentStepIdx;
              return (
                <div key={sIdx} style={{ zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: isDone ? '#101010' : '#FFFFFF',
                    border: isDone ? '2px solid #101010' : '2px solid rgba(16,16,16,0.2)',
                    transition: 'all 0.3s'
                  }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#777', marginBottom: '12px' }}>
            <span>Placed</span>
            <span>In Transit</span>
            <span>Delivered</span>
          </div>
          <button
            onClick={() => {
              if (onOpenTracking) onOpenTracking(orderObj);
            }}
            style={{
              width: '100%',
              background: '#101010',
              color: '#EFEDE8',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: '600',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Open Full Order Tracking</span>
            <span>&rarr;</span>
          </button>
        </div>
      );
    }
    if (data.type === 'size_fit_form') {
      return (
        <form
          className="apbot-inline-form"
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const height = formData.get('height') || '180 cm';
            const weight = formData.get('weight') || '75 kg';
            sendMessage(`My height is ${height} and my weight is ${weight}`);
          }}
          style={{ marginTop: '10px' }}
        >
          <input name="height" placeholder="Height (e.g. 180 cm or 6ft)" required />
          <input name="weight" placeholder="Weight (e.g. 75 kg or 165 lbs)" required />
          <button type="submit" className="apbot-submit-btn">Calculate AI Fit &rarr;</button>
        </form>
      );
    }
    if (data.type === 'size_fit_recommendation') {
      return (
        <div style={{ background: '#FAF9F6', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16,16,16,0.1)', marginTop: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ background: '#101010', color: '#EFEDE8', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>Recommended Size: {data.size}</span>
          </div>
          <p style={{ margin: 0, fontSize: '12px', color: '#444', lineHeight: 1.4 }}>{data.explanation}</p>
        </div>
      );
    }
    if (data.type === 'ai_outfit') {
      return (
        <div style={{ marginTop: '12px' }}>
          <div className="apbot-products">
            {(data.items || []).map(product => (
              <div key={product._id} className="apbot-product-card">
                <div className="apbot-product-img-wrap">
                  <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} />
                </div>
                <div className="apbot-product-info">
                  <span className="apbot-product-name">{product.name}</span>
                  <span className="apbot-product-price">£{product.price.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (onAddToCart && data.items) {
                data.items.forEach(item => onAddToCart(item, false));
                triggerActionFeedback("Full 3-piece outfit added to bag!");
              }
            }}
            className="apbot-submit-btn"
            style={{ marginTop: '10px', width: '100%', background: '#101010', color: '#EFEDE8' }}
          >
            Add Full Ensemble to Bag (£{data.totalAmount?.toFixed(2)})
          </button>
        </div>
      );
    }
    if (data.type === 'vip_discount') {
      return (
        <div style={{ background: '#101010', color: '#EFEDE8', padding: '16px', borderRadius: '8px', marginTop: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', opacity: 0.7, marginBottom: '6px' }}>SABLE VIP MEMBER PERK</div>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '0.1em', margin: '6px 0', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 12px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px' }}>
            {data.code || 'SABLE-VIP15'}
          </div>
          <p style={{ fontSize: '12px', opacity: 0.8, margin: '8px 0 12px' }}>15% OFF applied to your cart at checkout.</p>
          <button
            onClick={() => {
              triggerActionFeedback("15% VIP Discount Code Applied!");
            }}
            style={{ width: '100%', background: '#EFEDE8', color: '#101010', border: 'none', padding: '8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase' }}
          >
            Claim 15% VIP Discount &rarr;
          </button>
        </div>
      );
    }
    if (data.type === 'address_form') {
      return (
        <form 
          className="apbot-inline-form" 
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const addressStr = `${formData.get('name')}, ${formData.get('email')}, ${formData.get('phone')}, ${formData.get('address')}, ${formData.get('city')}`;
            sendMessage(addressStr);
          }}
        >
          <input name="name" placeholder="Full Name" required />
          <input name="email" type="email" placeholder="Email Address" required />
          <input name="phone" type="tel" placeholder="Phone Number" required />
          <input name="address" placeholder="Address Line 1" required />
          <input name="city" placeholder="City" required />
          <button type="submit" className="apbot-submit-btn">Continue to Payment</button>
        </form>
      );
    }
    if (data.type === 'payment_form') {
      return (
        <form 
          className="apbot-inline-form" 
          onSubmit={(e) => {
            e.preventDefault();
            handlePaymentSubmit("Demo Payment (Card ending in 4242)");
          }}
        >
          <p style={{ fontSize: '11px', color: '#666', margin: '0 0 8px 0', lineHeight: 1.4 }}>
            Demo Checkout Flow — No real card processing or sensitive data required.
          </p>
          <button type="submit" className="apbot-submit-btn" style={{ width: '100%' }}>Confirm Demo Order &rarr;</button>
        </form>
      );
    }
    if (data.type === 'report_status') {
      return (
        <div style={{ background: '#FAF9F6', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16,16,16,0.12)', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ background: '#101010', color: '#EFEDE8', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em' }}>
              REPORT #{data.reportId}
            </span>
            <span style={{ fontSize: '10px', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {data.status || 'Under Review'}
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#555', lineHeight: 1.4 }}>
            Priority Issue Ticket is active. Our Mayfair Concierge is reviewing your logged details and will email you within 24 hours.
          </p>
        </div>
      );
    }
    if (data.type === 'contact_form' || data.type === 'report_issue_form') {
      return (
        <div className="apbot-contact-card" style={{ background: '#FAF9F6', padding: '14px', borderRadius: '8px', border: '1px solid rgba(16,16,16,0.12)', marginTop: '12px' }}>
          <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#101010', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Submit Priority Issue Report</h4>
          <p style={{ margin: '0 0 10px 0', fontSize: '11px', color: '#666', lineHeight: 1.4 }}>Fill out the report form below to log your inquiry with our Mayfair Concierge.</p>
          <form 
            className="apbot-inline-form"
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const name = formData.get('name') || 'Guest';
              const subject = formData.get('subject') || 'Issue Report';
              const reportNum = Math.floor(10000 + Math.random() * 90000);
              triggerActionFeedback(`Priority Issue Report #SBL-REP-${reportNum} Submitted!`);
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: `Thank you, ${name}. Your issue report regarding "${subject}" has been registered with priority tracking ID #SBL-REP-${reportNum}. Our Mayfair Concierge team will follow up via email within 24 hours.`
              }]);
            }}
          >
            <input name="name" placeholder="Your Name" required defaultValue={currentUser?.name || ''} />
            <input name="email" type="email" placeholder="Email Address" required defaultValue={currentUser?.email || ''} />
            <input name="subject" placeholder="Issue Subject (e.g. Parcel Delay, Damaged Box)" required />
            <textarea name="details" placeholder="Describe your issue in detail..." required rows={3} style={{ width: '100%', padding: '8px 10px', fontSize: '11px', borderRadius: '4px', border: '1px solid rgba(16,16,16,0.15)', background: '#FFFFFF', color: '#101010', fontFamily: 'Archivo, sans-serif', resize: 'vertical' }} />
            <button type="submit" className="apbot-submit-btn" style={{ width: '100%', marginTop: '6px' }}>
              Submit Priority Report &rarr;
            </button>
          </form>
          <button 
            type="button"
            onClick={() => {
              if (onNavigate) onNavigate('contact');
              handleClose();
            }}
            style={{ width: '100%', marginTop: '8px', background: 'transparent', border: '1px solid #101010', color: '#101010', padding: '8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.12em' }}
          >
            Open Full Contact Page &rarr;
          </button>
        </div>
      );
    }
    return null;
  };
  return (
    <>
      <button 
        className={`apbot-trigger ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        title="Open SABLE ApBot AI"
      >
        <Bot size={20} />
      </button>
      <div ref={panelRef} className={`apbot-container ${isOpen ? 'open' : ''}`}>
        {actionNotice && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'var(--ink)',
            color: 'var(--bone)',
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            padding: '8px 16px',
            textAlign: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {actionNotice}
          </div>
        )}
        <div className="apbot-header">
          <div className="apbot-header-left">
            <img src="/apbot-logo.png" alt="ApBot" className="apbot-header-avatar" />
            <div className="apbot-title-group">
              <span className="apbot-title">ApBot</span>
            </div>
          </div>
          <div className="apbot-header-actions">
            <button onClick={() => setIsSpeechEnabled(!isSpeechEnabled)} title={isSpeechEnabled ? "Disable AI Voice Read-Aloud" : "Enable AI Voice Read-Aloud"} style={{ color: isSpeechEnabled ? '#10b981' : 'inherit' }}>
              {isSpeechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button onClick={handleResetChat} title="Reset Chat">
              <RefreshCw size={14} />
            </button>
            <button onClick={handleClose}>
              <Minus size={16} />
            </button>
            <button onClick={handleClose}>
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="apbot-messages no-scrollbar" data-lenis-prevent="true">
          {messages.map((msg, idx) => (
            <div key={idx} className={`apbot-message-wrapper ${msg.role}`}>
              {msg.role === 'assistant' && (
                <img src="/apbot-logo.png" alt="Avatar" className="apbot-bot-avatar" />
              )}
              <div className="apbot-message">
                <p>{msg.content}</p>
                {renderData(msg.data)}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="apbot-message-wrapper assistant">
              <img src="/apbot-logo.png" alt="Avatar" className="apbot-bot-avatar" />
              <div className="apbot-message">
                <div className="apbot-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="apbot-quick-actions" style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '8px 12px', scrollbarWidth: 'none' }}>
          <button type="button" onClick={() => sendMessage("What's in my bag?")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <ShoppingBag size={13} /> View Bag
          </button>
          <button type="button" onClick={() => sendMessage("Track my order")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Package size={13} /> Track Order
          </button>
          <button type="button" onClick={() => sendMessage("Show me new arrivals")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} /> New Arrivals
          </button>
          <button type="button" onClick={() => sendMessage("Show me outerwear jackets")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Shirt size={13} /> Outerwear
          </button>
          <button type="button" onClick={() => sendMessage("Show me tailoring collection")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Scissors size={13} /> Tailoring
          </button>
          <button type="button" onClick={() => sendMessage("Show me knitwear sweaters")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={13} /> Knitwear
          </button>
          <button type="button" onClick={() => sendMessage("Help me find my size")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Ruler size={13} /> Size Guide
          </button>
          
          <button type="button" onClick={() => sendMessage("How can I contact customer support?")} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Headphones size={13} /> Contact Us
          </button>
        </div>
        <form onSubmit={handleSend} className="apbot-input-area">
          <div className="apbot-input-box">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              title="Upload Photo for Visual AI Search (+)"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 4px', display: 'flex', alignItems: 'center' }}
            >
              <Plus size={18} className="icon-plus" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
            />
            <div className="apbot-input-actions">
              <button 
                type="button" 
                onClick={handleVoiceInput}
                title={isListening ? "Listening... Speak into mic" : "Voice Dictation"}
                style={{ color: isListening ? '#ef4444' : 'inherit', animation: isListening ? 'pulse 1s infinite' : 'none' }}
              >
                <Mic size={16} />
              </button>
              <button type="submit" className="send-btn" disabled={!input.trim() || isTyping}>
                <Send size={14} />
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default ApBot;
