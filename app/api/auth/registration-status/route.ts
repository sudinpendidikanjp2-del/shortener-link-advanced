import { NextResponse } from 'next/server'
import { isRegistrationEnabled } from '@/lib/auth'

export async function GET() {
  try {
    const enabled = await isRegistrationEnabled()
    return NextResponse.json({ enabled })
  } catch (error) {
    console.error('Registration status error:', error)
    return NextResponse.json({ enabled: false })
  }
}
