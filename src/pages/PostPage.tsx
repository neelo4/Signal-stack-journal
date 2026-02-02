import { Link, useNavigate, useParams } from 'react-router-dom'
import QuoteHighlight from '../components/QuoteHighlight'
import { usePosts } from '../hooks/usePosts'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const PostPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { posts, isLoadingPosts } = usePosts()

  const post = posts.find((story) => story.slug === slug) ?? posts[0]

  if (!post && isLoadingPosts) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f3f5f8] px-6">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-semibold uppercase tracking-[0.28em] text-ink/60 shadow-soft">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-rose/30 border-t-rose" />
          Loading story…
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f3f5f8] px-6 text-center text-ink/70">
        <h1 className="text-4xl font-display font-semibold text-ink">Story not found</h1>
        <p>This link may be outdated. Head back to the journal to explore the latest posts.</p>
        <Link
          to="/"
          className="rounded-full bg-rose/70 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white shadow-soft"
        >
          Return home
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f3f5f8] text-ink">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 pb-24 pt-16 md:px-10">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="self-start rounded-full border border-ink/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink/60 transition hover:text-ink"
        >
          ← Back
        </button>
        <article className="overflow-hidden rounded-[42px] bg-white shadow-soft ring-1 ring-white/70">
          <div className="relative h-[380px] w-full overflow-hidden bg-ink">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-transparent" />
            <div className="absolute inset-x-8 bottom-10 flex flex-col gap-4 text-white md:inset-x-12 md:bottom-16">
              <span className="inline-flex w-fit items-center rounded-full bg-white/20 px-4 py-1 text-xs font-medium uppercase tracking-[0.35em] text-white/95">
                {post.category}
              </span>
              <h1 className="font-display text-3xl font-semibold tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="max-w-2xl text-base text-white/80 md:text-lg">{post.highlight}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="inline-flex items-center gap-2">
                  <img src={post.author.avatar} alt={post.author.name} className="h-9 w-9 rounded-full border border-white/30 object-cover" />
                  <span className="font-medium text-white">{post.author.name}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/60" />
                <span>{post.publishedAt}</span>
                <span className="h-1 w-1 rounded-full bg-white/60" />
                <span>{post.readingTime}</span>
              </div>
            </div>
          </div>
          <div className="space-y-8 px-8 py-12 text-base leading-relaxed text-slate-600 md:px-12 md:py-16 md:text-lg">
            <QuoteHighlight text={post.summary} variant="hero" />
            <div className="prose prose-lg max-w-none text-slate-600 prose-headings:font-display prose-headings:text-ink prose-strong:text-ink prose-a:text-ink prose-a:font-semibold hover:prose-a:text-ink/80">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
            </div>
            <div className="flex flex-wrap gap-3 pt-4">
              {post.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center rounded-full bg-blush px-4 py-2 text-sm font-medium text-ink/80">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export default PostPage
