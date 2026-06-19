import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import LeftSidebar from "./LeftSidebar";
import RightSidebar from "./RightSidebar";
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
  root: {
    minHeight: '100vh',
    background: C.bg,
    fontFamily: "'Inter', sans-serif",
    color: C.text,
  },
  layout: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '1.25rem 1rem',
    display: 'grid',
    gridTemplateColumns: '260px minmax(0,1fr) 280px',
    gap: '1.25rem',
    alignItems: 'start',
  },
};

function AppLayout({
  children
}) {

  const navigate = useNavigate();
  const { user, loading } = useCurrentUser();

  const [activeNav, setActiveNav] = useState("home");
  const [followed, setFollowed] = useState({});

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  const toggleFollow = (name) => setFollowed(p => ({ ...p, [name]: !p[name] }));

  const initials =
    ((user?.firstName?.[0] || "") +
    (user?.lastName?.[0] || ""))
    .toUpperCase() ||
    user?.username?.[0]?.toUpperCase() ||
    "U";

  if (loading) return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css" />

      <div style={s.root}>

        <TopBar
          profile={user}
          initials={initials}
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          navigate={navigate}
        />

        <div style={s.layout}>

          <LeftSidebar
            profile={user}
            initials={initials}
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            logout={logout}
          />

          {children}

          <RightSidebar
            followed={followed}
            toggleFollow={toggleFollow}
          />

        </div>

      </div>
    </>
  );

}

export default AppLayout;
