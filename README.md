# Vibe Coding · Beauty & Mind

Beauty & Mind is a mindful-tech journal that blends calming digital rituals, nervous-system aware beauty practices, and AI-assisted habit design. Each story opens with a full-bleed hero, scroll-friendly Markdown content, and soft‑tone quote highlights.

## Tech Stack

- React 19 + TypeScript (Vite 7)
- Tailwind CSS 3.4 (custom palette, soft shadows, Avenir typography)
- Supabase Postgres for content (optional Markdown fallback during development)
- Formspree for the “Send Love” feedback form
- Vercel for hosting, Vercel Analytics + Google Analytics 4 for metrics

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 and the site will hot-reload as you edit.

## Writing Posts

- **Supabase-first**: By default the app fetches posts from the Supabase `posts` table. Each row mirrors the fields used in the UI (slug, title, highlight, summary, markdown content, tags, pinned, accent color, author info, etc.).
- **Markdown fallback**: During development you can still drop `.md` files into `src/content/posts/`. If Supabase credentials are missing, the app renders the Markdown collection instead.
- Set `pinned: true` on a single story to make it the hero feature.

### Supabase schema

```sql
create table posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  highlight text,
  category text,
  cover_image text,
  reading_time text,
  published_at timestamptz,
  summary text,
  content text,
  tags text[],
  pinned boolean default false,
  accent_color text,
  author_name text,
  author_role text,
  author_avatar text
);
```

Seed examples live in `src/content/posts/` (for reference) and in the Supabase SQL inserts under `/docs`.

## Styling Notes

- Tailwind config lives in `tailwind.config.js` (Avenir primary font, Sora/Plus Jakarta fallbacks).
- Global styles and Google Fonts imports are in `src/index.css`.
- Featured quotes use pink gradients, supporting quotes use neutral greys. Adjust `QuoteHighlight` in `src/App.tsx` if you tweak the palette.

## Production Build

```bash
npm run build   # outputs static assets to dist/
npm run preview # optional: run a local preview server
```

## Analytics & SEO

- Vercel Analytics is enabled via `<Analytics />` in `src/main.tsx`.
- Google Analytics 4: set `VITE_GA_MEASUREMENT_ID` locally and in Vercel.
  - In Vercel: Project → Settings → Environment Variables → add the same key/value in the Production environment and redeploy.
- Formspree feedback form: set `VITE_FEEDBACK_FORM_ENDPOINT=https://formspree.io/f/your-id`.
- Meta tags are in `index.html`; social preview image lives at `public/social-card.jpg`.

## Optional: Supabase CMS

Switch from local Markdown to Supabase:

1. Create a Supabase project and copy the project URL + anon key.
2. In the Supabase SQL editor, run a migration to create a `posts` table that mirrors the app fields: `slug`, `title`, `highlight`, `category`, `cover_image`, `reading_time`, `published_at`, `summary`, `content`, `tags` (text array or comma-separated text), `pinned`, `accent_color`, plus `author_name`, `author_role`, `author_avatar`.
3. Seed the table with your current stories (insert manually, via CSV, or with a quick script).
4. Add credentials:
   - `.env.local`: `VITE_SUPABASE_URL=...` and `VITE_SUPABASE_ANON_KEY=...`
   - Vercel → Settings → Environment Variables → add the same keys
5. Redeploy. When credentials exist the app fetches posts from Supabase; otherwise it falls back to the Markdown files.

## Deploying to Vercel

1. Push this repo to GitHub or GitLab.
2. In Vercel, create a new project and import the repository.
3. Use the default settings:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `dist`
4. Trigger a deploy. Once live, add your custom domain in Vercel’s dashboard.

Vercel handles HTTPS automatically. Re‑deploys happen whenever you push new commits to the connected branch.

### Connecting Your Custom Domain

1. Buy your domain from any registrar (Namecheap, Google Domains, GoDaddy, etc.).
2. In Vercel, open the project → **Settings → Domains** → **Add** and enter the domain you purchased.
3. Vercel shows the exact DNS records to create at your registrar. Log into the registrar dashboard and add the provided A or CNAME records.
4. Wait for DNS to propagate (usually a few minutes, occasionally up to 24 hours). Vercel will mark the domain as “Verified” when the records are live.
5. Set one domain as the primary in Vercel so that `www` and root traffic redirect consistently.

After DNS is verified, every new deploy automatically publishes to your custom domain with a valid SSL certificate.
