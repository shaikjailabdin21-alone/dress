import api from './api.js';

export async function getProducts(query = '') { return (await api.get(`/products${query}`)).data; }
export async function getAllProducts(query = '') {
  const params = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  params.set('limit', '48'); params.set('page', '1'); params.set('sort', 'newest');
  const firstPage = await getProducts(`?${params}`);
  if (firstPage.pagination.pages <= 1) return firstPage.products;
  const remaining = await Promise.all(Array.from({ length: firstPage.pagination.pages - 1 }, (_, index) => {
    const pageParams = new URLSearchParams(params);
    pageParams.set('page', String(index + 2));
    return getProducts(`?${pageParams}`);
  }));
  return [firstPage.products, ...remaining.map(page => page.products)].flat();
}
export async function getProduct(slug) { return (await api.get(`/products/${encodeURIComponent(slug)}`)).data; }
export async function getCategories(admin = false) { return (await api.get(admin ? '/categories/admin/all' : '/categories')).data.categories; }
export async function getCollections(admin = false) { return (await api.get(admin ? '/collections/admin/all' : '/collections')).data.collections; }
export async function getAdminProducts() { return (await api.get('/products/admin/all')).data.products; }
export async function saveProduct(id, body) { return id ? api.put(`/products/${id}`, body) : api.post('/products', body); }
export async function setProductActive(id, isActive) { return api.patch(`/products/${id}/status`, { isActive }); }
export async function deleteProduct(id) { return api.delete(`/products/${id}`); }
export async function createCategory(name) { return api.post('/categories', { name }); }
export async function updateCategory(id, data) { return api.put(`/categories/${id}`, data); }
export async function deleteCategory(id) { return api.delete(`/categories/${id}`); }
export async function createCollection(name) { return api.post('/collections', { name }); }
export async function updateCollection(id, data) { return api.put(`/collections/${id}`, data); }
export async function deleteCollection(id) { return api.delete(`/collections/${id}`); }
export async function getDashboardStats() { return (await api.get('/dashboard/stats')).data.stats; }
export async function getUploadSignature() { return (await api.post('/uploads/signature')).data; }
export async function confirmUpload(payload) { return (await api.post('/uploads/confirm', payload)).data.image; }
export async function deleteUpload(publicId) { return api.delete(`/uploads/${encodeURIComponent(publicId)}`); }
