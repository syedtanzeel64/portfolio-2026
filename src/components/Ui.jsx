import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

export function Container({ children, className = '' }) {
  return <div className={`container-page ${className}`}>{children}</div>
}

export function Surface({ children, className = '' }) {
  return <div className={`surface ${className}`}>{children}</div>
}

export function SectionHeading({ eyebrow, title, desc }) {
  return (
    <div className="mb-8 sm:mb-10">
      {eyebrow ? (
        <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {desc ? <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">{desc}</p> : null}
    </div>
  )
}

export function Chip({ children }) {
  return (
    <span className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-1 text-xs font-medium tracking-wide text-zinc-700 dark:text-zinc-300">
      {children}
    </span>
  )
}

export function ButtonLink({
  to,
  href,
  children,
  variant = 'primary',
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all will-change-transform'
  const styles =
    variant === 'primary'
      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md shadow-zinc-900/10 dark:shadow-white/5 hover:bg-black dark:hover:bg-white hover:shadow-lg hover:shadow-zinc-900/30'
      : 'border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm'

  const Comp = to ? Link : 'a'
  const props = to ? { to } : { href, target: '_blank', rel: 'noreferrer' }

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
      <Comp className={`${base} ${styles}`} {...props} {...rest}>
        {children}
      </Comp>
    </motion.div>
  )
}

export function TopNav({ settings }) {
  const [isOpen, setIsOpen] = useState(false)
  const [theme, setTheme] = useTheme()

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
    }`

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ]

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex flex-col items-center px-4 w-full pointer-events-none">
      <header className="pointer-events-auto rounded-full border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] px-4 sm:px-6 py-3 flex items-center justify-between gap-4 transition-all w-full max-w-4xl">
        <Link to="/" className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          {settings?.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt={settings.siteName}
              className="h-7 w-auto rounded-md object-contain"
            />
          ) : (
            settings?.siteName || 'Portfolio'
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navLinks.map(link => (
            <NavLink key={link.to} className={navLinkClass} to={link.to}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="group rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
          </button>

          {/* Socials (Desktop only) */}
          <div className="hidden sm:flex items-center gap-2">
            {settings?.socials?.github && (
              <a
                className="group rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                href={settings.socials.github}
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
            )}
            {settings?.socials?.linkedin && (
              <a
                className="group rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                href={settings.socials.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden group rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            aria-label="Toggle Menu"
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className="pointer-events-auto mt-2 w-full max-w-sm rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/90 dark:bg-zinc-900/90 p-4 backdrop-blur-md shadow-xl sm:hidden flex flex-col gap-2"
          >
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            <div className="mt-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-center gap-4">
              {settings?.socials?.github && (
                <a className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" href={settings.socials.github} target="_blank" rel="noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                </a>
              )}
              {settings?.socials?.linkedin && (
                <a className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" href={settings.socials.linkedin} target="_blank" rel="noreferrer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

