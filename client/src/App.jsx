import React, { useState, useEffect } from 'react';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Season from './components/Season';
import ServiceRow from './components/ServiceRow';
import Shop from './components/Shop';
import Lookbook from './components/Lookbook';
import Cloth from './components/Cloth';
import Atelier from './components/Atelier';
import Signup from './components/Signup';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import SearchModal from './components/SearchModal';
import WishlistDrawer from './components/WishlistDrawer';
import ProfileModal from './components/ProfileModal';
import CheckoutModal from './components/CheckoutModal';
import OrderTrackingPage from './components/OrderTrackingPage';
import MyOrdersModal from './components/MyOrdersModal';
import ApBot from './components/ApBot';
import ProductDetail from './components/ProductDetail';
import PageLoader from './components/PageLoader';
import { useScrollEffects } from './hooks/useScrollEffects';
import { usePageTransition } from './hooks/usePageTransition';


export default function App() {

  useScrollEffects();
  const { transitionTo } = usePageTransition();

  const handleSelectProduct = (id) => {
    transitionTo(() => setSelectedProductId(id));
  };

  const handleBackToHome = () => {
    transitionTo(() => setSelectedProductId(null));
  };



  const [favs, setFavs] = useState(() => {
    try {
      const savedFavs = localStorage.getItem('sable_favs');
      return savedFavs ? JSON.parse(savedFavs) : {};
    } catch {
      return {};
    }
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register');

  // Persistent User Session via localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sable_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // Modals & Drawers State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [trackingDefaultOrder, setTrackingDefaultOrder] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [products, setProducts] = useState([]);

  // Fetch real products
  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        // Map _id to id for backwards compatibility with Shop component
        setProducts(data.map(p => ({ ...p, id: p._id })));
      })
      .catch(err => console.error("Failed to fetch products", err));
  }, []);

  // Cart & Orders State with Persistence
  const [userCarts, setUserCarts] = useState(() => {
    try {
      const savedCarts = localStorage.getItem('sable_userCarts');
      return savedCarts ? JSON.parse(savedCarts) : {};
    } catch {
      return {};
    }
  });

  const [guestCart, setGuestCart] = useState([]);
  const [userOrders, setUserOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem('sable_orders');
      return savedOrders ? JSON.parse(savedOrders) : [];
    } catch {
      return [];
    }
  });

  // Persist User Session on Change & Fetch DB Wishlist
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('sable_user', JSON.stringify(currentUser));
      // Fetch wishlist from MongoDB
      fetch(`http://localhost:5000/api/user/wishlist?email=${encodeURIComponent(currentUser.email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.wishlist && Array.isArray(data.wishlist)) {
            const favMap = {};
            data.wishlist.forEach(id => { favMap[id] = true; });
            setFavs(prev => ({ ...prev, ...favMap }));
          }
        })
        .catch(err => console.error("Failed to fetch user wishlist", err));
    } else {
      localStorage.removeItem('sable_user');
    }
  }, [currentUser]);

  // Persist User Carts on Change
  useEffect(() => {
    localStorage.setItem('sable_userCarts', JSON.stringify(userCarts));
  }, [userCarts]);

  // Persist Wishlist on Change
  useEffect(() => {
    localStorage.setItem('sable_favs', JSON.stringify(favs));
  }, [favs]);

  // Persist Orders on Change
  useEffect(() => {
    localStorage.setItem('sable_orders', JSON.stringify(userOrders));
  }, [userOrders]);

  const isAnyModalOpen =
    isAuthOpen ||
    isCartOpen ||
    isSearchOpen ||
    isWishlistOpen ||
    isProfileOpen ||
    isCheckoutOpen ||
    isTrackingOpen;

  // Lock body scrolling and stop Lenis when any modal or drawer is open
  useEffect(() => {
    if (isAnyModalOpen) {
      document.body.classList.add('modal-open');
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
    }
    return () => {
      document.body.classList.remove('modal-open');
      if (window.lenis) window.lenis.start();
    };
  }, [isAnyModalOpen]);

  const activeUserId = currentUser ? currentUser.email : 'guest';
  const activeCartItems = currentUser
    ? userCarts[activeUserId] || []
    : guestCart;

  const totalBagCount = activeCartItems.reduce((acc, item) => acc + item.quantity, 0);
  const favCount = Object.keys(favs).filter((id) => favs[id]).length;

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    localStorage.setItem('sable_user', JSON.stringify(user));
    if (guestCart.length > 0) {
      setUserCarts((prev) => {
        const existingUserCart = prev[user.email] || [];
        const merged = [...existingUserCart];
        guestCart.forEach((gItem) => {
          const found = merged.find((item) => item.id === gItem.id);
          if (found) {
            found.quantity += gItem.quantity;
          } else {
            merged.push({ ...gItem });
          }
        });
        return { ...prev, [user.email]: merged };
      });
      setGuestCart([]);
    }
  };

  const handleAddToCart = (product, openDrawer = true) => {
    const updateCartArray = (items) => {
      const existing = items.find((i) => i.id === product.id);
      if (existing) {
        return items.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    };

    if (currentUser) {
      setUserCarts((prev) => ({
        ...prev,
        [currentUser.email]: updateCartArray(prev[currentUser.email] || [])
      }));
    } else {
      setGuestCart((prev) => updateCartArray(prev));
    }
    if (openDrawer) {
      setIsCartOpen(true);
    }
  };


  const handleUpdateQuantity = (id, newQty) => {
    const updateCartArray = (items) => {
      if (newQty <= 0) return items.filter((i) => i.id !== id);
      return items.map((i) => (i.id === id ? { ...i, quantity: newQty } : i));
    };

    if (currentUser) {
      setUserCarts((prev) => ({
        ...prev,
        [currentUser.email]: updateCartArray(prev[currentUser.email] || [])
      }));
    } else {
      setGuestCart((prev) => updateCartArray(prev));
    }
  };

  const handleRemoveItem = (id) => {
    const updateCartArray = (items) => items.filter((i) => i.id !== id);

    if (currentUser) {
      setUserCarts((prev) => ({
        ...prev,
        [currentUser.email]: updateCartArray(prev[currentUser.email] || [])
      }));
    } else {
      setGuestCart((prev) => updateCartArray(prev));
    }
  };

  const handleToggleFav = (id) => {
    setFavs((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));

    if (currentUser) {
      fetch('http://localhost:5000/api/user/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: currentUser.email, productId: id })
      }).catch(err => console.error("Failed to sync wishlist to DB", err));
    }
  };

  const handleOpenAuth = (mode = 'register') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('sable_user');
  };

  const handleStartCheckout = () => {
    setIsCartOpen(false);
    if (!currentUser) {
      handleOpenAuth('login');
    } else {
      setIsCheckoutOpen(true);
    }
  };

  const handleOrderPlaced = (order) => {
    if (order) {
      setUserOrders((prev) => [order, ...prev]);
    }
    if (currentUser) {
      setUserCarts((prev) => ({ ...prev, [currentUser.email]: [] }));
    }
    setGuestCart([]);
  };


  const handleOpenTrackingPage = (order = null) => {
    setTrackingDefaultOrder(order || null);
    setIsTrackingOpen(true);
  };

  const handleUpdateAddress = (newAddress) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, address: newAddress };
      setCurrentUser(updatedUser);
      localStorage.setItem('sable_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <div>
      <PageLoader />
      <AnnouncementBar />
      <Navbar
        bagCount={totalBagCount}
        favCount={favCount}
        currentUser={currentUser}
        onOpenAuth={() => handleOpenAuth('register')}
        onSignOut={handleSignOut}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenTracking={() => handleOpenTrackingPage(null)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />
      {selectedProductId ? (
        <ProductDetail 
          productId={selectedProductId} 
          onBack={handleBackToHome}
          onAddToCart={handleAddToCart}
          onToggleFav={handleToggleFav}
          favs={favs}
          onOpenApBot={() => {
            const chatToggle = document.querySelector('[data-apbot-toggle]');
            if (chatToggle) chatToggle.click();
          }}
        />
      ) : (
        <>
          <Hero />
          <Categories />
          <Season />
          <ServiceRow />
          <Shop
            products={products}
            favs={favs}
            onToggleFav={handleToggleFav}
            onAddToCart={handleAddToCart}
            onProductSelect={handleSelectProduct}
          />
          <Lookbook />
          <Cloth />
          <Atelier />
          <Signup />
        </>
      )}

      <Footer />

      {/* Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={activeCartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleStartCheckout}
        currentUser={currentUser}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onAddToCart={handleAddToCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        favs={favs}
        products={products}
        onToggleFav={handleToggleFav}
        onAddToCart={handleAddToCart}
        onProductSelect={setSelectedProductId}
        currentUser={currentUser}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onUpdateAddress={handleUpdateAddress}
      />

      <MyOrdersModal
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
        currentUser={currentUser}
        userOrders={userOrders}
        onOpenTrackingPage={handleOpenTrackingPage}
        onAddToCart={handleAddToCart}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={activeCartItems}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
        onOpenTrackingPage={handleOpenTrackingPage}
      />

      <OrderTrackingPage
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        defaultOrder={trackingDefaultOrder}
        orders={userOrders}
        currentUser={currentUser}
        bagCount={totalBagCount}
        favCount={favCount}
        onOpenAuth={() => handleOpenAuth('register')}
        onSignOut={handleSignOut}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <ApBot 
        currentUser={currentUser}
        cartItems={activeCartItems}
        onOrderPlaced={handleOrderPlaced}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveItem}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onOpenTracking={handleOpenTrackingPage}

        favs={favs}
        onToggleFav={handleToggleFav}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAuth={() => handleOpenAuth('login')}
        onSignOut={handleSignOut}
        onOpenProfile={() => setIsProfileOpen(true)}
        onNavigate={(target, params) => {
          if (target === 'home') setSelectedProductId(null);
          else if (target === 'product' && params?.id) setSelectedProductId(params.id);
          // could add more targets like categories if supported
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />
    </div>
  );
}
