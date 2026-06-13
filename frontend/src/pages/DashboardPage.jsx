import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

/* ─── Stat Cards data ─── */
const STATS = [
  {
    key: 'users',
    label: 'Total Users',
    value: 4821,
    change: '+12%',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    key: 'projects',
    label: 'Total Projects',
    value: 138,
    change: '+5%',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
      </svg>
    ),
  },
  {
    key: 'tasks',
    label: 'Total Tasks',
    value: 2047,
    change: '-3%',
    up: false,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    key: 'completed',
    label: 'Completed Tasks',
    value: 1563,
    change: '+18%',
    up: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4"/>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
      </svg>
    ),
  },
];

/* ─── Activity data ─── */
const ACTIVITIES = [
  { id: 1, type: 'user',    text: 'New user registered', sub: 'sarah.kim@example.com joined the platform', time: '2 min ago', color: '#3B82F6' },
  { id: 2, type: 'task',    text: 'Task marked complete', sub: '"Redesign onboarding flow" in Project Apollo', time: '14 min ago', color: '#10B981' },
  { id: 3, type: 'project', text: 'New project created', sub: '"Project Titan" created by Mark Johnson', time: '1 hr ago', color: '#8B5CF6' },
  { id: 4, type: 'task',    text: 'Task overdue', sub: '"API integration" in Project Helios is past due', time: '2 hr ago', color: '#F59E0B' },
  { id: 5, type: 'user',    text: 'User role updated', sub: 'alex.patel@example.com promoted to Admin', time: '3 hr ago', color: '#3B82F6' },
  { id: 6, type: 'project', text: 'Project completed', sub: '"Project Nova" marked as done by the team', time: '5 hr ago', color: '#10B981' },
  { id: 7, type: 'task',    text: 'New task assigned', sub: '"Write release notes" assigned to Dana Mills', time: 'Yesterday', color: '#6B7280' },
];

/* ─── Active Projects ─── */
const PROJECTS = [
  { name: 'Project Apollo', tasks: 24, done: 18, members: 5, status: 'On track' },
  { name: 'Project Helios', tasks: 31, done: 14, members: 8, status: 'At risk' },
  { name: 'Project Nova',   tasks: 19, done: 19, members: 3, status: 'Completed' },
  { name: 'Project Titan',  tasks: 12, done: 3,  members: 6, status: 'On track' },
];

const STATUS_COLORS = {
  'On track':  { bg: '#F0FDF4', color: '#15803D', dot: '#22C55E' },
  'At risk':   { bg: '#FFFBEB', color: '#92400E', dot: '#F59E0B' },
  'Completed': { bg: '#F0F9FF', color: '#075985', dot: '#0EA5E9' },
};

/* ─── Counter animation hook ─── */
function useCount(target, duration = 900) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

/* ─── Sub-components ─── */
function StatCard({ label, value, change, up, icon }) {
  const count = useCount(value);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'box-shadow var(--transition), transform var(--transition)',
        boxShadow: hovered ? 'var(--shadow-md)' : 'var(--shadow)',
        transform: hovered ? 'translateY(-1px)' : 'none',
        cursor: 'default',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12.5px', fontWeight: '500', color: 'var(--text-secondary)', letterSpacing: '-0.01em' }}>{label}</span>
        <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{icon}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-mono)' }}>
          {count.toLocaleString()}
        </span>
        <span style={{
          fontSize: '11.5px',
          fontWeight: '500',
          color: up ? '#15803D' : '#B91C1C',
          background: up ? '#F0FDF4' : '#FEF2F2',
          padding: '3px 7px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}>
          {up ? '↑' : '↓'} {change}
        </span>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>vs last month</div>
    </div>
  );
}

function ActivityItem({ type, text, sub, time, color, last }) {
  return (
    <div style={{
      display: 'flex',
      gap: '13px',
      paddingBottom: last ? 0 : '16px',
      borderBottom: last ? 'none' : '1px solid var(--border)',
      marginBottom: last ? 0 : '16px',
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        background: color + '15',
        border: `1.5px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        color,
        marginTop: '1px',
      }}>
        {type === 'user' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        )}
        {type === 'task' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
        )}
        {type === 'project' && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '2px' }}>{text}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</div>
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', flexShrink: 0, fontFamily: 'var(--font-mono)', paddingTop: '2px' }}>{time}</span>
    </div>
  );
}

function ProgressBar({ value, total, color = 'var(--accent)' }) {
  const pct = Math.round((value / total) * 100);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ flex: 1, height: '5px', background: 'var(--surface-2)', borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '99px', transition: 'width 600ms ease' }} />
      </div>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: '28px', textAlign: 'right' }}>{pct}%</span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function DashboardPage() {
  const completedPct = Math.round((1563 / 2047) * 100);

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1200px' }}>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
          gap: '16px',
        }}>
          {STATS.map(({ key, ...rest }) => <StatCard key={key} {...rest} />)}
        </div>

        {/* Task Completion Banner */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow)',
        }}>
          <div style={{ flex: 1, minWidth: '180px' }}>
            <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Overall Task Completion
            </div>
            <ProgressBar value={1563} total={2047} color="#1A1A1A" />
          </div>
          <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
            {[
              { label: 'Completed', value: '1,563', color: '#15803D' },
              { label: 'In Progress', value: '342', color: '#B45309' },
              { label: 'Pending', value: '142', color: '#6B7280' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '17px', fontWeight: '700', color: item.color, fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}>{item.value}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom grid: Activity + Projects */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px', alignItems: 'start' }}>

          {/* Recent Activities */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Recent Activity</span>
              <button style={{
                fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font)', padding: '2px 6px', borderRadius: '4px',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                View all
              </button>
            </div>
            <div style={{ padding: '16px 20px' }}>
              {ACTIVITIES.map((a, i) => (
                <ActivityItem key={a.id} {...a} last={i === ACTIVITIES.length - 1} />
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow)',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>Active Projects</span>
              <button style={{
                fontSize: '12px', color: 'var(--text-muted)', background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'var(--font)', padding: '2px 6px', borderRadius: '4px',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-2)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                View all
              </button>
            </div>
            <div style={{ padding: '12px 0' }}>
              {PROJECTS.map((p, i) => {
                const sc = STATUS_COLORS[p.status];
                return (
                  <div
                    key={p.name}
                    style={{
                      padding: '12px 20px',
                      borderBottom: i < PROJECTS.length - 1 ? '1px solid var(--border)' : 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-primary)' }}>{p.name}</span>
                      <span style={{
                        fontSize: '11px', fontWeight: '500',
                        color: sc.color, background: sc.bg,
                        padding: '2px 8px', borderRadius: '20px',
                        display: 'flex', alignItems: 'center', gap: '4px',
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                        {p.status}
                      </span>
                    </div>
                    <ProgressBar value={p.done} total={p.tasks} color={p.status === 'At risk' ? '#F59E0B' : p.status === 'Completed' ? '#0EA5E9' : '#1A1A1A'} />
                    <div style={{ display: 'flex', gap: '14px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--text-secondary)' }}>{p.done}</span>/{p.tasks} tasks
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '500', color: 'var(--text-secondary)' }}>{p.members}</span> members
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
