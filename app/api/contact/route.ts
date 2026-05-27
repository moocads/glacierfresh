import { NextResponse } from 'next/server'
import { verifyRecaptchaToken } from '@/lib/recaptcha'
import { sendContactEmail, type ContactFormPayload } from '@/lib/sendgrid-contact'

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  recaptchaToken?: string
}

function getClientIp(request: Request): string | undefined {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim()
  return request.headers.get('x-real-ip') ?? undefined
}

const REQUIRED: (keyof ContactBody)[] = ['name', 'email', 'phone', 'company', 'message']

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  for (const key of REQUIRED) {
    if (!body[key] || String(body[key]).trim() === '') {
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 })
    }
  }

  const email = String(body.email).trim()
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  const payload: ContactFormPayload = {
    name: String(body.name).trim(),
    email,
    phone: String(body.phone).trim(),
    company: String(body.company).trim(),
    message: String(body.message).trim(),
  }

  if (payload.message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
  }

  const recaptchaToken = String(body.recaptchaToken ?? '').trim()
  if (!recaptchaToken) {
    return NextResponse.json(
      { error: 'Please complete the verification before submitting.' },
      { status: 400 },
    )
  }

  const verification = await verifyRecaptchaToken(recaptchaToken, getClientIp(request))
  if (!verification.ok) {
    return NextResponse.json(
      { error: verification.error ?? 'Verification failed. Please try again.' },
      { status: 400 },
    )
  }

  try {
    await sendContactEmail(payload)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form SendGrid error:', error)
    const isDev = process.env.NODE_ENV === 'development'
    let message = 'Failed to send message. Please try again or email us directly.'
    if (error instanceof Error) {
      if (error.message.includes('SENDGRID_API_KEY is not configured')) {
        message = 'Email service is not configured.'
      } else if (error.message.includes('401 Unauthorized') || error.message.includes('SG.')) {
        message = isDev
          ? error.message
          : 'Email service configuration error. Please contact us directly.'
      } else if (isDev) {
        message = error.message
      }
    }
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
