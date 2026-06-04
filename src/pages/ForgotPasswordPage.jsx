import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import Input from '../components/Input';

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  button: {
    width: '100%',
    height: '44px',
    background: 'var(--accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius)',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'var(--font)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background var(--transition)',
    letterSpacing: '-0.01em',
  },
  spinner: {
    width: '14px',
    height: '14px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  sentState: {
    textAlign: 'center',
    padding: '8px 0 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  sentIcon: {
    width: '48px',
    height: '48px',
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#16A34A',
  },
  sentTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  sentText: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    maxWidth: '280px',
  },
  backRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '4px',
  },
  backLink: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'color var(--transition)',
  },
  hint: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    lineHeight: '1.5',
    padding: '10px 12px',
    background: 'var(--surface-2)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
  },
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <AuthLayout
        heading={sent ? '' : 'Reset your password'}
        subheading={sent ? '' : 'Enter your email and we\'ll send you a reset link.'}
        footer={null}
      >
        {sent ? (
          <div style={styles.sentState}>
            <div style={styles.sentIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 13V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12c0 1.1.9 2 2 2h8"/>
                <path d="M22 7l-10 7L2 7"/>
                <path d="M16 19h6M19 16l3 3-3 3"/>
              </svg>
            </div>
            <div>
              <div style={styles.sentTitle}>Check your inbox</div>
            </div>
            <p style={styles.sentText}>
              We sent a password reset link to <strong>{email}</strong>. It expires in 30 minutes.
            </p>
            <div style={{ ...styles.divider, width: '100%', margin: '4px 0' }} />
            <Link
              to="/login"
              style={styles.backLink}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"/>
                <polyline points="12 19 5 12 12 5"/>
              </svg>
              Back to sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form} noValidate>
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={error}
              autoComplete="email"
            />

            <div style={styles.hint}>
              We'll send a secure link to this address. Check your spam folder if you don't see it within a few minutes.
            </div>

            <div style={styles.divider} />

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                background: btnHover && !loading ? 'var(--accent-hover)' : 'var(--accent)',
              }}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? (
                <>
                  <span style={styles.spinner} />
                  Sending reset link…
                </>
              ) : (
                <>
                  Send reset link
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </button>

            <div style={styles.backRow}>
              <Link
                to="/login"
                style={styles.backLink}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </AuthLayout>
    </>
  );
}
