import React from 'react';
export default function Season() {
  const handleScrollToShop = (e) => {
    e.preventDefault();
    const el = document.querySelector('#shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };
  return (
    <section id="season">
      <div className="grid">
        <div className="copy">
          <div className="kick lbl rv">New season</div>
          <h2 className="rv">New<br />vibes</h2>
          <p className="rv">
            Sixteen pieces, one palette, cut from the same three cloths. Everything in the
            drop works with everything else in it, which is the entire point.
          </p>
          <a href="#shop" className="btn rv" onClick={handleScrollToShop}>
            <span>Explore the collection</span>
          </a>
        </div>
        <div className="shot">
          <img
            id="seasonImg"
            src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/season.webp"
            alt="Model in a black open collar shirt, lit from one side"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
