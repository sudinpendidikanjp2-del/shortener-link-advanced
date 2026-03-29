import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { getSession, hashPassword } from '@/lib/auth'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Check if user exists
    const existingUsers = await sql`SELECT * FROM users WHERE id = ${id}`
    if (existingUsers.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const existingUser = existingUsers[0]

    // Build update
    let passwordHash = existingUser.password_hash
    if (body.password) {
      passwordHash = await hashPassword(body.password)
    }

    const users = await sql`
      UPDATE users
      SET 
        name = COALESCE(${body.name ?? null}, name),
        email = COALESCE(${body.email?.toLowerCase() ?? null}, email),
        role = COALESCE(${body.role ?? null}, role),
        password_hash = ${passwordHash}
      WHERE id = ${id}
      RETURNING id, email, name, role, created_at
    `

    return NextResponse.json({ user: users[0] })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Prevent deleting yourself
    if (id === session.userId) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    // Delete user's clicks
    await sql`DELETE FROM clicks WHERE link_id IN (SELECT id FROM links WHERE user_id = ${id})`

    // Delete user's links
    await sql`DELETE FROM links WHERE user_id = ${id}`

    // Delete user
    await sql`DELETE FROM users WHERE id = ${id}`

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
