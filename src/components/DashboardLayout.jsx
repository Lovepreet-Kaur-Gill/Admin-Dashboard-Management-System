import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const MOBILE_BREAKPOINT = 768;

const s = {
  shell: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'var(--bg)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    minWidth: 0,
  },
  content: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px',
  },
};

export default function DashboardLayout({ pageTitle, children }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < MOBILE_BREAKPOINT);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const mobile = window.innerWidth < MOBILE_BREAKPOINT;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <div style={s.shell}>
      {/* Desktop sidebar — always visible */}
      {!isMobile && <Sidebar />}

      {/* Mobile sidebar — slide in/out */}
      {isMobile && (
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      )}

      <div style={s.main}>
        <Navbar
          pageTitle={pageTitle}
          isMobile={isMobile}
          onMenuToggle={() => setMobileOpen(o => !o)}
        />
        <main style={s.content}>
          {children}
        </main>
      </div>
    </div>
  );
}
