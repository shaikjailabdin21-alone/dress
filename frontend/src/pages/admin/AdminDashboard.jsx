import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProducts } from '../../context/ProductContext.jsx';
import * as productService from '../../services/productService.js';
import { uploadProductImages } from '../../services/cloudinaryUpload.js';
import { blankProduct } from './AddProduct.jsx';
import { announceProductUpdate } from '../../hooks/useProductSync.js';
import AddProduct from './AddProduct.jsx';
import EditProduct from './EditProduct.jsx';
import ManageProducts from './ManageProducts.jsx';
import ManageCategories from './ManageCategories.jsx';

function messageOf(error) { return error.response?.data?.message || error.message || 'Could not complete this request.'; }
export default function AdminDashboard() {
  const { admin, logout } = useAuth(); const navigate = useNavigate();
  const { refreshCategories } = useProducts();
  const [products, setProducts] = useState([]); const [categories, setCategories] = useState([]); const [stats, setStats] = useState({});
  const [form, setForm] = useState(blankProduct); const [files, setFiles] = useState([]); const [editing, setEditing] = useState(''); const [busy, setBusy] = useState(false); const [progress, setProgress] = useState(''); const [notice, setNotice] = useState(''); const [error, setError] = useState(''); const [imageProgress, setImageProgress] = useState([]);

  const refresh = async () => {
    const [p, c, s] = await Promise.all([
      productService.getAdminProducts(),
      productService.getCategories(true),
      productService.getDashboardStats(),
    ]);
    setProducts(p);
    setCategories(c);
    setStats(s);
    await refreshCategories();
  };

  useEffect(() => { refresh().catch(err => setError(messageOf(err))); }, []);

  const patch = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const edit = p => {
    setEditing(p._id);
    setFiles([]);
    setForm({
      ...blankProduct,
      ...p,
      category: p.category?._id || p.category || '',
      colors: (p.colors || []).join(', '),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reset = () => { setEditing(''); setFiles([]); setForm(blankProduct); };

  const save = async event => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setNotice('');
    let uploadedImages = [];
    try {
      if (files.length + form.images.length === 0) throw new Error('Add at least one product image.');
      setImageProgress(files.map(file => `${file.name}: waiting`));
      const images = await uploadProductImages(files, form.images, (index, status) => {
        setProgress(status);
        setImageProgress(current => current.map((value, i) => i === index ? `${files[index].name}: ${status}` : value));
      });
      uploadedImages = images.slice(form.images.length);

      const body = {
        ...form,
        images,
        price: Number(form.price || 0),
        compareAtPrice: form.compareAtPrice === '' || form.compareAtPrice == null ? null : Number(form.compareAtPrice),
        stock: Number(form.stock || 0),
        sizes: Array.isArray(form.sizes) ? form.sizes : String(form.sizes || '').split(',').map(v => v.trim()).filter(Boolean),
        colors: Array.isArray(form.colors) ? form.colors : String(form.colors || '').split(',').map(v => v.trim()).filter(Boolean),
        description: form.description || '',
        collection: form.collection || null,
        collections: form.collections || [],
      };
      delete body._id;
      delete body.createdAt;
      delete body.updatedAt;
      delete body.__v;

      const response = await productService.saveProduct(editing, body);
      uploadedImages = [];
      announceProductUpdate();
      setNotice(response.data.imageCleanupFailures?.length ? 'Product saved, but some removed Cloudinary images could not be deleted.' : editing ? 'Product updated.' : 'Product added to the catalogue.');
      reset();
      await refresh();
    } catch (err) {
      uploadedImages = uploadedImages.length ? uploadedImages : err.uploadedImages || [];
      setError(messageOf(err));
      await Promise.allSettled(uploadedImages.map(image => productService.deleteUpload(image.publicId)));
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  const remove = async product => {
    if (!window.confirm(`Delete “${product.name}” and its Cloudinary images?`)) return;
    try {
      const { data } = await productService.deleteProduct(product._id);
      announceProductUpdate();
      await refresh();
      setNotice(data.imageCleanupFailures?.length ? data.message : 'Product deleted.');
    } catch (err) {
      setError(messageOf(err));
    }
  };

  const toggle = async product => {
    try {
      await productService.setProductActive(product._id, !product.isActive);
      announceProductUpdate();
      await refresh();
    } catch (err) {
      setError(messageOf(err));
    }
  };

  const reportTaxonomyError = err => setError(messageOf(err));
  const Editor = editing ? EditProduct : AddProduct;

  return <main className="admin-layout">
    <aside className="admin-sidebar">
      <Link className="brand" to="/"><img src="/images/al-nisa-collections-logo.png" alt=""/><span>AL NISA<small>ADMIN</small></span></Link>
      <nav>
        <a href="#overview">Dashboard overview</a>
        <a href="#product-editor">Manage products</a>
        <a href="#taxonomy">Categories</a>
      </nav>
      <div className="admin-user">
        <b>{admin?.name}</b>
        <small>{admin?.email}</small>
        <button onClick={() => { logout(); navigate('/admin/login'); }}>Log out</button>
        <Link to="/">View store ↗</Link>
      </div>
    </aside>

    <div className="admin-content">
      <header className="admin-heading">
        <div><span className="eyebrow">STORE MANAGEMENT</span><h1>Dashboard</h1></div>
      </header>
      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      <section id="overview" className="stat-grid">
        {[['TOTAL PRODUCTS', stats.totalProducts], ['ACTIVE PRODUCTS', stats.activeProducts], ['CATEGORIES', stats.totalCategories]].map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span>{label}</span>
            <b>{value ?? '—'}</b>
          </div>
        ))}
      </section>

      <Editor form={form} patch={patch} files={files} setFiles={setFiles} categories={categories} onSave={save} onCancel={reset} busy={busy} progress={progress} imageProgress={imageProgress}/>
      <ManageProducts products={products} onEdit={edit} onToggle={toggle} onDelete={remove}/>

      <section id="taxonomy" className="admin-panel">
        <div style={{ marginBottom: '20px' }}><span className="eyebrow">ORGANIZE THE STORE</span><h2>Categories</h2></div>
        <ManageCategories categories={categories} items={categories} create={productService.createCategory} update={productService.updateCategory} remove={productService.deleteCategory} onChanged={refresh} onError={reportTaxonomyError}/>
      </section>
    </div>
  </main>;
}
