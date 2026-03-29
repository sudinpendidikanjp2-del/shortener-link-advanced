import { nanoid } from 'nanoid'
import { sql } from './db'

export function generateSlug(): string {
  return nanoid(7)
}

export function isValidSlug(slug: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(slug) && slug.length >= 3 && slug.length <= 50
}

export async function isSlugAvailable(slug: string, excludeLinkId?: string): Promise<boolean> {
  const query = excludeLinkId
    ? await sql`SELECT id FROM links WHERE slug = ${slug} AND id != ${excludeLinkId}`
    : await sql`SELECT id FROM links WHERE slug = ${slug}`
  return query.length === 0
}
