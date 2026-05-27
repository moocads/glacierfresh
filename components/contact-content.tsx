'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { Mail, MapPin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? ''

const CONTACT_INFO = [
  {
    icon: Mail,
    label: 'Email',
    href: 'mailto:wholesale@glacierfreshfilter.com',
    value: 'wholesale@glacierfreshfilter.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    href: 'tel:19059406266',
    value: '1-905-940-6266',
  },
  {
    icon: Phone,
    label: 'Toll free',
    href: 'tel:18775136266',
    value: '1-877-513-6266',
  },
  {
    icon: MapPin,
    label: 'Office',
    href: 'https://share.google/G1tUyaYyXuWHFwWCd',
    value: '90 Allstate Pkwy, Suite 601, Markham, ON L3R 6H3',
  },
] as const

type FormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const emptyForm = (): FormState => ({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
})

function getSubmitErrorMessage(json: unknown): string {
  if (typeof json !== 'object' || json === null) return 'Submission failed'
  const o = json as Record<string, unknown>
  if (typeof o.error === 'string') return o.error
  return 'Submission failed'
}

export function ContactContent() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const captchaConfigured = Boolean(RECAPTCHA_SITE_KEY)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)

    if (!captchaConfigured) {
      setSubmitError('Verification is not configured. Please contact us by email.')
      return
    }

    const widget = recaptchaRef.current
    if (!widget) {
      setSubmitError('Verification is not ready. Please refresh and try again.')
      return
    }

    setSubmitting(true)
    try {
      const token = await widget.executeAsync()
      widget.reset()

      if (!token) {
        setSubmitError('Verification failed. Please try again.')
        return
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, recaptchaToken: token }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) {
        setSubmitError(getSubmitErrorMessage(json) || json.error || 'Submission failed')
        return
      }
      setSubmitted(true)
      setForm(emptyForm())
    } catch {
      recaptchaRef.current?.reset()
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Contact us</p>
          <h1 className="mt-3 font-heading text-4xl font-heavy tracking-tight text-secondary md:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Questions about wholesale, products, or partnerships? Send us a message and our team will
            respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <aside className="lg:col-span-2">
              <h2 className="font-heading text-2xl font-heavy text-secondary">Get in touch</h2>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                Glacier Fresh supports distributors, retailers, and installers across North America.
                Reach out for product information, pricing, or technical support.
              </p>
              <ul className="mt-8 space-y-5">
                {CONTACT_INFO.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="group flex gap-4 text-secondary transition-colors hover:text-primary"
                      {...(item.href.startsWith('http')
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="size-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium group-hover:underline md:text-base">
                          {item.value}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>

            <div className="lg:col-span-3">
              <div
                className={cn(
                  'rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8',
                )}
              >
                {submitted ? (
                  <div className="py-8 text-center md:py-12">
                    <p className="font-heading text-xl font-semibold text-secondary md:text-2xl">
                      Thank you for reaching out
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                      We have received your message and will get back to you at the email address you
                      provided.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-8 rounded-full"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="grid gap-5">
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-secondary">
                        Send a message
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">All fields are required.</p>
                    </div>

                    {submitError && (
                      <p
                        className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                        role="alert"
                      >
                        {submitError}
                      </p>
                    )}

                    {!captchaConfigured && (
                      <p className="text-sm text-destructive" role="alert">
                        Verification is not configured (missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
                      </p>
                    )}

                    <div className="grid gap-2">
                      <Label htmlFor="contact-name">Name</Label>
                      <Input
                        id="contact-name"
                        name="name"
                        autoComplete="name"
                        required
                        value={form.name}
                        onChange={(e) => update('name', e.target.value)}
                        className="h-10 rounded-md"
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="grid gap-2">
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          required
                          value={form.email}
                          onChange={(e) => update('email', e.target.value)}
                          className="h-10 rounded-md"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          required
                          value={form.phone}
                          onChange={(e) => update('phone', e.target.value)}
                          className="h-10 rounded-md"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-company">Company</Label>
                      <Input
                        id="contact-company"
                        name="company"
                        autoComplete="organization"
                        required
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        className="h-10 rounded-md"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="contact-message">Message</Label>
                      <Textarea
                        id="contact-message"
                        name="message"
                        required
                        rows={5}
                        value={form.message}
                        onChange={(e) => update('message', e.target.value)}
                        className="min-h-[120px] resize-y rounded-md"
                        placeholder="How can we help you?"
                      />
                    </div>

                    {captchaConfigured && (
                      <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={RECAPTCHA_SITE_KEY}
                        size="invisible"
                      />
                    )}

                    <Button
                      type="submit"
                      className="mt-2 w-full rounded-full sm:w-auto sm:px-10"
                      disabled={submitting || !captchaConfigured}
                    >
                      {submitting ? 'Sending…' : 'Submit'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
