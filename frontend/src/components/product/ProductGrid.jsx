import ProductCard from './ProductCard.jsx';

export default function ProductGrid({ products = [], showImages = true }) { return products.length ? <div className="product-grid">{products.map(product => <ProductCard key={product._id} product={product} showImage={showImages}/>)}</div> : <div className="empty-state">No products available yet.</div>; }
