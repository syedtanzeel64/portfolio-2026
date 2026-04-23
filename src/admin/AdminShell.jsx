import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { adminLogout, watchAuth } from '../lib/adminAuth'

export default function AdminShell() {
  const [state, setState] = useState({ ready: false, isAdmin: false, user: null, error: '' })
  const navigate = useNavigate()

  useEffect(() => watchAuth(setState), [])

  useEffect(() => {
    if (!state.ready) return
    if (!state.user) navigate('/admin/login', { replace: true })
    else if (!state.isAdmin) navigate('/admin/not-authorized', { replace: true })
  }, [navigate, state.isAdmin, state.ready, state.user])

  if (!state.ready) return <div className="container-page py-14 text-zinc-500">Loading…</div>

  const linkClass = ({ isActive }) =>
    `block rounded-xl px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-zinc-100 text-zinc-900 font-bold' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
    }`

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">
            Dashboard
          </h1>
        </div>
        <button
          onClick={async () => {
            await adminLogout()
            navigate('/admin/login', { replace: true })
          }}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-bold text-zinc-600 hover:bg-zinc-50 transition-colors shadow-sm"
          type="button"
        >
          Logout
        </button>
      </div>

      {state.error ? (
        <div className="mb-6 rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-100/80">
          {state.error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="surface p-3">
          <nav className="space-y-1">
            <NavLink to="/admin/settings" className={linkClass}>
              Settings
            </NavLink>
            <NavLink to="/admin/projects" className={linkClass}>
              Projects
            </NavLink>
            <NavLink to="/admin/services" className={linkClass}>
              Services
            </NavLink>
            <NavLink to="/admin/testimonials" className={linkClass}>
              Testimonials
            </NavLink>
            <NavLink to="/admin/media" className={linkClass}>
              Media
            </NavLink>
          </nav>
        </aside>

        <section className="min-w-0">
          <Outlet />
        </section>
      </div>
    </div>
  )
}

