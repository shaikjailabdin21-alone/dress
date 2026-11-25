import { Link } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { useProductSync } from '../hooks/useProductSync.js';
import { getProducts } from '../services/productService.js';
import { isHiddenCategory } from '../utils/hiddenCategories.js';

export default function Home() {
  const { getCategories } = useProducts();
  const productRevision = useProductSync();
  const { data, loading, error } = useLoad(async () => {
    const [allRes, categories] = await Promise.all([
      getProducts('?limit=8&sort=newest'),
      getCategories().catch(() => []),
    ]);
    const all = allRes?.products || [];
    return { all, categories };
  }, [productRevision], true);

  return <main><section className="hero"><div className="hero-copy"><span className="eyebrow">THE ART OF MODEST LUXURY</span><h1>Elegance in<br/><i>every layer.</i></h1><p>Discover timeless modest fashion designed with grace, beauty and intention.</p><p className="home-admin-name">Curated by <strong>UMAR ALI</strong></p><Link className="button button-light" to="/shop">SHOP THE COLLECTION <span>↗</span></Link></div><div className="hero-photo"><img src="/images/home-gallery/khimar-sand-lace.jpeg" alt="Elegance in every layer - AL NISA COLLECTIONS" loading="eager" decoding="async" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/lace-hijab-sand.jpg'; }}/><div className="photo-label"><span>AL NISA</span><span>MODEST LUXURY</span></div></div><span className="hero-ornament">✧</span></section>
    <section className="intro-block"><span className="eyebrow">A WORLD OF REFINED MODESTY</span><h2>Find your <i>forever</i> pieces</h2><p>Considered silhouettes, beautiful textures, and details to treasure.</p></section>
    {loading && !data && <div className="page-state">Loading the collection…</div>}{error && !data && <div className="page-state error-text">{error}</div>}{data && <>
      {!!data.categories.filter(category => !isHiddenCategory(category)).length && <section className="category-grid">{data.categories.filter(category => !isHiddenCategory(category)).slice(0, 4).map(c => <Link className="category-tile category-tile-text" to={`/shop?category=${c._id}`} key={c._id}><span>DISCOVER</span><h3>{c.name}</h3></Link>)}</section>}
      <section className="content-section"><SectionTitle overline="ALL PRODUCTS" title="The complete <i>collection</i>" to="/shop"/><ProductGrid products={data.all} showViewDetails={false} showPrice={false}/></section>
    </>}</main>;
}
