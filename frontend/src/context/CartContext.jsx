import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('alNisaCart') || '[]'); } catch { return []; } });
  const update = next => { setItems(next); localStorage.setItem('alNisaCart', JSON.stringify(next)); };
  const add = (product, size = '', color = '') => {
    const existingIndex = items.findIndex(item =>
      (item.product._id === product._id || item.product.slug === product.slug) &&
      (item.size || '') === (size || '') &&
      (item.color || '') === (color || '')
    );
    if (existingIndex > -1) {
      const next = [...items];
      next[existingIndex] = { ...next[existingIndex], qty: (next[existingIndex].qty || 1) + 1 };
      update(next);
    } else {
      update([...items, { product, size, color, qty: 1 }]);
    }
  };
  const remove = index => update(items.filter((_, i) => i !== index));
  const updateQty = (index, qty) => {
    if (qty <= 0) return remove(index);
    const next = [...items];
    next[index] = { ...next[index], qty };
    update(next);
  };
  const clearCart = () => update([]);
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const value = useMemo(() => ({ items, add, remove, updateQty, clearCart, count }), [items, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
