import { useState,useEffect } from "react";
import SearchBar from "../components/SearchBar";
import NotificationBell from "../components/NotificationBell";
import {createPost,getFeed} from "../services/postApi";
import PostCard from "../components/PostCard";
import AppLayout from "../components/AppLayout";
import useCurrentUser from "../hooks/useCurrentUser";

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
  // ── Topbar ──
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
  searchInput: {
    background: 'none', border: 'none', outline: 'none',
    fontFamily: 'inherit', fontSize: 13, color: C.text,
    width: '100%',
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

  // ── Card base ──
  card: {
    background: C.surface,
    borderRadius: 14,
    border: `1px solid ${C.border}`,
    overflow: 'hidden',
    marginBottom: '1rem',
  },

  // ── Left sidebar ──
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
  statsRow: { display: 'flex', borderTop: `1px solid ${C.border}` },
  statItem: {
    flex: 1, padding: '0.75rem 0.5rem', textAlign: 'center',
    borderRight: `1px solid ${C.border}`,
    cursor: 'pointer',
  },
  statNum: { fontSize: 15, fontWeight: 700, color: C.text },
  statLbl: { fontSize: 10, color: C.textMuted, marginTop: 1 },
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

  // ── Create post ──
  createPost: { padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' },
  createAvatarMini: {
    width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
    background: `linear-gradient(135deg, ${C.accent}, ${C.accentPink})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, fontWeight: 700, color: '#fff',
  },
  createInput: {
    flex: 1, padding: '9px 14px',
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 24, outline: 'none', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, color: C.textMuted,
  },
  postActions: {
    display: 'flex', gap: '0.25rem',
    padding: '0.5rem 1.25rem 0.875rem',
    borderTop: `1px solid ${C.border}`,
  },
  postActionBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '6px 10px', borderRadius: 8,
    background: 'none', border: 'none',
    color: C.textMuted, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
    transition: 'background 0.15s, color 0.15s',
  },

  // ── Textarea post box ──
  postBox: {
    padding: '1.25rem',
    borderBottom: `1px solid ${C.border}`,
  },
  postTextarea: {
    width: '100%', background: C.surface2,
    border: `1px solid ${C.border}`,
    borderRadius: 10, padding: '10px 14px',
    fontFamily: 'inherit', fontSize: 14, color: C.text,
    resize: 'none', outline: 'none', boxSizing: 'border-box',
    lineHeight: 1.5,
  },
  postSubmitRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' },
  postSubmitActions: { display: 'flex', gap: '0.5rem' },
  postIconBtn: {
    width: 32, height: 32, borderRadius: 8,
    background: C.surface2, border: `1px solid ${C.border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: C.textMuted, cursor: 'pointer', fontSize: 15,
  },
  postBtn: {
    padding: '7px 18px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: '#fff', border: 'none', borderRadius: 8,
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
    cursor: 'pointer',
    boxShadow: '0 3px 12px rgba(168,85,247,0.35)',
  },

  // ── Feed post ──
  feedPost: { padding: '1.25rem', borderBottom: `1px solid ${C.border}` },
  postHeader: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' },
  postAvatar: (color1, color2) => ({
    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
    background: `linear-gradient(135deg, ${color1}, ${color2})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 700, color: '#fff',
  }),
  postMeta: { flex: 1 },
  postAuthor: { fontSize: 14, fontWeight: 600, color: C.text },
  postHandleTime: { fontSize: 12, color: C.textMuted },
  moreBtn: {
    background: 'none', border: 'none', color: C.textMuted,
    cursor: 'pointer', fontSize: 18, padding: 0,
  },
  postContent: { fontSize: 14, color: C.textSub, lineHeight: 1.65, marginBottom: '0.875rem' },
  postTag: {
    display: 'inline-block', padding: '2px 8px',
    background: C.accentSoft, borderRadius: 4,
    fontSize: 11, color: C.accent, fontWeight: 500, marginRight: 4,
  },
  postEngagement: { fontSize: 11, color: C.textMuted, marginBottom: '0.75rem', display: 'flex', gap: '0.875rem' },
  reactionRow: {
    display: 'flex', borderTop: `1px solid ${C.border}`,
    paddingTop: '0.625rem', gap: '0.25rem',
  },
  reactionBtn: (active) => ({
    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    padding: '6px', borderRadius: 8, border: 'none',
    background: active ? C.accentSoft : 'none',
    color: active ? C.accent : C.textMuted,
    cursor: 'pointer', fontFamily: 'inherit',
    fontSize: 12, fontWeight: active ? 500 : 400,
    transition: 'all 0.15s',
  }),

  // ── Right sidebar ──
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

const NAV = [
  { icon:'ti-home', label:'Home', key:'home' },
  { icon:'ti-compass', label:'Explore', key:'explore' },
  { icon:'ti-message-circle', label:'Messages', key:'messages' },
  { icon:'ti-bell', label:'Alerts', key:'alerts' },
  { icon:'ti-user', label:'Profile', key:'profile' },
];

const LEFT_NAV = [
  { icon:'ti-home', label:'Home', key:'home' },
  { icon:'ti-compass', label:'Explore', key:'explore' },
  { icon:'ti-users', label:'Network', key:'network' },
  { icon:'ti-message-circle', label:'Messages', key:'messages' },
  { icon:'ti-bookmark', label:'Saved', key:'saved' },
];

function Dashboard() {
  const { user } = useCurrentUser();
  const [postText, setPostText] = useState('');
  const [composing, setComposing] = useState(false);
  const [feed,setFeed]=useState([]);
  const loadFeed=async()=>{
 try{
  const posts=await getFeed();
  setFeed(posts);
 }catch(err){
  console.error(err);
 }
};

useEffect(()=>{
loadFeed();
},[]);

  const handlePost=async()=>{
  try{
  if(!postText.trim()) return;

  const post=await createPost(postText);

  setFeed(prev=>[post,...prev]);

  setPostText('');
  setComposing(false);

 }catch(err){
  console.error(err);
 }
};

  return (
    <>
      <AppLayout>

        {/* ── Center feed ── */}
        <div>
          {/* Create post card */}
          <div style={s.card}>
            {!composing ? (
              <>
                <div style={s.createPost}>
                  <div style={s.createAvatarMini}>D</div>
                  <div
                    style={s.createInput}
                    onClick={() => setComposing(true)}
                  >
                    What's on your mind?
                  </div>
                </div>
                <div style={s.postActions}>
                  {[['ti-photo','Photo'],['ti-video','Video'],['ti-link','Link'],['ti-mood-smile','Feeling']].map(([ico, lbl]) => (
                    <button key={lbl} style={s.postActionBtn} onClick={() => setComposing(true)}>
                      <i className={`ti ${ico}`} style={{ fontSize:16 }} /> {lbl}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={s.postBox}>
                <div style={{ display:'flex', gap:'0.75rem', marginBottom:'0.75rem' }}>
                  <div style={s.createAvatarMini}>D</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:C.text }}>Dhruv</div>
                    <div style={{ fontSize:11, color:C.textMuted }}>Public</div>
                  </div>
                </div>
                <textarea
                  style={s.postTextarea}
                  rows={4}
                  placeholder="What's on your mind?"
                  value={postText}
                  onChange={e => setPostText(e.target.value)}
                  autoFocus
                />
                <div style={s.postSubmitRow}>
                  <div style={s.postSubmitActions}>
                    {['ti-photo','ti-mood-smile','ti-map-pin'].map(ico => (
                      <div key={ico} style={s.postIconBtn}><i className={`ti ${ico}`} /></div>
                    ))}
                  </div>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    <button onClick={() => { setComposing(false); setPostText(''); }}
                      style={{ ...s.postIconBtn, width:'auto', padding:'0 12px', fontSize:12, color:C.textMuted }}>
                      Cancel
                    </button>
                    <button style={{ ...s.postBtn, opacity: postText.trim() ? 1 : 0.5 }} onClick={handlePost}>
                      Post
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Feed */}
          {feed.map(post=>(
            <div
              key={post.id}
              style={s.card}
            >
              <PostCard
                post={post}
                currentUserId={user?.id}
                onDelete={()=>{}}
              />
            </div>
          ))}
        </div>

      </AppLayout>
    </>
  );
}
export default Dashboard;