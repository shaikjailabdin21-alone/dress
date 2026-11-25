import ProductCard from './ProductCard.jsx';

export default function ProductGrid({
  products = [],
  showImages = true,
  showViewDetails = true,
  showPrice = true,
  emptyMessage = 'No products available yet.'
}) {
  return products.length ? (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          showImage={showImages}
          showViewDetails={showViewDetails}
          showPrice={showPrice}
        />
      ))}
    </div>
  ) : (
    <div className="empty-state">{emptyMessage}</div>
  );
}
