import { Link } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';

export default function Collections() {
  const { getCollections } = useProducts();
  const { data, loading, error } = useLoad(getCollections, []);
  return <main className="catalog-page"><div className="page-heading"><span className="eyebrow">CURATED WITH INTENTION</span><h1>All collections</h1></div>{loading ? <div className="page-state">Loading collections…</div> : error ? <div className="page-state error-text">{error}</div> : data.length ? <div className="collection-list">{data.map(c => <Link key={c._id} to={`/shop?collection=${c._id}`}>{c.bannerImage?.url && <img src={c.bannerImage.url} alt="" loading="lazy"/>}<span className="eyebrow">THE AL NISA EDIT · {c.products?.length || 0} PIECES</span><h2>{c.name}</h2><p>{c.description}</p><span className="text-link">EXPLORE ↗</span><div className="collection-thumbs">{c.products?.slice(0, 4).map(p => <img key={p._id} src={p.images?.[0]?.url} alt={p.name} loading="lazy"/>)}</div></Link>)}</div> : <div className="empty-state">Our next collection is on its way.</div>}</main>;
}
