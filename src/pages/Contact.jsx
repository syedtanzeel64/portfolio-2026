import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PROFILE } from '../content/profile'
import { Page, Reveal } from '../components/Motion'
import { ButtonLink, Container, Surface } from '../components/Ui'

export default function Contact() {
  const { settings } = useOutletContext() || {}
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  // Resolve phone dynamically from backend
  const rawPhone = settings?.phone || settings?.socials?.whatsapp || PROFILE.links.whatsapp || ''
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '')
  const displayPhone = rawPhone || 'Not set'

  // Resolve email dynamically from backend
  const contactEmail = settings?.email || PROFILE.links.email || ''

  const canSend = useMemo(() => {
    const name = form.name.trim()
    const message = form.message.trim()
    return Boolean(name && message && cleanPhone)
  }, [form.name, form.message, cleanPhone])

  function onSubmit(e) {
    e.preventDefault()
    if (!canSend) return
    setStatus('sending')

    const emailLine = form.email.trim() ? `\nEmail: ${form.email.trim()}` : ''
    const text = `Hi, I'm ${form.name.trim()}.${emailLine}\n\n${form.message.trim()}`
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')

    setStatus('sent')
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <Page>
      <section className="py-14 sm:py-16">
        <Container>
          <Reveal>
            <div className="mb-8 sm:mb-10">
              <p className="text-xs font-bold tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
                Contact
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Let’s build something great
              </h2>
              <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                Send a direct message on WhatsApp to discuss your project.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal>
              <Surface className="p-8 lg:col-span-2">
                <form className="grid gap-6 sm:grid-cols-2" onSubmit={onSubmit}>
                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name *</span>
                    <input
                      className="h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email (optional)</span>
                    <input
                      type="email"
                      className="h-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    />
                  </label>

                  <label className="grid gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message *</span>
                    <textarea
                      className="min-h-[160px] resize-y rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:border-zinc-900 dark:focus:border-white focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-white"
                      placeholder="Tell me about your project..."
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    />
                  </label>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-4 mt-2">
                    {cleanPhone ? (
                      <button
                        type="submit"
                        disabled={!canSend || status === 'sending'}
                        className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#1DA851] disabled:cursor-not-allowed disabled:opacity-60 shadow-md hover:shadow-lg"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.298-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>
                        {status === 'sending' ? 'Redirecting…' : 'Send via WhatsApp'}
                      </button>
                    ) : (
                      <p className="text-sm text-amber-600 font-medium">⚠ WhatsApp number not set in admin panel.</p>
                    )}
                  </div>

                  {status === 'sent' ? (
                    <p className="sm:col-span-2 text-sm font-medium text-emerald-600">
                      ✓ Opening WhatsApp — thanks for reaching out!
                    </p>
                  ) : null}

                </form>
              </Surface>
            </Reveal>

            <Reveal delay={0.08}>
              <Surface className="p-8 h-full bg-zinc-50 dark:bg-zinc-900/40 border-zinc-100 dark:border-zinc-800">
                {cleanPhone ? (
                  <>
                    <p className="text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">WhatsApp</p>
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block text-xl font-bold text-[#25D366] hover:underline break-all"
                    >
                      {displayPhone}
                    </a>
                  </>
                ) : (
                  <p className="text-sm text-amber-600">⚠ WhatsApp not set. Add it in the admin panel.</p>
                )}

                {contactEmail && (
                  <>
                    <p className="mt-8 text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Email</p>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="mt-2 block text-base font-semibold text-zinc-900 dark:text-white hover:underline break-all"
                    >
                      {contactEmail}
                    </a>
                  </>
                )}

                <p className="mt-8 text-sm font-bold tracking-widest uppercase text-zinc-400 dark:text-zinc-500">Social</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {(settings?.socials?.github || PROFILE.links.github) && (
                    <a
                      className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
                      href={settings?.socials?.github || PROFILE.links.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                  {(settings?.socials?.linkedin || PROFILE.links.linkedin) && (
                    <a
                      className="rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white transition-colors shadow-sm"
                      href={settings?.socials?.linkedin || PROFILE.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      LinkedIn
                    </a>
                  )}
                </div>
              </Surface>
            </Reveal>
          </div>
        </Container>
      </section>
    </Page>
  )
}

