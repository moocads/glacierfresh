function normalizeEnvSecret(value: string | undefined): string {
  if (!value) return ''
  return value.trim().replace(/^['"]|['"]$/g, '')
}

type RecaptchaVerifyResponse = {
  success: boolean
  'error-codes'?: string[]
}

export async function verifyRecaptchaToken(
  token: string,
  remoteIp?: string | null,
): Promise<{ ok: boolean; error?: string }> {
  const secret = normalizeEnvSecret(process.env.RECAPTCHA_SECRET_KEY)
  if (!secret) {
    return { ok: false, error: 'Verification is not configured on the server' }
  }

  const params = new URLSearchParams({ secret, response: token })
  if (remoteIp) params.set('remoteip', remoteIp)

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    })
    const data = (await res.json()) as RecaptchaVerifyResponse
    if (data.success) return { ok: true }

    const codes = data['error-codes']?.join(', ') ?? 'unknown'
    console.error('reCAPTCHA verification failed:', codes)
    return { ok: false, error: 'Verification failed. Please try again.' }
  } catch (error) {
    console.error('reCAPTCHA verify error:', error)
    return { ok: false, error: 'Verification service unavailable. Please try again.' }
  }
}
