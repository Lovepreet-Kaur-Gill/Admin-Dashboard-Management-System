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
  forgotRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '-8px',
  },
  forgotLink: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color var(--transition)',
  },
  divider: {
    height: '1px',
    background: 'var(--border)',
    margin: '4px 0',
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
    transition: 'background var(--transition), transform 80ms ease, opacity var(--transition)',
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
  successBanner: {
    background: '#F0FDF4',
    border: '1px solid #BBF7D0',
    borderRadius: 'var(--radius)',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#166534',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  signupRow: {
    textAlign: 'center',
    fontSize: '13px',
    color: 'var(--text-muted)',
    marginTop: '4px',
  },
  link: {
    color: 'var(--text-primary)',
    fontWeight: '500',
    textDecoration: 'none',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email address';
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'Password must be at least 6 characters';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <AuthLayout
        heading="Welcome back"
        subheading="Sign in to your admin account to continue."
        footer={
          <span>
            Don't have an account?{' '}
            <Link to="#" style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              Contact support
            </Link>
          </span>
        }
      >
        {success && (
          <div style={{ ...styles.successBanner, marginBottom: '16px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Signed in successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form} noValidate>
          <Input
            label="Email address"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={errors.email}
            autoComplete="email"
          />

          <div>
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
              toggleable
            />
            <div style={styles.forgotRow}>
              <Link
                to="/forgot-password"
                style={styles.forgotLink}
                onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
                onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div style={styles.divider} />

          <button
            type="submit"
            disabled={loading || success}
            style={{
              ...styles.button,
              background: btnHover && !loading && !success ? 'var(--accent-hover)' : 'var(--accent)',
              opacity: success ? 0.7 : 1,
            }}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            {loading ? (
              <>
                <span style={styles.spinner} />
                Signing in…
              </>
            ) : success ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Signed in
              </>
            ) : (
              <>
                Sign in
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </>
            )}
          </button>
        </form>
      </AuthLayout>
    </>
  );
}
