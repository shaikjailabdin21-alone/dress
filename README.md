# AL NISA COLLECTIONS

React/Vite storefront and Express/Mongoose API. Product images are uploaded directly to Cloudinary with short lived server signatures. MongoDB Atlas is the only application database.

## Local setup

1. Copy `backend/.env.example` to `backend/.env` and set the Atlas URI, a random JWT secret of at least 32 characters, admin name/email/password, and Cloudinary credentials. Set `FRONTEND_ORIGINS` to the comma-separated frontend origins allowed to access the API. If you use only one origin, `CLIENT_URL` is supported as a fallback when `FRONTEND_ORIGINS` is unset.
2. Install packages with `npm install --prefix backend` and `npm install --prefix frontend`.
3. Create or update the initial administrator with `npm run seed:admin --prefix backend`.
4. Start `npm run dev --prefix backend` and `npm run dev --prefix frontend` in separate terminals. Open `http://localhost:5173`; the admin login is at `/admin/login`.
5. Create categories and collections in the admin dashboard, then add products.

The API connects to the `al_nisa_collections` database. Product uploads and catalogue editing require MongoDB Atlas and Cloudinary credentials. No product fixtures are generated. For a separately hosted frontend, set `VITE_API_URL` at build time to the backend `/api` base URL; local Vite development proxies `/api` to port 4000.
