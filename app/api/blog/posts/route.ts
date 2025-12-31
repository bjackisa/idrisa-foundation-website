import { NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET() {
  try {
    const posts = await sql`
      SELECT id, title, slug, category, author, author_role, lead_text, 
             content, tags, published_at
      FROM blog_posts 
      WHERE is_published = true 
      ORDER BY published_at DESC
    `
    
    // Parse tags JSON
    const postsWithTags = posts.map(post => ({
      ...post,
      tags: post.tags ? JSON.parse(post.tags) : []
    }))
    
    return NextResponse.json({ posts: postsWithTags })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json({ error: "Failed to fetch blog posts" }, { status: 500 })
  }
}