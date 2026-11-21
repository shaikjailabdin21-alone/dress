import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function requireAdmin(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Admin authentication required.' });
  let payload;
  try { payload = jwt.verify(token, process.env.JWT_SECRET, { issuer: 'al-nisa-collections' }); }
  catch { return res.status(401).json({ message: 'Session expired. Please sign in again.' }); }
  if (payload.role !== 'admin') return res.status(403).json({ message: 'Admin access required.' });
  try {
    const admin = await Admin.findOne({ _id: payload.sub, isActive: true }).select('_id name email role');
    if (!admin) return res.status(401).json({ message: 'Admin account is inactive or unavailable.' });
    req.admin = admin;
    next();
  } catch (error) { next(error); }
}
