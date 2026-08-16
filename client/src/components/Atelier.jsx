import React from 'react';

export default function Atelier() {
  return (
    <section id="atelier">
      <div className="agrid">
        <figure className="ashot rv" data-speed="0.05">
          <img
            src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/atelier.webp"
            alt="Hands guiding wool under a sewing machine"
            loading="lazy"
          />
        </figure>
        <div className="acopy">
          <div className="lbl rv" style={{ marginBottom: '16px', color: 'rgba(239,237,232,.5)' }}>The studio</div>
          <h2 className="rv">Eleven people,<br />one floor.</h2>
          <p className="rv">
            Everything is cut and made in the same building on Redchurch Street. Small runs,
            so if something does not sell we simply do not make it again.
          </p>
          <div className="acount rv">
            <div><b data-to="11">0</b><span>People</span></div>
            <div><b data-to="42">0</b><span>Styles a year</span></div>
            <div><b data-to="120">0</b><span>Units per run</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

