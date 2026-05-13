'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export const PARTNER_TYPE_OPTIONS = [
  'Wholesalers&Distributors',
  'Dealers&Retail Partner',
  'Plumbers&Installers',
] as const

export type PartnerTypeOption = (typeof PARTNER_TYPE_OPTIONS)[number]

export type PartnerRegistrationFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultPartnerType?: PartnerTypeOption
}

type FormState = {
  firstname: string
  lastname: string
  Partner_type: PartnerTypeOption
  email: string
  phonenumber: string
  company: string
  business_address: string
}

const emptyForm = (): FormState => ({
  firstname: '',
  lastname: '',
  Partner_type: PARTNER_TYPE_OPTIONS[0],
  email: '',
  phonenumber: '',
  company: '',
  business_address: '',
})

function getSubmitErrorMessage(json: unknown): string {
  if (typeof json !== 'object' || json === null) return 'Submission failed'
  const o = json as Record<string, unknown>
  if (typeof o.error === 'string') return o.error
  if (typeof o.error === 'object' && o.error !== null) {
    const e = o.error as Record<string, unknown>
    if (typeof e.message === 'string') return e.message
  }
  if (typeof o.message === 'string') return o.message
  return 'Submission failed'
}

export function PartnerRegistrationFormDialog({
  open,
  onOpenChange,
  defaultPartnerType,
}: PartnerRegistrationFormDialogProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      setSubmitted(false)
      setSubmitting(false)
      setSubmitError(null)
      setForm(emptyForm())
      return
    }
    setForm((prev) => ({
      ...prev,
      Partner_type: defaultPartnerType ?? PARTNER_TYPE_OPTIONS[0],
    }))
  }, [open, defaultPartnerType])

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/partner-registration-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstname: form.firstname,
          lastname: form.lastname,
          Partner_type: form.Partner_type,
          email: form.email,
          phonenumber: form.phonenumber,
          company: form.company,
          business_address: form.business_address,
        }),
      })

      const json = (await res.json()) as { error?: string; details?: unknown }

      if (!res.ok) {
        setSubmitError(
          getSubmitErrorMessage(json.details ?? json) || json.error || 'Submission failed',
        )
        return
      }

      setSubmitted(true)
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className={cn(
          'max-h-[min(90vh,720px)] gap-0 overflow-y-auto p-0 sm:max-w-xl',
        )}
      >
        <div className="border-b border-border px-6 py-8 sm:px-8">
          <DialogHeader className="gap-1 text-left">
            <DialogTitle className="font-heading text-xl font-heavy text-secondary sm:text-2xl">
              Partner registration
            </DialogTitle>
            <DialogDescription className="text-left text-sm">
              Tell us about your business and we will follow up shortly.
            </DialogDescription>
          </DialogHeader>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center sm:px-8">
            <p className="font-heading text-lg font-semibold text-secondary">
              Thank you for your interest.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We have received your details and will contact you soon.
            </p>
            <Button
              type="button"
              className="mt-8 rounded-full px-8"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="grid gap-4 px-6 py-6 sm:grid-cols-2 sm:gap-5 sm:px-8">
              {submitError && (
                <p
                  className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
                  role="alert"
                >
                  {submitError}
                </p>
              )}
              <div className="grid gap-2 sm:col-span-1">
                <Label htmlFor="partner-firstname">First name</Label>
                <Input
                  id="partner-firstname"
                  name="firstname"
                  autoComplete="given-name"
                  required
                  value={form.firstname}
                  onChange={(e) => update('firstname', e.target.value)}
                  className="h-10 rounded-md"
                />
              </div>
              <div className="grid gap-2 sm:col-span-1">
                <Label htmlFor="partner-lastname">Last name</Label>
                <Input
                  id="partner-lastname"
                  name="lastname"
                  autoComplete="family-name"
                  required
                  value={form.lastname}
                  onChange={(e) => update('lastname', e.target.value)}
                  className="h-10 rounded-md"
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="partner-type">Partner type</Label>
                <Select
                  name="Partner_type"
                  value={form.Partner_type}
                  onValueChange={(v) => update('Partner_type', v as PartnerTypeOption)}
                >
                  <SelectTrigger id="partner-type" className="h-10 w-full rounded-md">
                    <SelectValue placeholder="Select partner type" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="z-[60]">
                    {PARTNER_TYPE_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="partner-email">Email</Label>
                <Input
                  id="partner-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  className="h-10 rounded-md"
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="partner-phone">Phone number</Label>
                <Input
                  id="partner-phone"
                  name="phonenumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={form.phonenumber}
                  onChange={(e) => update('phonenumber', e.target.value)}
                  className="h-10 rounded-md"
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="partner-company">Company</Label>
                <Input
                  id="partner-company"
                  name="company"
                  autoComplete="organization"
                  required
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                  className="h-10 rounded-md"
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="partner-address">Business address</Label>
                <Textarea
                  id="partner-address"
                  name="business_address"
                  required
                  rows={3}
                  value={form.business_address}
                  onChange={(e) => update('business_address', e.target.value)}
                  className="min-h-[88px] resize-y rounded-md"
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border bg-muted px-6 py-4 sm:px-8 sticky bottom-0 left-0 right-0">
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                disabled={submitting}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-full px-8" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
