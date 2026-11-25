import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../utils/format.js';

export default function Cart() {
  const { items, remove, updateQty } = useCart();
  const subtotal = items.reduce((sum, i) => sum + (i.product.price || 0) * (i.qty || 1), 0);
  const message = encodeURIComponent(`Hello AL NISA COLLECTIONS, I would like to order:\n${items.map(i => `• ${i.product.name} (${i.size || 'One size'}${i.color ? `, ${i.color}` : ''}) × ${i.qty} — ${money((i.product.price || 0) * i.qty)}`).join('\n')}\n\nTotal: ${money(subtotal)}`);

  return <main className="catalog-page"><div className="page-heading"><span className="eyebrow">YOUR EDIT</span><h1>Shopping bag</h1></div>{items.length ? <><div className="cart-list">{items.map((item, i) => <article className="cart-item" key={`${item.product._id}-${i}`}><img src={item.product.images?.[0]?.url} alt=""/><div><h3>{item.product.name}</h3><p>{[item.color, item.size].filter(Boolean).join(' · ') || 'One size'}</p><b>{money((item.product.price || 0) * item.qty)}</b><div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}><button type="button" onClick={() => updateQty(i, item.qty - 1)} style={{ padding: '2px 8px', fontSize: '13px' }}>−</button><span>Qty {item.qty}</span><button type="button" onClick={() => updateQty(i, item.qty + 1)} style={{ padding: '2px 8px', fontSize: '13px' }}>+</button></div></div><button onClick={() => remove(i)}>Remove</button></article>)}</div><div style={{ margin: '20px 0', fontSize: '18px', fontWeight: 600 }}>Total: {money(subtotal)}</div><a className="button" href={`https://wa.me/917731935049?text=${message}`} target="_blank" rel="noreferrer">CONTINUE ON WHATSAPP ↗</a><p className="delivery-note">We’ll confirm availability, delivery and payment with you before completing the order.</p></> : <div className="empty-state">Your bag is waiting for something lovely.<p><Link to="/shop" className="text-link">EXPLORE THE COLLECTION ↗</Link></p></div>}</main>;
}
