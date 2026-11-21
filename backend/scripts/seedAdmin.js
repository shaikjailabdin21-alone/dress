import '../config/loadEnv.js';
import bcrypt from 'bcryptjs';
import connectDatabase from '../config/db.js';
import Admin from '../models/Admin.js';

await connectDatabase();
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Store Administrator' } = process.env;
if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before seeding.');
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase() }, { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'admin', isActive: true }, { upsert: true, new: true, runValidators: true });
console.info(`Administrator ${ADMIN_EMAIL} is ready.`);
process.exit(0);
