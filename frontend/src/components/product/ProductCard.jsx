import { Link } from 'react-router-dom';
export default function ProductCard({ product, showImage = true }) {
  const image = product.images?.[0]?.url;
  return <article className={`product-card${showImage ? '' : ' product-card-text-only'}`}>{showImage && <Link className="product-image" to={`/product/${product.slug}`}>
    {image ? <img src={image} alt={product.name} loading="lazy" decoding="async"/> : <span className="image-empty">AL NISA</span>}
    {product.isNewArrival && <span className="product-badge">NEW</span>}
  </Link>}<div className="product-info"><Link to={`/product/${product.slug}`}><h3>{product.name || 'Product details'}</h3></Link><small>Category: {product.category?.name || 'Unclassified'}</small></div></article>;
}
