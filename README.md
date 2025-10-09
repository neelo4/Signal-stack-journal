# Vibe Coding · Beauty & Mind Blog

Modern React + TypeScript journal that blends beauty rituals with mental wellbeing. Each post renders with a full-bleed wallpaper highlight followed by rich article content and tag pills.

## Tech Stack

- React 19 with TypeScript and Vite 7
- Tailwind CSS 3.4 with custom palette, soft shadows, and editorial typography
- Content sourced from Markdown files in `src/content/posts/` for easy publishing

## Getting Started

```bash
npm install
npm run dev
```

Open the local dev server (usually http://localhost:5173) and edit files inside `src/`. Vite hot reloads changes instantly.

## Writing Posts

- Posts live as Markdown files under `src/content/posts/`.
- Each file begins with front matter (between `---`) for title, highlight, summary, metadata, and author details.
- The Markdown body renders with Tailwind typography so headings, lists, links, and tables just work.

To create a new entry, duplicate an existing `.md` file, adjust the front matter, and write your story in Markdown. The newest `publishedAt` date is chosen as the featured hero; others fall into the card grid automatically.

Click any card (or use the “View archive” button) to surface a different story in the hero without leaving the page.

> **Author photo:** Place your portrait at `public/images/neelofar-khan.jpeg` (or adjust the filename in each post front matter). The blog pulls this path for every byline. Replace the file whenever you want to refresh the image.

## Styling Notes

- Tailwind utilities and custom tokens are configured in `tailwind.config.js`
- Global fonts (Playfair Display + Plus Jakarta Sans) load in `src/index.css`
- Card shadows and pastel accents match the calm beauty/mental health aesthetic

## Production Build

```bash
npm run build   # outputs static assets to dist/
npm run preview # optional: run a local preview server
```

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
