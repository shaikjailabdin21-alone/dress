import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useCart } from '../../context/CartContext.jsx';

export default function ProductCard({ product, showImage = true }) {
  const image = product.images?.[0]?.url;
  const productPath = `/product/${encodeURIComponent(product.slug || product._id)}`;
  const [imageFailed, setImageFailed] = useState(false);
  const { add } = useCart();
  const hasOptions = product.sizes?.length > 0 || product.colors?.length > 0;
  const unavailable = product.stock != null && Number.isFinite(Number(product.stock)) && Number(product.stock) <= 0;
  return <article className={`product-card${showImage ? '' : ' product-card-text-only'}`}>{showImage && <Link className="product-image" to={productPath}>
    {image && !imageFailed ? <img src={image} alt={product.name} loading="lazy" decoding="async" onError={() => setImageFailed(true)}/> : <span className="image-empty">AL NISA</span>}
    {product.isNewArrival !== false && <span className="product-badge">NEW</span>}{product.isFeatured && <span className="product-badge product-badge-featured">FEATURED</span>}
  </Link>}<div className="product-info"><Link to={productPath}><h3>{product.name || 'Product details'}</h3></Link><small>Category: {product.category?.name || 'Unclassified'}</small>{product.description && <p className="product-summary">{product.description}</p>}
    <div className="product-card-actions"><Link className="button button-secondary" to={productPath}>VIEW DETAILS</Link>{hasOptions ? <Link className="button" to={productPath}>CHOOSE OPTIONS</Link> : <button className="button" disabled={unavailable} onClick={() => add(product)}>{unavailable ? 'OUT OF STOCK' : 'ADD TO CART'}</button>}</div>
  </div></article>;
}
