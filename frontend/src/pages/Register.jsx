import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api"
const C = {
  bg: '#0d0d0d',
  card: '#161616',
  border: '#262626',
  accent: '#a855f7',
  accentHover: '#9333ea',
  accentGlow: 'rgba(168,85,247,0.15)',
  accentSoft: '#1e1428',
  text: '#f5f5f5',
  textMuted: '#737373',
  textSub: '#a3a3a3',
  inputBg: '#1a1a1a',
  inputBorder: '#2e2e2e',
  error: '#f87171',
  success: '#4ade80',
};

const base = {
  body: {
    minHeight: '100vh',
    background: C.bg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Inter', 'DM Sans', sans-serif",
    padding: '2rem 1rem',
  },
  card: {
    width: 'min(400px, 100%)',
    background: C.card,
    borderRadius: 16,
    border: `1px solid ${C.border}`,
    padding: '2rem 1.75rem',
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
  },
  header: { textAlign: 'center', marginBottom: '1.75rem' },
  logoWrap: {
    width: 44, height: 44,
    borderRadius: 12,
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20, color: '#fff',
    marginBottom: '0.875rem',
    boxShadow: '0 6px 20px rgba(168,85,247,0.4)',
  },
  heading: { fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 },
  sub: { fontSize: 13, color: C.textMuted },

  // Avatar
  avatarWrap: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', marginBottom: '1.5rem',
  },
  avatar: (hasImg) => ({
    width: 80, height: 80,
    borderRadius: '50%',
    background: hasImg ? 'transparent' : C.accentSoft,
    border: `2px dashed ${hasImg ? C.accent : C.inputBorder}`,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', overflow: 'hidden',
    transition: 'border-color 0.2s',
    marginBottom: 6,
    position: 'relative',
  }),
  avatarOverlay: {
    position: 'absolute', inset: 0,
    background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: '50%',
  },
  avatarHint: { fontSize: 11, color: C.textMuted },

  // Divider line
  sectionLabel: {
    fontSize: 10, fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: C.textMuted,
    marginBottom: '0.75rem',
    marginTop: '0.25rem',
  },

  // Fields
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem', marginBottom: '0.625rem' },
  field: { marginBottom: '0.625rem' },
  label: {
    display: 'block', fontSize: 11, fontWeight: 500,
    letterSpacing: '0.05em', textTransform: 'uppercase',
    color: C.textMuted, marginBottom: 5,
  },
  inputWrap: { position: 'relative' },
  input: (focused, err) => ({
    width: '100%',
    padding: '10px 36px 10px 34px',
    fontFamily: 'inherit', fontSize: 14,
    color: C.text, background: C.inputBg,
    border: `1px solid ${err ? C.error : focused ? C.accent : C.inputBorder}`,
    borderRadius: 9, outline: 'none',
    boxSizing: 'border-box',
    boxShadow: focused && !err ? `0 0 0 3px ${C.accentGlow}` : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    '::placeholder': { color: C.textMuted },
  }),
  icoL: {
    position: 'absolute', left: 10, top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 15, color: '#404040', pointerEvents: 'none',
  },
  icoR: (color) => ({
    position: 'absolute', right: 10, top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14, color, cursor: 'pointer',
  }),
  hint: (color) => ({ fontSize: 11, color, marginTop: 4 }),

  // Strength
  strengthWrap: { marginTop: 6, marginBottom: 2 },
  strengthBar: { display: 'flex', gap: 3, marginBottom: 4 },
  seg: (on, color) => ({
    flex: 1, height: 3, borderRadius: 99,
    background: on ? color : C.inputBorder,
    transition: 'background 0.25s',
  }),
  strengthTxt: (color) => ({ fontSize: 11, color, fontWeight: 500 }),

  // DOB
  dobRow: { display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr', gap: '0.625rem', marginBottom: '0.625rem' },
  select: (focused) => ({
    width: '100%',
    padding: '10px 10px 10px 10px',
    fontFamily: 'inherit', fontSize: 13,
    color: C.textSub, background: C.inputBg,
    border: `1px solid ${focused ? C.accent : C.inputBorder}`,
    borderRadius: 9, outline: 'none',
    boxSizing: 'border-box',
    appearance: 'none',
    cursor: 'pointer',
    boxShadow: focused ? `0 0 0 3px ${C.accentGlow}` : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  }),

  // Terms
  termsRow: {
    display: 'flex', alignItems: 'flex-start', gap: 10,
    margin: '1rem 0',
  },
  termsText: { fontSize: 12, color: C.textMuted, lineHeight: 1.55 },
  termsLink: { color: C.accent, textDecoration: 'none', fontWeight: 500 },

  // Button
  btn: (disabled) => ({
    width: '100%', padding: '12px',
    background: disabled ? '#2a1f3d' : 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: disabled ? C.textMuted : '#fff',
    fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
    border: 'none', borderRadius: 10, cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 4px 20px rgba(168,85,247,0.4)',
    transition: 'opacity 0.2s, box-shadow 0.2s',
    marginBottom: '1.25rem',
    letterSpacing: '0.01em',
  }),

  dividerRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' },
  divLine: { flex: 1, height: 1, background: C.border },
  divTxt: { fontSize: 11, color: C.textMuted },

  footer: { textAlign: 'center', fontSize: 13, color: C.textMuted },
  footerBtn: {
    color: C.accent, background: 'none', border: 'none',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', padding: 0,
  },

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

const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const days = Array.from({length:31},(_,i)=>i+1);
const years = Array.from({length:100},(_,i)=>2006-i);

const getStrength = (pw) => {
  if (!pw) return { level:0, label:'', color:'' };
  let sc = 0;
  if (pw.length >= 8) sc++;
  if (/[A-Z]/.test(pw)) sc++;
  if (/[0-9]/.test(pw)) sc++;
  if (/[^A-Za-z0-9]/.test(pw)) sc++;
  if (sc<=1) return { level:1, label:'Weak', color:'#f87171' };
  if (sc===2) return { level:2, label:'Fair', color:'#fb923c' };
  if (sc===3) return { level:3, label:'Good', color:'#4ade80' };
  return { level:4, label:'Strong', color:'#a855f7' };
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName:'', lastName:'', username:'', email:'',
    password:'', confirmPassword:'', month:'', day:'', year:'', gender:''
  });
  const [focused, setFocused] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(null);
  

  const strength = getStrength(form.password);
  const pwMatch = form.confirmPassword && form.password === form.confirmPassword;
  const pwMismatch = form.confirmPassword && form.password !== form.confirmPassword;
  const usernameValid = form.username.length >= 3;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const foc = (k) => () => setFocused(k);
  const blur = () => setFocused(null);

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarSrc(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed || pwMismatch) return;
    setLoading(true); setStatus(null);
    try {
      const data = await api.post('/auth/signup', form);
      console.log(data);
      setStatus('success');
      setTimeout(() => {
          navigate("/verification-pending");
      },1500);
    } catch (err) {
          console.error(err);
          setStatus('error');
        }
        finally {
            setLoading(false);
        }
  };
  const disabled = loading || !agreed || pwMismatch || !form.password || !form.email || !form.username;
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />
      <input type="file" accept="image/*" id="avatar-input" style={{display:'none'}} onChange={handleAvatar} />

      <div style={base.body}>
        <div style={base.card}>

          {/* Header */}
          <div style={base.header}>
            <div style={base.logoWrap}><i className="ti ti-sparkles" /></div>
            <p style={base.heading}>Create your account</p>
            <p style={base.sub}>Join millions of people on the platform</p>
          </div>

          {/* Avatar */}
          <div style={base.avatarWrap}>
            <div style={base.avatar(!!avatarSrc)} onClick={() => document.getElementById('avatar-input').click()}>
              {avatarSrc
                ? <><img src={avatarSrc} alt="avatar" style={{width:'100%',height:'100%',objectFit:'cover'}} /><div style={base.avatarOverlay}><i className="ti ti-camera" style={{color:'#fff',fontSize:18}} /></div></>
                : <><i className="ti ti-camera" style={{fontSize:20,color:C.textMuted}} /><span style={{fontSize:10,color:C.textMuted,marginTop:3}}>Add photo</span></>
              }
            </div>
            <span style={base.avatarHint}>Optional profile photo</span>
          </div>

          {/* Status */}
          {status==='success' && <div style={base.successBox}><i className="ti ti-circle-check" style={{fontSize:15}} /> Registration successful. Check your email.</div>}
          {status==='error'   && <div style={base.errorBox}><i className="ti ti-circle-x" style={{fontSize:15}} />Something went wrong. Try again.</div>}

          {/* Name */}
          <p style={base.sectionLabel}>Your name</p>
          <div style={base.row2}>
            {[['firstName','First name','ti-user'],['lastName','Last name','ti-user']].map(([key,ph,ico]) => (
              <div key={key}>
                <div style={base.inputWrap}>
                  <i className={`ti ${ico}`} style={base.icoL} />
                  <input style={base.input(focused===key)} type="text" placeholder={ph}
                    value={form[key]} onChange={set(key)} onFocus={foc(key)} onBlur={blur} />
                </div>
              </div>
            ))}
          </div>

          {/* Username */}
          <p style={{...base.sectionLabel, marginTop:'0.75rem'}}>Username & email</p>
          <div style={base.field}>
            <div style={base.inputWrap}>
              <i className="ti ti-at" style={base.icoL} />
              <input style={base.input(focused==='username', form.username.length>0 && !usernameValid)}
                type="text" placeholder="username" value={form.username}
                onChange={set('username')} onFocus={foc('username')} onBlur={blur} />
              {form.username.length>0 && (
                <i className={`ti ${usernameValid?'ti-circle-check':'ti-circle-x'}`}
                  style={base.icoR(usernameValid ? C.success : C.error)} />
              )}
            </div>
            {form.username.length>0 && <p style={base.hint(usernameValid?C.success:C.error)}>{usernameValid?`@${form.username} is available`:'At least 3 characters required'}</p>}
          </div>

          <div style={base.field}>
            <div style={base.inputWrap}>
              <i className="ti ti-mail" style={base.icoL} />
              <input style={base.input(focused==='email')} type="email" placeholder="Email address"
                value={form.email} onChange={set('email')} onFocus={foc('email')} onBlur={blur} />
            </div>
          </div>

          {/* DOB */}
          <p style={{...base.sectionLabel, marginTop:'0.75rem'}}>Date of birth</p>
          <div style={base.dobRow}>
            <select style={base.select(focused==='month')} value={form.month}
              onChange={set('month')} onFocus={foc('month')} onBlur={blur}>
              <option value="">Month</option>
              {months.map(m=><option key={m} value={m}>{m}</option>)}
            </select>
            <select style={base.select(focused==='day')} value={form.day}
              onChange={set('day')} onFocus={foc('day')} onBlur={blur}>
              <option value="">Day</option>
              {days.map(d=><option key={d} value={d}>{d}</option>)}
            </select>
            <select style={base.select(focused==='year')} value={form.year}
              onChange={set('year')} onFocus={foc('year')} onBlur={blur}>
              <option value="">Year</option>
              {years.map(y=><option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Gender */}
          <p style={{...base.sectionLabel, marginTop:'0.75rem'}}>Gender</p>
          <div style={{...base.field}}>
            <div style={{display:'flex', gap:'0.5rem'}}>
              {['Male','Female','Non-binary','Prefer not to say'].map(g=>(
                <button key={g} onClick={()=>setForm({...form,gender:g})} style={{
                  flex:1, padding:'8px 4px', fontSize:11, fontWeight:500,
                  borderRadius:8, cursor:'pointer', fontFamily:'inherit',
                  border:`1px solid ${form.gender===g ? C.accent : C.inputBorder}`,
                  background: form.gender===g ? C.accentSoft : C.inputBg,
                  color: form.gender===g ? C.accent : C.textMuted,
                  transition:'all 0.15s', whiteSpace:'nowrap',
                }}>{g}</button>
              ))}
            </div>
          </div>

          {/* Password */}
          <p style={{...base.sectionLabel, marginTop:'0.75rem'}}>Password</p>
          <div style={base.field}>
            <div style={base.inputWrap}>
              <i className="ti ti-lock" style={base.icoL} />
              <input style={base.input(focused==='password')}
                type={showPw?'text':'password'} placeholder="Create a password"
                value={form.password} onChange={set('password')}
                onFocus={foc('password')} onBlur={blur} />
              <i className={`ti ${showPw?'ti-eye-off':'ti-eye'}`}
                style={base.icoR(C.textMuted)} onClick={()=>setShowPw(!showPw)} />
            </div>
            {form.password.length>0 && (
              <div style={base.strengthWrap}>
                <div style={base.strengthBar}>
                  {[1,2,3,4].map(i=><div key={i} style={base.seg(i<=strength.level,strength.color)} />)}
                </div>
                <p style={base.strengthTxt(strength.color)}>{strength.label} password</p>
              </div>
            )}
          </div>

          <div style={base.field}>
            <div style={base.inputWrap}>
              <i className="ti ti-lock-check" style={base.icoL} />
              <input style={base.input(focused==='confirmPassword', pwMismatch)}
                type={showCpw?'text':'password'} placeholder="Confirm password"
                value={form.confirmPassword} onChange={set('confirmPassword')}
                onFocus={foc('confirmPassword')} onBlur={blur} />
              <i className={`ti ${showCpw?'ti-eye-off':'ti-eye'}`}
                style={base.icoR(C.textMuted)} onClick={()=>setShowCpw(!showCpw)} />
            </div>
            {pwMatch    && <p style={base.hint(C.success)}>✓ Passwords match</p>}
            {pwMismatch && <p style={base.hint(C.error)}>✗ Passwords do not match</p>}
          </div>

          {/* Terms */}
          <div style={base.termsRow}>
            <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
              style={{marginTop:2, accentColor:C.accent, cursor:'pointer', flexShrink:0}} />
            <span style={base.termsText}>
              I agree to the <a href="#" style={base.termsLink}>Terms of Service</a>,{' '}
              <a href="#" style={base.termsLink}>Privacy Policy</a>, and{' '}
              <a href="#" style={base.termsLink}>Community Guidelines</a>
            </span>
          </div>

          {/* Submit */}
          <button style={base.btn(disabled)} onClick={handleSubmit} disabled={disabled}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <div style={base.dividerRow}>
            <div style={base.divLine} /><span style={base.divTxt}>already a member?</span><div style={base.divLine} />
          </div>

          <p style={base.footer}>
            <button style={base.footerBtn} onClick={() => navigate("/login")}>
              Sign in to your account
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
export default Register;