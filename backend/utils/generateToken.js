import jwt from 'jsonwebtoken';

export function generateAdminToken(admin) {
  return jwt.sign({ sub: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d', issuer: 'al-nisa-collections' });
}
