# AL NISA COLLECTIONS

React/Vite storefront and Express/Mongoose API. Product images are uploaded directly to Cloudinary with short lived server signatures. MongoDB Atlas is the only application database.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set the Atlas URI, a random JWT secret of at least 32 characters, admin name/email/password, and Cloudinary credentials. Set `FRONTEND_ORIGINS` to the exact comma-separated browser origins allowed to access the API, including scheme and port (for example `http://10.168.60.15:5173`).
2. Install packages with `npm install --prefix backend` and `npm install --prefix frontend`.
3. Create or update the initial administrator with `npm run seed:admin --prefix backend`.
4. Start `npm run dev --prefix backend` and `npm run dev --prefix frontend` in separate terminals. Open `http://localhost:5173`; the admin login is at `/admin/login`.
5. Create categories and collections in the admin dashboard, then add products.

The API connects to the `al_nisa_collections` database. Product uploads and catalogue editing require MongoDB Atlas and Cloudinary credentials. No product fixtures are generated. The API allows only the exact origins listed in `FRONTEND_ORIGINS`; it accepts credentialed requests and browser preflights.

For LAN access, set `frontend/.env`'s `VITE_API_URL` to `http://<backend-LAN-IP>:4000/api` and include the browser URL (such as `http://<frontend-LAN-IP>:5173`) in `FRONTEND_ORIGINS`. The Vite dev server and API bind on all interfaces. LAN addresses can change when the machine reconnects or DHCP leases expire; check the current address with `ip -4 addr` and update both env files, then restart both servers. For local-only use, use `http://localhost:5173` in `FRONTEND_ORIGINS` and `http://localhost:4000/api` for `VITE_API_URL`.
