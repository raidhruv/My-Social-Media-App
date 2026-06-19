import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

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
  topbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(13,13,13,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${C.border}`,
    padding: '0 1.5rem',
    height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    gap: '1rem',
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '0.875rem', flexShrink: 0 },
  logoWrap: {
    width: 34, height: 34, borderRadius: 10,
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, color: '#fff',
    boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
    flexShrink: 0,
  },
  searchWrap: {
    display: 'flex', alignItems: 'center',
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '6px 12px', gap: 8,
    width: 220,
  },
  topbarNav: { display: 'flex', alignItems: 'center', gap: '0.25rem' },
  navBtn: (active) => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '4px 14px',
    background: 'none', border: 'none', cursor: 'pointer',
    borderBottom: active ? `2px solid ${C.accent}` : '2px solid transparent',
    color: active ? C.accent : C.textMuted,
    fontFamily: 'inherit', fontSize: 10, fontWeight: 500,
    gap: 3, transition: 'color 0.15s',
  }),
  topbarRight: { display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 },
  notifBtn: {
    position: 'relative', width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 10, cursor: 'pointer', color: C.textMuted, fontSize: 16,
  },
  notifDot: {
    position: 'absolute', top: 7, right: 7,
    width: 7, height: 7, borderRadius: '50%',
    background: C.accentPink, border: `2px solid ${C.bg}`,
  },
  avatarSmall: {
    width: 32, height: 32, borderRadius: '50%',
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentPink})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
    border: `2px solid ${C.border}`,
  },
};

const NAV = [
  { icon:'ti-home', label:'Home', key:'home' },
  { icon:'ti-compass', label:'Explore', key:'explore' },
  { icon:'ti-message-circle', label:'Messages', key:'messages' },
  { icon:'ti-bell', label:'Alerts', key:'alerts' },
  { icon:'ti-user', label:'Profile', key:'profile' },
];

function TopBar({
  profile,
  initials,
  activeNav,
  setActiveNav,
  navigate
}) {

  return (
    <div style={s.topbar}>
      <div style={s.topbarLeft}>
        <div style={s.logoWrap}><i className="ti ti-sparkles" /></div>
        <div style={s.searchWrap}>
          <SearchBar />
        </div>
      </div>

      <div style={s.topbarNav}>
        {NAV.map(n => (
          <button key={n.key} style={s.navBtn(activeNav===n.key)} 
          onClick={() => {
            setActiveNav(n.key);
            if (n.key === 'profile') {
              navigate('/profile');
            }
          }}>
            <i className={`ti ${n.icon}`} style={{ fontSize:18 }} />
            {n.label}
          </button>
        ))}
      </div>

      <div style={s.topbarRight}>
        <NotificationBell style={s.notifBtn} dotStyle={s.notifDot}/>
        <div style={s.avatarSmall} onClick={() => navigate('/profile')}>
          {profile?.profilePicture?<img src={profile.profilePicture} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>:initials}
        </div>
      </div>
    </div>
  );

}

export default TopBar;
