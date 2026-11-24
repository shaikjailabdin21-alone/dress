import '../config/loadEnv.js';
import bcrypt from 'bcryptjs';
import connectDatabase from '../config/db.js';
import Admin from '../models/Admin.js';
import { isEmail } from '../utils/validators.js';

await connectDatabase();
const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME = 'Store Administrator' } = process.env;
if (!isEmail(ADMIN_EMAIL) || ADMIN_EMAIL.length > 254 || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 12 || Buffer.byteLength(ADMIN_PASSWORD, 'utf8') > 72) {
  throw new Error('Set a valid ADMIN_EMAIL and an ADMIN_PASSWORD of 12–72 UTF-8 bytes before seeding.');
}
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await Admin.findOneAndUpdate({ email: ADMIN_EMAIL.toLowerCase() }, { name: ADMIN_NAME, email: ADMIN_EMAIL.toLowerCase(), passwordHash, role: 'admin', isActive: true }, { upsert: true, new: true, runValidators: true });
console.info(`Administrator ${ADMIN_EMAIL} is ready.`);
process.exit(0);
