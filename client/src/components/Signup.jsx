import React, { useState } from 'react';
export default function Signup() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !e.target.checkValidity()) {
      return;
    }
    setSubscribed(true);
    setEmail('');
  };
  return (
    <section id="signup">
      <div className="wrap">
        <h2 className="rv">First look, first run.</h2>
        <p className="rv">
          Runs are small and they do sell out. We write once a month, before anything goes
          on the site.
        </p>
        <form className="rv" id="nf" noValidate onSubmit={handleSubmit}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="btn" type="submit">
            <span>Join the list</span>
          </button>
        </form>
        <div className={`ok ${subscribed ? 'on' : ''}`} id="nok" role="status">
          You are on the list. Look out for Thursday.
        </div>
      </div>
    </section>
  );
}
