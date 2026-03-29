import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession } from '@/lib/auth'
import { generateQRCodeWithLogo } from '@/lib/qrcode'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { searchParams } = new URL(request.url)
    const baseUrl = searchParams.get('baseUrl') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Check ownership or admin
    const links = await sql`SELECT * FROM links WHERE id = ${id}`
    if (links.length === 0) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }

    const link = links[0]
    if (link.user_id !== session.userId && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const shortUrl = `${baseUrl}/${link.slug}`
    const qrCode = await generateQRCodeWithLogo(shortUrl)

    return NextResponse.json({ qrCode, shortUrl })
  } catch (error) {
    console.error('Generate QR code error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
