import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentAdmin, loginAdmin } from '../services/authService.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [ready, setReady] = useState(false);
  const refresh = useCallback(async () => {
    if (!sessionStorage.getItem('alnisa-admin-token')) { setReady(true); return; }
    try { setAdmin(await getCurrentAdmin()); }
    catch { sessionStorage.removeItem('alnisa-admin-token'); setAdmin(null); }
    finally { setReady(true); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  const login = async (email, password) => {
    const data = await loginAdmin(email, password);
    sessionStorage.setItem('alnisa-admin-token', data.token); setAdmin(data.admin); return data.admin;
  };
  const logout = () => { sessionStorage.removeItem('alnisa-admin-token'); setAdmin(null); };
  const value = useMemo(() => ({ admin, ready, login, logout }), [admin, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
