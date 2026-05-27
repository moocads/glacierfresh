import sgMail from '@sendgrid/mail'

export type ContactFormPayload = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const DEFAULT_TO = 'info@moocads.com'

/** Strip quotes/whitespace — common .env.local mistakes cause SendGrid 401. */
function normalizeEnvSecret(value: string | undefined): string {
  if (!value) return ''
  return value.trim().replace(/^['"]|['"]$/g, '')
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function buildContactEmailContent(data: ContactFormPayload) {
  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Company: ${data.company}`,
    '',
    'Message:',
    data.message,
  ]

  const htmlRows = [
    ['Name', data.name],
    ['Email', data.email],
    ['Phone', data.phone],
    ['Company', data.company],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;font-weight:600;color:#082449;vertical-align:top">${escapeHtml(label)}</td><td style="padding:8px 12px;color:#4D617C">${escapeHtml(value)}</td></tr>`,
    )
    .join('')

  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:560px">
      <h2 style="color:#306FCB;margin:0 0 16px">New contact form submission</h2>
      <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px">
        <tbody>${htmlRows}</tbody>
      </table>
      <p style="margin:20px 0 8px;font-weight:600;color:#082449">Message</p>
      <p style="margin:0;padding:12px;background:#f1f5f9;border-radius:8px;color:#4D617C;white-space:pre-wrap">${escapeHtml(data.message)}</p>
    </div>
  `.trim()

  return {
    text: lines.join('\n'),
    html,
    subject: `Contact form: ${data.name} — ${data.company}`,
  }
}

function getSendGridErrorDetail(error: unknown): string {
  if (typeof error !== 'object' || error === null) return 'Unknown error'
  const err = error as {
    code?: number
    message?: string
    response?: { body?: { errors?: { message?: string }[] } }
  }
  const fromBody = err.response?.body?.errors?.map((e) => e.message).filter(Boolean).join('; ')
  if (fromBody) return fromBody
  if (err.message) return err.message
  return 'Unknown error'
}

export async function sendContactEmail(data: ContactFormPayload): Promise<void> {
  const apiKey = normalizeEnvSecret(process.env.SENDGRID_API_KEY)
  if (!apiKey) {
    throw new Error('SENDGRID_API_KEY is not configured')
  }
  if (!apiKey.startsWith('SG.')) {
    throw new Error(
      'SENDGRID_API_KEY looks invalid (should start with SG.). Check .env.local and restart the dev server.',
    )
  }

  const from = normalizeEnvSecret(process.env.SENDGRID_FROM_EMAIL) || DEFAULT_TO
  const to = normalizeEnvSecret(process.env.CONTACT_TO_EMAIL) || DEFAULT_TO

  const { text, html, subject } = buildContactEmailContent(data)

  sgMail.setApiKey(apiKey)

  try {
    await sgMail.send({
      to,
      from,
      replyTo: data.email,
      subject,
      text,
      html,
    })
  } catch (error) {
    const detail = getSendGridErrorDetail(error)
    const code =
      typeof error === 'object' && error !== null && 'code' in error
        ? (error as { code?: number }).code
        : undefined
    console.error('SendGrid send failed:', { code, detail, to, from })
    if (code === 401) {
      throw new Error(
        `SendGrid rejected the API key (401 Unauthorized). Create a new API key with Mail Send permission, update SENDGRID_API_KEY in .env.local, and restart npm run dev. (${detail})`,
      )
    }
    throw new Error(detail || 'SendGrid request failed')
  }
}
