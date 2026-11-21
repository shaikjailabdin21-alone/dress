import { useEffect, useState } from 'react';

const PRODUCT_UPDATE_KEY = 'al-nisa-products-updated';
const PRODUCT_UPDATE_EVENT = 'al-nisa-products-updated';

export function announceProductUpdate() {
  const updatedAt = String(Date.now());
  try { localStorage.setItem(PRODUCT_UPDATE_KEY, updatedAt); } catch { /* Storage can be unavailable in private browsing. */ }
  window.dispatchEvent(new Event(PRODUCT_UPDATE_EVENT));
}

export function useProductSync() {
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    const onStorage = event => { if (event.key === PRODUCT_UPDATE_KEY) refresh(); };
    const onVisibility = () => { if (document.visibilityState === 'visible') refresh(); };
    const interval = window.setInterval(() => { if (document.visibilityState === 'visible') refresh(); }, 10000);
    window.addEventListener(PRODUCT_UPDATE_EVENT, refresh);
    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener(PRODUCT_UPDATE_EVENT, refresh);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
  return revision;
}
