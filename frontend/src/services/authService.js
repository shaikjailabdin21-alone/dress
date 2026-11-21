import api from './api.js';

export async function loginAdmin(email, password) {
  return (await api.post('/auth/admin/login', { email, password })).data;
}
export async function getCurrentAdmin() {
  return (await api.get('/auth/admin/me')).data.admin;
}
