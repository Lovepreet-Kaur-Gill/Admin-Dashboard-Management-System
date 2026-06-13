import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  {
    label: 'Main',
    items: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        ),
      },
      {
        to: '/users',
        label: 'Users',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
          </svg>
        ),
      },
      {
        to: '/projects',
        label: 'Projects',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        ),
      },
      {
        to: '/tasks',
        label: 'Tasks',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'System',
    items: [
      {
        to: '/analytics',
        label: 'Analytics',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        ),
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2"/>
          </svg>
        ),
      },
    ],
  },
];

const s = {
  sidebar: {
    width: '220px',
    minWidth: '220px',
    height: '100vh',
    background: 'var(--surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    overflowY: 'auto',
    transition: 'transform 280ms ease',
    zIndex: 100,
  },
  sidebarMobile: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    boxShadow: '4px 0 24px rgba(0,0,0,0.10)',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '20px 16px 18px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  logoMark: {
    width: '30px',
    height: '30px',
    background: 'var(--accent)',
    borderRadius: '7px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '10px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
  },
  nav: {
    flex: 1,
    padding: '12px 10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  group: {},
  groupLabel: {
    fontSize: '10px',
    fontWeight: '600',
    color: 'var(--text-muted)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    padding: '0 8px',
    marginBottom: '4px',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '6px',
    fontSize: '13.5px',
    fontWeight: '450',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'background var(--transition), color var(--transition)',
    letterSpacing: '-0.01em',
  },
  navLinkActive: {
    background: 'var(--surface-2)',
    color: 'var(--text-primary)',
    fontWeight: '500',
  },
  footer: {
    padding: '12px 10px',
    borderTop: '1px solid var(--border)',
    flexShrink: 0,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '8px 10px',
    borderRadius: '6px',
    fontSize: '13.5px',
    fontWeight: '450',
    color: 'var(--text-secondary)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    fontFamily: 'var(--font)',
    transition: 'background var(--transition), color var(--transition)',
    letterSpacing: '-0.01em',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 99,
  },
};

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();

  const sidebarStyle = {
    ...s.sidebar,
    ...(mobileOpen !== undefined ? s.sidebarMobile : {}),
    ...(mobileOpen === false ? { transform: 'translateX(-100%)' } : {}),
  };

  return (
    <>
      {mobileOpen && <div style={s.overlay} onClick={onClose} />}
      <aside style={sidebarStyle}>
        <div style={s.brand}>
          <div style={s.logoMark}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <div style={s.brandName}>AdminBase</div>
            <div style={s.brandSub}>Dashboard</div>
          </div>
        </div>

        <nav style={s.nav}>
          {NAV_ITEMS.map((group) => (
            <div key={group.label} style={s.group}>
              <div style={s.groupLabel}>{group.label}</div>
              <ul style={s.navList}>
                {group.items.map((item) => {
                  const active = location.pathname === item.to;
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={onClose}
                        style={{ ...s.navLink, ...(active ? s.navLinkActive : {}) }}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-primary)'; } }}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; } }}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div style={s.footer}>
          <button
            style={s.logoutBtn}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--error)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
