import { useEffect, useState } from 'react'
import { getSettings, saveSettings } from '../lib/cms'
import { ImageUploader } from './ImageUploader'

export default function SettingsPage() {
  const [settings, setSettings] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let alive = true
    setStatus('loading')
    getSettings()
      .then((s) => {
        if (!alive) return
        setSettings(s)
        setStatus('ready')
      })
      .catch((e) => {
        if (!alive) return
        setError(e?.message || 'Failed to load settings.')
        setStatus('error')
      })
    return () => {
      alive = false
    }
  }, [])

  if (status === 'loading') return <div className="text-white/70">Loading…</div>
  if (status === 'error') return <div className="text-rose-200/80">{error}</div>

  return (
    <div className="surface p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Site settings</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Update imagery, titles, contact, socials, stats, and basic info.
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            setError('')
            setSaved(false)
            try {
              await saveSettings(settings)
              setSaved(true)
              setTimeout(() => setSaved(false), 1800)
            } catch (e) {
              setError(e?.message || 'Save failed.')
            }
          }}
          className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-black"
        >
          Save
        </button>
      </div>

      {saved ? (
        <div className="mb-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 p-3 text-sm text-emerald-100/80">
          Saved.
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-100/80">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          ['siteName', 'Site name'],
          ['tagline', 'Tagline'],
          ['location', 'Location'],
          ['email', 'Email'],
          ['phone', 'Phone'],
          ['heroTitle', 'Hero Title'],
          ['heroSubtitles', 'Hero Subtitles (comma separated)'],
        ].map(([key, label]) => (
          <label key={key} className="grid gap-2">
            <span className="text-sm font-medium text-zinc-700">{label}</span>
            <input
              className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              value={settings[key] || ''}
              onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
              placeholder={label}
            />
          </label>
        ))}
        
        
        <label className="col-span-full grid gap-2">
          <span className="text-sm font-medium text-zinc-700">About Bio</span>
          <textarea
            className="h-24 resize-y rounded-xl border border-zinc-200 bg-white p-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            value={settings.aboutBio || ''}
            onChange={(e) => setSettings((s) => ({ ...s, aboutBio: e.target.value }))}
            placeholder="Main bio text for the About page"
          />
        </label>

        <div className="col-span-full pt-6 border-t border-zinc-200 mt-2 grid gap-6 sm:grid-cols-3">
          <ImageUploader 
            label="Logo Image" 
            value={settings.logoUrl || ''} 
            onChange={(url) => setSettings((s) => ({ ...s, logoUrl: url }))} 
          />
          <ImageUploader 
            label="Hero Image" 
            value={settings.heroImage || ''} 
            onChange={(url) => setSettings((s) => ({ ...s, heroImage: url }))} 
          />
          <ImageUploader 
            label="About Image" 
            value={settings.aboutImage || ''} 
            onChange={(url) => setSettings((s) => ({ ...s, aboutImage: url }))} 
          />
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Social links</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {['whatsapp', 'github', 'linkedin', 'instagram', 'x'].map((k) => (
              <label key={k} className="grid gap-2">
                <span className="text-sm font-medium text-zinc-700 capitalize">{k}</span>
                <input
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  value={settings.socials?.[k] || ''}
                  onChange={(e) =>
                    setSettings((s) => ({
                      ...s,
                      socials: { ...(s.socials || {}), [k]: e.target.value },
                    }))
                  }
                  placeholder={k === 'whatsapp' ? '+1234567890 (Phone number)' : `https://${k}.com/...`}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
          <h3 className="text-sm font-semibold text-zinc-900">Stats</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Edit the 3 homepage stat cards.
          </p>
          <div className="mt-4 grid gap-3">
            {(settings.stats || []).map((st, idx) => (
              <div key={idx} className="grid gap-3 sm:grid-cols-2">
                <input
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  value={st.value || ''}
                  onChange={(e) =>
                    setSettings((s) => {
                      const next = [...(s.stats || [])]
                      next[idx] = { ...next[idx], value: e.target.value }
                      return { ...s, stats: next }
                    })
                  }
                  placeholder="Value (e.g., 1+)"
                />
                <input
                  className="h-11 rounded-xl border border-zinc-200 bg-white px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  value={st.label || ''}
                  onChange={(e) =>
                    setSettings((s) => {
                      const next = [...(s.stats || [])]
                      next[idx] = { ...next[idx], label: e.target.value }
                      return { ...s, stats: next }
                    })
                  }
                  placeholder="Label (e.g., Years Experience)"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-full rounded-2xl border border-zinc-200 bg-zinc-50 p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-zinc-900">Technical Expertise (Skills)</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Comma-separated lists of your skills for the About page.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {['frontend', 'backend', 'tooling'].map((k) => (
              <label key={k} className="grid gap-2">
                <span className="text-sm font-medium text-zinc-700 capitalize">{k}</span>
                <textarea
                  className="h-24 resize-y rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  value={settings.skills?.[k] ? settings.skills[k].join(', ') : ''}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    setSettings((s) => ({
                      ...s,
                      skills: { ...(s.skills || {}), [k]: arr },
                    }))
                  }}
                  placeholder="React, Tailwind, Node.js..."
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

