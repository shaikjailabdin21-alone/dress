import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { generateAdminToken } from '../utils/generateToken.js';
import { isEmail } from '../utils/validators.js';

export async function adminLogin(req, res) {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!isEmail(email) || email.length > 254 || !password || password.length > 200) return res.status(400).json({ message: 'Enter a valid email and password.' });
  const admin = await Admin.findOne({ email, isActive: true }).select('+passwordHash');
  if (!admin || !await bcrypt.compare(password, admin.passwordHash)) return res.status(401).json({ message: 'Email or password is incorrect.' });
  const token = generateAdminToken(admin);
  res.json({ token, admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } });
}
export function adminMe(req, res) { res.json({ admin: { id: req.admin.id, name: req.admin.name, email: req.admin.email, role: req.admin.role } }); }
