import { useState } from "react";
import api from "../services/api"
import { useParams, useNavigate, Link } from "react-router-dom";

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
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'Inter', sans-serif",
    padding: '2rem 1rem',
    position: 'relative', overflow: 'hidden',
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
    border: '1px solid rgba(168,85,247,0.2)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, color: C.accent, marginBottom: '1rem',
  },
  heading: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 6 },
  sub: { fontSize: 13, color: C.textMuted, lineHeight: 1.6 },
  label: {
    display: 'block', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: 5,
  },
  inputWrap: { position: 'relative', marginBottom: '1rem' },
  input: (focused, err) => ({
    width: '100%',
    padding: '11px 36px 11px 36px',
    fontFamily: 'inherit', fontSize: 14,
    color: C.text, background: C.inputBg,
    border: `1px solid ${err ? C.error : focused ? C.accent : C.inputBorder}`,
    borderRadius: 10, outline: 'none', boxSizing: 'border-box',
    boxShadow: focused && !err ? `0 0 0 3px ${C.accentGlow}` : 'none',
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
  strengthRow: { display: 'flex', gap: 4, marginBottom: 4 },
  seg: (on, color) => ({
    flex: 1, height: 3, borderRadius: 99,
    background: on ? color : '#2e2e2e',
    transition: 'background 0.25s',
  }),
  strengthTxt: (color) => ({ fontSize: 11, color, fontWeight: 500, marginBottom: '1.25rem' }),
  btn: (disabled) => ({
    width: '100%', padding: '12px',
    background: disabled ? '#2a1f3d' : 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: disabled ? C.textMuted : '#fff',
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    border: 'none', borderRadius: 10,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(168,85,247,0.4)',
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

const getStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  let sc = 0;
  if (pw.length >= 8) sc++;
  if (/[A-Z]/.test(pw)) sc++;
  if (/[0-9]/.test(pw)) sc++;
  if (/[^A-Za-z0-9]/.test(pw)) sc++;
  if (sc <= 1) return { level: 1, label: 'Weak', color: '#f87171' };
  if (sc === 2) return { level: 2, label: 'Fair', color: '#fb923c' };
  if (sc === 3) return { level: 3, label: 'Good', color: '#4ade80' };
  return { level: 4, label: 'Strong', color: '#a855f7' };
};

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focused, setFocused] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getStrength(password);
  const pwMatch = confirmPassword && password === confirmPassword;
  const pwMismatch = confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pwMismatch || !password) return;
    setLoading(true);
    setMessage('');
    try {
      const response = await api.post(
        `/auth/reset-password/${token}`,
        { password }
      );
      setMessage(response.data.message);
      setIsError(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Reset failed. Please try again.');
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
            <div style={s.iconWrap}><i className="ti ti-key" /></div>
            <p style={s.heading}>Reset your password</p>
            <p style={s.sub}>Choose a strong new password for your account.</p>
          </div>

          {/* Status */}
          {message && (
            <div style={isError ? s.errorBox : s.successBox}>
              <i className={`ti ${isError ? 'ti-circle-x' : 'ti-circle-check'}`} style={{ fontSize: 15 }} />
              {message}
            </div>
          )}

          {/* New password */}
          <label style={s.label}>New password</label>
          <div style={s.inputWrap}>
            <i className="ti ti-lock" style={s.icoL} />
            <input
              style={s.input(focused === 'pw', false)}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused('pw')}
              onBlur={() => setFocused(null)}
            />
            <i
              className={`ti ${showPw ? 'ti-eye-off' : 'ti-eye'}`}
              style={s.icoR}
              onClick={() => setShowPw(!showPw)}
            />
          </div>

          {/* Strength bar */}
          {password.length > 0 && (
            <>
              <div style={s.strengthRow}>
                {[1,2,3,4].map(i => <div key={i} style={s.seg(i <= strength.level, strength.color)} />)}
              </div>
              <p style={s.strengthTxt(strength.color)}>{strength.label} password</p>
            </>
          )}

          {/* Confirm password */}
          <label style={s.label}>Confirm password</label>
          <div style={s.inputWrap}>
            <i className="ti ti-lock-check" style={s.icoL} />
            <input
              style={s.input(focused === 'cpw', pwMismatch)}
              type={showCpw ? 'text' : 'password'}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused('cpw')}
              onBlur={() => setFocused(null)}
            />
            <i
              className={`ti ${showCpw ? 'ti-eye-off' : 'ti-eye'}`}
              style={s.icoR}
              onClick={() => setShowCpw(!showCpw)}
            />
          </div>
          {pwMatch    && <p style={{ ...s.strengthTxt(C.success), marginTop: -8 }}>✓ Passwords match</p>}
          {pwMismatch && <p style={{ ...s.strengthTxt(C.error),   marginTop: -8 }}>✗ Passwords do not match</p>}

          {/* Submit */}
          <button
            style={{ ...s.btn(loading || !password || pwMismatch), marginTop: '1rem' }}
            onClick={handleSubmit}
            disabled={loading || !password || pwMismatch}
          >
            {loading ? 'Updating...' : 'Update password'}
          </button>

          <Link to="/login" style={s.backLink}>
            <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
            Back to <span style={s.backAccent}>&nbsp;sign in</span>
          </Link>

        </div>
      </div>
    </>
  );
}

export default ResetPassword;
