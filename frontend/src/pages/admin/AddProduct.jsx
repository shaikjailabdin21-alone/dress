import { useEffect, useRef, useState } from 'react';

export const blankProduct = { name: '', description: '', price: 0, compareAtPrice: '', category: '', collection: '', sizes: '', colors: '', stock: 0, isActive: true, isNewArrival: true, isFeatured: false, images: [] };
function Field({ label, children, wide = false }) { return <label className={wide ? 'admin-field wide' : 'admin-field'}>{label}{children}</label>; }
function CategoryPicker({ categories, value, onChange }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const activeCategories = categories.filter(category => category.isActive && category.slug !== 'unclassified');
  const selected = activeCategories.find(category => category._id === value);
  const visible = activeCategories.filter(category => category.name.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="category-picker">
    <input role="combobox" aria-label="Choose a category" aria-expanded={open} aria-controls="admin-category-options" required value={open ? query : (selected?.name || '')} placeholder="Search or choose a category" onFocus={() => { setQuery(''); setOpen(true); }} onBlur={() => setOpen(false)} onChange={event => { setQuery(event.target.value); setOpen(true); onChange(''); }}/>
    {open && <div className="category-options" id="admin-category-options" role="listbox">{visible.length ? visible.map(category => <button type="button" role="option" aria-selected={category._id === value} key={category._id} onMouseDown={event => event.preventDefault()} onClick={() => { onChange(category._id); setQuery(''); setOpen(false); }}>{category.name}</button>) : <span>No matching categories</span>}</div>}
    {!open && selected && <span className="category-selected">Selected: {selected.name}</span>}
  </div>;
}
export function ProductEditor({ form, patch, files, setFiles, categories, onSave, onCancel, busy, progress, imageProgress, editing = false }) {
  const [previews, setPreviews] = useState([]);
  const cameraInput = useRef(null);
  useEffect(() => { const urls = files.map(file => URL.createObjectURL(file)); setPreviews(urls); return () => urls.forEach(URL.revokeObjectURL); }, [files]);
  return <section id="product-editor" className="admin-panel"><div className="panel-heading"><div><span className="eyebrow">CATALOGUE</span><h2>{editing ? 'Edit product' : 'Add a product'}</h2></div></div><form onSubmit={onSave} className="admin-form">
    <Field label="Product name"><input required maxLength="160" value={form.name} onChange={e => patch('name', e.target.value)} placeholder="e.g. Embroidered Khimar"/></Field><Field label="Category"><CategoryPicker categories={categories} value={form.category?._id || form.category} onChange={value => patch('category', value)}/></Field>
    <Field label="Colours (comma separated)"><input value={form.colors} onChange={e => patch('colors', e.target.value)} placeholder="Olive, Sand"/></Field>
    <Field label="Product photos · up to 10" wide><input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={e => { setFiles(Array.from(e.target.files || []).slice(0, Math.max(0, 10 - form.images.length))); e.target.value = ''; }}/><button type="button" className="camera-upload" onClick={() => cameraInput.current?.click()}>Take a photo</button><input ref={cameraInput} type="file" accept="image/*" capture="environment" hidden onChange={e => { const photo = e.target.files?.[0]; if (!photo) return; setFiles(current => [...current, photo].slice(0, Math.max(0, 10 - form.images.length))); e.target.value = ''; }}/><small>Images are resized to at most 2000px and converted to WebP before upload. On supported phones, “Take a photo” opens the rear camera.</small><div className="admin-photo-list">{form.images.map((img, i) => <button type="button" key={img.publicId} onClick={() => patch('images', form.images.filter((_, n) => n !== i))}><img src={img.url} alt={`Remove image ${i + 1}`}/>×</button>)}{previews.map((url, i) => <figure key={url}><img src={url} alt={`Preview ${files[i]?.name || 'product photo'}`}/><figcaption>{imageProgress[i] || files[i]?.name}</figcaption></figure>)}</div></Field>
    <div className="checkbox-row wide"><label><input type="checkbox" checked={form.isActive} onChange={e => patch('isActive', e.target.checked)}/> Active</label><label><input type="checkbox" checked={form.isNewArrival} onChange={e => patch('isNewArrival', e.target.checked)}/> New arrival</label><label><input type="checkbox" checked={form.isFeatured} onChange={e => patch('isFeatured', e.target.checked)}/> Featured</label></div>
    <div className="form-actions wide">{progress && <span>{progress}</span>}<button disabled={busy} className="button">{busy ? 'SAVING…' : editing ? 'UPDATE PRODUCT' : 'SAVE PRODUCT'}</button>{editing && <button type="button" className="button-secondary" onClick={onCancel}>Cancel edit</button>}</div>
  </form></section>;
}
export default function AddProduct(props) { return <ProductEditor {...props}/>; }
