import React from 'react';

export default function Categories() {
  const handleScrollToShop = (e) => {
    e.preventDefault();
    const el = document.querySelector('#shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="cats">
      <div className="wrap row">
        <a href="#shop" className="rv" onClick={handleScrollToShop}>
          <div className="ph">
            <img
              src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cat-men.webp"
              alt="Outerwear"
              loading="lazy"
            />
          </div>
          <div>
            <h3>Outerwear</h3>
            <p>Coats and overshirts cut with room to move.</p>
            <span className="go">Shop outerwear <i>→</i></span>
          </div>
        </a>

        <a href="#shop" className="rv" onClick={handleScrollToShop}>
          <div className="ph">
            <img
              src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cat-women.webp"
              alt="Knitwear"
              loading="lazy"
            />
          </div>
          <div>
            <h3>Knitwear</h3>
            <p>Heavy gauge lambswool, worn soft by the second season.</p>
            <span className="go">Shop knitwear <i>→</i></span>
          </div>
        </a>

        <a href="#shop" className="rv" onClick={handleScrollToShop}>
          <div className="ph">
            <img
              src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cat-tailoring.webp"
              alt="Tailoring"
              loading="lazy"
            />
          </div>
          <div>
            <h3>Tailoring</h3>
            <p>Unstructured jackets you can actually sit down in.</p>
            <span className="go">Shop tailoring <i>→</i></span>
          </div>
        </a>
      </div>
    </section>
  );
}

