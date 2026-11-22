import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

function messageOf(error) { return error.response?.data?.message || (error.isApiUnavailable ? error.message : 'Could not complete this request.'); }
export default function AdminLogin() {
  const { admin, ready, login } = useAuth(); const navigate = useNavigate(); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  if (ready && admin) return <Navigate to="/admin" replace/>;
  const submit = async e => { e.preventDefault(); setBusy(true); setError(''); try { await login(e.currentTarget.email.value, e.currentTarget.password.value); navigate('/admin'); } catch (err) { setError(messageOf(err)); } finally { setBusy(false); } };
  return <main className="admin-login-page"><Link className="brand" to="/"><img src="/images/al-nisa-collections-logo.png" alt=""/><span>AL NISA<small>COLLECTIONS</small></span></Link><form className="admin-login-card" onSubmit={submit}><span className="eyebrow">SECURE ADMIN ACCESS</span><h1>Welcome back</h1><p>Sign in to manage the Al Nisa catalogue.</p>{error && <div className="form-error">{error}</div>}<label>Email address<input name="email" type="email" autoComplete="username" required/></label><label>Password<input name="password" type="password" autoComplete="current-password" required/></label><button className="button" disabled={busy}>{busy ? 'SIGNING IN…' : 'SIGN IN'}</button><Link to="/" className="text-link">← Return to store</Link></form></main>;
}
