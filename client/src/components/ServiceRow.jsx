import React from 'react';
export default function ServiceRow() {
  return (
    <section id="svc">
      <div className="wrap row">
        <div className="rv">
          <h4>Fast delivery</h4>
          <p>Dispatched within 24 hours, tracked.</p>
        </div>
        <div className="rv">
          <h4>Easy returns</h4>
          <p>30 days, prepaid label in the box.</p>
        </div>
        <div className="rv">
          <h4>Made to last</h4>
          <p>Repairs free for the first two years.</p>
        </div>
        <div className="rv">
          <h4>Secure payment</h4>
          <p>Every major method, nothing stored.</p>
        </div>
      </div>
    </section>
  );
}
