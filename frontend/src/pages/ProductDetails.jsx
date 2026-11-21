import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { money } from '../utils/format.js';

export default function ProductDetails() {
  const { slug } = useParams(); const { getProduct } = useProducts(); const { data, loading, error } = useLoad(() => getProduct(slug), [slug]);
  const [selected, setSelected] = useState(0); const [size, setSize] = useState(''); const [color, setColor] = useState(''); const { add } = useCart();
  useEffect(() => setSelected(0), [slug]);
  if (loading) return <main className="page-state">Loading product…</main>; if (error) return <main className="page-state error-text">{error}</main>;
  const { product, related } = data; const image = product.images[selected]?.url || '';
  return <main className="product-detail"><div className="detail-gallery"><img className="detail-main-image" src={image} alt={product.name}/><div className="detail-thumbs">{product.images.map((img, i) => <button className={selected === i ? 'selected' : ''} key={img.publicId} onClick={() => setSelected(i)}><img src={img.url} alt={`${product.name}, view ${i + 1}`}/></button>)}</div></div><div className="detail-copy"><span className="eyebrow">{product.category?.name}</span><h1>{product.name}</h1><div className="price detail-price"><b>{money(product.price)}</b>{product.compareAtPrice > product.price && <del>{money(product.compareAtPrice)}</del>}</div><p className="description">{product.description}</p>
    {product.colors?.length > 0 && <label className="detail-select">COLOUR<select value={color} onChange={e => setColor(e.target.value)}><option value="">Choose a colour</option>{product.colors.map(c => <option key={c}>{c}</option>)}</select></label>}{product.sizes?.length > 0 && <label className="detail-select">SIZE<select value={size} onChange={e => setSize(e.target.value)}><option value="">Choose a size</option>{product.sizes.map(s => <option key={s}>{s}</option>)}</select></label>}
    <p className="stock-status">{product.stock > 0 ? `${product.stock} available` : 'Contact us to check availability'}</p><button className="button" disabled={product.stock <= 0 || (product.sizes?.length && !size) || (product.colors?.length && !color)} onClick={() => add(product, size, color)}>ADD TO BAG</button><p className="delivery-note">For delivery and payment details, please contact us on WhatsApp.</p></div>{related.length > 0 && <section className="related-products"><div className="section-title"><div><span className="eyebrow">COMPLETE THE EDIT</span><h2>You may also <i>love</i></h2></div></div><ProductGrid products={related}/></section>}</main>;
}
