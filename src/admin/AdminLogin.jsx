import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminLogin, watchAuth } from '../lib/adminAuth'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    return watchAuth(({ user, isAdmin, error: authError }) => {
      if (authError) setError(authError)
      if (user && isAdmin) navigate('/admin/settings', { replace: true })
    })
  }, [navigate])

  return (
    <div className="container-page py-16">
      <div className="mx-auto max-w-md surface p-8 bg-white border border-zinc-200 shadow-sm rounded-2xl">
        <h1 className="text-2xl font-bold text-zinc-900">Admin Login</h1>
        <p className="mt-2 text-sm text-zinc-600">
          Sign in with your Firebase Email/Password user.
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setStatus('loading')
            try {
              await adminLogin(email, password)
              setStatus('idle')
            } catch (err) {
              setStatus('idle')
              setError(err?.message || 'Login failed.')
            }
          }}
        >
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-700">Email</span>
            <input
              className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-medium text-zinc-700">Password</span>
            <input
              type="password"
              className="h-12 rounded-xl border border-zinc-200 bg-white px-4 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          <button
            disabled={status === 'loading'}
            type="submit"
            className="rounded-xl bg-zinc-900 px-4 py-3 mt-4 text-sm font-bold text-white hover:bg-black disabled:opacity-60 transition-colors shadow-md"
          >
            {status === 'loading' ? 'Signing in…' : 'Sign in'}
          </button>

          {error ? (
            <p className="text-sm font-semibold text-rose-500">{error}</p>
          ) : null}
        </form>
      </div>
    </div>
  )
}

