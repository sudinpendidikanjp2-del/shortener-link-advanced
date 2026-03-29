import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { generateSlug } from '@/lib/slug'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = generateSlug()
    return NextResponse.json({ slug })
  } catch (error) {
    console.error('Generate slug error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
