import { posts } from '../src/data/posts'

console.log(posts.map((post) => ({ slug: post.slug, title: post.title, pinned: post.pinned, published: post.publishedAtISO })))
