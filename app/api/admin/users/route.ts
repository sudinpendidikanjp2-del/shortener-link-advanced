import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, hashPassword } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    const users = await sql`
      SELECT id, email, name, role, created_at,
        (SELECT COUNT(*) FROM links WHERE user_id = users.id) as link_count
      FROM users
      WHERE email ILIKE ${'%' + search + '%'} OR name ILIKE ${'%' + search + '%'}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    const countResult = await sql`
      SELECT COUNT(*) as count FROM users 
      WHERE email ILIKE ${'%' + search + '%'} OR name ILIKE ${'%' + search + '%'}
    `

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        totalCount: parseInt(countResult[0].count as string),
        totalPages: Math.ceil(parseInt(countResult[0].count as string) / limit),
      },
    })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email, password, name, role } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUsers = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase()}`
    if (existingUsers.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)

    const users = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${name}, ${role || 'user'})
      RETURNING id, email, name, role, created_at
    `

    return NextResponse.json({ user: users[0] }, { status: 201 })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
