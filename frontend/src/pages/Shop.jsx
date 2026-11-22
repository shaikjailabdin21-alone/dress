import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useLoad } from '../hooks/useLoad.js';
import { useProducts } from '../context/ProductContext.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { useProductSync } from '../hooks/useProductSync.js';

export default function Shop({ mode = 'all', title }) {
  const [params, setParams] = useSearchParams(); const location = useLocation();
  const [query, setQuery] = useState(params.get('q') || ''); const [searchTerm, setSearchTerm] = useState((params.get('q') || '').trim());
  useEffect(() => { const timer = window.setTimeout(() => { const value = query.trim(); setSearchTerm(value); const next = new URLSearchParams(params); value ? next.set('q', value) : next.delete('q'); next.delete('page'); setParams(next, { replace: true }); }, 300); return () => window.clearTimeout(timer); }, [query]);
  useEffect(() => { const value = new URLSearchParams(location.search).get('q') || ''; if (value.trim() !== searchTerm) { setQuery(value); setSearchTerm(value.trim()); } }, [location.pathname, location.search]);
  const category = params.get('category') || ''; const sort = params.get('sort') || 'newest';
  const page = Math.max(1, Number(params.get('page') || 1)); const collection = params.get('collection') || '';
  const requestParams = new URLSearchParams({ limit: '24', page: String(page), sort });
  if (mode === 'new') requestParams.set('newArrivals', 'true'); if (mode === 'featured') requestParams.set('featured', 'true');
  if (category) requestParams.set('category', category); if (collection) requestParams.set('collection', collection); if (searchTerm) requestParams.set('q', searchTerm);
  const url = `?${requestParams}`;
  const { getProducts, getCategories } = useProducts();
  const productRevision = useProductSync();
  const { data, loading, error } = useLoad(async () => { const [products, categories] = await Promise.all([getProducts(url), getCategories().catch(() => [])]); return { ...products, categories }; }, [url, productRevision], true);
  const heading = title || (mode === 'new' ? 'New arrivals' : mode === 'featured' ? 'Featured pieces' : 'Shop all');
  return <main className="catalog-page"><div className="page-heading"><span className="eyebrow">THE COLLECTION</span><h1>{heading}</h1><p>Thoughtfully chosen pieces for every layer of your day.</p></div><div className="catalog-tools"><label className="search-field">⌕ <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products" aria-label="Search products"/><button type="button" className="clear-search" aria-label="Clear search" onClick={() => setQuery('')} disabled={!query}>×</button></label><select aria-label="Filter by category" value={category} onChange={e => { const next = new URLSearchParams(params); e.target.value ? next.set('category', e.target.value) : next.delete('category'); next.delete('page'); setParams(next); }}><option value="">All categories</option>{data?.categories?.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select><select aria-label="Sort products" value={sort} onChange={e => { const next = new URLSearchParams(params); next.set('sort', e.target.value); next.delete('page'); setParams(next); }}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="priceLow">Price: low to high</option><option value="priceHigh">Price: high to low</option></select></div>
    {loading && <div className="page-state" role="status">{data ? 'Updating products…' : 'Loading products…'}</div>}{error && data && <div className="page-state error-text" role="status">{error}</div>}{error && !data && !loading && <div className="page-state error-text">{error}</div>}{data && !loading && !error && <><ProductGrid products={data.products} emptyMessage={searchTerm || category || collection ? 'No products found. Try adjusting your search or filters.' : mode === 'new' ? 'No new arrivals are available yet.' : mode === 'featured' ? 'No featured products are available yet.' : 'No products are available yet.'}/>{data.pagination.pages > 1 && <div className="pagination"><button disabled={data.pagination.page <= 1} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(data.pagination.page - 1)); setParams(n); }}>← Previous</button><span>Page {data.pagination.page} of {data.pagination.pages}</span><button disabled={data.pagination.page >= data.pagination.pages} onClick={() => { const n = new URLSearchParams(params); n.set('page', String(data.pagination.page + 1)); setParams(n); }}>Next →</button></div>}</>}</main>;
}
