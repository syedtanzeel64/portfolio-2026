import { useEffect, useState } from 'react'
import { useOutletContext, Link } from 'react-router-dom'
import { PROFILE } from '../content/profile'
import { Page, Reveal } from '../components/Motion'
import { motion, AnimatePresence } from 'framer-motion'
import {
  fetchProjects,
  fetchServicesFallback,
} from '../lib/data'
import { ButtonLink, Chip, Container, SectionHeading, Surface } from '../components/Ui'

function Typewriter({ texts }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!texts || texts.length === 0) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % texts.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [texts])

  if (!texts || texts.length === 0) return null

  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden ml-3 align-bottom">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={index}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute left-0 top-0 whitespace-nowrap text-zinc-500 font-normal"
        >
          {texts[index]}
        </motion.span>
      </AnimatePresence>
      <span className="opacity-0 whitespace-nowrap px-1">{texts[index]}</span>
    </div>
  )
}

export default function Home() {
  const [projects, setProjects] = useState([])
  const [services, setServices] = useState(null)
  const { settings } = useOutletContext() || {}

  useEffect(() => {
    let alive = true
    Promise.allSettled([
      fetchProjects(),
      fetchServicesFallback(),
    ]).then((results) => {
      if (!alive) return
      const [p, s] = results
      if (p.status === 'fulfilled') setProjects(p.value.slice(0, 4))
      if (s.status === 'fulfilled') setServices(s.value)
    })
    return () => { alive = false }
  }, [])

  const defaults = {
    siteName: PROFILE.name,
    tagline: PROFILE.title,
    location: PROFILE.location,
    email: PROFILE.links.email,
    stats: PROFILE.stats,
    heroTitle: `Hi, I'm ${PROFILE.name || 'Syed T.'}`,
    heroSubtitles: PROFILE.title || 'Full Stack Developer',
    heroImage: '',
  }

  const effectiveSettings = {
    ...defaults,
    ...settings,
    heroTitle: settings?.heroTitle || defaults.heroTitle,
    heroSubtitles: settings?.heroSubtitles || defaults.heroSubtitles,
    heroImage: settings?.heroImage || defaults.heroImage,
  }

  // Resolve WhatsApp number: backend phone > backend socials.whatsapp > profile fallback
  const whatsappPhone = (
    settings?.phone ||
    settings?.socials?.whatsapp ||
    PROFILE.links.whatsapp ||
    ''
  ).replace(/[^0-9]/g, '')

  const whatsappUrl = whatsappPhone
    ? `https://wa.me/${whatsappPhone}?text=${encodeURIComponent("Hi, I'd like to connect with you!")}`
    : '/contact'

  const subtitlesArray = effectiveSettings.heroSubtitles
    ? effectiveSettings.heroSubtitles.split(',').map((s) => s.trim())
    : [effectiveSettings.tagline || 'Software Solutions']

  return (
    <Page>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
        <Container>
          <Reveal>
            <div className="flex flex-col items-center text-center">

              {/* Availability badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/60 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available for new projects
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="text-5xl font-extrabold tracking-tight sm:text-7xl text-zinc-900 dark:text-white drop-shadow-sm"
              >
                {effectiveSettings.heroTitle}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
                className="mt-6 text-xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center flex-wrap justify-center gap-2"
              >
                <span>I craft</span>
                <Typewriter texts={subtitlesArray} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl font-medium"
              >
                {PROFILE.summary}
              </motion.p>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <ButtonLink to="/projects" variant="primary">View My Work</ButtonLink>
                <ButtonLink to="/contact" variant="secondary">Get in Touch</ButtonLink>
                {whatsappPhone ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#1DA851] hover:shadow-lg transition-all duration-200"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                    Connect with Me
                  </a>
                ) : (
                  <ButtonLink to="/contact" variant="secondary">Connect with Me</ButtonLink>
                )}
              </div>
            </div>

            {/* Hero image */}
            <div className="mt-16 sm:mt-24 w-full px-2 sm:px-0 relative z-10">
              <div className="rounded-3xl border border-white/40 surface shadow-xl shadow-zinc-900/5 overflow-hidden transform hover:scale-[1.01] transition-transform duration-700">
                {effectiveSettings.heroImage ? (
                  <img
                    src={effectiveSettings.heroImage}
                    alt="Hero Visual"
                    className="w-full aspect-[21/9] object-cover sm:aspect-[24/10]"
                  />
                ) : (
                  <div className="w-full aspect-[21/9] sm:aspect-[24/10] overflow-hidden rounded-3xl">
                    <div className="skeleton w-full h-full" style={{ aspectRatio: 'inherit' }} />
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid gap-4 grid-cols-2 sm:grid-cols-3 border-t border-zinc-100 dark:border-zinc-800 pt-10">
              {((effectiveSettings.stats || PROFILE.stats) || []).map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">{s.value}</p>
                  <p className="mt-2 text-xs font-semibold tracking-wider uppercase text-zinc-500 dark:text-zinc-500">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── What I Bring ── */}
      <section className="py-14 sm:py-20 relative before:absolute before:inset-0 before:bg-linear-to-b before:from-transparent before:via-zinc-100/40 before:to-transparent">
        <Container className="grid gap-8 lg:grid-cols-3 relative z-10">
          {[
            {
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
              title: 'Design-Forward UI',
              desc: 'Modern, minimalist layouts with tasteful motion and a component-driven approach to visual design.',
            },
            {
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>,
              title: 'Performance & UX',
              desc: 'Fast load times, smooth interactions, and fluid responsive behaviour across every device and screen size.',
            },
            {
              icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 1 0 0 4m0-4a2 2 0 1 1 0 4m-6 8a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 1 0 0-4m0 4a2 2 0 1 1 0-4m0 4v2m0-6V4"/></svg>,
              title: 'Dynamic Content Management',
              desc: 'Integrated backend admin panels for updating imagery, projects, and content on the fly — no code required.',
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={0.05 * i}>
              <Surface className="p-8 h-full transition-colors hover:bg-white/90 dark:hover:bg-zinc-800/80">
                <div className="h-10 w-10 rounded-xl bg-zinc-900/5 dark:bg-white/10 mb-6 flex items-center justify-center text-zinc-900 dark:text-white">
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{c.title}</h3>
                <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.desc}</p>
              </Surface>
            </Reveal>
          ))}
        </Container>
      </section>

      {/* ── How I Work (Process) ── */}
      <section className="py-20 sm:py-28 bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="How I Work"
              title="A Clear, Collaborative Process"
              desc="From first conversation to final deployment — a structured workflow designed to keep you informed and confident at every step."
            />
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROFILE.process.map((item, i) => (
              <Reveal key={item.step} delay={0.07 * i}>
                <div className="relative p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow h-full">
                  <p className="text-5xl font-black text-zinc-100 dark:text-zinc-800 select-none leading-none">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-zinc-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Selected Projects ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="My Work"
              title="Selected Projects"
              desc="A curated selection of projects defined by clean layouts, sharp typography, and meaningful interactions."
            />
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {projects.map((p, i) => (
              <Reveal key={p.id || p.title} delay={0.04 * i}>
                <div className="group overflow-hidden rounded-2xl surface shadow-sm hover:shadow-xl dark:shadow-zinc-900/50 transition-all duration-300">
                  {p.imageUrl ? (
                    <div className="overflow-hidden border-b border-black/5 dark:border-white/5 bg-zinc-50 dark:bg-zinc-900 relative">
                      <div className="absolute inset-0 bg-black/5 dark:bg-white/5 group-hover:bg-transparent transition-colors z-10" />
                      <img
                        src={p.imageUrl}
                        alt={p.title}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}
                  <div className="p-8 bg-white/40 dark:bg-zinc-900/40">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{p.title}</h3>
                        <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base line-clamp-2">
                          {p.description || p.desc}
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {(p.tags || []).slice(0, 3).map((t) => (
                        <Chip key={t}>{t}</Chip>
                      ))}
                    </div>
                    {p.liveUrl ? (
                      <div className="mt-8 border-t border-black/5 dark:border-white/5 pt-6">
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-sm font-bold text-zinc-900 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          View Live Site <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-16 text-center">
            <ButtonLink to="/projects" variant="primary">View Full Portfolio</ButtonLink>
          </div>
        </Container>
      </section>

      {/* ── Services ── */}
      <section className="py-16 sm:py-24 bg-zinc-50 dark:bg-zinc-900 border-y border-zinc-100 dark:border-zinc-800">
        <Container>
          <Reveal>
            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">Services</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                What I Can Build for You
              </h2>
              <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed">
                High-quality, bespoke websites built end-to-end: custom UI, fluid frontend interactions, and dynamic backend integrations.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 mt-8">
            {(services && services.length ? services : PROFILE.services || []).map((srv, i) => (
              <Reveal key={srv.title} delay={0.04 * i}>
                <div className="p-8 rounded-2xl bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 h-full hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{srv.title}</h3>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed">{srv.desc}</p>
                  <ul className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
                    {(srv.bullets || []).map((b) => (
                      <li key={b} className="flex gap-3">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Experience ── */}
      <section className="py-14 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Years of Building for the Web"
              desc="Translating business goals into pixel-perfect interfaces, driven by a deep appreciation for minimalist aesthetics."
            />
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3 mt-8">
            <Reveal>
              <Surface className="p-8 lg:col-span-2 flex flex-col justify-center h-full">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Highlights</h3>
                <ul className="mt-6 space-y-4 text-base text-zinc-600 dark:text-zinc-400">
                  {[
                    'Architecture and layout design with a focus on modern, dynamic interactions.',
                    'Deep integration of React, Firebase, and CMS backends for production-ready apps.',
                    'Specialised in image-driven masonry layouts and high-impact hero sections.',
                    'Continuous client collaboration — from Figma concepts through to launch day.',
                  ].map((x) => (
                    <li key={x} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-400" />
                      <span>{x}</span>
                    </li>
                  ))}
                </ul>
              </Surface>
            </Reveal>
            <Reveal delay={0.06}>
              <Surface className="p-8 h-full flex flex-col justify-center">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">Availability</p>
                <p className="mt-3 text-3xl font-extrabold text-zinc-900 dark:text-white">Open to new projects</p>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">Currently taking on freelance and contract work.</p>
                <div className="mt-8">
                  <Link
                    to="/contact"
                    className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 dark:bg-white px-5 py-3 text-sm font-bold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
                  >
                    Start a conversation
                  </Link>
                </div>
              </Surface>
            </Reveal>
          </div>
        </Container>
      </section>


      {/* ── CTA Banner ── */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-8 py-16 sm:px-16 text-center">
              {/* Glow blobs */}
              <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

              <p className="relative text-xs font-bold tracking-widest uppercase text-zinc-400">
                Let's build together
              </p>
              <h2 className="relative mt-4 text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Have a project in mind?
              </h2>
              <p className="relative mt-5 max-w-xl mx-auto text-lg text-zinc-400 leading-relaxed">
                I'm currently available for freelance work. Whether you need a new website, a React app, or a Firebase backend — let's talk.
              </p>
              <div className="relative mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-zinc-900 hover:bg-zinc-100 transition-colors shadow-lg"
                >
                  Start a Conversation →
                </Link>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-700 px-8 py-4 text-sm font-bold text-zinc-300 hover:border-zinc-500 hover:text-white transition-colors"
                >
                  See My Work
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

    </Page>
  )
}
