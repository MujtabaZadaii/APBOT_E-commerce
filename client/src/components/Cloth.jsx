import React from 'react';
export default function Cloth() {
  return (
    <section id="cloth">
      <div className="cgrid">
        <div className="ccopy">
          <div className="lbl rv" style={{ marginBottom: '16px', color: 'var(--mid)' }}>The cloth</div>
          <h2 className="rv">Three cloths,<br />all season.</h2>
          <p className="rv">
            We buy one wool, one cotton and one lambswool, in quantity, once a year. It is
            the reason a coat from two seasons ago still sits next to this one.
          </p>
          <dl className="rv">
            <div><dt>Melton wool</dt><dd>620 gsm · Huddersfield</dd></div>
            <div><dt>Dry cotton</dt><dd>340 gsm · Osaka</dd></div>
            <div><dt>Lambswool</dt><dd>7 gauge · Hawick</dd></div>
          </dl>
        </div>
        <figure className="cshot rv vband" data-speed="0.05">
          <video
            data-src="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cloth.mp4"
            poster="https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@sable-v2/sable/img/cloth.webp"
            muted
            loop
            playsInline
            preload="none"
            aria-label="Macro of charcoal melton wool moving in a draught"
          />
        </figure>
      </div>
    </section>
  );
}
