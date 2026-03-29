import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { parseUserAgent } from '@/lib/analytics'
import { verifyPassword } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('p')

    // Find the link
    const links = await sql`SELECT * FROM links WHERE slug = ${slug}`

    if (links.length === 0) {
      return NextResponse.redirect(new URL('/404', request.url))
    }

    const link = links[0]

    // Check if link is active
    if (!link.is_active) {
      return NextResponse.redirect(new URL('/link-disabled', request.url))
    }

    // Check if link is expired
    if (link.expires_at && new Date(link.expires_at as string) < new Date()) {
      return NextResponse.redirect(new URL('/link-expired', request.url))
    }

    // Check if password protected
    if (link.password_hash) {
      if (!password) {
        // Redirect to password page
        return NextResponse.redirect(new URL(`/p/${slug}`, request.url))
      }

      const isValid = await verifyPassword(password, link.password_hash as string)
      if (!isValid) {
        return NextResponse.redirect(new URL(`/p/${slug}?error=invalid`, request.url))
      }
    }

    // Track click
    const userAgent = request.headers.get('user-agent')
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               null
    const referer = request.headers.get('referer')

    const { device, browser, os } = parseUserAgent(userAgent)
    
    // Get geo from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || null
    const city = request.headers.get('x-vercel-ip-city') || null

    // Insert click record
    await sql`
      INSERT INTO clicks (link_id, ip_address, user_agent, referer, country, city, device_type, browser, os)
      VALUES (${link.id}, ${ip}, ${userAgent}, ${referer}, ${country}, ${city}, ${device}, ${browser}, ${os})
    `

    // Update click count
    await sql`
      UPDATE links SET click_count = click_count + 1 WHERE id = ${link.id}
    `

    // Redirect to original URL
    return NextResponse.redirect(link.original_url as string)
  } catch (error) {
    console.error('Redirect error:', error)
    return NextResponse.redirect(new URL('/error', request.url))
  }
}
