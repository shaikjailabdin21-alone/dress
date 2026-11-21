import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useProductSync } from '../hooks/useProductSync.js';

export default function Shop({ mode = 'all', title }) {
  const [params, setParams] = useSearchParams(); const [query, setQuery] = useState(params.get('q') || '');
  const category = params.get('category') || ''; const sort = params.get('sort') || 'newest';
  const page = Math.max(1, Number(params.get('page') || 1)); const collection = params.get('collection') || '';
  const url = `/products?limit=24&page=${page}&sort=${encodeURIComponent(sort)}&${mode === 'new' ? 'newArrivals=true&' : ''}${mode === 'featured' ? 'featured=true&' : ''}${category ? `category=${encodeURIComponent(category)}&` : ''}${collection ? `collection=${encodeURIComponent(collection)}&` : ''}${query ? `q=${encodeURIComponent(query)}` : ''}`;
  const { getProducts, getCategories } = useProducts();
  const productRevision = useProductSync();
  const { data, loading, error } = useLoad(async () => { const [products, categories] = await Promise.all([getProducts(url), getCategories().catch(() => [])]); return { ...products, categories }; }, [url, productRevision], true);
  const heading = title || (mode === 'new' ? 'New arrivals' : mode === 'featured' ? 'Featured pieces' : 'Shop all');
  return <main className="catalog-page"><div className="page-heading"><span className="eyebrow">THE COLLECTION</span><h1>{heading}</h1><p>Thoughtfully chosen pieces for every layer of your day.</p></div><div className="catalog-tools"><label className="search-field">⌕ <input value={query} onChange={e => { const v = e.target.value; setQuery(v); const next = new URLSearchParams(params); v ? next.set('q', v) : next.delete('q'); next.delete('page'); setParams(next); }} placeholder="Search products"/></label><select aria-label="Filter by category" value={category} onChange={e => { const next = new URLSearchParams(params); e.target.value ? next.set('category', e.target.value) : next.delete('category'); next.delete('page'); setParams(next); }}><option value="">All categories</option>{data?.categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select><select aria-label="Sort products" value={sort} onChange={e => { const next = new URLSearchParams(params); next.set('sort', e.target.value); next.delete('page'); setParams(next); }}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></select></div>
    {loading && !data ? <div className="page-state">Loading products…</div> : error && !data ? <div className="page-state error-text">{error}</div> : data && <><ProductGrid products={data.products}/>{data.pagination.pages > 1 && <div className="pagination"><button disabled={data.pagination.page <= 1} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(data.pagination.page - 1)); setParams(n); }}>← Previous</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button disabled={data.pagination.page >= data.pagination.pages} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(data.pagination.page + 1)); setParams(n); }}>Next →</button></div>}</>}</main>;
}
