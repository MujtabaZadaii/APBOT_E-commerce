import React from 'react';

export default function Footer({
  onGoHome,
  onOpenProducts,
  onOpenAbout,
  onOpenFaq,
  onOpenContact
}) {
  return (
    <footer>
      <div className="wrap">
        <div className="cols">
          <div>
            <div className="mk" onClick={onGoHome} style={{ cursor: 'pointer' }}>SABLE</div>
            <address>
              14 Bruton Street, Mayfair<br />
              London W1J 6LX, UK<br /><br />
              concierge@sable-couture.com<br />
              +44 20 7946 0912
            </address>
          </div>
          <div>
            <h4>Collections</h4>
            <a 
              href="#shop" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenProducts) onOpenProducts();
              }}
            >
              All Products
            </a>
            <a 
              href="#shop" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenProducts) onOpenProducts();
              }}
            >
              Outerwear
            </a>
            <a 
              href="#shop" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenProducts) onOpenProducts();
              }}
            >
              Tailoring
            </a>
            <a 
              href="#shop" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenProducts) onOpenProducts();
              }}
            >
              Knitwear
            </a>
          </div>
          <div>
            <h4>Maison</h4>
            <a 
              href="#home" 
              onClick={(e) => {
                e.preventDefault();
                if (onGoHome) onGoHome();
              }}
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenAbout) onOpenAbout();
              }}
            >
              About SABLE
            </a>
            <a 
              href="#faq" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenFaq) onOpenFaq();
              }}
            >
              FAQ Intelligence
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
              }}
            >
              Contact Concierge
            </a>
          </div>
          <div>
            <h4>Client Services</h4>
            <a 
              href="#faq" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenFaq) onOpenFaq();
              }}
            >
              Order Tracking & FAQ
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
              }}
            >
              Bespoke Fitting
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                if (onOpenContact) onOpenContact();
              }}
            >
              Mayfair Atelier Visit
            </a>
          </div>
        </div>
        <div className="legal">
          <span>© 2026 SABLE HAUTE COUTURE LTD · LONDON</span>
          <span>COMPLIMENTARY GLOBAL SHIPPING OVER £150</span>
        </div>
      </div>
    </footer>
  );
}
