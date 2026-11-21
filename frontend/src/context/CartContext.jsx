import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => { try { return JSON.parse(localStorage.getItem('alNisaCart') || '[]'); } catch { return []; } });
  const update = next => { setItems(next); localStorage.setItem('alNisaCart', JSON.stringify(next)); };
  const add = (product, size = '', color = '') => update([...items, { product, size, color, qty: 1 }]);
  const remove = index => update(items.filter((_, i) => i !== index));
  const count = items.reduce((sum, item) => sum + item.qty, 0);
  const value = useMemo(() => ({ items, add, remove, count }), [items, count]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
