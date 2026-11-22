import { useState } from 'react';
import { announceProductUpdate } from '../../hooks/useProductSync.js';

export default function TaxonomyManager({ title, noun, items, create, update, remove, onChanged, onError }) {
  const [name, setName] = useState('');
  const refresh = async () => { await onChanged(); announceProductUpdate(); };
  const add = async event => { event.preventDefault(); if (!name.trim()) return; try { await create(name.trim()); setName(''); await refresh(); } catch (error) { onError(error); } };
  const edit = async item => { const nextName = window.prompt(`${noun} name`, item.name); if (nextName === null || !nextName.trim()) return; const description = window.prompt('Description', item.description || ''); if (description === null) return; try { await update(item._id, { name: nextName.trim(), description }); await refresh(); } catch (error) { onError(error); } };
  const toggle = async item => { try { await update(item._id, { isActive: !item.isActive }); await refresh(); } catch (error) { onError(error); } };
  const del = async item => { try { await remove(item._id); await refresh(); } catch (error) { onError(error); } };
  return <div className="taxonomy-group"><h3>{title}</h3><form onSubmit={add}><input value={name} onChange={e => setName(e.target.value)} placeholder={`New ${noun.toLowerCase()} name`}/><button className="button">ADD</button></form>{items.map(item => <div className="taxonomy-row" key={item._id}><span>{item.name} {!item.isActive && '· Hidden'}</span><div><button type="button" onClick={() => edit(item)}>Edit</button><button type="button" onClick={() => toggle(item)}>{item.isActive ? 'Hide' : 'Activate'}</button><button type="button" onClick={() => del(item)}>Delete</button></div></div>)}</div>;
}
