import { useState, useEffect } from "react";

const NAV_LINKS = ["Explore", "People", "Trending", "About"];

const FEATURES = [
  {
    icon: "🔥",
    title: "Trending posts",
    desc: "Discover what's buzzing in your circles right now.",
  },
  {
    icon: "🔖",
    title: "Bookmarks",
    desc: "Save anything worth reading again — all in one place.",
  },
  {
    icon: "🔁",
    title: "Reposts",
    desc: "Amplify voices you believe in with a single tap.",
  },
  {
    icon: "🖼️",
    title: "Rich media",
    desc: "Share photos and stories the way they were meant to be seen.",
  },
];

const TESTIMONIALS = [
  {
    name: "Aanya Sharma",
    handle: "@aanya",
    avatar: "AS",
    text: "Finally a feed that shows me what I actually care about. The repost system is 🔥",
  },
  {
    name: "Rohan Mehta",
    handle: "@rohanm",
    avatar: "RM",
    text: "Clean, fast, and distraction-free. Switched from everything else.",
  },
  {
    name: "Priya Iyer",
    handle: "@priya_dev",
    avatar: "PI",
    text: "The bookmarks feature alone makes this worth it. Love the dark theme.",
  },
];

const STATS = [
  { value: "50K+", label: "Active users" },
  { value: "2M+", label: "Posts shared" },
  { value: "99.9%", label: "Uptime" },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles.root}>
      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <span style={styles.logo}>
            <span style={styles.logoDot}>●</span> sma
          </span>
          <div style={styles.navLinks}>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" style={styles.navLink}>
                {l}
              </a>
            ))}
          </div>
          <div style={styles.navActions}>
            <a href="/login" style={styles.btnGhost}>
              Sign in
            </a>
            <a href="/register" style={styles.btnPrimary}>
              Join free
            </a>
          </div>
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <a key={l} href="#" style={styles.mobileNavLink}>
                {l}
              </a>
            ))}
            <hr style={styles.mobileHr} />
            <a href="/login" style={styles.mobileNavLink}>
              Sign in
            </a>
            <a href="/register" style={{ ...styles.mobileNavLink, ...styles.mobileJoin }}>
              Join free
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <p style={styles.eyebrow}>Your community, your voice</p>
          <h1 style={styles.heroHeading}>
            Where real conversations
            <br />
            <span style={styles.heroAccent}>actually happen.</span>
          </h1>
          <p style={styles.heroSub}>
            Connect, share, and discover without the noise. sma is built for
            people who want depth over dopamine.
          </p>
          <div style={styles.heroCtas}>
            <a href="/register" style={styles.btnHero}>
              Get started — it's free
            </a>
            <a href="#features" style={styles.btnHeroGhost}>
              See how it works →
            </a>
          </div>
        </div>

        {/* Mock phone card */}
        <div style={styles.heroCard}>
          <MockFeed />
        </div>
      </section>

      {/* STATS */}
      <section style={styles.statsBar}>
        {STATS.map((s) => (
          <div key={s.label} style={styles.statItem}>
            <span style={styles.statValue}>{s.value}</span>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section id="features" style={styles.section}>
        <p style={styles.sectionEyebrow}>What you get</p>
        <h2 style={styles.sectionHeading}>Built for how you actually use social media</h2>
        <div style={styles.featureGrid}>
          {FEATURES.map((f) => (
            <div key={f.title} style={styles.featureCard}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h3 style={styles.featureTitle}>{f.title}</h3>
              <p style={styles.featureDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={styles.testimonialSection}>
        <p style={styles.sectionEyebrow}>What people say</p>
        <h2 style={styles.sectionHeading}>People who made the switch</h2>
        <div style={styles.testimonialGrid}>
          {TESTIMONIALS.map((t) => (
            <div key={t.handle} style={styles.testimonialCard}>
              <p style={styles.testimonialText}>"{t.text}"</p>
              <div style={styles.testimonialAuthor}>
                <div style={styles.avatar}>{t.avatar}</div>
                <div>
                  <p style={styles.authorName}>{t.name}</p>
                  <p style={styles.authorHandle}>{t.handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={styles.ctaBanner}>
        <div style={styles.ctaBannerGlow} />
        <h2 style={styles.ctaHeading}>Ready to join the conversation?</h2>
        <p style={styles.ctaSub}>No ads. No algorithms selling your attention. Just people.</p>
        <div style={styles.heroCtas}>
          <a href="/register" style={styles.btnHero}>
            Create your account
          </a>
          <a href="/login" style={styles.btnHeroGhost}>
            Already a member? Sign in
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span style={styles.logo}>
          <span style={styles.logoDot}>●</span> sma
        </span>
        <p style={styles.footerLinks}>
          <a href="#" style={styles.footerLink}>Privacy</a>
          {" · "}
          <a href="#" style={styles.footerLink}>Terms</a>
          {" · "}
          <a href="#" style={styles.footerLink}>Contact</a>
        </p>
        <p style={styles.footerCopy}>© 2026 sma. Made with purpose.</p>
      </footer>
    </div>
  );
}

/* ── Mock feed card ── */
function MockFeed() {
  const posts = [
    {
      id: 1,
      avatar: "DK",
      name: "Dev Kumar",
      handle: "@devkumar",
      time: "2m",
      text: "Just shipped the repost feature 🎉 This took way longer than expected but so worth it.",
      likes: 42,
      comments: 8,
    },
    {
      id: 2,
      avatar: "SR",
      name: "Sara Rao",
      handle: "@sara_r",
      time: "15m",
      text: "Hot take: dark mode isn't a feature, it's a human right. 🌙",
      likes: 128,
      comments: 23,
    },
  ];

  return (
    <div style={mockStyles.card}>
      <div style={mockStyles.header}>
        <span style={mockStyles.appName}>sma</span>
        <span style={mockStyles.bell}>🔔</span>
      </div>
      {posts.map((p) => (
        <div key={p.id} style={mockStyles.post}>
          <div style={mockStyles.postAvatar}>{p.avatar}</div>
          <div style={mockStyles.postBody}>
            <div style={mockStyles.postMeta}>
              <span style={mockStyles.postName}>{p.name}</span>
              <span style={mockStyles.postHandle}>{p.handle} · {p.time}</span>
            </div>
            <p style={mockStyles.postText}>{p.text}</p>
            <div style={mockStyles.postActions}>
              <span style={mockStyles.action}>♡ {p.likes}</span>
              <span style={mockStyles.action}>💬 {p.comments}</span>
              <span style={mockStyles.action}>↪ Repost</span>
            </div>
          </div>
        </div>
      ))}
      <div style={mockStyles.composeRow}>
        <div style={mockStyles.composeAvatar}>You</div>
        <div style={mockStyles.composePlaceholder}>What's on your mind?</div>
      </div>
    </div>
  );
}

/* ─────────── Styles ─────────── */

const purple = "#a87dff";
const purpleDark = "#8b5cf6";
const purpleDeep = "#6d42c9";
const bg = "#0d0d0f";
const surface = "#131318";
const surfaceRaised = "#1a1a23";
const border = "#2a2a3a";
const textPrimary = "#f0eeff";
const textSecondary = "#9e9bb5";
const textMuted = "#5e5b70";

const styles = {
  root: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    background: bg,
    color: textPrimary,
    minHeight: "100vh",
    overflowX: "hidden",
  },

  /* NAV */
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: "0 1.5rem",
    transition: "background 0.3s, border-bottom 0.3s",
  },
  navScrolled: {
    background: "rgba(13,13,15,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: `1px solid ${border}`,
  },
  navInner: {
    maxWidth: 1100,
    margin: "0 auto",
    height: 64,
    display: "flex",
    alignItems: "center",
    gap: "2rem",
  },
  logo: {
    fontSize: 20,
    fontWeight: 700,
    color: textPrimary,
    letterSpacing: "-0.5px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: 6,
    flexShrink: 0,
  },
  logoDot: { color: purple, fontSize: 14 },
  navLinks: {
    display: "flex",
    gap: "0.25rem",
    flex: 1,
  },
  navLink: {
    color: textSecondary,
    textDecoration: "none",
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 14,
    transition: "color 0.2s",
    "&:hover": { color: textPrimary },
  },
  navActions: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    marginLeft: "auto",
  },
  btnGhost: {
    color: textSecondary,
    textDecoration: "none",
    padding: "8px 18px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    transition: "color 0.2s",
  },
  btnPrimary: {
    background: purple,
    color: "#fff",
    textDecoration: "none",
    padding: "8px 20px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    transition: "background 0.2s",
  },
  hamburger: {
    display: "none",
    background: "none",
    border: "none",
    color: textPrimary,
    fontSize: 20,
    cursor: "pointer",
    marginLeft: "auto",
  },
  mobileMenu: {
    display: "flex",
    flexDirection: "column",
    paddingBottom: "1rem",
    background: "rgba(13,13,15,0.98)",
    borderBottom: `1px solid ${border}`,
  },
  mobileNavLink: {
    color: textSecondary,
    textDecoration: "none",
    padding: "12px 0",
    fontSize: 16,
    borderBottom: "none",
  },
  mobileJoin: {
    color: purple,
    fontWeight: 600,
  },
  mobileHr: {
    border: "none",
    borderTop: `1px solid ${border}`,
    margin: "8px 0",
  },

  /* HERO */
  hero: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4rem",
    maxWidth: 1100,
    margin: "0 auto",
    padding: "7rem 1.5rem 4rem",
    position: "relative",
  },
  heroGlow: {
    position: "absolute",
    top: "10%",
    left: "-10%",
    width: 500,
    height: 500,
    background: `radial-gradient(circle, ${purpleDeep}22 0%, transparent 70%)`,
    pointerEvents: "none",
  },
  heroContent: {
    flex: "1 1 460px",
    maxWidth: 560,
    position: "relative",
    zIndex: 1,
  },
  eyebrow: {
    fontSize: 13,
    fontWeight: 600,
    color: purple,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "1rem",
  },
  heroHeading: {
    fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: "-1.5px",
    margin: "0 0 1.25rem",
    color: textPrimary,
  },
  heroAccent: { color: purple },
  heroSub: {
    fontSize: "1.05rem",
    color: textSecondary,
    lineHeight: 1.7,
    margin: "0 0 2rem",
    maxWidth: 440,
  },
  heroCtas: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
  },
  btnHero: {
    background: purple,
    color: "#fff",
    textDecoration: "none",
    padding: "13px 28px",
    borderRadius: 10,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "-0.2px",
    transition: "background 0.2s, transform 0.15s",
  },
  btnHeroGhost: {
    color: textSecondary,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 500,
    transition: "color 0.2s",
  },

  heroCard: {
    flex: "0 0 auto",
    width: 320,
  },

  /* STATS */
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: "4rem",
    padding: "2.5rem 1.5rem",
    borderTop: `1px solid ${border}`,
    borderBottom: `1px solid ${border}`,
    background: surface,
    flexWrap: "wrap",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: 800,
    color: purple,
    letterSpacing: "-1px",
  },
  statLabel: {
    fontSize: 13,
    color: textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  /* SECTIONS */
  section: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "5rem 1.5rem",
    textAlign: "center",
  },
  sectionEyebrow: {
    fontSize: 12,
    fontWeight: 600,
    color: purple,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "0.75rem",
  },
  sectionHeading: {
    fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
    fontWeight: 800,
    letterSpacing: "-0.8px",
    marginBottom: "3rem",
    color: textPrimary,
  },

  /* FEATURES */
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.25rem",
    textAlign: "left",
  },
  featureCard: {
    background: surfaceRaised,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: "1.5rem",
    transition: "border-color 0.2s",
  },
  featureIcon: { fontSize: 28, display: "block", marginBottom: "0.75rem" },
  featureTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: textPrimary,
    margin: "0 0 0.5rem",
  },
  featureDesc: {
    fontSize: 14,
    color: textSecondary,
    lineHeight: 1.6,
    margin: 0,
  },

  /* TESTIMONIALS */
  testimonialSection: {
    background: surface,
    padding: "5rem 1.5rem",
    textAlign: "center",
  },
  testimonialGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "1.25rem",
    maxWidth: 1000,
    margin: "0 auto",
    textAlign: "left",
  },
  testimonialCard: {
    background: surfaceRaised,
    border: `1px solid ${border}`,
    borderRadius: 16,
    padding: "1.5rem",
  },
  testimonialText: {
    fontSize: 15,
    color: textPrimary,
    lineHeight: 1.65,
    marginBottom: "1.25rem",
  },
  testimonialAuthor: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: purpleDeep,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0,
  },
  authorName: { fontSize: 14, fontWeight: 600, margin: 0, color: textPrimary },
  authorHandle: { fontSize: 12, color: textMuted, margin: 0 },

  /* CTA BANNER */
  ctaBanner: {
    textAlign: "center",
    padding: "6rem 1.5rem",
    position: "relative",
    overflow: "hidden",
  },
  ctaBannerGlow: {
    position: "absolute",
    top: "0%",
    left: "50%",
    transform: "translateX(-50%)",
    width: 600,
    height: 300,
    background: `radial-gradient(circle, ${purpleDeep}30 0%, transparent 70%)`,
    pointerEvents: "none",
  },
  ctaHeading: {
    fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
    fontWeight: 800,
    letterSpacing: "-1px",
    marginBottom: "1rem",
    position: "relative",
  },
  ctaSub: {
    fontSize: "1.05rem",
    color: textSecondary,
    marginBottom: "2.5rem",
    position: "relative",
  },

  /* FOOTER */
  footer: {
    borderTop: `1px solid ${border}`,
    padding: "2rem 1.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  footerLinks: {
    fontSize: 13,
    color: textMuted,
    margin: 0,
  },
  footerLink: {
    color: textMuted,
    textDecoration: "none",
  },
  footerCopy: {
    fontSize: 13,
    color: textMuted,
    margin: 0,
  },
};

/* Mock feed card styles */
const mockStyles = {
  card: {
    background: surfaceRaised,
    border: `1px solid ${border}`,
    borderRadius: 20,
    overflow: "hidden",
    width: "100%",
    boxShadow: `0 0 60px ${purpleDeep}30`,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: `1px solid ${border}`,
    background: surface,
  },
  appName: {
    fontSize: 16,
    fontWeight: 800,
    color: textPrimary,
    letterSpacing: "-0.5px",
  },
  bell: { fontSize: 18 },
  post: {
    display: "flex",
    gap: 10,
    padding: "14px 16px",
    borderBottom: `1px solid ${border}`,
  },
  postAvatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: purpleDeep,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
  postBody: { flex: 1 },
  postMeta: { display: "flex", flexDirection: "column", gap: 2, marginBottom: 6 },
  postName: { fontSize: 13, fontWeight: 700, color: textPrimary },
  postHandle: { fontSize: 11, color: textMuted },
  postText: { fontSize: 13, color: textPrimary, lineHeight: 1.55, margin: "0 0 10px" },
  postActions: { display: "flex", gap: 14 },
  action: { fontSize: 11, color: textMuted, cursor: "pointer" },
  composeRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px",
  },
  composeAvatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: `${purple}44`,
    color: purple,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
  },
  composePlaceholder: {
    fontSize: 13,
    color: textMuted,
    background: `${border}66`,
    borderRadius: 8,
    padding: "8px 12px",
    flex: 1,
  },
};
