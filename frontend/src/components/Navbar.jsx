import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const s = {
  navbar: {
    height: '56px',
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 50,
    flexShrink: 0,
  },
  menuBtn: {
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    width: '34px',
    height: '34px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    flexShrink: 0,
  },
  menuBtnMobile: {
    display: 'flex',
  },
  breadcrumb: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  pageTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
  },
  pageDate: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  iconBtn: {
    position: 'relative',
    width: '34px',
    height: '34px',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    background: 'none',
    cursor: 'pointer',
    color: 'var(--text-secondary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background var(--transition), color var(--transition)',
  },
  badge: {
    position: 'absolute',
    top: '6px',
    right: '6px',
    width: '6px',
    height: '6px',
    background: '#E74C3C',
    borderRadius: '50%',
    border: '1.5px solid var(--surface)',
  },
  divider: {
    width: '1px',
    height: '20px',
    background: 'var(--border)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'var(--surface-2)',
    border: '1.5px solid var(--border)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '600',
    color: 'var(--text-secondary)',
    letterSpacing: '0.02em',
    userSelect: 'none',
    flexShrink: 0,
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    boxShadow: 'var(--shadow-md)',
    minWidth: '180px',
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownHeader: {
    padding: '12px 14px 10px',
    borderBottom: '1px solid var(--border)',
  },
  dropdownName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-primary)',
  },
  dropdownEmail: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    marginTop: '1px',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '9px 14px',
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    width: '100%',
    fontFamily: 'var(--font)',
    transition: 'background var(--transition)',
  },
};

function formatDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Navbar({ pageTitle = 'Dashboard', onMenuToggle, isMobile }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={s.navbar}>
      {isMobile && (
        <button
          style={{ ...s.menuBtn, ...s.menuBtnMobile }}
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      )}

      <div style={s.breadcrumb}>
        <span style={s.pageTitle}>{pageTitle}</span>
        <span style={s.pageDate}>{formatDate()}</span>
      </div>

      <div style={s.actions}>
        {/* Search */}
        <button
          style={s.iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          aria-label="Search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>

        {/* Notifications */}
        <button
          style={s.iconBtn}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          aria-label="Notifications"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          <span style={s.badge} />
        </button>

        <div style={s.divider} />

        {/* Avatar + Dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <div
            style={s.avatar}
            onClick={() => setDropdownOpen(o => !o)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setDropdownOpen(o => !o)}
          >
            JD
          </div>
          {dropdownOpen && (
            <div style={s.dropdown}>
              <div style={s.dropdownHeader}>
                <div style={s.dropdownName}>John Doe</div>
                <div style={s.dropdownEmail}>john@company.com</div>
              </div>
              {[
                { label: 'Profile', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                { label: 'Settings', icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/></svg> },
              ].map(item => (
                <button
                  key={item.label}
                  style={s.dropdownItem}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  {item.icon}{item.label}
                </button>
              ))}
              <div style={{ height: '1px', background: 'var(--border)' }} />
              <Link
                to="/login"
                style={{ ...s.dropdownItem, color: 'var(--error)', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--error-bg)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign out
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
