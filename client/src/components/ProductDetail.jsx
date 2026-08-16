import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './ProductDetail.css';

export default function ProductDetail({ productId, onBack, onAddToCart, onToggleFav, favs, onOpenApBot }) {
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  const containerRef = useRef(null);
  const mainImgRef = useRef(null);
  const contentRefs = useRef([]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setLoading(true);

    fetch(`http://localhost:5000/api/products/${productId}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colour) setSelectedColor(data.colour);
        
        if (data.relatedProducts && data.relatedProducts.length > 0) {
          Promise.all(data.relatedProducts.slice(0, 3).map(id => 
            fetch(`http://localhost:5000/api/products/${id}`).then(r => r.json()).catch(() => null)
          )).then(related => {
            setRelatedProducts(related.filter(Boolean));
          });
        } else {
          fetch('http://localhost:5000/api/products')
            .then(r => r.json())
            .then(all => {
              const others = all.filter(p => p._id !== data._id).slice(0, 3);
              setRelatedProducts(others);
            });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch product", err);
        setLoading(false);
      });
  }, [productId]);

  useEffect(() => {
    if (!loading && product && containerRef.current) {
      const tl = gsap.timeline();
      tl.fromTo(mainImgRef.current, 
        { autoAlpha: 0, scale: 1.02 }, 
        { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power3.out" }
      );
      tl.fromTo(contentRefs.current,
        { autoAlpha: 0, y: 15 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05, ease: "power2.out" },
        "-=0.8"
      );
    }
  }, [loading, product, productId]);

  useEffect(() => {
    if (mainImgRef.current) {
      gsap.fromTo(mainImgRef.current,
        { opacity: 0.5, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
      );
    }
  }, [activeImageIndex]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        onAddToCart({
          id: product._id,
          name: product.nm,
          price: product.pr,
          category: product.ct,
          images: [product.img],
          size: selectedSize
        });
      }
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="pd-loading">
        <div>Loading Editorial...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pd-error">
        <div style={{ marginBottom: '16px' }}>Product Not Found</div>
        <button onClick={onBack} className="pd-link-back">Return to Store</button>
      </div>
    );
  }

  const isFav = favs && favs[product._id];
  const images = [product.img, product.img, product.img, product.img, product.img];
  const colors = [
    { name: 'BLACK', hex: '#000000' },
    { name: 'TAN', hex: '#E6DCCF' },
    { name: 'GREY', hex: '#DCDCDC' }
  ];

  return (
    <div ref={containerRef} className="pd-wrap">
      {/* Top Split Section */}
      <div className="pd-top">
        
        {/* Left Gallery Section */}
        <div className="pd-gallery-area">
          <div className="pd-thumbnails">
            {images.map((img, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveImageIndex(idx)}
                className={`pd-thumb-btn ${activeImageIndex === idx ? 'active' : ''}`}
              >
                <img src={img} alt={`Thumbnail ${idx+1}`} />
              </button>
            ))}
          </div>
          
          <div className="pd-hero">
            <img 
              ref={mainImgRef}
              src={images[activeImageIndex]} 
              alt={product.nm}
            />


            <div className="pd-zoom-btn">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v6"/><path d="M8 11h6"/></svg>
            </div>
            <div className="pd-pagination">
              0{activeImageIndex + 1} &mdash; 05
            </div>
            <div className="pd-arrows">
              <button onClick={() => setActiveImageIndex(i => Math.max(0, i - 1))}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => setActiveImageIndex(i => Math.min(images.length - 1, i + 1))}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Right Details Section */}
        <div className="pd-info">
          
          <div ref={el => contentRefs.current[0] = el}>
            <div className="pd-breadcrumbs">
              <span onClick={onBack}>HOME</span> / <span>{product.ct}</span> / <span>{product.nm.toUpperCase()}</span>
            </div>
            <div className="pd-tag">BEST SELLER</div>
            
            <h1 className="pd-title">
              {product.nm}
            </h1>
            
            <div className="pd-price-row">
              <div className="pd-price">£{product.pr.toFixed(2)}</div>
              <div className="pd-stock">
                <span className={`pd-stock-dot ${product.inStock ? 'in' : 'out'}`}></span>
                {product.inStock ? 'IN STOCK' : 'SOLD OUT'}
              </div>
            </div>

            <p className="pd-desc">
              {product.desc || "A modern interpretation of a timeless silhouette. Crafted from premium materials with a refined finish for everyday elegance."}
            </p>
          </div>

          <div ref={el => contentRefs.current[1] = el}>
            <div className="pd-section-title">
              <span>COLOR:</span>
              <span style={{ color: '#666' }}>{selectedColor.toUpperCase() || 'BLACK'}</span>
            </div>
            <div className="pd-colors">
              {colors.map((c, i) => (
                <button 
                  key={i} 
                  onClick={() => setSelectedColor(c.name)}
                  className={`pd-color-btn ${selectedColor.toUpperCase() === c.name ? 'active' : ''}`}
                >
                  <div className="pd-color-inner" style={{ backgroundColor: c.hex }}></div>
                </button>
              ))}
            </div>
          </div>

          <div ref={el => contentRefs.current[2] = el}>
            <div className="pd-size-header">
              <span className="pd-section-title" style={{ margin: 0 }}>SIZE:</span>
              <button onClick={onOpenApBot} className="pd-size-guide">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                SIZE GUIDE
              </button>
            </div>
            <div className="pd-sizes">
              {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`pd-size-btn ${selectedSize === size ? 'active' : ''}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div ref={el => contentRefs.current[3] = el}>
            <div className="pd-qty-row">
              <span className="pd-section-title" style={{ margin: 0 }}>QTY:</span>
              <div className="pd-qty-box">
                <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/></svg>
                </button>
                <div>{quantity}</div>
                <button onClick={() => setQuantity(q => Math.min(10, q + 1))}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 5v14M5 12h14"/></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="pd-actions" ref={el => contentRefs.current[4] = el}>
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`pd-btn-primary ${isAdded ? 'added' : ''}`}
            >
              {isAdded ? 'ADDED' : `ADD TO BAG — £${product.pr.toFixed(2)}`}
            </button>
            <button
              onClick={() => onToggleFav(product._id)}
              className="pd-btn-secondary"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill={isFav ? "#1a1a1a" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {isFav ? 'SAVED' : 'ADD TO WISHLIST'}
            </button>
          </div>

          <div className="pd-features-strip" ref={el => contentRefs.current[5] = el}>
            <div className="pd-feature-item">
              <svg className="pd-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/></svg>
              <div>
                <div className="pd-feature-title">FREE SHIPPING</div>
                <div className="pd-feature-desc">On all orders over £200</div>
              </div>
            </div>
            <div className="pd-feature-item">
              <svg className="pd-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/></svg>
              <div>
                <div className="pd-feature-title">EASY RETURNS</div>
                <div className="pd-feature-desc">30-day return policy</div>
              </div>
            </div>
            <div className="pd-feature-item">
              <svg className="pd-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <div>
                <div className="pd-feature-title">SECURE PAYMENT</div>
                <div className="pd-feature-desc">100% secure checkout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Tabs + You May Also Like */}
      <div className="pd-bottom">
        <div className="pd-tabs-area">
          <div className="pd-tabs-nav">
            {['DETAILS', 'MATERIAL & CARE', 'SHIPPING', 'RETURNS'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`pd-tab-btn ${activeTab === tab.toLowerCase() ? 'active' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="pd-tabs-content">
            {activeTab === 'details' && (
              <div className="pd-tab-pane">
                <p className="pd-tab-text">
                  {product.desc || "Ribbed collar, cuffs, and hem. Two-way zip closure. Side pockets with hidden snap fasteners. Inner pocket for essentials."}
                </p>
                <ul className="pd-tab-list">
                  {(product.features && product.features.length > 0) ? product.features.map((f, i) => (
                    <li key={i}><span>•</span> {f}</li>
                  )) : (
                    <>
                      <li><span>•</span> Premium matte finish</li>
                      <li><span>•</span> Lightweight and breathable</li>
                      <li><span>•</span> Regular fit</li>
                      <li><span>•</span> Model is 188cm and wears size M</li>
                    </>
                  )}
                </ul>
              </div>
            )}
            {activeTab === 'material & care' && (
              <div className="pd-tab-pane" style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h4 className="pd-sub-head">MATERIAL</h4>
                  <p className="pd-sub-text" style={{ marginBottom: 0 }}>{product.material || "100% Premium Polyester"}</p>
                </div>
                <div>
                  <h4 className="pd-sub-head">CARE</h4>
                  <p className="pd-sub-text" style={{ marginBottom: 0 }}>Dry clean only. Do not bleach. Do not tumble dry. Cool iron if needed.</p>
                </div>
              </div>
            )}
            {activeTab === 'shipping' && (
              <div className="pd-tab-pane">
                <p className="pd-tab-text">
                  Standard shipping takes 3-5 business days. Express shipping is available at checkout. All orders over £200 qualify for complimentary express delivery.
                </p>
              </div>
            )}
            {activeTab === 'returns' && (
              <div className="pd-tab-pane">
                <p className="pd-tab-text">
                  We offer a 30-day return policy for all unused items in their original condition with tags attached. Refunds will be processed to the original method of payment.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pd-cross-sell">
          <div className="pd-cs-header">
            <h3 className="pd-cs-title">YOU MAY ALSO LIKE</h3>
            <div className="pd-cs-controls">
              <button>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              </button>
              <button>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
          
          <div className="pd-cs-grid">
            {relatedProducts.map(p => (
              <div key={p._id} className="pd-cs-card" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <div className="pd-cs-img-wrap">
                  <img src={p.img} alt={p.nm} />
                  <button onClick={(e) => { e.stopPropagation(); onToggleFav(p._id); }} className="pd-cs-fav">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={favs && favs[p._id] ? "#1a1a1a" : "none"} stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  </button>
                </div>
                <div className="pd-cs-nm">{p.nm}</div>
                <div className="pd-cs-pr">£{p.pr.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pd-trust-footer">
        <div className="pd-trust-grid">
          <div className="pd-trust-item">
            <svg className="pd-trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
            <div>
              <div className="pd-trust-title">PREMIUM QUALITY</div>
              <div className="pd-trust-desc">Finest materials & craftsmanship</div>
            </div>
          </div>
          <div className="pd-trust-item">
            <svg className="pd-trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <div>
              <div className="pd-trust-title">TIMELESS DESIGN</div>
              <div className="pd-trust-desc">Modern classics for every wardrobe</div>
            </div>
          </div>
          <div className="pd-trust-item">
            <svg className="pd-trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <div>
              <div className="pd-trust-title">BUILT TO LAST</div>
              <div className="pd-trust-desc">Durable & made to endure</div>
            </div>
          </div>
          <div className="pd-trust-item">
            <svg className="pd-trust-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <div>
              <div className="pd-trust-title">DESIGNED IN LONDON</div>
              <div className="pd-trust-desc">Thoughtfully designed in house</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
