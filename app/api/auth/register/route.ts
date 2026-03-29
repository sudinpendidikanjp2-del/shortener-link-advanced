import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sql } from '@/lib/db'
import { hashPassword, createToken, isRegistrationEnabled } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const registrationEnabled = await isRegistrationEnabled()

    if (!registrationEnabled) {
      return NextResponse.json(
        { error: 'Registration is currently disabled' },
        { status: 403 }
      )
    }

    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUsers = await sql`
      SELECT id FROM users WHERE email = ${email.toLowerCase()}
    `

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    const passwordHash = await hashPassword(password)

    const newUsers = await sql`
      INSERT INTO users (email, password_hash, name, role)
      VALUES (${email.toLowerCase()}, ${passwordHash}, ${name}, 'user')
      RETURNING id, email, name, role
    `

    const user = newUsers[0]

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
