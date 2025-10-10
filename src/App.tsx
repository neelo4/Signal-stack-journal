import { useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { posts } from './data/posts'
import AboutMe from './components/AboutMe'

type QuoteHighlightProps = {
  text: string
  variant?: 'hero' | 'card'
  accent?: string
}

const QuoteHighlight = ({ text, variant = 'hero' }: QuoteHighlightProps) => {
  const isHero = variant === 'hero'
  const borderColor = isHero ? '#d9dee7' : '#e1e6ef'
  const backgroundColor = isHero ? '#f2f4f8' : '#f5f6fa'
  const quoteColor = '#b0b7c6'

  return (
    <div
      className={`relative overflow-hidden ${isHero ? 'rounded-[28px] px-8 py-6 shadow-soft md:px-10 md:py-7' : 'rounded-3xl px-6 py-5 shadow-[0_14px_32px_-16px_rgba(0,0,0,0.2)]'}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: backgroundColor,
      }}
    >
      <span
        aria-hidden="true"
        className={`absolute font-display ${isHero ? 'left-6 top-3 text-5xl md:left-8 md:text-6xl' : 'left-4 top-2 text-4xl'}`}
        style={{ color: quoteColor }}
      >
        “
      </span>
      <p
        className={`text-ink ${isHero ? 'pl-9 text-[1.05rem] leading-7 md:pl-12 md:text-xl md:leading-8' : 'pl-8 text-[0.9rem] leading-6 md:text-[1rem] md:leading-6'}`}
        style={{
          fontWeight: 500,
        }}
      >
        {text}
      </p>
      <span
        aria-hidden="true"
        className={`absolute font-display ${isHero ? 'bottom-2 right-6 text-4xl md:bottom-3 md:right-8 md:text-5xl' : 'bottom-1 right-5 text-3xl'}`}
        style={{ color: quoteColor }}
      >
        ”
      </span>
    </div>
  )
}

function App() {
  const initialPinnedSlug = useMemo(() => {
    const pinnedPost = posts.find((post) => post.pinned)
    return pinnedPost?.slug ?? posts[0]?.slug ?? ''
  }, [])

  const [pinnedSlug, setPinnedSlug] = useState(initialPinnedSlug)
  const [activeSlug, setActiveSlug] = useState(initialPinnedSlug)

  const featured = useMemo(() => {
    if (!activeSlug) return posts[0]
    return posts.find((post) => post.slug === activeSlug) ?? posts[0]
  }, [activeSlug])

  const morePosts = useMemo(
    () => (featured ? posts.filter((post) => post.slug !== featured.slug) : posts),
    [featured],
  )

  const handleSelectPost = (slug: string) => {
    setActiveSlug(slug)
  }

  const handlePinPost = (slug: string) => {
    setPinnedSlug(slug)
    setActiveSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-rose/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/80">
            <span>Beauty & Mind</span>
          </div>
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
              <div className="flex items-center gap-3">
                <h2 className="max-w-3xl font-display text-3xl font-semibold tracking-tight md:text-5xl">
                  {featured.title}
                </h2>
                <button
                  type="button"
                  onClick={() => handlePinPost(featured.slug)}
                  className="rounded-full border border-white/40 bg-white/10 p-3 text-white transition hover:bg-white/25"
                  aria-label={
                    featured.slug === pinnedSlug
                      ? 'Pinned story'
                      : 'Pin this story to the top'
                  }
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={featured.slug === pinnedSlug ? '#F7BFD6' : 'none'}
                    stroke="#ffffff"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17v5" />
                    <path d="M8 3v5l-2 4h12l-2-4V3" />
                  </svg>
                </button>
              </div>
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
                  handleSelectPost(post.slug)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleSelectPost(post.slug)
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
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handlePinPost(post.slug)
                    }}
                    className="absolute right-5 top-5 rounded-full border border-white/40 bg-white/10 p-2 text-white transition hover:bg-white/25"
                    aria-label={
                      post.slug === pinnedSlug
                        ? 'Pinned story'
                        : 'Pin this story to the top'
                    }
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill={post.slug === pinnedSlug ? '#F2448B' : 'none'}
                      stroke="#ffffff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 17v5" />
                      <path d="M8 3v5l-2 4h12l-2-4V3" />
                    </svg>
                  </button>
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
                  <QuoteHighlight text={post.summary} variant="card" accent={post.accentColor} />
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

        <AboutMe
          latestPost={featured}
          onSelectPost={(slug) => {
            handleSelectPost(slug)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      </div>
    </div>
  )
}

export default App
