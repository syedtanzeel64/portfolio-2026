import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchProjects } from '../lib/data'
import { Page, Reveal } from '../components/Motion'
import { Chip, Container, SectionHeading, Surface } from '../components/Ui'

function ProjectCard({ p }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Surface className="group h-full p-6 transition hover:shadow-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700">
        {p.imageUrl ? (
          <div className="mb-5 overflow-hidden rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 relative">
            <div className="absolute inset-0 bg-black/5 dark:bg-white/5 group-hover:bg-transparent transition-colors z-10" />
            <img
              src={p.imageUrl}
              alt={p.title}
              loading="lazy"
              className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        ) : null}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{p.title}</h3>
            <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">{p.description || p.desc}</p>
          </div>
          {p.liveUrl ? (
            <a
              href={p.liveUrl}
              className="text-sm font-bold text-zinc-500 dark:text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              Live →
            </a>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {(p.tags || []).map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>

        {p.sourceUrl ? (
          <a
            href={p.sourceUrl}
            className="mt-5 inline-flex text-sm font-bold text-zinc-400 dark:text-zinc-500 transition hover:text-zinc-900 dark:hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            Source code →
          </a>
        ) : null}
      </Surface>
    </motion.div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [active, setActive] = useState('Featured')

  useEffect(() => {
    let alive = true
    setStatus('loading')
    fetchProjects()
      .then((items) => {
        if (!alive) return
        setProjects(items)
        setStatus('ready')
      })
      .catch((err) => {
        if (!alive) return
        setStatus('error')
        setError(err?.message || 'Failed to load projects.')
      })
    return () => {
      alive = false
    }
  }, [])

  const categories = ['Featured', ...new Set(projects.map((p) => p.category).filter(Boolean))]
  const visible =
    active === 'Featured'
      ? projects
      : projects.filter((p) => (p.category || '').toLowerCase() === active.toLowerCase())

  return (
    <Page>
      <section className="py-14 sm:py-16">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Projects"
              title="Selected Work"
              desc="A curated selection of projects combining polished UI, smooth motion, and Firebase-backed features."
            />
          </Reveal>

          {status === 'loading' ? (
            <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Loading projects…</p>
          ) : null}
          {status === 'error' ? (
            <p className="text-sm font-medium text-rose-500">{error}</p>
          ) : null}

          {projects.length ? (
            <div className="mb-6 flex flex-wrap gap-2">
              {categories.map((c) => {
                const selected = c === active
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActive(c)}
                    className={
                      'rounded-full border px-4 py-2 text-sm font-bold transition-colors ' +
                      (selected
                        ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-md'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white')
                    }
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          ) : null}

          <div className="grid gap-8 md:grid-cols-2">
            {visible.map((p, i) => (
              <Reveal key={p.id || p.title} delay={0.04 * i}>
                <ProjectCard p={p} />
              </Reveal>
            ))}
          </div>


        </Container>
      </section>
    </Page>
  )
}

