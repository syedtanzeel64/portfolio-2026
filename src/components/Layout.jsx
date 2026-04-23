import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Background from './Background'
import { PROFILE } from '../content/profile'
import { Container, TopNav } from './Ui'
import { fetchSettingsFallback } from '../lib/data'
import { useTheme } from '../hooks/useTheme'

export default function Layout() {
  const [settings, setSettings] = useState(null)
  const [settingsReady, setSettingsReady] = useState(false)
  
  // Initialize and observe theme globally
  useTheme()

  useEffect(() => {
    let alive = true

    // Timeout fallback: if Firebase takes > 2s, show defaults immediately
    const timeout = setTimeout(() => {
      if (alive && !settingsReady) setSettingsReady(true)
    }, 2000)

    fetchSettingsFallback().then((s) => {
      if (!alive) return
      if (s) setSettings(s)
      setSettingsReady(true)
      clearTimeout(timeout)
    }).catch(() => {
      if (alive) setSettingsReady(true)
      clearTimeout(timeout)
    })

    return () => {
      alive = false
      clearTimeout(timeout)
    }
  }, [])

  const effectiveSettings = settings || {
    siteName: PROFILE.name,
    tagline: PROFILE.title,
    location: PROFILE.location,
    email: PROFILE.links.email,
    stats: PROFILE.stats,
    socials: PROFILE.links,
  }

  return (
    <div className="min-h-dvh">
      <Background />
      <TopNav settings={effectiveSettings} />

      {/* Added pt-28 to clear mobile nav spacing */}
      <main className="pt-28 sm:pt-16">
        {settingsReady ? (
          <Outlet context={{ settings: effectiveSettings }} />
        ) : (
          // Minimal skeleton while waiting for Firebase settings
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
              <div className="skeleton rounded-full" style={{ width: 48, height: 48 }} />
              <div className="skeleton rounded-lg" style={{ width: 160, height: 14 }} />
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10">
        <Container className="flex flex-col gap-2 text-sm text-zinc-500 dark:text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {effectiveSettings.siteName}. All rights reserved.
          </p>
          <p className="text-zinc-400 dark:text-zinc-600">React Router + Framer Motion + Firebase</p>
        </Container>
      </footer>
    </div>
  )
}

