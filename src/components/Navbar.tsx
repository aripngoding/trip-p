import React from 'react';

interface NavbarProps {
  activeTab: 'dashboard' | 'planner' | 'explore';
  setActiveTab: (tab: 'dashboard' | 'planner' | 'explore') => void;
  hasActiveTrip: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, hasActiveTrip }) => {
  return (
    <nav style={styles.nav}>
      <div style={styles.container}>
        <div style={styles.logo} onClick={() => setActiveTab('dashboard')}>
          <svg style={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-1.1.1-1.3.6l-.3.7c-.2.5-.1 1.1.4 1.4L10 12l-3 3-2.5-.5c-.4-.1-.8.1-1 .4l-.3.5c-.2.4-.1.9.3 1.1L7 18l1.2 3.6c.2.4.7.5 1.1.3l.5-.3c.3-.2.5-.6.4-1L9.7 17l3-3 3.1 6.2c.3.5.9.6 1.4.4l.7-.3c.5-.2.7-.8.6-1.3Z" />
          </svg>
          <span style={styles.logoText}>Trip<span style={styles.logoHighlight}>Flow</span></span>
        </div>
        <div style={styles.menu}>
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`btn-nav ${activeTab === 'dashboard' ? 'active' : ''}`}
            style={{...styles.navItem, ...(activeTab === 'dashboard' ? styles.navItemActive : {})}}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            Dashboard
          </button>
          
          <button 
            onClick={() => setActiveTab('planner')} 
            className={`btn-nav ${activeTab === 'planner' ? 'active' : ''}`}
            style={{
              ...styles.navItem, 
              ...(activeTab === 'planner' ? styles.navItemActive : {}),
              ...(!hasActiveTrip ? styles.disabledItem : {})
            }}
            disabled={!hasActiveTrip}
            title={!hasActiveTrip ? "Pilih atau buat trip terlebih dahulu di Dashboard" : "Rencana Perjalanan"}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            Trip Planner
            {!hasActiveTrip && <span style={styles.lockBadge}>🔒</span>}
          </button>

          <button 
            onClick={() => setActiveTab('explore')} 
            className={`btn-nav ${activeTab === 'explore' ? 'active' : ''}`}
            style={{...styles.navItem, ...(activeTab === 'explore' ? styles.navItemActive : {})}}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
            </svg>
            Explore
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: 72,
    background: 'rgba(8, 12, 20, 0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    zIndex: 900,
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
  },
  container: {
    maxWidth: 1400,
    width: '100%',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
    userSelect: 'none',
  },
  logoIcon: {
    width: 28,
    height: 28,
    color: '#00f2fe',
    filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.4))',
  },
  logoText: {
    fontFamily: 'var(--font-heading)',
    fontSize: 22,
    fontWeight: 800,
    color: '#f8fafc',
    letterSpacing: '-0.5px',
  },
  logoHighlight: {
    background: 'var(--gradient-cyan-blue)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  menu: {
    display: 'flex',
    gap: 8,
  },
  navItem: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 18px',
    background: 'transparent',
    border: 'none',
    borderRadius: '12px',
    color: 'var(--text-secondary)',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    position: 'relative',
  },
  navItemActive: {
    color: '#00f2fe',
    background: 'rgba(0, 242, 254, 0.08)',
  },
  disabledItem: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  navIcon: {
    width: 18,
    height: 18,
  },
  lockBadge: {
    fontSize: 10,
    marginLeft: 4,
  }
};
