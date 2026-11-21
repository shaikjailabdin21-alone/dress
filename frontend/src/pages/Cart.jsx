import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format.js';

export default function Cart() {
  const { items, remove } = useCart();
  const message = encodeURIComponent(`Hello AL NISA COLLECTIONS, I would like to order:\n${items.map(i => `• ${i.product.name} (${i.size || 'One size'}${i.color ? `, ${i.color}` : ''}) × ${i.qty} — ${money(i.product.price * i.qty)}`).join('\n')}`);
  return <main className="catalog-page"><div className="page-heading"><span className="eyebrow">YOUR EDIT</span><h1>Shopping bag</h1></div>{items.length ? <><div className="cart-list">{items.map((item, i) => <article className="cart-item" key={`${item.product._id}-${i}`}><img src={item.product.images?.[0]?.url} alt=""/><div><h3>{item.product.name}</h3><p>{[item.color, item.size].filter(Boolean).join(' · ') || 'One size'} · Qty {item.qty}</p><b>{money(item.product.price * item.qty)}</b></div><button onClick={() => remove(i)}>Remove</button></article>)}</div><a className="button" href={`https://wa.me/917731935049?text=${message}`} target="_blank" rel="noreferrer">CONTINUE ON WHATSAPP ↗</a><p className="delivery-note">We’ll confirm availability, delivery and payment with you before completing the order.</p></> : <div className="empty-state">Your bag is waiting for something lovely.<p><Link to="/shop" className="text-link">EXPLORE THE COLLECTION ↗</Link></p></div>}</main>;
}
