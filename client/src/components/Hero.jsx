import React from 'react';
export default function Hero() {
  const handleScrollTo = (e, targetId) => {
    e.preventDefault();
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header id="hero">
      <div className="wrap" style={{ width: '100%' }}>
        <div className="tl hv" id="h1">
          <p>Fashion<br />that moves<br />with you.</p>
          <div className="rule"></div>
        </div>
        <div className="stage">
          <div className="word back" aria-hidden="true"><b id="wb">SABLE</b></div>
          <img
            className="model hv"
            id="hm"
            src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/model.png"
            alt="A model walking in an oversized charcoal overcoat, wide trousers and white sneakers"
          />
        </div>
        <div className="br hv" id="h2">
          <p>Autumn<br />collection<br />2026</p>
        </div>
        <div className="acts hv" id="h3">
          <a href="#shop" className="btn" onClick={(e) => handleScrollTo(e, '#shop')}>
            <span>Shop the collection</span>
          </a>
          <a href="#season" className="btn-line" onClick={(e) => handleScrollTo(e, '#season')}>
            Explore new in
          </a>
        </div>
      </div>
    </header>
  );
}
