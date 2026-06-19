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
  sidebarSection: { padding: '1rem 1.25rem' },
  sidebarTitle: { fontSize: 13, fontWeight: 700, color: C.text, marginBottom: '0.875rem' },
  suggestionItem: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    marginBottom: '0.875rem',
  },
  suggAvatar: (c1, c2) => ({
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#fff',
  }),
  suggInfo: { flex: 1, minWidth: 0 },
  suggName: { fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  suggSub: { fontSize: 11, color: C.textMuted },
  followBtn: {
    padding: '4px 12px', borderRadius: 99,
    background: 'none',
    border: `1px solid ${C.accent}`,
    color: C.accent, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
    transition: 'all 0.15s', flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  trendItem: { marginBottom: '0.875rem', cursor: 'pointer' },
  trendCategory: { fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' },
  trendTag: { fontSize: 13, fontWeight: 600, color: C.text, marginTop: 1 },
  trendCount: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  divider: { height: 1, background: C.border, margin: '0.75rem 0' },
};

const SUGGESTIONS = [
  { name:'Piyush Sharma', sub:'Full Stack Dev', initials:'PS', c1:'#f59e0b', c2:'#ef4444' },
  { name:'James white', sub:'UI/UX Designer', initials:'JW', c1:'#06b6d4', c2:'#6366f1' },
  { name:'Robert ', sub:'Product Manager', initials:'R', c1:'#10b981', c2:'#14b8a6' },
];

const TRENDS = [
  { cat:'Technology', tag:'#ReactJS', count:'14.2K posts' },
  { cat:'Career', tag:'#OpenToWork', count:'9.8K posts' },
  { cat:'Programming', tag:'#100DaysOfCode', count:'8.1K posts' },
  { cat:'Design', tag:'#UIDesign', count:'5.4K posts' },
];

function RightSidebar({
  followed,
  toggleFollow
}) {

  return (
    <div>
      {/* Suggestions */}
      <div style={s.card}>
        <div style={s.sidebarSection}>
          <div style={s.sidebarTitle}>People you may know</div>
          {SUGGESTIONS.map(u => (
            <div key={u.name} style={s.suggestionItem}>
              <div style={s.suggAvatar(u.c1, u.c2)}>{u.initials}</div>
              <div style={s.suggInfo}>
                <div style={s.suggName}>{u.name}</div>
                <div style={s.suggSub}>{u.sub}</div>
              </div>
              <button
                style={{ ...s.followBtn, background: followed[u.name] ? C.accentSoft : 'none', color: followed[u.name] ? C.accent : C.accent }}
                onClick={() => toggleFollow(u.name)}
              >
                {followed[u.name] ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trending */}
      <div style={s.card}>
        <div style={s.sidebarSection}>
          <div style={s.sidebarTitle}>Trending</div>
          {TRENDS.map((t, i) => (
            <div key={t.tag}>
              <div style={s.trendItem}>
                <div style={s.trendCategory}>{t.cat}</div>
                <div style={s.trendTag}>{t.tag}</div>
                <div style={s.trendCount}>{t.count}</div>
              </div>
              {i < TRENDS.length - 1 && <div style={s.divider} />}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding:'0 0.5rem' }}>
        <p style={{ fontSize:11, color:C.textMuted, lineHeight:1.8 }}>
          Terms · Privacy · Cookies · Advertising · More<br />
          <span style={{ color:'#3a3a3a' }}>© 2026 Arc Inc.</span>
        </p>
      </div>
    </div>
  );

}

export default RightSidebar;
