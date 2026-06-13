import React, { useState, useMemo, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const ROLES    = ['Admin', 'User'];
const STATUSES = ['Active', 'Inactive'];
const EMPTY_FORM = { name: '', email: '', phone: '', role: 'User', status: 'Active' };

function initials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}
function avatarColor(name) {
  const palette = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#84CC16','#F97316'];
  let h = 0;
  for (let c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffffffff;
  return palette[Math.abs(h) % palette.length];
}
function validate(form) {
  const errs = {};
  if (!form.name.trim())                               errs.name  = 'Full name is required';
  if (!form.email.trim())                              errs.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(form.email))          errs.email = 'Enter a valid email';
  if (!form.phone.trim())                              errs.phone = 'Phone number is required';
  else if (!/^\+?[\d\s()\-]{7,20}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
  return errs;
}

/* ── Badge ── */
function Badge({ value }) {
  const cfg = {
    Admin:    { bg: '#EEF2FF', color: '#4338CA' },
    User:     { bg: '#F0F9FF', color: '#0369A1' },
    Active:   { bg: '#F0FDF4', color: '#15803D' },
    Inactive: { bg: '#F9FAFB', color: '#6B7280' },
  }[value] || { bg: '#F3F4F6', color: '#374151' };
  return (
    <span style={{ display:'inline-flex',alignItems:'center',gap:5,padding:'2px 9px',borderRadius:20,fontSize:11.5,fontWeight:500,background:cfg.bg,color:cfg.color }}>
      {(value==='Active'||value==='Inactive') && (
        <span style={{width:5,height:5,borderRadius:'50%',background:value==='Active'?'#22C55E':'#9CA3AF',flexShrink:0}}/>
      )}
      {value}
    </span>
  );
}

/* ── Avatar ── */
function Avatar({ name, size=32 }) {
  const bg = avatarColor(name);
  return (
    <div style={{width:size,height:size,borderRadius:'50%',background:bg+'22',border:`1.5px solid ${bg}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:size*0.35,fontWeight:600,color:bg,flexShrink:0,letterSpacing:'0.03em',userSelect:'none'}}>
      {initials(name)}
    </div>
  );
}

/* ── FormField ── */
function FormField({ label, error, children }) {
  return (
    <div style={{display:'flex',flexDirection:'column',gap:6}}>
      <label style={{fontSize:13,fontWeight:500,color:'var(--text-secondary)'}}>{label}</label>
      {children}
      {error && (
        <span style={{fontSize:12,color:'var(--error)',display:'flex',alignItems:'center',gap:4}}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </span>
      )}
    </div>
  );
}

/* ── TextInput ── */
function TextInput({ value, onChange, placeholder, error, type='text' }) {
  const [focused, setFocused] = useState(false);
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{height:40,padding:'0 12px',border:`1.5px solid ${error?'var(--error)':focused?'var(--border-focus)':'var(--border)'}`,borderRadius:'var(--radius)',background:'var(--surface)',fontSize:13.5,fontFamily:'var(--font)',color:'var(--text-primary)',outline:'none',boxShadow:focused?`0 0 0 3px ${error?'rgba(192,57,43,0.08)':'rgba(26,26,26,0.06)'}`:undefined,transition:'border-color var(--transition),box-shadow var(--transition)'}}
    />
  );
}

/* ── SelectInput ── */
function SelectInput({ value, onChange, options }) {
  const [focused, setFocused] = useState(false);
  return (
    <select value={value} onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{height:40,padding:'0 32px 0 12px',border:`1.5px solid ${focused?'var(--border-focus)':'var(--border)'}`,borderRadius:'var(--radius)',background:'var(--surface)',fontSize:13.5,fontFamily:'var(--font)',color:'var(--text-primary)',outline:'none',cursor:'pointer',boxShadow:focused?'0 0 0 3px rgba(26,26,26,0.06)':undefined,transition:'border-color var(--transition)',appearance:'none',backgroundImage:`url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%236B6A65' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 12px center'}}
    >
      {options.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* ── Modal ── */
function Modal({ title, onClose, onSubmit, form, setForm, errors, loading, submitLabel }) {
  const overlayRef = useRef(null);
  useEffect(()=>{
    const h=(e)=>{if(e.key==='Escape')onClose();};
    document.addEventListener('keydown',h);
    return()=>document.removeEventListener('keydown',h);
  },[onClose]);
  return (
    <div ref={overlayRef} onClick={e=>{if(e.target===overlayRef.current)onClose();}}
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16,backdropFilter:'blur(2px)'}}>
      <div style={{background:'var(--surface)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)',boxShadow:'var(--shadow-md)',width:'100%',maxWidth:480,animation:'modalIn 160ms ease'}}>
        <div style={{padding:'18px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span style={{fontSize:15,fontWeight:600,color:'var(--text-primary)',letterSpacing:'-0.01em'}}>{title}</span>
          <button onClick={onClose} style={{background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',borderRadius:6,padding:4,display:'flex',alignItems:'center'}}
            onMouseEnter={e=>{e.currentTarget.style.background='var(--surface-2)';e.currentTarget.style.color='var(--text-primary)';}}
            onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text-muted)';}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div style={{padding:20,display:'flex',flexDirection:'column',gap:14}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
            <div style={{gridColumn:'1 / -1'}}>
              <FormField label="Full Name" error={errors.name}>
                <TextInput value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Jane Doe" error={errors.name}/>
              </FormField>
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <FormField label="Email Address" error={errors.email}>
                <TextInput type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="jane@company.com" error={errors.email}/>
              </FormField>
            </div>
            <div style={{gridColumn:'1 / -1'}}>
              <FormField label="Phone Number" error={errors.phone}>
                <TextInput value={form.phone} onChange={e=>setForm(f=>({...f,phone:e.target.value}))} placeholder="+1 (555) 000-0000" error={errors.phone}/>
              </FormField>
            </div>
            <FormField label="Role">
              <SelectInput value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))} options={ROLES}/>
            </FormField>
            <FormField label="Status">
              <SelectInput value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))} options={STATUSES}/>
            </FormField>
          </div>
        </div>
        <div style={{padding:'14px 20px',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'flex-end',gap:8}}>
          <button onClick={onClose} style={{height:36,padding:'0 16px',border:'1.5px solid var(--border)',borderRadius:'var(--radius)',background:'none',cursor:'pointer',fontSize:13.5,fontFamily:'var(--font)',color:'var(--text-secondary)',transition:'background var(--transition)'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>Cancel</button>
          <button onClick={onSubmit} disabled={loading} style={{height:36,padding:'0 18px',border:'none',borderRadius:'var(--radius)',background:'var(--accent)',cursor:loading?'not-allowed':'pointer',fontSize:13.5,fontWeight:500,fontFamily:'var(--font)',color:'#fff',opacity:loading?0.7:1,display:'flex',alignItems:'center',gap:6,transition:'background var(--transition)'}}
            onMouseEnter={e=>{if(!loading)e.currentTarget.style.background='var(--accent-hover)';}}
            onMouseLeave={e=>e.currentTarget.style.background='var(--accent)'}>
            {loading&&<span style={{width:12,height:12,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Delete Modal ── */
function DeleteModal({ user, onClose, onConfirm, loading }) {
  const overlayRef = useRef(null);
  useEffect(()=>{const h=(e)=>{if(e.key==='Escape')onClose();};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h);},[onClose]);
  return (
    <div ref={overlayRef} onClick={e=>{if(e.target===overlayRef.current)onClose();}}
      style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:16,backdropFilter:'blur(2px)'}}>
      <div style={{background:'var(--surface)',borderRadius:'var(--radius-lg)',border:'1px solid var(--border)',boxShadow:'var(--shadow-md)',width:'100%',maxWidth:380,animation:'modalIn 160ms ease'}}>
        <div style={{padding:24,display:'flex',flexDirection:'column',alignItems:'center',gap:14,textAlign:'center'}}>
          <div style={{width:44,height:44,borderRadius:'50%',background:'var(--error-bg)',border:'1px solid #F5C6C2',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--error)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:600,color:'var(--text-primary)',marginBottom:4}}>Delete User</div>
            <div style={{fontSize:13,color:'var(--text-secondary)',lineHeight:1.6}}>
              Are you sure you want to delete <strong>{user?.name}</strong>? This action cannot be undone.
            </div>
          </div>
        </div>
        <div style={{padding:'12px 20px 18px',display:'flex',gap:8,justifyContent:'center'}}>
          <button onClick={onClose} style={{height:36,padding:'0 20px',border:'1.5px solid var(--border)',borderRadius:'var(--radius)',background:'none',cursor:'pointer',fontSize:13.5,fontFamily:'var(--font)',color:'var(--text-secondary)',transition:'background var(--transition)'}}
            onMouseEnter={e=>e.currentTarget.style.background='var(--surface-2)'}
            onMouseLeave={e=>e.currentTarget.style.background='none'}>Cancel</button>
          <button onClick={onConfirm} disabled={loading} style={{height:36,padding:'0 20px',border:'none',borderRadius:'var(--radius)',background:'var(--error)',cursor:loading?'not-allowed':'pointer',fontSize:13.5,fontWeight:500,fontFamily:'var(--font)',color:'#fff',opacity:loading?0.7:1,display:'flex',alignItems:'center',gap:6,transition:'background var(--transition)'}}
            onMouseEnter={e=>{if(!loading)e.currentTarget.style.background='#A93226';}}
            onMouseLeave={e=>e.currentTarget.style.background='var(--error)'}>
            {loading&&<span style={{width:12,height:12,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'spin 0.6s linear infinite'}}/>}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Toast ── */
function Toast({ message, type }) {
  const cfg={success:{bg:'#F0FDF4',border:'#BBF7D0',color:'#15803D'},error:{bg:'var(--error-bg)',border:'#F5C6C2',color:'var(--error)'}}[type];
  return (
    <div style={{position:'fixed',bottom:24,right:24,zIndex:2000,background:cfg.bg,border:`1px solid ${cfg.border}`,color:cfg.color,padding:'11px 16px',borderRadius:'var(--radius)',fontSize:13.5,fontWeight:500,boxShadow:'var(--shadow-md)',display:'flex',alignItems:'center',gap:8,animation:'toastIn 200ms ease'}}>
      {type==='success'
        ?<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        :<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
      {message}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function UsersPage() {
  const [users, setUsers]               = useState([]);
  const [pageLoading, setPageLoading]   = useState(true);
  const [fetchError, setFetchError]     = useState(null);
  const [search, setSearch]             = useState('');
  const [roleFilter, setRoleFilter]     = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortKey, setSortKey]           = useState('name');
  const [sortDir, setSortDir]           = useState('asc');
  const [modal, setModal]               = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [formErrors, setFormErrors]     = useState({});
  const [loading, setLoading]           = useState(false);
  const [toast, setToast]               = useState(null);
  const [searchFocused, setSearchFocused] = useState(false);

  // FIX 1: fetch users from API on mount
  useEffect(() => {
    fetch(`${API}/users`)
      .then(r => r.json())
      .then(data => { setUsers(data); setPageLoading(false); })
      .catch(() => { setFetchError('Failed to load users'); setPageLoading(false); });
  }, []);

  function showToast(message, type='success') {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }

  function handleSort(key) {
    if (sortKey === key) setSortDir(d => d==='asc'?'desc':'asc');
    else { setSortKey(key); setSortDir('asc'); }
  }

  const filteredUsers = useMemo(() => {
    let list = users.filter(u => {
      const q = search.toLowerCase();
      return (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
        && (roleFilter==='All' || u.role===roleFilter)
        && (statusFilter==='All' || u.status===statusFilter);
    });
    return [...list].sort((a,b) => {
      const va=a[sortKey]?.toLowerCase?.()??a[sortKey];
      const vb=b[sortKey]?.toLowerCase?.()??b[sortKey];
      return sortDir==='asc'?(va>vb?1:-1):(va<vb?1:-1);
    });
  }, [users, search, roleFilter, statusFilter, sortKey, sortDir]);

  function openAdd() { setForm(EMPTY_FORM); setFormErrors({}); setModal('add'); }

  // FIX 2: use _id (MongoDB) not id
  function openEdit(u) {
    setForm({ name:u.name, email:u.email, phone:u.phone, role:u.role, status:u.status });
    setFormErrors({});
    setModal({ type:'edit', id:u._id });
  }

  async function handleAdd() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error?.includes('duplicate') || data.error?.includes('E11000')) {
          setFormErrors({ email: 'Email already exists' });
        } else {
          setFormErrors({ email: data.error });
        }
        setLoading(false);
        return;
      }
      setUsers(prev => [data, ...prev]);
      setModal(null);
      showToast('User added successfully');
    } catch {
      showToast('Something went wrong', 'error');
    }
    setLoading(false);
  }

  async function handleEdit() {
    const errs = validate(form);
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/users/${modal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error || 'Update failed', 'error'); setLoading(false); return; }
      setUsers(prev => prev.map(u => u._id === modal.id ? data : u));
      setModal(null);
      showToast('User updated successfully');
    } catch {
      showToast('Something went wrong', 'error');
    }
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await fetch(`${API}/users/${deleteTarget._id}`, { method: 'DELETE' });
      setUsers(prev => prev.filter(u => u._id !== deleteTarget._id));
      setDeleteTarget(null);
      showToast('User deleted', 'error');
    } catch {
      showToast('Something went wrong', 'error');
    }
    setLoading(false);
  }

  function SortIcon({ col }) {
    const active = sortKey===col;
    return (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={active?'var(--text-primary)':'var(--text-muted)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        {(!active||sortDir==='asc') ? <polyline points="18 15 12 9 6 15"/> : <polyline points="6 9 12 15 18 9"/>}
      </svg>
    );
  }

  const TH = [
    {key:'name',   label:'Name',    sort:true },
    {key:'email',  label:'Email',   sort:true },
    {key:'phone',  label:'Phone',   sort:false},
    {key:'role',   label:'Role',    sort:true },
    {key:'status', label:'Status',  sort:true },
    {key:'actions',label:'Actions', sort:false},
  ];

  const stats = {
    total:    users.length,
    active:   users.filter(u=>u.status==='Active').length,
    admins:   users.filter(u=>u.role==='Admin').length,
    inactive: users.filter(u=>u.status==='Inactive').length,
  };

  return (
    <DashboardLayout pageTitle="Users">
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.97) translateY(6px); } to { opacity:1; transform:none; } }
        @keyframes toastIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
        .u-row:hover   { background: var(--surface-2) !important; }
        .act-btn:hover { background: var(--surface-2) !important; color: var(--text-primary) !important; }
        @media (max-width:768px) {
          .tbl-wrap { overflow-x: auto; }
          .top-bar  { flex-direction: column !important; align-items: stretch !important; }
          .f-row    { flex-wrap: wrap !important; }
          .s-grid   { grid-template-columns: repeat(2,1fr) !important; }
          .h-mob    { display: none !important; }
        }
      `}</style>

      {/* FIX 3: pageLoading spinner */}
      {pageLoading && (
        <div style={{display:'flex',justifyContent:'center',padding:'60px 0'}}>
          <div style={{width:28,height:28,border:'3px solid var(--border)',borderTopColor:'var(--accent)',borderRadius:'50%',animation:'spin 0.7s linear infinite'}}/>
        </div>
      )}

      {/* Fetch error banner */}
      {fetchError && (
        <div style={{background:'var(--error-bg)',border:'1px solid #F5C6C2',color:'var(--error)',padding:'14px 18px',borderRadius:'var(--radius)',fontSize:13.5,marginBottom:16}}>
          ⚠️ {fetchError} — make sure your backend is running on port 5000.
        </div>
      )}

      {!pageLoading && (
        <div style={{display:'flex',flexDirection:'column',gap:20,maxWidth:1200}}>

          {/* Stats */}
          <div className="s-grid" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
            {[
              {label:'Total Users', value:stats.total},
              {label:'Active',      value:stats.active},
              {label:'Admins',      value:stats.admins},
              {label:'Inactive',    value:stats.inactive},
            ].map(s=>(
              <div key={s.label} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'14px 18px',boxShadow:'var(--shadow)'}}>
                <div style={{fontSize:11.5,fontWeight:500,color:'var(--text-muted)',marginBottom:6}}>{s.label}</div>
                <div style={{fontSize:24,fontWeight:700,color:'var(--text-primary)',letterSpacing:'-0.04em',fontFamily:'var(--font-mono)'}}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',padding:'14px 16px',boxShadow:'var(--shadow)',display:'flex',flexDirection:'column',gap:12}}>
            <div className="top-bar" style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
              <div style={{position:'relative',flex:1,maxWidth:320}}>
                <svg style={{position:'absolute',left:10,top:'50%',transform:'translateY(-50%)',color:'var(--text-muted)',pointerEvents:'none'}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" placeholder="Search by name or email…" value={search}
                  onChange={e=>setSearch(e.target.value)}
                  onFocus={()=>setSearchFocused(true)}
                  onBlur={()=>setSearchFocused(false)}
                  style={{width:'100%',height:36,paddingLeft:32,paddingRight:search?32:12,border:`1.5px solid ${searchFocused?'var(--border-focus)':'var(--border)'}`,borderRadius:'var(--radius)',background:'var(--surface)',fontSize:13.5,fontFamily:'var(--font)',color:'var(--text-primary)',outline:'none',boxShadow:searchFocused?'0 0 0 3px rgba(26,26,26,0.06)':'none',transition:'border-color var(--transition),box-shadow var(--transition)'}}
                />
                {search&&(
                  <button onClick={()=>setSearch('')} style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',color:'var(--text-muted)',display:'flex',padding:2}}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                )}
              </div>
              <button onClick={openAdd} style={{height:36,padding:'0 16px',background:'var(--accent)',border:'none',borderRadius:'var(--radius)',cursor:'pointer',fontSize:13.5,fontWeight:500,fontFamily:'var(--font)',color:'#fff',display:'flex',alignItems:'center',gap:7,whiteSpace:'nowrap',transition:'background var(--transition)'}}
                onMouseEnter={e=>e.currentTarget.style.background='var(--accent-hover)'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--accent)'}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add User
              </button>
            </div>

            <div className="f-row" style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
              <span style={{fontSize:12,color:'var(--text-muted)',fontWeight:500}}>Filter:</span>
              {['All',...ROLES].map(r=>(
                <button key={r} onClick={()=>setRoleFilter(r)} style={{height:28,padding:'0 11px',borderRadius:20,cursor:'pointer',fontSize:12,fontFamily:'var(--font)',fontWeight:500,border:'1.5px solid',transition:'all var(--transition)',borderColor:roleFilter===r?'var(--border-focus)':'var(--border)',background:roleFilter===r?'var(--accent)':'none',color:roleFilter===r?'#fff':'var(--text-secondary)'}}>
                  {r==='All'?'All Roles':r}
                </button>
              ))}
              <div style={{width:1,height:18,background:'var(--border)',margin:'0 2px'}}/>
              {['All',...STATUSES].map(s=>(
                <button key={s} onClick={()=>setStatusFilter(s)} style={{height:28,padding:'0 11px',borderRadius:20,cursor:'pointer',fontSize:12,fontFamily:'var(--font)',fontWeight:500,border:'1.5px solid',transition:'all var(--transition)',borderColor:statusFilter===s?'var(--border-focus)':'var(--border)',background:statusFilter===s?'var(--accent)':'none',color:statusFilter===s?'#fff':'var(--text-secondary)'}}>
                  {s==='All'?'All Status':s}
                </button>
              ))}
              {(roleFilter!=='All'||statusFilter!=='All'||search)&&(
                <button onClick={()=>{setRoleFilter('All');setStatusFilter('All');setSearch('');}} style={{height:28,padding:'0 10px',borderRadius:20,cursor:'pointer',fontSize:12,fontFamily:'var(--font)',color:'var(--error)',border:'1.5px solid #F5C6C2',background:'var(--error-bg)',fontWeight:500,marginLeft:4}}>Clear</button>
              )}
              <span style={{marginLeft:'auto',fontSize:12,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{filteredUsers.length} of {users.length}</span>
            </div>
          </div>

          {/* Table */}
          <div className="tbl-wrap" style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',boxShadow:'var(--shadow)',overflow:'hidden'}}>
            <table style={{width:'100%',borderCollapse:'collapse',minWidth:680}}>
              <thead>
                <tr style={{borderBottom:'1px solid var(--border)',background:'var(--surface-2)'}}>
                  {TH.map(col=>(
                    <th key={col.key} className={col.key==='phone'?'h-mob':''} onClick={col.sort?()=>handleSort(col.key):undefined}
                      style={{padding:'10px 16px',textAlign:'left',fontSize:11.5,fontWeight:600,color:'var(--text-secondary)',letterSpacing:'0.04em',textTransform:'uppercase',cursor:col.sort?'pointer':'default',userSelect:'none',whiteSpace:'nowrap'}}>
                      <span style={{display:'flex',alignItems:'center',gap:5}}>
                        {col.label}{col.sort&&<SortIcon col={col.key}/>}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length===0?(
                  <tr><td colSpan={6} style={{padding:'48px 16px',textAlign:'center'}}>
                    <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                      <span style={{fontSize:14,color:'var(--text-secondary)',fontWeight:500}}>No users found</span>
                      <span style={{fontSize:12,color:'var(--text-muted)'}}>Try adjusting your search or filters</span>
                    </div>
                  </td></tr>
                ):filteredUsers.map((user,i)=>(
                  // FIX 4: use user._id as key (MongoDB)
                  <tr key={user._id} className="u-row" style={{borderBottom:i<filteredUsers.length-1?'1px solid var(--border)':'none',transition:'background var(--transition)',background:'var(--surface)'}}>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',alignItems:'center',gap:10}}>
                        <Avatar name={user.name}/>
                        <span style={{fontSize:13.5,fontWeight:500,color:'var(--text-primary)'}}>{user.name}</span>
                      </div>
                    </td>
                    <td style={{padding:'12px 16px'}}>
                      <span style={{fontSize:13,color:'var(--text-secondary)',fontFamily:'var(--font-mono)'}}>{user.email}</span>
                    </td>
                    <td className="h-mob" style={{padding:'12px 16px'}}>
                      <span style={{fontSize:13,color:'var(--text-secondary)'}}>{user.phone}</span>
                    </td>
                    <td style={{padding:'12px 16px'}}><Badge value={user.role}/></td>
                    <td style={{padding:'12px 16px'}}><Badge value={user.status}/></td>
                    <td style={{padding:'12px 16px'}}>
                      <div style={{display:'flex',gap:4}}>
                        <button className="act-btn" onClick={()=>openEdit(user)} title="Edit" style={{width:30,height:30,border:'1px solid var(--border)',borderRadius:6,background:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background var(--transition),color var(--transition)'}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button onClick={()=>setDeleteTarget(user)} title="Delete" style={{width:30,height:30,border:'1px solid var(--border)',borderRadius:6,background:'none',cursor:'pointer',color:'var(--text-secondary)',display:'flex',alignItems:'center',justifyContent:'center',transition:'background var(--transition),color var(--transition)'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='var(--error-bg)';e.currentTarget.style.color='var(--error)';e.currentTarget.style.borderColor='#F5C6C2';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='none';e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.borderColor='var(--border)';}}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {modal==='add'&&<Modal title="Add New User" onClose={()=>setModal(null)} onSubmit={handleAdd} form={form} setForm={setForm} errors={formErrors} loading={loading} submitLabel="Add User"/>}
      {modal?.type==='edit'&&<Modal title="Edit User" onClose={()=>setModal(null)} onSubmit={handleEdit} form={form} setForm={setForm} errors={formErrors} loading={loading} submitLabel="Save Changes"/>}
      {deleteTarget&&<DeleteModal user={deleteTarget} onClose={()=>setDeleteTarget(null)} onConfirm={handleDelete} loading={loading}/>}
      {toast&&<Toast message={toast.message} type={toast.type}/>}
    </DashboardLayout>
  );
}
