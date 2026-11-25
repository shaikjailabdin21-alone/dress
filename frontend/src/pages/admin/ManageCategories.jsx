import { useState, useMemo } from 'react';
import { announceProductUpdate } from '../../hooks/useProductSync.js';
import { isHiddenCategory } from '../../utils/hiddenCategories.js';

export default function ManageCategories({
  categories = [],
  items = [],
  create,
  update,
  remove,
  onChanged,
  onError,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [busy, setBusy] = useState(false);

  const allCategories = useMemo(() => {
    const list = categories.length ? categories : items;
    return list.filter(category => !isHiddenCategory(category)).sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [categories, items]);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return allCategories;
    return allCategories.filter(cat =>
      (cat.name || '').toLowerCase().includes(q) ||
      (cat.slug || '').toLowerCase().includes(q) ||
      (cat.description || '').toLowerCase().includes(q)
    );
  }, [allCategories, searchQuery]);

  const refresh = async () => {
    if (onChanged) await onChanged();
    announceProductUpdate();
  };

  const handleCreate = async e => {
    e.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      if (create) {
        await create(trimmed);
      }
      setNewCategoryName('');
      setNewCategoryDesc('');
      setIsAdding(false);
      await refresh();
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setBusy(false);
    }
  };

  const startEdit = cat => {
    setEditingId(cat._id);
    setEditName(cat.name || '');
    setEditDesc(cat.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
    setEditDesc('');
  };

  const handleSaveEdit = async id => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setBusy(true);
    try {
      if (update) {
        await update(id, { name: trimmed, description: editDesc });
      }
      setEditingId(null);
      await refresh();
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async cat => {
    setBusy(true);
    try {
      if (update) {
        await update(cat._id, { isActive: !cat.isActive });
      }
      await refresh();
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async cat => {
    if (!window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) return;
    setBusy(true);
    try {
      if (remove) {
        await remove(cat._id);
      }
      await refresh();
    } catch (err) {
      if (onError) onError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="category-management-wrap">
      {/* Top Controls: Search Bar & Add Category Button */}
      <div className="category-header-controls">
        <div className="category-search-wrapper">
          <svg
            className="category-search-icon"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="category-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            aria-label="Search categories"
          />
          {searchQuery && (
            <button
              type="button"
              className="category-search-clear"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button
          type="button"
          className="button add-category-btn"
          onClick={() => setIsAdding(prev => !prev)}
        >
          {isAdding ? '✕ CLOSE' : '+ ADD CATEGORY'}
        </button>
      </div>

      {/* Add Category Form (Expandable) */}
      {isAdding && (
        <form className="category-add-form" onSubmit={handleCreate}>
          <h4>Add New Category</h4>
          <div className="category-add-form-fields">
            <input
              type="text"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
              placeholder="Category name (e.g. Abaya, Burkha)"
              autoFocus
              required
              disabled={busy}
            />
            <div className="category-add-form-actions">
              <button type="submit" className="button" disabled={busy || !newCategoryName.trim()}>
                {busy ? 'SAVING...' : 'SAVE CATEGORY'}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => {
                  setIsAdding(false);
                  setNewCategoryName('');
                }}
                disabled={busy}
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Category count indicator */}
      <div className="category-count-bar">
        <span>
          Showing <b>{filteredCategories.length}</b> of <b>{allCategories.length}</b> categories
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
      </div>

      {/* Responsive 3-Column Grid */}
      {filteredCategories.length > 0 ? (
        <div className="category-admin-grid">
          {filteredCategories.map(cat => {
            const isEditing = editingId === cat._id;
            return (
              <div
                className={`category-admin-card ${!cat.isActive ? 'category-card-inactive' : ''}`}
                key={cat._id}
              >
                <div className="category-card-header">
                  <div className="category-card-identity">
                    {isEditing ? (
                      <input
                        type="text"
                        className="category-inline-input"
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        placeholder="Category name"
                        autoFocus
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleSaveEdit(cat._id);
                          if (e.key === 'Escape') cancelEdit();
                        }}
                      />
                    ) : (
                      <h3 className="category-card-name">{cat.name}</h3>
                    )}
                    {cat.slug && !isEditing && (
                      <span className="category-card-slug">/{cat.slug}</span>
                    )}
                  </div>
                  <span
                    className={`category-status-pill ${
                      cat.isActive ? 'status-active' : 'status-hidden'
                    }`}
                  >
                    {cat.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>

                {/* Actions */}
                <div className="category-card-actions">
                  {isEditing ? (
                    <>
                      <button
                        type="button"
                        className="cat-action-btn cat-save-btn"
                        onClick={() => handleSaveEdit(cat._id)}
                        disabled={busy || !editName.trim()}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="cat-action-btn cat-cancel-btn"
                        onClick={cancelEdit}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="cat-action-btn cat-edit-btn"
                        onClick={() => startEdit(cat)}
                        disabled={busy}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`cat-action-btn cat-toggle-btn ${
                          cat.isActive ? 'btn-hide' : 'btn-unhide'
                        }`}
                        onClick={() => handleToggle(cat)}
                        disabled={busy}
                      >
                        {cat.isActive ? 'Hide' : 'Unhide'}
                      </button>
                      <button
                        type="button"
                        className="cat-action-btn cat-delete-btn"
                        onClick={() => handleDelete(cat)}
                        disabled={busy}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="categories-empty-state">
          <p>No categories found{searchQuery ? ` matching "${searchQuery}"` : ''}.</p>
          {searchQuery && (
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
}
