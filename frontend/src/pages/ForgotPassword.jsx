import { useState } from "react";
import api from "../services/api"
import { Link } from "react-router-dom";

const C = {
  bg: '#0d0d0d',
  card: '#161616',
  border: '#262626',
  accent: '#a855f7',
  accentGlow: 'rgba(168,85,247,0.15)',
  accentSoft: '#1e1428',
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
    position: 'fixed', width: 500, height: 500, borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)',
    top: -150, left: -150, pointerEvents: 'none',
  },
  glow2: {
    position: 'fixed', width: 400, height: 400, borderRadius: '50%',
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
  iconWrap: {
    width: 52, height: 52, borderRadius: 14,
    background: C.accentSoft,
    border: `1px solid rgba(168,85,247,0.2)`,
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: C.accent,
    marginBottom: '1rem',
  },
  heading: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 },
  sub: { fontSize: 13, color: C.textMuted, lineHeight: 1.6 },
  label: {
    display: 'block', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: 5,
  },
  inputWrap: { position: 'relative', marginBottom: '1.25rem' },
  input: (focused) => ({
    width: '100%',
    padding: '11px 12px 11px 36px',
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
  successBox: {
    background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)',
    borderRadius: 10, padding: '10px 14px', fontSize: 12,
    color: C.success, marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  errorBox: {
    background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
    borderRadius: 10, padding: '10px 14px', fontSize: 12,
    color: C.error, marginBottom: '1.25rem',
    display: 'flex', alignItems: 'center', gap: 8,
  },
  backLink: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontSize: 13, color: C.textMuted, textDecoration: 'none',
  },
  backAccent: { color: C.accent, fontWeight: 600 },
};

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post(
        '/auth/forgot-password',
        { email }
      );
      setMessage(response.data.message);
      setIsError(false);
      setSent(true);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Request failed. Please try again.');
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
            <div style={s.iconWrap}>
              <i className="ti ti-lock-open" />
            </div>
            <p style={s.heading}>Forgot password?</p>
            <p style={s.sub}>
              {sent
                ? "We've sent a reset link to your email. Check your inbox."
                : "No worries — enter your email and we'll send you a reset link."}
            </p>
          </div>

          {/* Status banner */}
          {message && (
            <div style={isError ? s.errorBox : s.successBox}>
              <i className={`ti ${isError ? 'ti-circle-x' : 'ti-circle-check'}`} style={{ fontSize: 15 }} />
              {message}
            </div>
          )}

          {!sent && (
            <>
              <label style={s.label}>Email address</label>
              <div style={s.inputWrap}>
                <i className="ti ti-mail" style={s.icoL} />
                <input
                  style={s.input(focused)}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  required
                />
              </div>

              <button style={s.btn(loading)} onClick={handleSubmit} disabled={loading}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </>
          )}

          {sent && (
            <button
              style={{ ...s.btn(false), marginBottom: '1.5rem' }}
              onClick={() => { setSent(false); setEmail(''); setMessage(''); }}
            >
              Send to a different email
            </button>
          )}

          <Link to="/login" style={s.backLink}>
            <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
            Back to <span style={s.backAccent}>&nbsp;sign in</span>
          </Link>

        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
