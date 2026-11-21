import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';

export default function Header() {
  const [open, setOpen] = useState(false); const { count } = useCart();
  return <><div className="announcement">Discover elegant modest fashion <span>✦</span> New pieces, made for moments that matter</div><header className="site-header">
    <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setOpen(!open)}>☰</button>
    <Link className="brand" to="/"><img src="/images/al-nisa-collections-logo.png" alt="AL NISA COLLECTIONS"/><span>AL NISA<small>COLLECTIONS</small></span></Link>
    <nav className={open ? 'main-nav open' : 'main-nav'} onClick={() => setOpen(false)}>
      <NavLink end to="/">Home</NavLink><NavLink to="/shop">Shop all</NavLink><NavLink to="/new-arrivals">New arrivals</NavLink><NavLink to="/featured">Featured</NavLink><NavLink to="/collections">Collections</NavLink><NavLink to="/about">Our story</NavLink>
    </nav>
    <div className="header-actions"><Link to="/search" aria-label="Search products">⌕</Link><Link to="/cart" aria-label="Shopping bag">♧<i>{count}</i></Link></div>
  </header></>;
}
