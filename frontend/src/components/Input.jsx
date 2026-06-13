import React, { useState } from 'react';

const styles = {
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: 'var(--text-secondary)',
    letterSpacing: '0.01em',
  },
  wrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: '44px',
    padding: '0 12px',
    border: '1.5px solid var(--border)',
    borderRadius: 'var(--radius)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontFamily: 'var(--font)',
    outline: 'none',
    transition: 'border-color var(--transition), box-shadow var(--transition)',
  },
  inputWithAction: {
    paddingRight: '44px',
  },
  action: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--text-muted)',
    transition: 'color var(--transition)',
    borderRadius: '4px',
  },
  error: {
    fontSize: '12px',
    color: 'var(--error)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
};

export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  toggleable = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = toggleable ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={styles.group}>
      {label && <label style={styles.label}>{label}</label>}
      <div style={styles.wrapper}>
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.input,
            ...(toggleable ? styles.inputWithAction : {}),
            borderColor: error
              ? 'var(--error)'
              : focused
              ? 'var(--border-focus)'
              : 'var(--border)',
            boxShadow: focused && !error
              ? '0 0 0 3px rgba(26,26,26,0.06)'
              : error
              ? '0 0 0 3px rgba(192,57,43,0.08)'
              : 'none',
          }}
        />
        {toggleable && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={styles.action}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            )}
          </button>
        )}
      </div>
      {error && (
        <span style={styles.error}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {error}
        </span>
      )}
    </div>
  );
}
