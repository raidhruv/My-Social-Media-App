import { useNavigate } from "react-router-dom";

const C = {
  bg: '#0d0d0d',
  surface: '#161616',
  surface2: '#1a1a1a',
  border: '#262626',
  accent: '#a855f7',
  accentPink: '#ec4899',
  accentGlow: 'rgba(168,85,247,0.15)',
  accentSoft: '#1e1428',
  text: '#f5f5f5',
  textMuted: '#737373',
  textSub: '#a3a3a3',
  error: '#f87171',
  success: '#4ade80',
  online: '#4ade80',
};

const s = {
  card: {
    background: C.surface,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    overflow: 'hidden',
    marginBottom: '1rem',
  },
  profileBanner: {
    height: 64,
    background: 'linear-gradient(135deg, #1e1428, #1a1630)',
    position: 'relative',
  },
  profileAvatarWrap: {
    position: 'absolute', bottom: -28, left: '50%',
    transform: 'translateX(-50%)',
  },
  profileAvatar: {
    width: 58, height: 58, borderRadius: '50%',
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentPink})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 700, color: '#fff',
    border: `3px solid ${C.surface}`,
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 2, right: 2,
    width: 10, height: 10, borderRadius: '50%',
    background: C.online, border: `2px solid ${C.surface}`,
  },
  profileInfo: { padding: '2.25rem 1.25rem 1.25rem', textAlign: 'center' },
  profileName: { fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 2 },
  profileHandle: { fontSize: 12, color: C.textMuted, marginBottom: '0.75rem' },
  profileBio: { fontSize: 12, color: C.textSub, lineHeight: 1.5, marginBottom: '0.875rem' },
  leftNavItem: (active) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 1.25rem',
    background: active ? C.accentSoft : 'none',
    color: active ? C.accent : C.textMuted,
    border: 'none', cursor: 'pointer', width: '100%',
    textAlign: 'left', fontFamily: 'inherit',
    fontSize: 13, fontWeight: active ? 500 : 400,
    borderLeft: active ? `2px solid ${C.accent}` : '2px solid transparent',
    transition: 'all 0.15s',
  }),
  logoutItem: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '9px 1.25rem',
    background: 'none', color: C.error,
    border: 'none', cursor: 'pointer', width: '100%',
    textAlign: 'left', fontFamily: 'inherit',
    fontSize: 13, borderTop: `1px solid ${C.border}`,
    borderLeft: '2px solid transparent',
    marginTop: 4,
  },
};

const LEFT_NAV = [
  { icon:'ti-home', label:'Home', key:'home' },
  { icon:'ti-compass', label:'Explore', key:'explore' },
  { icon:'ti-users', label:'Network', key:'network' },
  { icon:'ti-message-circle', label:'Messages', key:'messages' },
  { icon:'ti-bookmark', label:'Saved', key:'saved' },
];

function LeftSidebar({
  profile,
  initials,
  activeNav,
  setActiveNav,
  logout
}) {

  const navigate = useNavigate();

  return (
    <div>
      <div
        style={{
        ...s.card,
      cursor: 'pointer'
    }}
    onClick={() => navigate('/profile')}
  >
        <div style={{...s.profileBanner,background:profile?.bannerImage?`url(${profile.bannerImage}) center/cover`:s.profileBanner.background}}>
          <div style={s.profileAvatarWrap}>
            <div style={s.profileAvatar}>
              {profile?.profilePicture?<img src={profile.profilePicture} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>:initials}
              <div style={s.onlineDot} />
            </div>
          </div>
        </div>
        <div style={s.profileInfo}>
          <div style={s.profileName}>{profile?.firstName?`${profile.firstName} ${profile.lastName||''}`.trim():profile?.username}</div>
          <div style={s.profileHandle}>@{profile?.username}</div>
          <div style={s.profileBio}>{profile?.bio||"No bio yet."}</div>
        </div>
      </div>

      <div style={s.card}>
        {LEFT_NAV.map(n => (
          <button key={n.key} style={s.leftNavItem(activeNav===n.key)} 
          onClick={() => {
            setActiveNav(n.key);
            if (n.key === 'profile') {
              navigate('/profile');
            }
          }}>
            <i className={`ti ${n.icon}`} style={{ fontSize:16 }} />
            {n.label}
          </button>
        ))}
        <button style={s.logoutItem} onClick={logout}>
          <i className="ti ti-logout" style={{ fontSize:16 }} />
          Sign out
        </button>
      </div>
    </div>
  );

}

export default LeftSidebar;
