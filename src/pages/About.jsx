import { useOutletContext } from 'react-router-dom'
import { PROFILE } from '../content/profile'
import { Page, Reveal } from '../components/Motion'
import { Chip, Container, SectionHeading, Surface } from '../components/Ui'

export default function About() {
  const { settings } = useOutletContext() || {}

  const defaults = {
    aboutImage: '',
    aboutBio: 'I craft elegant and responsive frontend experiences...',
    tagline: PROFILE.title,
    email: PROFILE.links.email,
  }

  const effectiveSettings = {
    ...defaults,
    ...settings,
    aboutImage: settings?.aboutImage || defaults.aboutImage,
    aboutBio: settings?.aboutBio || defaults.aboutBio,
    skills: settings?.skills || PROFILE.skills,
  }

  return (
    <Page>

      {/* ── About Header ── */}
      <section className="py-24 sm:py-32">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Behind the Code"
              title="About Me"
              desc="Turning bold ideas into scalable, beautiful digital products."
            />
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-2 items-start mt-12 relative z-10">
            <Reveal>
              <div className="rounded-3xl border border-white/40 dark:border-white/10 surface shadow-xl shadow-zinc-900/5 dark:shadow-black/50 overflow-hidden">
                {effectiveSettings.aboutImage ? (
                  <img
                    src={effectiveSettings.aboutImage}
                    alt="About Me"
                    className="w-full aspect-[4/5] sm:aspect-square object-cover object-center"
                  />
                ) : (
                  <div className="w-full aspect-[4/5] sm:aspect-square overflow-hidden">
                    <div className="skeleton w-full h-full" />
                  </div>
                )}
              </div>
            </Reveal>

            <div className="flex flex-col gap-6">
              <Reveal delay={0.1}>
                <Surface className="p-8">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">My Story</h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg whitespace-pre-wrap">
                    {effectiveSettings.aboutBio}
                  </p>
                </Surface>
              </Reveal>

              {/* Quick facts */}
              <Reveal delay={0.15}>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Location', value: PROFILE.location },
                    { label: 'Role', value: PROFILE.title },
                    { label: 'Availability', value: 'Open to work' },
                    { label: 'Focus', value: 'Frontend & Firebase' },
                  ].map((fact) => (
                    <Surface key={fact.label} className="p-5">
                      <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">{fact.label}</p>
                      <p className="mt-1.5 text-sm font-semibold text-zinc-900 dark:text-white">{fact.value}</p>
                    </Surface>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Skills ── */}
      <section className="py-14 sm:py-20 bg-zinc-50 dark:bg-zinc-950 border-y border-zinc-100 dark:border-zinc-900">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Skills"
              title="Tech Arsenal"
              desc="The tools and technologies I reach for to bring products to life."
            />
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-8 sm:grid-cols-3 mt-8">
              <Surface className="p-7">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-4">Frontend</p>
                <div className="flex flex-wrap gap-2">
                  {(effectiveSettings.skills.frontend || PROFILE.skills.frontend).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </Surface>
              <Surface className="p-7">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-4">Backend</p>
                <div className="flex flex-wrap gap-2">
                  {(effectiveSettings.skills.backend || PROFILE.skills.backend).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </Surface>
              <Surface className="p-7">
                <p className="text-xs font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mb-4">Tooling</p>
                <div className="flex flex-wrap gap-2">
                  {(effectiveSettings.skills.tooling || PROFILE.skills.tooling).map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </Surface>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Experience Timeline ── */}
      <section className="py-14 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Experience"
              title="Work History"
              desc="A record of the roles and projects that have shaped my skills and perspective."
            />
          </Reveal>

          <div className="mt-10 relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-zinc-200 dark:bg-zinc-800 sm:left-6" />

            <div className="space-y-10">
              {PROFILE.experience.map((exp, i) => (
                <Reveal key={exp.role + exp.company} delay={0.05 * i}>
                  <div className="relative pl-12 sm:pl-16">
                    {/* Dot */}
                    <div className="absolute left-2.5 sm:left-4 top-1 h-3 w-3 rounded-full border-2 border-zinc-900 dark:border-white bg-white dark:bg-zinc-900" />

                    <Surface className="p-7">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{exp.role}</h3>
                          <p className="mt-1 text-sm font-semibold text-zinc-600 dark:text-zinc-400">{exp.company}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                            {exp.period}
                          </span>
                          <span className="rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            {exp.type}
                          </span>
                        </div>
                      </div>
                      <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{exp.desc}</p>
                      <ul className="mt-5 space-y-2">
                        {(exp.highlights || []).map((h) => (
                          <li key={h} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </Surface>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Education ── */}
      <section className="py-14 sm:py-20 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Education"
              title="Academic Background"
              desc="The foundation that underpins everything I build."
            />
          </Reveal>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {PROFILE.education.map((edu, i) => (
              <Reveal key={edu.degree} delay={0.05 * i}>
                <Surface className="p-8 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900/5 dark:bg-white/10 flex items-center justify-center text-zinc-900 dark:text-white flex-shrink-0">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-900 dark:text-white">{edu.degree}</h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">{edu.institution}</p>
                    </div>
                  </div>
                  <span className="self-start rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                    {edu.period}
                  </span>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{edu.desc}</p>
                </Surface>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Values ── */}
      <section className="py-14 sm:py-24">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="My Approach"
              title="What I Stand For"
              desc="The principles that guide every project I take on."
            />
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Clarity Over Complexity',
                desc: 'Clean code and clear communication matter as much as a polished UI. I keep things simple, maintainable, and well-documented.',
              },
              {
                title: 'Details Matter',
                desc: 'The difference between good and great lies in the spacing, the transitions, and the micro-interactions that make a product feel alive.',
              },
              {
                title: 'Client-First Mindset',
                desc: "I treat every project as if it were my own. Your goals, your timeline, and your satisfaction are always the priority.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={0.05 * i}>
                <Surface className="p-8 h-full hover:bg-white/90 dark:hover:bg-zinc-800/80 transition-colors">
                  <div className="h-10 w-10 rounded-xl bg-zinc-900 dark:bg-white flex items-center justify-center mb-5">
                    <span className="text-white dark:text-zinc-900 font-black text-lg">{i + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">{v.title}</h3>
                  <p className="mt-3 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">{v.desc}</p>
                </Surface>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

    </Page>
  )
}
