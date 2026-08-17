import React, { useState } from 'react';
export default function ProductCard({ product, isFav, onToggleFav, onAddToCart, onClick }) {
  const [btnText, setBtnText] = useState('Add to bag');
  const [heartAnim, setHeartAnim] = useState(false);
  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setBtnText('Added');
    setTimeout(() => {
      setBtnText('Add to bag');
    }, 1400);
  };
  const handleFavClick = (e) => {
    e.stopPropagation();
    setHeartAnim(true);
    onToggleFav(product.id);
    setTimeout(() => setHeartAnim(false), 350);
  };
  return (
    <article className="card rv product-card">
      <div className="ph">
        <img
          src={product.img}
          alt={product.nm}
          loading="lazy"
          onClick={onClick}
          className="cursor-pointer sable-card-img"
        />
        <button
          className={`fav ${isFav ? 'active' : ''} ${heartAnim ? 'heart-pulse' : ''}`}
          aria-pressed={isFav ? 'true' : 'false'}
          aria-label={`Save ${product.nm}`}
          onClick={handleFavClick}
        >
          <svg viewBox="0 0 24 24">
            <path d="M12 20.5 3.8 12.6a5 5 0 0 1 7.1-7l1.1 1.1 1.1-1.1a5 5 0 0 1 7.1 7Z" />
          </svg>
        </button>
        <button className="add" onClick={handleAdd}>
          {btnText}
        </button>
      </div>
      <div className="meta">
        <div>
          <div className="nm cursor-pointer hover:underline" onClick={onClick}>{product.nm}</div>
          <div className="ct">{product.ct}</div>
        </div>
        <div className="pr">£{product.pr}</div>
      </div>
    </article>
  );
}
