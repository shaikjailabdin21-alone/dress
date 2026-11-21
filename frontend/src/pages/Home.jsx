import { Link } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import SectionTitle from '../components/common/SectionTitle.jsx';
import { useProductSync } from '../hooks/useProductSync.js';
import { getAllProducts } from '../services/productService.js';

export default function Home() {
  const { getCategories } = useProducts();
  const productRevision = useProductSync();
  const { data, loading, error } = useLoad(async () => { const [all, categories] = await Promise.all([getAllProducts(), getCategories().catch(() => [])]); return { all, fresh: all.filter(product => product.isNewArrival), featured: all.filter(product => product.isFeatured).slice(0, 4), categories }; }, [productRevision], true);
  return <main><section className="hero home-text-hero"><div className="hero-copy"><span className="eyebrow">THE ART OF MODEST LUXURY</span><h1>Elegance in<br/><i>every layer.</i></h1><p>Discover timeless modest fashion designed with grace, beauty and intention.</p><p className="home-admin-name">Curated by <strong>UMAR ALI</strong></p><Link className="button button-light" to="/shop">SHOP THE COLLECTION <span>↗</span></Link></div><span className="hero-ornament">✧</span></section>
    <section className="intro-block"><span className="eyebrow">A WORLD OF REFINED MODESTY</span><h2>Find your <i>forever</i> pieces</h2><p>Considered silhouettes, beautiful textures, and details to treasure.</p></section>
    {loading && !data && <div className="page-state">Loading the collection…</div>}{error && !data && <div className="page-state error-text">{error}</div>}{data && <>
      {!!data.categories.length && <section className="category-grid">{data.categories.slice(0, 4).map(c => <Link className="category-tile category-tile-text" to={`/shop?category=${c._id}`} key={c._id}><span>DISCOVER</span><h3>{c.name}</h3></Link>)}</section>}
      <section className="content-section"><SectionTitle overline="JUST ARRIVED" title="New with <i>grace</i>" to="/new-arrivals"/><ProductGrid products={data.fresh}/></section><section className="content-section soft-section"><SectionTitle overline="ALL PRODUCTS" title="The complete <i>collection</i>" to="/shop"/><ProductGrid products={data.all}/></section><section className="content-section"><SectionTitle overline="THE AL NISA EDIT" title="Chosen for <i>you</i>" to="/featured"/><ProductGrid products={data.featured}/></section>
    </>}</main>;
}
