import { NextResponse } from 'next/server'
import { sendContactEmail, type ContactFormPayload } from '@/lib/sendgrid-contact'

type ContactBody = {
  name?: string
  email?: string
  phone?: string
  company?: string
  message?: string
  recaptchaToken?: string
}

const REQUIRED: (keyof ContactBody)[] = ['name', 'email', 'phone', 'company', 'message']

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export async function POST(request: Request) {
  // #region agent log
  fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H1',location:'app/api/contact/route.ts:POST:entry',message:'Contact POST received',data:{hasSecret:Boolean(process.env.RECAPTCHA_SECRET_KEY),hasSendgridKey:Boolean(process.env.SENDGRID_API_KEY)},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log

  let body: ContactBody
  try {
    body = (await request.json()) as ContactBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { name, email, phone, company, message, recaptchaToken } = body

  // 1) 先做字段非空校验
  for (const key of REQUIRED) {
    if (!body[key] || String(body[key]).trim() === '') {
      // #region agent log
      fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H2',location:'app/api/contact/route.ts:missing-field',message:'Missing required field',data:{field:String(key)},timestamp:Date.now()})}).catch(()=>{});
      // #endregion agent log
      return NextResponse.json({ error: `Missing field: ${key}` }, { status: 400 })
    }
  }

  // 2) 邮箱格式基础校验
  if (!isValidEmail(String(email))) {
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H2',location:'app/api/contact/route.ts:bad-email',message:'Invalid email format',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  // 3) 调用 Google reCAPTCHA 校验 token（与你给的示例一致）
  const token = String(recaptchaToken ?? '').trim()
  if (!token) {
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H3',location:'app/api/contact/route.ts:no-token',message:'Missing recaptchaToken',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json(
      { error: 'Please complete the verification before submitting.' },
      { status: 400 },
    )
  }

  const secretConfigured = Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim())
  if (!secretConfigured) {
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H3',location:'app/api/contact/route.ts:no-secret',message:'Missing RECAPTCHA_SECRET_KEY',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: 'reCAPTCHA server is not configured' }, { status: 500 })
  }

  const params = new URLSearchParams()
  params.set('secret', process.env.RECAPTCHA_SECRET_KEY ?? '')
  params.set('response', token)

  let verifyRes: Response
  try {
    verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
  } catch (e) {
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H4',location:'app/api/contact/route.ts:verify-fetch-failed',message:'reCAPTCHA siteverify fetch threw',data:{err:e instanceof Error?e.message:String(e)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: 'reCAPTCHA verify request failed' }, { status: 502 })
  }

  const verifyData = (await verifyRes.json()) as { success?: boolean; ['error-codes']?: string[] }

  if (!verifyData.success) {
    console.error('reCAPTCHA verify failed', verifyData['error-codes'])
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H3',location:'app/api/contact/route.ts:verify-fail',message:'reCAPTCHA verify not successful',data:{status:verifyRes.status,hasErrorCodes:Array.isArray(verifyData['error-codes'])},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ error: 'reCAPTCHA 验证失败' }, { status: 400 })
  }

  // 4) 通过 reCAPTCHA 后，构造邮件 payload
  const payload: ContactFormPayload = {
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone).trim(),
    company: String(company).trim(),
    message: String(message).trim(),
  }

  if (payload.message.length > 5000) {
    return NextResponse.json({ error: 'Message is too long' }, { status: 400 })
  }

  // #region agent log
  fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H5',location:'app/api/contact/route.ts:before-sendgrid',message:'reCAPTCHA ok; sending email',data:{},timestamp:Date.now()})}).catch(()=>{});
  // #endregion agent log

  // 5) 发送邮件
  try {
    await sendContactEmail(payload)
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H5',location:'app/api/contact/route.ts:sendgrid-ok',message:'SendGrid send succeeded',data:{},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact form SendGrid error:', error)
    // #region agent log
    fetch('http://127.0.0.1:7289/ingest/6ef269f3-94f9-4e40-b104-75cae335988e',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'9300c0'},body:JSON.stringify({sessionId:'9300c0',runId:'contact-pre',hypothesisId:'H5',location:'app/api/contact/route.ts:sendgrid-failed',message:'SendGrid send threw',data:{err:error instanceof Error?error.message:String(error)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion agent log
    const isDev = process.env.NODE_ENV === 'development'
    let messageText = 'Failed to send message. Please try again or email us directly.'
    if (error instanceof Error) {
      if (error.message.includes('SENDGRID_API_KEY is not configured')) {
        messageText = 'Email service is not configured.'
      } else if (error.message.includes('401 Unauthorized') || error.message.includes('SG.')) {
        messageText = isDev
          ? error.message
          : 'Email service configuration error. Please contact us directly.'
      } else if (isDev) {
        messageText = error.message
      }
    }
    return NextResponse.json({ error: messageText }, { status: 500 })
  }
}
