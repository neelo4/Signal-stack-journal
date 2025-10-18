import { useState } from 'react'
import type { BlogPost } from '../data/posts'

type AboutMeProps = {
  latestPost?: BlogPost
  onSelectPost?: (slug: string) => void
}

const FORM_ENDPOINT = import.meta.env.VITE_FEEDBACK_FORM_ENDPOINT ?? ''

const AboutMe = ({ latestPost, onSelectPost }: AboutMeProps) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'missing'>('idle')

  const canSubmit = message.trim().length > 0

  return (
    <section className="rounded-[36px] bg-white shadow-soft ring-1 ring-rose/30">
      <div className="flex flex-col gap-6 px-8 py-10 md:flex-row md:items-center md:gap-10 md:px-12 md:py-12">
        <div className="relative flex shrink-0 items-center justify-center">
          <button
            type="button"
            className={`group relative flex h-28 w-28 items-center justify-center rounded-full p-[3px] transition duration-300 hover:scale-105 md:h-32 md:w-32 ${
              latestPost
                ? 'bg-gradient-to-tr from-rose via-rose to-rose shadow-[0_0_30px_rgba(245,70,123,0.45)] animate-pulse'
                : 'bg-gradient-to-tr from-ink/10 via-ink/15 to-ink/10'
            }`}
            onClick={() => {
              if (latestPost && onSelectPost) {
                onSelectPost(latestPost.slug)
              }
            }}
          >
            <span className="block h-full w-full overflow-hidden rounded-full border-4 border-white">
              <img
                src="/images/neelofar-khan.jpeg"
                alt="Neelofar Khan"
                className="h-full w-full object-cover"
              />
            </span>
          </button>
          {latestPost ? (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-rose/70 shadow-md">
              Latest Story
            </div>
          ) : null}
        </div>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-ink/75 md:text-base">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose/70">
              Designing interfaces that feel like instructions for ease.
            </p>
            <h2 className="text-3xl font-display font-semibold text-ink md:text-[2.6rem] md:leading-[1.15]">
              I make interfaces that help the body exhale.
            </h2>
          </div>
          <p className="text-[1.05rem] leading-relaxed text-ink/75 md:text-[1.1rem] md:leading-[1.75]">
            On Beauty &amp; Mind, I document the craft behind that feeling—code notes, motion choices,
            and the micro-habits that keep a UI honest. Less decoration, more nervous-system literacy.
            If a pixel can’t serve calm, it doesn’t ship.
          </p>
          {latestPost ? (
            <div className="mt-4 flex flex-col gap-4 rounded-[26px] border border-rose/30 bg-rose/10 px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onSelectPost?.(latestPost.slug)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose transition duration-200 hover:bg-rose/80 hover:text-white"
                >
                  View latest story
                  <span
                    aria-hidden="true"
                    className="translate-y-[1px] transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </button>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-rose/80">
                  {latestPost.title}
                </span>
              </div>
              <form
                className="grid gap-3 text-sm text-ink/70"
                action={FORM_ENDPOINT || '#'}
                method="POST"
                onSubmit={(event) => {
                  if (!FORM_ENDPOINT) {
                    event.preventDefault()
                    setStatus('missing')
                  }
                }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose/70">
                  Share your reflections
                </p>
                <input type="hidden" name="story" value={latestPost.title} />
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                    Name
                  </span>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="rounded-full border border-rose/30 bg-white px-4 py-2 text-sm text-ink focus:border-rose/60 focus:outline-none focus:ring-2 focus:ring-rose/40"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                    Email (optional)
                  </span>
                  <input
                    name="_replyto"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="rounded-full border border-rose/30 bg-white px-4 py-2 text-sm text-ink focus:border-rose/60 focus:outline-none focus:ring-2 focus:ring-rose/40"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-ink/50">
                    Comment
                  </span>
                  <textarea
                  name="message"
                  rows={3}
                  placeholder="What resonated with you?"
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full rounded-3xl border border-rose/30 bg-white px-4 py-3 text-sm text-ink focus:border-rose/60 focus:outline-none focus:ring-2 focus:ring-rose/40"
                />
                </label>
                <button
                  type={FORM_ENDPOINT ? 'submit' : 'button'}
                  disabled={!FORM_ENDPOINT || !canSubmit}
                  className={`inline-flex w-fit items-center justify-center rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] transition ${
                    FORM_ENDPOINT && canSubmit
                      ? 'bg-[#f2448b] text-white hover:bg-[#d83878]'
                      : 'cursor-not-allowed bg-rose/20 text-ink/40'
                  }`}
                  title={
                    FORM_ENDPOINT
                      ? canSubmit
                        ? 'Send your note'
                        : 'Add your message first'
                      : 'Add VITE_FEEDBACK_FORM_ENDPOINT to enable submissions'
                  }
                >
                  Send love
                </button>
                {FORM_ENDPOINT ? (
                  <p className="text-[11px] text-ink/50">
                    Your words come straight to me. Leave an email if you’d like me to write back.
                  </p>
                ) : (
                  <p className="text-[11px] text-rose/80">
                    Add `VITE_FEEDBACK_FORM_ENDPOINT` in your environment pointing to a Formspree (or
                    similar) endpoint to start collecting messages.
                  </p>
                )}
                {status === 'missing' ? (
                  <p className="text-[11px] font-semibold text-rose">
                    Submission blocked: configure `VITE_FEEDBACK_FORM_ENDPOINT` before publishing.
                  </p>
                ) : null}
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default AboutMe
