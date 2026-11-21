import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as productService from '../services/productService.js';

const ProductContext = createContext(null);
export function ProductProvider({ children }) {
  const [categories, setCategories] = useState(null);
  const loadCategories = useCallback(async (force = false) => {
    if (categories && !force) return categories;
    const result = await productService.getCategories(); setCategories(result); return result;
  }, [categories]);
  const value = useMemo(() => ({
    getProducts: productService.getProducts,
    getProduct: productService.getProduct,
    getCategories: loadCategories,
    getCollections: productService.getCollections,
    refreshCategories: () => loadCategories(true),
  }), [loadCategories]);
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
export const useProducts = () => useContext(ProductContext);
