import { useState } from "react";
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
  textSub: '#a3a3a3',
  inputBg: '#1a1a1a',
  inputBorder: '#2e2e2e',
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
    width: 'min(420px, 100%)',
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    padding: '2.25rem 1.75rem',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
    position: 'relative', zIndex: 1,
    textAlign: 'center',
  },

  // Animated envelope icon
  iconOuter: {
    width: 72, height: 72, borderRadius: 20,
    background: 'linear-gradient(135deg, #1e1428, #1a1630)',
    border: '1px solid rgba(168,85,247,0.25)',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    marginBottom: '1.5rem',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(168,85,247,0.2)',
  },
  iconInner: { fontSize: 30, color: C.accent },
  pulseDot: {
    position: 'absolute', top: 10, right: 10,
    width: 12, height: 12, borderRadius: '50%',
    background: C.success,
    border: `2px solid ${C.card}`,
    animation: 'pulse 2s infinite',
  },

  heading: { fontSize: 21, fontWeight: 700, color: C.text, marginBottom: 8 },
  sub: { fontSize: 14, color: C.textMuted, lineHeight: 1.65, marginBottom: '2rem' },
  emailHighlight: { color: C.accent, fontWeight: 600 },

  // Steps
  stepsWrap: {
    background: C.inputBg,
    border: `1px solid ${C.inputBorder}`,
    borderRadius: 12,
    padding: '1.25rem',
    marginBottom: '1.75rem',
    textAlign: 'left',
  },
  stepsTitle: { fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.textMuted, marginBottom: '0.875rem' },
  stepItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' },
  stepNum: {
    width: 24, height: 24, borderRadius: '50%',
    background: C.accentSoft,
    border: '1px solid rgba(168,85,247,0.3)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 11, fontWeight: 700, color: C.accent, flexShrink: 0,
  },
  stepText: { fontSize: 13, color: C.textSub },

  // Resend
  resendRow: { marginBottom: '1.5rem' },
  resendNote: { fontSize: 12, color: C.textMuted, marginBottom: '0.625rem' },
  resendBtn: (sent) => ({
    background: 'none',
    border: `1px solid ${sent ? C.inputBorder : C.accent}`,
    borderRadius: 8, padding: '8px 18px',
    color: sent ? C.textMuted : C.accent,
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
    cursor: sent ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s',
  }),
  sentBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: C.success, marginTop: '0.5rem',
  },

  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' },
  divLine: { flex: 1, height: 1, background: C.border },
  divTxt: { fontSize: 11, color: C.textMuted },

  loginBtn: {
    display: 'block', width: '100%', padding: '12px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: '#fff', border: 'none', borderRadius: 10,
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    cursor: 'pointer', textDecoration: 'none',
    boxShadow: '0 4px 20px rgba(168,85,247,0.4)',
    marginBottom: '1rem',
  },
  backLink: {
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    fontSize: 13, color: C.textMuted, textDecoration: 'none',
  },
  backAccent: { color: C.accent, fontWeight: 600 },
};

const STEPS = [
  'Open your email inbox',
  'Find the email from Arc',
  'Click the verification link inside',
  'You\'re in — come back and sign in!',
];

const VerificationPending = () => {
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);

  const handleResend = () => {
    if (resent) return;
    setResending(true);
    setTimeout(() => {
      setResending(false);
      setResent(true);
    }, 1500);
  };

  return (
    <>
      <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.3)} }`}</style>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div style={s.body}>
        <div style={s.glow1} /><div style={s.glow2} />

        <div style={s.card}>

          {/* Icon */}
          <div style={s.iconOuter}>
            <i className="ti ti-mail" style={s.iconInner} />
            <div style={s.pulseDot} />
          </div>

          {/* Heading */}
          <p style={s.heading}>Check your inbox</p>
          <p style={s.sub}>
            Registration successful! 🎉<br />
            We sent a verification link to your email.<br />
            <span style={s.emailHighlight}>Verify your email</span> before signing in.
          </p>

          {/* Steps */}
          <div style={s.stepsWrap}>
            <div style={s.stepsTitle}>What to do next</div>
            {STEPS.map((step, i) => (
              <div key={i} style={{ ...s.stepItem, marginBottom: i < STEPS.length - 1 ? '0.75rem' : 0 }}>
                <div style={s.stepNum}>{i + 1}</div>
                <span style={s.stepText}>{step}</span>
              </div>
            ))}
          </div>

          {/* Resend */}
          <div style={s.resendRow}>
            <p style={s.resendNote}>Didn't receive it? Check your spam folder or</p>
            <button style={s.resendBtn(resent || resending)} onClick={handleResend} disabled={resent || resending}>
              {resending ? 'Sending...' : resent ? 'Email sent!' : 'Resend verification email'}
            </button>
            {resent && (
              <div style={s.sentBadge}>
                <i className="ti ti-circle-check" style={{ fontSize: 14 }} />
                Sent! Check your inbox again.
              </div>
            )}
          </div>

          <div style={s.dividerRow}>
            <div style={s.divLine} />
            <span style={s.divTxt}>already verified?</span>
            <div style={s.divLine} />
          </div>

          <Link to="/login" style={s.loginBtn}>Go to sign in</Link>

          <Link to="/register" style={s.backLink}>
            <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
            Back to <span style={s.backAccent}>&nbsp;register</span>
          </Link>

        </div>
      </div>
    </>
  );
};

export default VerificationPending;
