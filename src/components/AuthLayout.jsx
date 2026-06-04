import React from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 16px',
    background: 'var(--bg)',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '40px',
  },
  logoMark: {
    width: '32px',
    height: '32px',
    background: 'var(--accent)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  brandName: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  brandSub: {
    fontSize: '11px',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-mono)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '32px',
    boxShadow: 'var(--shadow)',
  },
  heading: {
    fontSize: '20px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.02em',
    marginBottom: '6px',
  },
  subheading: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '28px',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '12px',
    color: 'var(--text-muted)',
  },
};

export default function AuthLayout({ heading, subheading, children, footer }) {
  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.brand}>
          <div style={styles.logoMark}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
          </div>
          <div>
            <div style={styles.brandName}>AdminBase</div>
            <div style={styles.brandSub}>Dashboard</div>
          </div>
        </div>

        <div style={styles.card}>
          <h1 style={styles.heading}>{heading}</h1>
          {subheading && <p style={styles.subheading}>{subheading}</p>}
          {children}
        </div>

        {footer && <div style={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
}
