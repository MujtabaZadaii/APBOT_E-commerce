import React from 'react';

export default function Footer() {
  const handleScrollToShop = (e) => {
    e.preventDefault();
    const el = document.querySelector('#shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div>
            <div className="mk">SABLE</div>
            <address>
              18 Redchurch Street<br />
              London E2 7DP<br /><br />
              hello@sable.studio
            </address>
          </div>
          <div>
            <h4>Shop</h4>
            <a href="#shop" onClick={handleScrollToShop}>Outerwear</a>
            <a href="#shop" onClick={handleScrollToShop}>Knitwear</a>
            <a href="#shop" onClick={handleScrollToShop}>Tailoring</a>
            <a href="#shop" onClick={handleScrollToShop}>Archive sale</a>
          </div>
          <div>
            <h4>Help</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>Sizing</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Shipping</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Returns</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Repairs</a>
          </div>
          <div>
            <h4>Studio</h4>
            <a href="#" onClick={(e) => e.preventDefault()}>Our cloth</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Stockists</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Journal</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Careers</a>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 Sable Studio Ltd · Company 11482207</span>
          <span>Prices include VAT</span>
        </div>
      </div>
    </footer>
  );
}

