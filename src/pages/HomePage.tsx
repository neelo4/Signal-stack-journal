import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import AboutMe from '../components/AboutMe'
import QuoteHighlight from '../components/QuoteHighlight'
import { hasSupabaseConfig } from '../lib/supabaseClient'
import { usePosts } from '../hooks/usePosts'

const HomePage = () => {
  const navigate = useNavigate()
  const { posts, isLoadingPosts } = usePosts()
  const [pinnedSlug, setPinnedSlug] = useState<string>('')
  const [activeSlug, setActiveSlug] = useState<string>('')

  useEffect(() => {
    if (!posts.length) return
    const pinned = posts.find((post) => post.pinned)
    const fallback = pinned?.slug ?? posts[0]?.slug ?? ''

    setPinnedSlug((prev) => {
      if (prev && posts.some((post) => post.slug === prev)) {
        return prev
      }
      return fallback
    })

    setActiveSlug((prev) => {
      if (prev && posts.some((post) => post.slug === prev)) {
        return prev
      }
      return fallback
    })
  }, [posts])

  const featured = useMemo(() => {
    if (!activeSlug) return posts[0]
    return posts.find((post) => post.slug === activeSlug) ?? posts[0]
  }, [activeSlug, posts])

  const pinnedStories = useMemo(() => posts.filter((post) => post.pinned), [posts])

  const additionalPinned = useMemo(
    () => pinnedStories.filter((post) => post.slug !== featured?.slug),
    [pinnedStories, featured],
  )

  const morePosts = useMemo(() => {
    const remaining = featured ? posts.filter((post) => post.slug !== featured.slug) : posts
    return remaining
  }, [featured, posts])

  const handlePreviewPost = (slug: string) => {
    setActiveSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePinPost = (slug: string) => {
    setPinnedSlug(slug)
    setActiveSlug(slug)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleOpenPost = (slug: string) => {
    navigate(`/post/${slug}`)
  }

  if (!featured) {
    if (isLoadingPosts) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-6">
          <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-ink/60 shadow-soft">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-rose/30 border-t-rose" />
            Syncing stories…
          </div>
        </div>
      )
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-6 text-center text-ink/60">
        <div className="max-w-md space-y-4">
          <span className="inline-flex items-center rounded-full bg-rose/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/70">
            Signal Stack Journal
          </span>
          <h1 className="text-3xl font-display font-semibold text-ink">No stories yet</h1>
          <p className="text-sm leading-relaxed">
            Publish your first entry from Supabase and it will appear here instantly.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-ink">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-28 md:px-10 md:pt-20 lg:pt-16">
        {hasSupabaseConfig && isLoadingPosts ? (
          <div className="rounded-full bg-rose/20 px-5 py-2 text-center text-xs font-semibold uppercase tracking-[0.28em] text-rose/80">
            Syncing stories from Supabase…
          </div>
        ) : null}

        <header className="flex flex-col gap-4 pb-10">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-rose/60 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-ink/80">
            <span>Signal Stack Journal</span>
          </div>
          <h1 className="text-3xl font-display font-semibold leading-snug text-ink md:text-[3.2rem]">
            Tinkering until JavaScript behaves.
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-ink/70 md:text-lg md:leading-[1.85]">
            I publish the lessons I wish someone had handed me-how event loops really behave, why closures
            rescue state, and the React rituals that turn experiments into trustworthy products.
          </p>
          <div className="h-[3px] w-20 rounded-full bg-rose/60" />
        </header>

        <div className="flex flex-col gap-3">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-rose/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose/80">
            Featured story
          </span>
          <article
            className="overflow-hidden rounded-[42px] bg-white shadow-soft ring-1 ring-white/70 cursor-pointer"
            onClick={() => handleOpenPost(featured.slug)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleOpenPost(featured.slug)
              }
            }}
            role="button"
            tabIndex={0}
          >
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
                <div className="flex flex-wrap items-center gap-3">
                <h2 className="max-w-3xl font-display text-3xl font-semibold leading-snug tracking-tight md:text-[2.6rem]">
                  {featured.title}
                </h2>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      handlePinPost(featured.slug)
                    }}
                    className="rounded-full border border-white/40 bg-white/10 p-3 text-white transition hover:bg-white/25"
                    aria-label={
                      featured.slug === pinnedSlug ? 'Pinned story' : 'Pin this story to the top'
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
                <p
                  className="max-w-2xl text-base text-white md:text-lg"
                  style={{ textShadow: '0 6px 18px rgba(0,0,0,0.45)' }}
                >
                  {featured.highlight}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="inline-flex items-center gap-2">
                    <img
                      src={featured.author.avatar}
                      alt={featured.author.name}
                      className="h-9 w-9 rounded-full border border-white/30 object-cover"
                    />
                    <span className="font-medium text-white">{featured.author.name}</span>
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
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{featured.content}</ReactMarkdown>
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
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleOpenPost(featured.slug)
                }}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-soft transition hover:bg-ink/90"
              >
                Read as standalone
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        </div>

        {additionalPinned.length > 0 ? (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-display font-semibold text-ink md:text-3xl">
                  Featured collection
                </h2>
                <p className="text-sm text-ink/60 md:text-base">
                  Other spotlight stories you can revisit anytime.
                </p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {additionalPinned.map((post) => (
                <article
                  key={post.slug}
                  className="group cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:ring-rose/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/70"
                  onClick={() => handleOpenPost(post.slug)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      handleOpenPost(post.slug)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white">
                      {post.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-4 px-6 py-6 text-sm text-slate-600">
                    <h3 className="font-display text-xl text-ink">{post.title}</h3>
                    <p className="text-sm text-ink/80">{post.summary}</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        className="rounded-full border border-rose/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose"
                        onClick={(event) => {
                          event.stopPropagation()
                          handlePreviewPost(post.slug)
                        }}
                      >
                        Preview here
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-rose/60 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-ink transition hover:bg-rose/80"
                      >
                        Read spotlight
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-10">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-ink md:text-3xl">More luminous reads</h3>
              <p className="text-sm text-ink/60 md:text-base">
                Explore lessons that keep your build honest without the fluff.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (morePosts[0]) {
                  handleOpenPost(morePosts[0].slug)
                }
              }}
              className="text-left text-sm font-semibold uppercase tracking-[0.3em] text-ink/50 transition hover:text-ink/80"
            >
              View archive
            </button>
          </div>

          <div className={`grid gap-8 ${morePosts.length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
            {morePosts.map((post) => (
              <article
                key={post.slug}
                role="button"
                tabIndex={0}
                onClick={() => handleOpenPost(post.slug)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    handleOpenPost(post.slug)
                  }
                }}
                className="group w-full cursor-pointer overflow-hidden rounded-[32px] bg-white shadow-soft ring-1 ring-transparent transition duration-300 hover:-translate-y-1 hover:ring-sky/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky/70"
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
                    aria-label={post.slug === pinnedSlug ? 'Pinned story' : 'Pin this story to the top'}
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
                    <h4 className="font-display text-2xl leading-snug">{post.title}</h4>
                    <p className="max-w-sm text-sm text-white/80">{post.highlight}</p>
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
                      <span key={tag} className="inline-flex items-center rounded-full bg-mint px-3 py-1 text-xs font-semibold text-ink/70">
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
            handleOpenPost(slug)
          }}
        />
      </div>
    </div>
  )
}

export default HomePage
