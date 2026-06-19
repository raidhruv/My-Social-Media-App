import { useEffect, useState } from "react";
import api from "../services/api";
import NotificationBell from "../components/NotificationBell";
import CreatePost from "../components/CreatePost";
import {getFeed,getUserPosts,deletePost,getBookmarkedPosts,getUserReposts} from "../services/postApi";
import PostCard from "../components/PostCard";
import { useNavigate,useParams } from "react-router-dom";

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
  success: '#4ade80',
  inputBg: '#1a1a1a',
  inputBorder: '#2e2e2e',
};

// ── Shared styled input ──
const editInput = (extra = {}) => ({
  background: C.inputBg,
  border: `1px solid ${C.inputBorder}`,
  borderRadius: 8,
  padding: '8px 12px',
  color: C.text,
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
  ...extra,
});

const s = {
  root: { minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", color: C.text },

  topbar: {
    position: 'sticky', top: 0, zIndex: 100,
    background: 'rgba(13,13,13,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${C.border}`,
    padding: '0 1.5rem', height: 56,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  topbarLeft: { display: 'flex', alignItems: 'center', gap: '0.875rem' },
  logoWrap: {
    width: 34, height: 34, borderRadius: 10,
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 16, color: '#fff',
    boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
  },
  backBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 8, padding: '6px 12px',
    color: C.textSub, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13,
  },
  topbarRight: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  notifBtn: {
    width: 34, height: 34,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: C.surface2, border: `1px solid ${C.border}`,
    borderRadius: 10, cursor: 'pointer', color: C.textMuted, fontSize: 16,
    position: 'relative',
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
    fontSize: 12, fontWeight: 700, color: '#fff',
    border: `2px solid ${C.border}`,
  },

  page: {
    maxWidth: 900, margin: '0 auto',
    padding: '1.5rem 1rem',
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1fr) 300px',
    gap: '1.25rem', alignItems: 'start',
  },

  card: {
    background: C.surface, borderRadius: 14,
    border: `1px solid ${C.border}`,
    overflow: 'hidden', marginBottom: '1rem',
  },

  // ── Hero ──
  coverBg: {
    height: 130,
    background: 'linear-gradient(135deg, #1e1428 0%, #1a1630 50%, #12182a 100%)',
    position: 'relative',
  },
  coverPattern: {
    position: 'absolute', inset: 0,
    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(168,85,247,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236,72,153,0.08) 0%, transparent 40%)',
  },
  heroBody: { padding: '0 1.5rem 1.5rem', position: 'relative' },
  heroAvatarWrap: { position: 'absolute', top: -48, width: 88, height: 88 },
  heroAvatar: {
    width: 88, height: 88, borderRadius: '50%',
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 32, fontWeight: 700, color: '#fff',
    border: `4px solid ${C.surface}`, position: 'relative',
  },
  onlineDot: {
    position: 'absolute', bottom: 4, right: 4,
    width: 14, height: 14, borderRadius: '50%',
    background: C.success, border: `3px solid ${C.surface}`,
  },
  heroTopRow: {
    display: 'flex', justifyContent: 'flex-end',
    paddingTop: '0.75rem', marginBottom: '2.75rem', gap: '0.625rem',
  },
  editBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 16px', borderRadius: 99,
    background: 'none', border: `1px solid ${C.border}`,
    color: C.textSub, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
  },
  saveBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 20px', borderRadius: 99,
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    border: 'none', color: '#fff', cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
    boxShadow: '0 4px 14px rgba(168,85,247,0.35)',
  },
  connectBtn: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '7px 20px', borderRadius: 99,
    background: 'none',
    border: `1px solid ${C.accent}`,
    color: C.accent, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
  },

  // name row in edit mode
  nameRow: { display: 'flex', gap: 8, marginBottom: 6 },

  heroName: { fontSize: 22, fontWeight: 700, color: C.text, marginBottom: 2 },
  heroHandle: { fontSize: 13, color: C.textMuted, marginBottom: '0.625rem' },
  heroBio: { fontSize: 14, color: C.textSub, lineHeight: 1.6, marginBottom: '0.875rem' },

  heroMeta: { display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' },
  metaItem: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.textMuted },

  // ── Private toggle ──
  toggleRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 12px',
    background: C.inputBg, border: `1px solid ${C.inputBorder}`,
    borderRadius: 8, cursor: 'pointer', userSelect: 'none',
  },
  toggleTrack: (on) => ({
    width: 34, height: 18, borderRadius: 99,
    background: on ? C.accent : C.inputBorder,
    position: 'relative', flexShrink: 0,
    transition: 'background 0.2s',
  }),
  toggleThumb: (on) => ({
    position: 'absolute', top: 2,
    left: on ? 18 : 2,
    width: 14, height: 14, borderRadius: '50%',
    background: '#fff', transition: 'left 0.2s',
  }),
  toggleLabel: { fontSize: 13, color: C.textSub },

  statsRow: { display: 'flex', gap: '1.5rem', paddingTop: '0.875rem', borderTop: `1px solid ${C.border}` },
  statItem: { display: 'flex', flex: 1, flexDirection: 'column', cursor: 'pointer' },
  statNum: { fontSize: 18, fontWeight: 700, color: C.text },
  statLbl: { fontSize: 11, color: C.textMuted, marginTop: 1 },

  section: { padding: '1.25rem 1.5rem' },
  sectionTitle: { fontSize: 15, fontWeight: 700, color: C.text, marginBottom: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  editIconBtn: { background: 'none', border: 'none', color: C.textMuted, cursor: 'pointer', fontSize: 16 },
  aboutText: { fontSize: 14, color: C.textSub, lineHeight: 1.7 },

  tabRow: { display: 'flex', gap: '0.5rem' },
  tabBtn: (active) => ({
    background: active ? C.accentSoft : 'none',
    border: `1px solid ${active ? C.accent : C.border}`,
    color: active ? C.accent : C.textMuted,
    borderRadius: 99,
    padding: '6px 14px',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: 'inherit',
  }),

  skillsWrap: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  skillTag: {
    padding: '5px 12px', borderRadius: 99,
    background: C.accentSoft,
    border: `1px solid rgba(168,85,247,0.2)`,
    fontSize: 12, color: C.accent, fontWeight: 500,
  },

  postItem: { padding: '1.25rem 1.5rem', borderBottom: `1px solid ${C.border}` },
  postHeader: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' },
  postAvatar: {
    width: 36, height: 36, borderRadius: '50%',
    background: 'linear-gradient(135deg,#a855f7,#ec4899)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 13, fontWeight: 700, color: '#fff',
  },
  postAuthor: { fontSize: 13, fontWeight: 600, color: C.text },
  postTime: { fontSize: 11, color: C.textMuted },
  postContent: { fontSize: 14, color: C.textSub, lineHeight: 1.65, marginBottom: '0.75rem' },
  postTag: {
    display: 'inline-block', padding: '2px 8px',
    background: C.accentSoft, borderRadius: 4,
    fontSize: 11, color: C.accent, fontWeight: 500, marginRight: 4,
  },
  postFooter: { display: 'flex', gap: '1.25rem', paddingTop: '0.625rem', borderTop: `1px solid ${C.border}` },
  postStat: { display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: C.textMuted, cursor: 'pointer' },

  sideCard: { padding: '1.25rem' },
  sideTitle: { fontSize: 13, fontWeight: 700, color: C.text, marginBottom: '0.875rem' },
  sideItem: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.625rem 0', borderBottom: `1px solid ${C.border}`, cursor: 'pointer',
  },
  sideAvatar: (c1, c2) => ({
    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
    background: `linear-gradient(135deg, ${c1}, ${c2})`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 12, fontWeight: 700, color: '#fff',
  }),
  sideName: { fontSize: 13, fontWeight: 500, color: C.text },
  sideSub: { fontSize: 11, color: C.textMuted },
  followBtn: (following) => ({
    marginLeft: 'auto', padding: '4px 12px', borderRadius: 99, flexShrink: 0,
    background: following ? C.accentSoft : 'none',
    border: `1px solid ${C.accent}`,
    color: C.accent, cursor: 'pointer',
    fontFamily: 'inherit', fontSize: 11, fontWeight: 600,
  }),
  infoRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem', fontSize: 13, color: C.textSub },
  infoIcon: {
    width: 28, height: 28, borderRadius: 8,
    background: C.surface2, border: `1px solid ${C.border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 14, color: C.textMuted, flexShrink: 0,
  },
  modalOverlay:{
  position:'fixed',
  inset:0,
  background:'rgba(0,0,0,0.75)',
  display:'flex',
  alignItems:'center',
  justifyContent:'center',
  zIndex:9999
  },

  modal:{
  width:'420px',
  maxHeight:'70vh',
  overflowY:'auto',
  background:C.surface,
  border:`1px solid ${C.border}`,
  borderRadius:14,
  padding:'1rem'
  },

  modalHeader:{
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  marginBottom:'1rem'
  },

  modalTitle:{
  fontSize:16,
  fontWeight:700
  },

  modalClose:{
  background:'none',
  border:'none',
  color:C.textMuted,
  cursor:'pointer',
  fontSize:18
  },

  userRow:{
  display:'flex',
  alignItems:'center',
  gap:'0.75rem',
  padding:'0.75rem 0',
  borderBottom:`1px solid ${C.border}`
  },

  userAvatar:{
  width:42,
  height:42,
  borderRadius:'50%',
  objectFit:'cover'
  },

  userInfo:{
  flex:1
  }
  };

const MUTUAL = [
  { name:'Alex Chen', sub:'@alexchen', c1:'#06b6d4', c2:'#3b82f6', initials:'AC' },
  { name:'Sarah K.', sub:'@sarahk', c1:'#f59e0b', c2:'#ef4444', initials:'SK' },
  { name:'Marcus Dev', sub:'@marcusdev', c1:'#10b981', c2:'#059669', initials:'MD' },
];

const SKILLS = ['React','Node.js','TypeScript','PostgreSQL','Docker','REST APIs','Tailwind CSS','Git'];

function Profile() {
  const navigate = useNavigate();
  const {username}=useParams();
  const [followed, setFollowed] = useState({});
  const [likedPosts, setLikedPosts] = useState({});
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', bio: '',
    location: '', website: '', isPrivate: false,
  });
  const[uploading, setUploading] = useState(false);
  const[followStatus,setFollowStatus]=useState("SELF");
  const[followLoading,setFollowLoading]=useState(false);
  const[followerCount,setFollowerCount]=useState(0);
  const[followingCount,setFollowingCount]=useState(0);

  const[showFollowers,setShowFollowers]=useState(false);
  const[showFollowing,setShowFollowing]=useState(false);

  const[followers,setFollowers]=useState([]);
  const[following,setFollowing]=useState([]); 
  const[posts,setPosts]=useState([]);
  const[activeTab,setActiveTab]=useState("posts");
  const [bookmarks,setBookmarks]=useState([]);
  const [reposts,setReposts]=useState([]);

  const[isOwnProfile,setIsOwnProfile]=useState(true);
  const loadFeed=async(profileUsername)=>{
    try{
      const data=await getUserPosts(
      profileUsername
      );

      setPosts(data);
    }catch(err){
      console.error(err);
    }
    };

  const loadBookmarks=async()=>{
    try{
      const data=await getBookmarkedPosts();
      setBookmarks(data);
    }catch(err){
      console.error(err);
    }
  };

  const loadReposts=async(profileUsername)=>{
    try{
      const data=await getUserReposts(
        profileUsername
      );
      setReposts(data);
    }catch(err){
      console.error(err);
    }
  };

  useEffect(()=>{
const fetchProfile=async()=>{
try{
const response=username
 ? await api.get(`/users/${username}`)
 : await api.get("/users/me");

const u=response.data.user;
setProfile(u);
await loadFeed(u.username);
await loadBookmarks();
await loadReposts(u.username);
const meResponse=await api.get("/users/me");

setIsOwnProfile(
 meResponse.data.user.username===u.username
);

setForm({
firstName:u.firstName||'',
lastName:u.lastName||'',
bio:u.bio||'',
location:u.location||'',
website:u.website||'',
isPrivate:u.isPrivate||false,
});

const [statusResponse, followersResponse, followingResponse] = await Promise.all([
  api.get(`/users/follow-status/${u.username}`),
  api.get(`/users/followers/${u.username}`),
  api.get(`/users/following/${u.username}`),
]);

setFollowStatus(statusResponse.data.status);

setFollowers(followersResponse.data);
setFollowing(followingResponse.data);

setFollowerCount(followersResponse.data.length);
setFollowingCount(followingResponse.data.length);

}catch(error){
console.error(error);
}finally{
setLoading(false);
}
};

fetchProfile();
},[username]);

  const updateProfile = async () => {
    try {
      const response = await api.patch("/users/profile", form);
      const u=response.data.user;
      setProfile(u);
      await loadFeed(u.username);
      /*const statusResponse=await api.get(`http://localhost:5000/api/users/follow-status/${u.username}`,{headers:{Authorization:`Bearer ${token}`}});
      setFollowStatus(statusResponse.data.status);*/
      setForm({
        firstName:
        u.firstName || '',
        lastName:
        u.lastName || '',
        bio:
        u.bio || '',
        location:
        u.location || '',
        website:
        u.website || '',
        isPrivate:
        u.isPrivate || false
      });
      setEditing(false);

    } catch (error) {
      console.error(error);
    }
  };

  const toggleLike = (id) => setLikedPosts(p => ({ ...p, [id]: !p[id] }));
  const toggleFollow = (name) => setFollowed(p => ({ ...p, [name]: !p[name] }));

  const handleAvatarUpload =
  async (e)=>{
    try{
      const file = e.target.files[0];
      if(!file) return;
        setUploading(true);
      const formData =new FormData();
      formData.append("profilePicture", file);
    
      const response = await api.patch("/users/profile-picture",formData);
      setProfile(
        prev => ({...prev,
        profilePicture:
        response
        .data
        .user
        .profilePicture
      })
    );
  }
      catch(error){
      console.error(error);
  }
      finally{
      setUploading(false);
  }
};

const handleBannerUpload =
async (e)=>{
  try{
    const file =
    e.target.files[0];
    if(!file) return;
    const formData =
    new FormData();
    formData.append(
      "bannerImage",
      file
    );
    const response =
    await api.patch("/users/banner",formData);
    setProfile(
      prev => ({...prev,
        bannerImage:
        response
        .data
        .user
        .bannerImage
      })
    );
  }
  catch(error){
    console.error(error);
  }
};

const handleFollow=async()=>{
try{
if(!profile?.username) return;
setFollowLoading(true);

if(followStatus==="NOT_FOLLOWING"){
await api.post(`/users/follow/${profile.username}`,{});
const refreshed=await api.get(`/users/follow-status/${profile.username}`);
setFollowStatus(refreshed.data.status);
const followersResponse=await api.get(`/users/followers/${profile.username}`);
setFollowerCount(followersResponse.data.length);
} else if(followStatus==="FOLLOWING"){
await api.delete(`/users/unfollow/${profile.username}`);
setFollowStatus("NOT_FOLLOWING");
const followersResponse=await api.get(`/users/followers/${profile.username}`);
setFollowerCount(followersResponse.data.length);
}

}catch(err){console.error(err);}
finally{setFollowLoading(false);}
};

const handlePostCreated=(post)=>{
 setPosts(prev=>[post,...prev]);
};

const handleDeletePost=async(postId)=>{
 try{
  await deletePost(postId);

  setPosts(prev=>
   prev.filter(p=>p.id!==postId)
  );
 }catch(err){
  console.error(err);
 }
};

const initials = profile
    ? ((profile.firstName?.[0] || '') + (profile.lastName?.[0] || '')).toUpperCase() || profile.username?.[0]?.toUpperCase() || 'U'
    : 'U';

  if (loading) return (
    <div style={{ background: C.bg, color: C.text, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', gap: 12 }}>
      <div style={{ width: 20, height: 20, border: `2px solid ${C.border}`, borderTop: `2px solid ${C.accent}`, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      Loading profile...
    </div>
  );

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div style={s.root}>

        {/* Topbar */}
        <div style={s.topbar}>
          <div style={s.topbarLeft}>
            <div style={s.logoWrap}><i className="ti ti-sparkles" /></div>
            <button style={s.backBtn} onClick={() => navigate('/dashboard')}>
              <i className="ti ti-arrow-left" style={{ fontSize: 14 }} /> Back
            </button>
          </div>
          <div style={s.topbarRight}>
            <NotificationBell style={s.notifBtn} dotStyle={s.notifDot}/>
            <div style={s.avatarSmall}>
            {profile?.profilePicture?<img src={profile.profilePicture} alt="" style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}}/>:initials}
            </div>
          </div>
        </div>

        <div style={s.page}>

          {/* ── Main column ── */}
          <div>

            {/* Hero card */}
            <div style={s.card}>
              <div style={{...s.coverBg, background:profile?.bannerImage?`url(${profile.bannerImage}) center/cover` : s.coverBg.background, cursor:"pointer"}} onClick={()=>{
                if(isOwnProfile){
                  document.getElementById("bannerUpload").click();
                }
              }}><input type="file" accept="image/*" id="bannerUpload" style={{display:"none"}} onChange={handleBannerUpload}/><div style={s.coverPattern} /></div>
              <div style={s.heroBody}>
                <div style={s.heroAvatarWrap}><input type="file" accept="image/*" id="avatarUpload" style={{display:"none"}} onChange={handleAvatarUpload}/>
                  <div style={{...s.heroAvatar, cursor:"pointer", opacity : uploading?0.7 : 1}} onClick={()=>{
                    if(isOwnProfile){
                      document.getElementById("avatarUpload").click();
                    }
                  }}>
                    {profile?.profilePicture?(<img src={profile.profilePicture} alt="avatar" style={{ width:"100%", height:"100%", borderRadius:"50%", objectFit:"cover"}}/>) : (initials)}
                    {uploading && (<div style={{position:"absolute", bottom:-28, left:"50%", transform: "translateX(-50%)", fontSize:11, color:"#aaa"}}>Uploading...</div>)}
                    <div style={s.onlineDot} />
                  </div>
                </div>

                {/* Action buttons */}
                <div style={s.heroTopRow}>
                  {isOwnProfile && (
                  <>
                  <button style={s.editBtn}
                  onClick={() => {
                    if(editing){
                      setForm({
                        firstName:
                        profile?.firstName || '',
                        lastName:
                        profile?.lastName || '',
                        bio:
                        profile?.bio || '',
                        location:
                        profile?.location || '',
                        website:
                        profile?.website || '',
                        isPrivate:
                        profile?.isPrivate || false
                      });
                    }
                    setEditing(!editing);}}><i className="ti ti-pencil" style={{ fontSize:14 }}/>{editing?'Cancel' : 'Edit profile'}</button>
                  {editing && (
                    <button style={s.saveBtn} onClick={updateProfile}>
                      <i className="ti ti-check" style={{ fontSize: 14 }} /> Save changes
                    </button>
                  )}
                  </>
                  )}
                  {!editing&&followStatus!=="SELF"&&(
                  <button style={s.connectBtn} onClick={handleFollow} disabled={followLoading}>
                  <i className="ti ti-user-plus" style={{fontSize:14}}/>
                  {followLoading?"Loading...":followStatus==="FOLLOWING"?"Following":followStatus==="PENDING"?"Requested":"Follow"}
                  </button>
                  )}
                </div>

                {/* Name */}
                {editing ? (
                  <div style={s.nameRow}>
                    <input
                      style={editInput({ flex: 1 })}
                      value={form.firstName}
                      placeholder="First name"
                      onChange={e => setForm({ ...form, firstName: e.target.value })}
                    />
                    <input
                      style={editInput({ flex: 1 })}
                      value={form.lastName}
                      placeholder="Last name"
                      onChange={e => setForm({ ...form, lastName: e.target.value })}
                    />
                  </div>
                ) : (
                  <div style={s.heroName}>{profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : profile?.username}</div>
                )}

                <div style={s.heroHandle}>@{profile?.username}</div>

                {/* Bio */}
                {editing ? (
                  <textarea
                    style={editInput({ minHeight: 100, resize: 'vertical', lineHeight: 1.6, marginBottom: '0.875rem' })}
                    value={form.bio}
                    placeholder="Write a bio..."
                    onChange={e => setForm({ ...form, bio: e.target.value })}
                  />
                ) : (
                  <div style={s.heroBio}>{profile?.bio || 'No bio added yet.'}</div>
                )}

                {/* Meta row */}
                <div style={s.heroMeta}>
                  <span style={s.metaItem}>
                    <i className="ti ti-map-pin" style={{ fontSize: 13 }} />
                    {editing
                      ? <input style={editInput({ width: 140, padding: '6px 10px', fontSize: 13 })} value={form.location} placeholder="Location" onChange={e => setForm({ ...form, location: e.target.value })} />
                      : (profile?.location || 'No location')}
                  </span>
                  <span style={s.metaItem}>
                    <i className="ti ti-link" style={{ fontSize: 13 }} />
                    {editing
                      ? <input style={editInput({ width: 180, padding: '6px 10px', fontSize: 13 })} value={form.website} placeholder="Website URL" onChange={e => setForm({ ...form, website: e.target.value })} />
                      : (profile?.website || 'No website')}
                  </span>
                  {editing ? (
                    <div style={s.toggleRow} onClick={() => setForm({ ...form, isPrivate: !form.isPrivate })}>
                      <div style={s.toggleTrack(form.isPrivate)}>
                        <div style={s.toggleThumb(form.isPrivate)} />
                      </div>
                      <span style={s.toggleLabel}>Private account</span>
                    </div>
                  ) : (
                    <span style={s.metaItem}>
                      <i className="ti ti-briefcase" style={{ fontSize: 13 }} />
                      {profile?.isPrivate ? 'Private account' : 'Public account'}
                    </span>
                  )}
                  <span style={s.metaItem}>
                    <i className="ti ti-calendar" style={{ fontSize: 13 }} />
                    Joined {new Date(profile?.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>

                {/* Stats */}
                <div style={s.statsRow}>
                  {[
                    [String(followerCount),'Followers'],
                    [String(followingCount),'Following'],
                    [String(posts.length),'Posts'],
                    ['1.2K','Impressions']].map(([n, l]) => (
                    <div
                    key={l}
                    style={s.statItem}
                    onClick={()=>{
                      if(l==="Followers") setShowFollowers(true);
                      if(l==="Following") setShowFollowing(true);
                    }}
                    >
                      <span style={s.statNum}>{n}</span>
                      <span style={s.statLbl}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {isOwnProfile && (
              <CreatePost
                onPostCreated={handlePostCreated}
              />
            )}
            {/* About */}
            <div style={s.card}>
              <div style={s.section}>
                <div style={s.sectionTitle}>About <button style={s.editIconBtn}><i className="ti ti-pencil" /></button></div>
                <div style={s.aboutText}>
                  I'm a full-stack developer who loves building products from scratch. Currently focused on web apps using React and Node.js. I believe in shipping fast, learning in public, and writing clean, maintainable code.
                  <br /><br />
                  When I'm not coding, I'm writing about what I've learned or helping others debug their projects.
                </div>
              </div>
            </div>

            {/* Skills */}
            <div style={s.card}>
              <div style={s.section}>
                <div style={s.sectionTitle}>Skills <button style={s.editIconBtn}><i className="ti ti-pencil" /></button></div>
                <div style={s.skillsWrap}>
                  {SKILLS.map(sk => <span key={sk} style={s.skillTag}>{sk}</span>)}
                </div>
              </div>
            </div>

            {/* Posts / Bookmarks / Reposts */}
            <div style={s.card}>
              <div style={{ padding: '1.25rem 1.5rem 0.75rem', borderBottom: `1px solid ${C.border}` }}>
                <div style={s.tabRow}>
                  <button style={s.tabBtn(activeTab==="posts")} onClick={()=>setActiveTab("posts")}>Posts</button>
                  <button style={s.tabBtn(activeTab==="bookmarks")} onClick={()=>setActiveTab("bookmarks")}>Bookmarks</button>
                  <button style={s.tabBtn(activeTab==="reposts")} onClick={()=>setActiveTab("reposts")}>Reposts</button>
                </div>
              </div>

              {activeTab==="posts" && posts.map(post=>(
                <div
                  key={post.id}
                  style={{
                    borderBottom:`1px solid ${C.border}`
                  }}
                >
                  <PostCard
                    post={post}
                    currentUserId={profile?.id}
                    onDelete={
                      isOwnProfile
                        ? handleDeletePost
                        : undefined
                    }
                  />
                </div>
              ))}

              {activeTab==="bookmarks" && bookmarks.map(post=>(
                <div
                  key={post.id}
                  style={{
                    borderBottom:`1px solid ${C.border}`
                  }}
                >
                  <PostCard
                    post={post}
                    currentUserId={profile?.id}
                  />
                </div>
              ))}

              {activeTab==="reposts" && reposts.map(post=>(
                <div
                  key={post.id}
                  style={{
                    borderBottom:`1px solid ${C.border}`
                  }}
                >
                  <PostCard
                    post={post}
                    currentUserId={profile?.id}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* ── Right sidebar ── */}
          <div>

            {/* Contact info */}
            <div style={s.card}>
              <div style={s.sideCard}>
                <div style={s.sideTitle}>Contact info</div>
                {[
                  { ico: 'ti-mail', label: profile?.email || 'No email' },
                  { ico: 'ti-link', label: profile?.website || 'No website' },
                  { ico: 'ti-user', label: profile?.username ? `@${profile.username}` : 'No username' },
                ].map(({ ico, label }) => (
                  <div key={label} style={s.infoRow}>
                    <div style={s.infoIcon}><i className={`ti ${ico}`} /></div>
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* People also follow */}
            <div style={s.card}>
              <div style={s.sideCard}>
                <div style={s.sideTitle}>People also follow</div>
                {MUTUAL.map((u, i) => (
                  <div key={u.name} style={{ ...s.sideItem, borderBottom: i < MUTUAL.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                    <div style={s.sideAvatar(u.c1, u.c2)}>{u.initials}</div>
                    <div>
                      <div style={s.sideName}>{u.name}</div>
                      <div style={s.sideSub}>{u.sub}</div>
                    </div>
                    <button style={s.followBtn(followed[u.name])} onClick={() => toggleFollow(u.name)}>
                      {followed[u.name] ? 'Following' : 'Follow'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div style={s.card}>
              <div style={s.sideCard}>
                <div style={s.sideTitle}>Activity this week</div>
                {[
                  { ico: 'ti-eye', label: 'Profile views', val: '142' },
                  { ico: 'ti-trending-up', label: 'Post impressions', val: '1.2K' },
                  { ico: 'ti-users', label: 'New followers', val: '18' },
                ].map(({ ico, label, val }) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                    <div style={s.infoIcon}><i className={`ti ${ico}`} style={{ color: C.accent }} /></div>
                    <div style={{ flex: 1, fontSize: 13, color: C.textSub }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
          {showFollowers&&(
          <div style={s.modalOverlay} onClick={()=>setShowFollowers(false)}>
          <div style={s.modal} onClick={e=>e.stopPropagation()}>

          <div style={s.modalHeader}>
          <div style={s.modalTitle}>Followers</div>
          <button style={s.modalClose} onClick={()=>setShowFollowers(false)}>
          ✕
          </button>
          </div>

          {followers.map(item=>(
          <div
            key={item.follower.id}
            style={{
              ...s.userRow,
              cursor:"pointer"
            }}
            onClick={()=>{
              setShowFollowers(false);
              navigate(`/profile/${item.follower.username}`);
            }}
          >
          {item.follower.profilePicture?(
          <img
          src={item.follower.profilePicture}
          alt=""
          style={s.userAvatar}
          />
          ):(
          <div style={{
          width:42,
          height:42,
          borderRadius:'50%',
          background:'linear-gradient(135deg,#a855f7,#ec4899)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontWeight:700
          }}>
          {item.follower.username?.[0]?.toUpperCase()}
          </div>
          )}

          <div style={s.userInfo}>
          <div>{item.follower.firstName||item.follower.username}</div>
          <div style={{fontSize:12,color:C.textMuted}}>
          @{item.follower.username}
          </div>
          </div>
          </div>
          ))}

          </div>
          </div>
          )}

          {showFollowing&&(
          <div style={s.modalOverlay} onClick={()=>setShowFollowing(false)}>
          <div style={s.modal} onClick={e=>e.stopPropagation()}>

          <div style={s.modalHeader}>
          <div style={s.modalTitle}>Following</div>
          <button style={s.modalClose} onClick={()=>setShowFollowing(false)}>
          ✕
          </button>
          </div>

          {following.map(item=>(
          <div
            key={item.following.id}
            style={{
              ...s.userRow,
              cursor:"pointer"
            }}
            onClick={()=>{
              setShowFollowing(false);
              navigate(`/profile/${item.following.username}`);
            }}
          >
          {item.following.profilePicture?(
          <img
          src={item.following.profilePicture}
          alt=""
          style={s.userAvatar}
          />
          ):(
          <div style={{
          width:42,
          height:42,
          borderRadius:'50%',
          background:'linear-gradient(135deg,#a855f7,#ec4899)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          fontWeight:700
          }}>
          {item.following.username?.[0]?.toUpperCase()}
          </div>
          )}

          <div style={s.userInfo}>
          <div>{item.following.firstName||item.following.username}</div>
          <div style={{fontSize:12,color:C.textMuted}}>
          @{item.following.username}
          </div>
          </div>
          </div>
          ))}

          </div>
          </div>
          )}

        </div>
      </div>
    </>
  );
}
export default Profile;