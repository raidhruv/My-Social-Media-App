import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

const C = {
  bg: '#0d0d0d',
  card: '#161616',
  border: '#262626',
  accent: '#a855f7',
  accentGlow: 'rgba(168,85,247,0.15)',
  text: '#f5f5f5',
  textMuted: '#737373',
  inputBg: '#1a1a1a',
  inputBorder: '#2e2e2e',
  error: '#f87171',
  success: '#4ade80',
};

const s = {
  body: {
    minHeight: '100vh',
    background: C.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden',
  },
  glow1: {
    position: 'fixed', width: 500, height: 500,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
    top: -150, left: -150, pointerEvents: 'none',
  },
  glow2: {
    position: 'fixed', width: 400, height: 400,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(236,72,153,0.07) 0%, transparent 70%)',
    bottom: -100, right: -100, pointerEvents: 'none',
  },
  card: {
    width: 'min(400px, 100%)',
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    padding: '2rem 1.75rem',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    position: 'relative', zIndex: 1,
  },
  header: { textAlign: 'center', marginBottom: '2rem' },
  logoWrap: {
    width: 44, height: 44, borderRadius: 12,
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 20, color: '#fff', marginBottom: '0.875rem',
    boxShadow: '0 6px 20px rgba(168,85,247,0.4)',
  },
  heading: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 },
  sub: { fontSize: 13, color: C.textMuted },
  field: { marginBottom: '0.875rem' },
  label: {
    display: 'block', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: 5,
  },
  inputWrap: { position: 'relative' },
  input: (focused) => ({
    width: '100%',
    padding: '11px 36px 11px 36px',
    fontFamily: 'inherit', fontSize: 14,
    color: C.text, background: C.inputBg,
    border: `1px solid ${focused ? C.accent : C.inputBorder}`,
    borderRadius: 10, outline: 'none', boxSizing: 'border-box',
    boxShadow: focused ? `0 0 0 3px ${C.accentGlow}` : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }),
  icoL: {
    position: 'absolute', left: 11, top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 15, color: '#404040', pointerEvents: 'none',
  },
  icoR: {
    position: 'absolute', right: 11, top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14, color: C.textMuted, cursor: 'pointer',
  },
  forgotRow: { display: 'flex', justifyContent: 'flex-end', marginTop: 6, marginBottom: '1.25rem' },
  forgotLink: { fontSize: 12, color: C.accent, textDecoration: 'none', fontWeight: 500 },
  btn: (loading) => ({
    width: '100%', padding: '12px',
    background: loading ? '#2a1f3d' : 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: loading ? C.textMuted : '#fff',
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    border: 'none', borderRadius: 10,
    cursor: loading ? 'not-allowed' : 'pointer',
    boxShadow: loading ? 'none' : '0 4px 20px rgba(168,85,247,0.4)',
    transition: 'opacity 0.2s',
    marginBottom: '1.5rem',
    letterSpacing: '0.01em',
  }),
  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' },
  divLine: { flex: 1, height: 1, background: C.border },
  divTxt: { fontSize: 11, color: C.textMuted },
  footer: { textAlign: 'center', fontSize: 13, color: C.textMuted },
  footerLink: { color: C.accent, fontWeight: 600, textDecoration: 'none' },
  successBox: {
    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
    borderRadius: 10, padding: '10px 14px', fontSize: 12,
    color: C.success, marginBottom: '1rem',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  errorBox: {
    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: 10, padding: '10px 14px', fontSize: 12,
    color: C.error, marginBottom: '1rem',
    display: 'flex', alignItems: 'center', gap: 8,
  },
};

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focused, setFocused] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post('/auth/login', formData);
      console.log(response.data);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem("refreshToken",response.data.refreshToken);
      setMessage('Login successful! Redirecting...');
      setIsError(false);
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed. Please try again.');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      <div style={s.body}>
        <div style={s.glow1} /><div style={s.glow2} />
        <div style={s.card}>
          {/* Header */}
          <div style={s.header}>
            <div style={s.logoWrap}><i className="ti ti-sparkles" /></div>
            <p style={s.heading}>Welcome back</p>
            <p style={s.sub}>Sign in to continue to your account</p>
          </div>
          {/* Status banner */}
          {message && (
            <div style={isError ? s.errorBox : s.successBox}>
              <i className={`ti ${isError ? 'ti-circle-x' : 'ti-circle-check'}`} style={{ fontSize: 15 }} />
              {message}
            </div>
          )}
          {/* Email */}
          <div style={s.field}>
            <label style={s.label}>Email</label>
            <div style={s.inputWrap}>
              <i className="ti ti-mail" style={s.icoL} />
              <input
                style={s.input(focused === 'email')}
                type="email" name="email" placeholder="you@example.com"
                value={formData.email} onChange={handleChange} required
                onFocus={() => setFocused('email')} onBlur={() => setFocused(null)}
              />
            </div>
          </div>
          {/* Password */}
          <div style={s.field}>
            <label style={s.label}>Password</label>
            <div style={s.inputWrap}>
              <i className="ti ti-lock" style={s.icoL} />
              <input
                style={s.input(focused === 'password')}
                type={showPw ? 'text' : 'password'} name="password" placeholder="••••••••"
                value={formData.password} onChange={handleChange} required
                onFocus={() => setFocused('password')} onBlur={() => setFocused(null)}
              />
              <i
                className={`ti ${showPw ? 'ti-eye-off' : 'ti-eye'}`}
                style={s.icoR}
                onClick={() => setShowPw(!showPw)}
              />
            </div>
          </div>
          {/* Forgot password */}
          <div style={s.forgotRow}>
            <Link to="/forgot-password"> Forgot Password?</Link>
          </div>
          {/* Submit */}
          <button style={s.btn(loading)} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div style={s.dividerRow}>
            <div style={s.divLine} />
            <span style={s.divTxt}>new here?</span>
            <div style={s.divLine} />
          </div>
          <p style={s.footer}>
            <Link to="/register" style={s.footerLink}>Create an account</Link>
          </p>
        </div>
      </div>
    </>
  );
}
export default Login;