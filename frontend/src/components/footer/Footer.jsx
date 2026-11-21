import { Link } from 'react-router-dom';

export default function Footer() {
  return <footer className="site-footer"><div className="footer-brand"><Link className="brand" to="/"><img src="/images/al-nisa-collections-logo.png" alt=""/><span>AL NISA<small>COLLECTIONS</small></span></Link><p>Elegance in every layer.</p></div><div><b>DISCOVER</b><Link to="/shop">Shop all</Link><Link to="/new-arrivals">New arrivals</Link><Link to="/collections">Collections</Link></div><div><b>INFORMATION</b><Link to="/about">About us</Link><Link to="/contact">Contact us</Link><Link to="/privacy">Privacy policy</Link><Link to="/terms">Terms and conditions</Link></div><div><b>GET IN TOUCH</b><a href="https://wa.me/917731935049" target="_blank" rel="noreferrer">WhatsApp · +91 77319 35049</a></div><div className="copyright">© {new Date().getFullYear()} AL NISA COLLECTIONS <span>MADE WITH GRACE & INTENTION</span></div></footer>;
}
