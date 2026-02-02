import { useEffect, useState } from 'react'
import { posts as localPosts } from '../data/posts'
import type { BlogPost } from '../data/posts'
import { supabase, hasSupabaseConfig } from '../lib/supabaseClient'
import { mapRowToPost, mergePosts, sortPosts } from '../lib/postUtils'

export const usePosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>(localPosts)
  const [isLoadingPosts, setLoadingPosts] = useState<boolean>(hasSupabaseConfig)

  useEffect(() => {
    if (!supabase) return
    const client = supabase
    let isCancelled = false

    const loadPosts = async () => {
      setLoadingPosts(true)
      const { data, error } = await client
        .from('posts')
        .select('*')
        .order('pinned', { ascending: false })
        .order('published_at', { ascending: false })

      if (!isCancelled) {
        if (error) {
          console.error('[Supabase] Failed to load posts', error)
        } else if (data && Array.isArray(data)) {
          const mapped = data
            .map((row) => mapRowToPost(row))
            .filter((post): post is BlogPost => Boolean(post))

          const merged = sortPosts(mergePosts(mapped, localPosts))
          setPosts(merged.length > 0 ? merged : localPosts)
        }
        setLoadingPosts(false)
      }
    }

    loadPosts()
    return () => {
      isCancelled = true
    }
  }, [])

  return { posts, isLoadingPosts }
}
