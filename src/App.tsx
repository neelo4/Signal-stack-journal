import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { posts } from './data/posts'

type QuoteHighlightProps = {
  text: string
  variant?: 'hero' | 'card'
}

const QuoteHighlight = ({ text, variant = 'hero' }: QuoteHighlightProps) => {
  const isHero = variant === 'hero'

  const containerClasses = isHero
    ? 'relative overflow-hidden rounded-[28px] border border-rose/50 bg-rose/25 px-8 py-6 shadow-soft md:px-10 md:py-7'
    : 'relative overflow-hidden rounded-3xl border border-rose/40 bg-rose/20 px-6 py-5 shadow-[0_12px_30px_-20px_rgba(245,70,123,0.55)]'

  const textClasses = isHero
    ? 'pl-9 text-lg font-medium text-ink/90 md:pl-12 md:text-2xl'
    : 'pl-8 text-sm font-medium text-ink/85 md:text-base'

  const openingQuoteClasses = isHero
    ? 'absolute left-6 top-3 font-display text-5xl text-rose/70 md:left-8 md:text-6xl'
    : 'absolute left-4 top-2 font-display text-4xl text-rose/60'

  const closingQuoteClasses = isHero
    ? 'absolute bottom-2 right-6 font-display text-4xl text-rose/60 md:bottom-3 md:right-8 md:text-5xl'
    : 'absolute bottom-1 right-5 font-display text-3xl text-rose/50'

  return (
    <div className={containerClasses}>
      <span aria-hidden="true" className={openingQuoteClasses}>
        “
      </span>
      <p className={textClasses}>{text}</p>
      <span aria-hidden="true" className={closingQuoteClasses}>
        ”
      </span>
    </div>
  )
}

function App() {
  const [activeSlug, setActiveSlug] = useState(posts[0]?.slug ?? '')
  const featured = useMemo(() => {
    if (!activeSlug) return posts[0]
    return posts.find((post) => post.slug === activeSlug) ?? posts[0]
  }, [activeSlug])
  const morePosts = useMemo(
    () => (featured ? posts.filter((post) => post.slug !== featured.slug) : posts),
    [featured],
  )

  if (!featured) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-6 text-center text-ink/60">
        <div className="max-w-md space-y-4">
          <span className="inline-flex items-center rounded-full bg-rose/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/70">
            Beauty & Mind
          </span>
          <h1 className="text-3xl font-display font-semibold text-ink">
            Add your first story
          </h1>
          <p className="text-sm leading-relaxed">
            Drop a Markdown file into <code>src/content/posts/</code> and restart
            the dev server. The newest publish date will appear here automatically.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-14 md:px-10">
        <header className="flex flex-col gap-4 pb-10">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/80">
            Beauty & Mind
          </span>
          <h1 className="text-4xl font-display font-semibold leading-tight text-ink md:text-5xl">
            Daily rituals for glowing skin and grounded minds.
          </h1>
          <p className="max-w-2xl text-base text-ink/70 md:text-lg">
            A slow-beauty journal blending modern skincare science with mindful
            practices that keep your nervous system calm.
          </p>
          <div className="h-[3px] w-20 rounded-full bg-rose/60" />
        </header>

        <article className="overflow-hidden rounded-[42px] bg-white shadow-soft ring-1 ring-white/70">
          <div className="relative h-[420px] w-full overflow-hidden bg-ink">
            <img
              src={featured.coverImage}
              alt={featured.title}
              className="h-full w-full object-cover transition duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <div className="absolute inset-x-8 bottom-12 flex flex-col gap-5 text-white md:inset-x-16 md:bottom-16">
              <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white/95">
                {featured.category}
              </span>
              <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {featured.title}
              </h2>
              <p className="max-w-2xl text-base text-white/80 md:text-lg">
                {featured.highlight}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="h-9 w-9 rounded-full border border-white/30 object-cover"
                  />
                  <span className="font-medium text-white">
                    {featured.author.name}
                  </span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/60" />
                <span>{featured.publishedAt}</span>
                <span className="h-1 w-1 rounded-full bg-white/60" />
                <span>{featured.readingTime}</span>
              </div>
            </div>
          </div>

          <div className="space-y-8 px-8 py-12 text-base leading-relaxed text-slate-600 md:px-12 md:py-16 md:text-lg">
            <QuoteHighlight text={featured.summary} variant="hero" />
            <div className="prose prose-lg max-w-none text-slate-600 prose-headings:font-display prose-headings:text-ink prose-strong:text-ink prose-a:text-ink prose-a:font-semibold hover:prose-a:text-ink/80">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {featured.content}
              </ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {featured.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-blush px-4 py-2 text-sm font-medium text-ink/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>

        <section className="space-y-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink md:text-3xl">
                More luminous reads
              </h3>
              <p className="text-sm text-ink/60 md:text-base">
                Explore rituals that nurture your glow without compromising
                mental clarity.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (morePosts[0]) {
                  setActiveSlug(morePosts[0].slug)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }
              }}
              className="text-left text-sm font-semibold uppercase tracking-[0.3em] text-ink/50 transition hover:text-ink/80"
            >
              View archive
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {morePosts.map((post) => (
              <article
                key={post.slug}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setActiveSlug(post.slug)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    setActiveSlug(post.slug)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }
                }}
                className="group cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:ring-sky/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky/70"
              >
                <div className="relative h-64 w-full overflow-hidden bg-ink/5">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent opacity-90 transition duration-300 group-hover:opacity-100" />
                  <div className="absolute bottom-6 left-6 flex flex-col gap-3 text-white">
                    <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/90">
                      {post.category}
                    </span>
                    <h4 className="font-display text-2xl leading-snug">
                      {post.title}
                    </h4>
                    <p className="max-w-sm text-sm text-white/80">
                      {post.highlight}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-5 px-7 py-8 text-sm text-slate-600">
                  <QuoteHighlight text={post.summary} variant="card" />
                  <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.25em] text-ink/40">
                    <span>{post.publishedAt}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/30" />
                    <span>{post.readingTime}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink/70"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
