import React from 'react';
import ProductCard from './ProductCard';

export default function Shop({ products, favs, onToggleFav, onAddToCart, onProductSelect }) {
  return (
    <section id="shop">
      <div className="wrap">
        <div className="hd">
          <h2 className="rv">Best of Sable</h2>
          <a href="#" className="btn-line rv" onClick={(e) => e.preventDefault()}>View all 42</a>
        </div>
        <div className="grid" id="grid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              isFav={Boolean(favs[p.id])}
              onToggleFav={onToggleFav}
              onAddToCart={onAddToCart}
              onClick={() => onProductSelect && onProductSelect(p.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

