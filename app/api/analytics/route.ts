import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get total clicks for user's links
    const totalClicksResult = await sql`
      SELECT COUNT(*) as total
      FROM clicks c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ${user.id}
    `

    // Get total links
    const totalLinksResult = await sql`
      SELECT COUNT(*) as total FROM links WHERE user_id = ${user.id}
    `

    // Get clicks over time (last 30 days)
    const clicksOverTime = await sql`
      SELECT 
        DATE(c.clicked_at) as date,
        COUNT(*) as clicks
      FROM clicks c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ${user.id}
        AND c.clicked_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(c.clicked_at)
      ORDER BY date ASC
    `

    // Get top performing links
    const topLinks = await sql`
      SELECT 
        l.id,
        l.slug,
        l.original_url,
        l.title,
        COUNT(c.id) as clicks
      FROM links l
      LEFT JOIN clicks c ON l.id = c.link_id
      WHERE l.user_id = ${user.id}
      GROUP BY l.id
      ORDER BY clicks DESC
      LIMIT 5
    `

    // Get device breakdown
    const deviceBreakdown = await sql`
      SELECT 
        c.device_type as name,
        COUNT(*) as value
      FROM clicks c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ${user.id}
      GROUP BY c.device_type
    `

    // Get browser breakdown
    const browserBreakdown = await sql`
      SELECT 
        c.browser as name,
        COUNT(*) as value
      FROM clicks c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ${user.id}
      GROUP BY c.browser
      ORDER BY value DESC
      LIMIT 5
    `

    // Get country breakdown
    const countryBreakdown = await sql`
      SELECT 
        COALESCE(c.country, 'Unknown') as name,
        COUNT(*) as value
      FROM clicks c
      JOIN links l ON c.link_id = l.id
      WHERE l.user_id = ${user.id}
      GROUP BY c.country
      ORDER BY value DESC
      LIMIT 10
    `

    return NextResponse.json({
      totalClicks: parseInt(totalClicksResult[0]?.total || '0'),
      totalLinks: parseInt(totalLinksResult[0]?.total || '0'),
      clicksOverTime,
      topLinks,
      deviceBreakdown,
      browserBreakdown,
      countryBreakdown
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
  }
}
