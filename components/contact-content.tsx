'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import ReCAPTCHA from 'react-google-recaptcha'
import { Building2, Headphones, Mail, MapPin, Phone } from 'lucide-react'
import { PartnerRegistrationForm } from '@/components/partner-registration-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ?? ''
const RECAPTCHA_SIZE = (process.env.NEXT_PUBLIC_RECAPTCHA_SIZE?.trim() || 'normal') as
  | 'invisible'
  | 'normal'

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
    href: 'tel:19055136266',
    value: '1-905-513-6266',
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
    value: '90 Allstate Pkwy, Suite 602, Markham, ON L3R 6H3',
  },
] as const

type ContactFormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
}

const emptyContactForm = (): ContactFormState => ({
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

function CustomerSupportForm() {
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  const [form, setForm] = useState<ContactFormState>(emptyContactForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const captchaConfigured = Boolean(RECAPTCHA_SITE_KEY)

  function update<K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) {
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
      const token =
        RECAPTCHA_SIZE === 'invisible'
          ? await widget.executeAsync()
          : (widget.getValue?.() as string | null | undefined)

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
      setForm(emptyContactForm())
    } catch {
      recaptchaRef.current?.reset()
      setSubmitError(
        RECAPTCHA_SIZE === 'invisible'
          ? 'reCAPTCHA failed to run in invisible mode. Use a site key that supports Invisible reCAPTCHA, or switch to normal mode.'
          : 'Network error. Please try again.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-8 text-center md:py-12">
        <p className="font-heading text-xl font-semibold text-secondary md:text-2xl">
          Thank you for reaching out
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          We have received your message and will get back to you at the email address you provided.
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
    )
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      {submitError ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      {!captchaConfigured ? (
        <p className="text-sm text-destructive" role="alert">
          Verification is not configured (missing NEXT_PUBLIC_RECAPTCHA_SITE_KEY).
        </p>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="contact-name">Name</Label>
        <Input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          className="h-11 bg-background"
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
            className="h-11 bg-background"
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
            className="h-11 bg-background"
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
          className="h-11 bg-background"
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
          className="min-h-[120px] resize-y bg-background"
          placeholder="How can we help you?"
        />
      </div>

      {captchaConfigured ? (
        <ReCAPTCHA ref={recaptchaRef} sitekey={RECAPTCHA_SITE_KEY} size={RECAPTCHA_SIZE} />
      ) : null}

      <div className="flex justify-center">
        <Button
          type="submit"
          className="w-full rounded-full px-10 sm:w-auto"
          disabled={submitting || !captchaConfigured}
        >
          {submitting ? 'Sending…' : 'Submit request'}
        </Button>
      </div>
    </form>
  )
}

export function ContactContent() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border bg-muted/30 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-4xl px-4 text-center lg:px-8">
          <h1 className="type-page-heading text-secondary">Let&apos;s talk</h1>
          <p className="type-body mt-5 text-muted-foreground">
            Questions about wholesale, products, or partnerships? Send us a message and our team will
            respond as soon as possible.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16 lg:py-20">
        <div className="container mx-auto max-w-6xl px-4 lg:px-8">
          <section className="max-w-2xl" aria-labelledby="contact-info-title">
            <h2 id="contact-info-title" className="type-page-subheading text-secondary">
              Get in touch
            </h2>
            <p className="type-body mt-4 text-muted-foreground">
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
          </section>

          <Tabs defaultValue="customer-support" className="mt-12 gap-4 md:mt-16">
            <TabsList className="flex h-auto w-full flex-wrap justify-center gap-2 bg-transparent p-0 md:gap-3">
              <TabsTrigger
                value="customer-support"
                className="h-auto flex-none rounded-full border border-transparent bg-muted/60 px-2 py-2 text-sm font-medium text-secondary shadow-none transition-colors data-[state=inactive]:hover:border-primary/30 data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-primary data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
              >
                <Headphones className="size-5" aria-hidden />
                Customer Support
              </TabsTrigger>
              <TabsTrigger
                value="business-inquiries"
                className="h-auto flex-none rounded-full border border-transparent bg-muted/60 px-2 py-2 text-sm font-medium text-secondary shadow-none transition-colors data-[state=inactive]:hover:border-primary/30 data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-primary data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none"
              >
                <Building2 className="size-5" aria-hidden />
                Business Inquiries
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="customer-support"
              className="mt-0 overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/45"
            >
              <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                <div className="p-6 md:p-8 lg:p-10">
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary-100 text-primary">
                    <Headphones className="size-7" aria-hidden />
                  </span>
                  <h2 className="mt-6 font-heading text-2xl font-semibold text-secondary md:text-3xl">
                    Customer Support
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Purchased a Glacier Fresh product from a retail store? Send us a support request
                    and our team will follow up using the contact details you provide.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    Include your product model, place of purchase, and a brief description of the
                    issue in your message.
                  </p>
                </div>
                <div className="border-t border-primary-100 bg-white/65 p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
                  <h3 className="font-heading text-xl font-semibold text-secondary">
                    Support request
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">All fields are required.</p>
                  <div className="mt-6">
                    <CustomerSupportForm />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="business-inquiries"
              className="mt-0 overflow-hidden rounded-2xl border border-primary-100 bg-primary-50/45"
            >
              <div className="grid lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
                <div className="p-6 md:p-8 lg:p-10">
                  <span className="flex size-14 items-center justify-center rounded-full bg-primary-100 text-primary">
                    <Building2 className="size-7" aria-hidden />
                  </span>
                  <h2 className="mt-6 font-heading text-2xl font-semibold text-secondary md:text-3xl">
                    Business Inquiries
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Interested in becoming a Glacier Fresh distributor, retailer, or installation
                    partner? Complete the form and our team will get in touch.
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                    For retailers, wholesalers, distributors, and installation partners across North
                    America.
                  </p>
                </div>
                <div className="border-t border-primary-100 bg-white/65 p-6 md:p-8 lg:border-l lg:border-t-0 lg:p-10">
                  <h3 className="font-heading text-xl font-semibold text-secondary">
                    Business inquiry form
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">All fields are required.</p>
                  <div className="mt-6">
                    <PartnerRegistrationForm idPrefix="contact-partner" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
