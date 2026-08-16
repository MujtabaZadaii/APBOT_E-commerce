import React from 'react';

export default function Lookbook() {
  return (
    <section id="look">
      <div className="wrap">
        <div className="lhd">
          <div>
            <div className="lbl rv" style={{ marginBottom: '14px', color: 'var(--mid)' }}>Lookbook</div>
            <h2 className="rv">Autumn<br />2026</h2>
          </div>
          <p className="rv">
            Photographed over two mornings on the Isle of Grain. Nothing was steamed and
            nothing was retouched, which is why the coats look like coats.
          </p>
        </div>
        <div className="lgrid">
          <figure className="lg-a rv" data-scrub="" data-speed="0.06">
            <div className="ph">
              <img
                src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/look1.webp"
                alt="Model against a concrete wall in the overcoat"
                loading="lazy"
              />
            </div>
            <figcaption><span>01</span> Overcoat, wide trouser</figcaption>
          </figure>
          <figure className="lg-b rv" data-scrub="" data-speed="0.13">
            <div className="ph">
              <img
                src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/look2.webp"
                alt="Two models seated on a concrete bench"
                loading="lazy"
              />
            </div>
            <figcaption><span>02</span> Cable crew, overshirt</figcaption>
          </figure>
          <figure className="lg-c rv" data-scrub="" data-speed="0.03">
            <div className="ph">
              <img
                src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/season.webp"
                alt="Portrait in the open collar shirt"
                loading="lazy"
              />
            </div>
            <figcaption><span>03</span> Open collar, worn open</figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

