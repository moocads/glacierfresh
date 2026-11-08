'use client'

import { useState } from 'react'
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

type PartnerRegistrationFormProps = {
  defaultPartnerType?: PartnerTypeOption
  idPrefix?: string
  variant?: 'dialog' | 'inline'
  className?: string
  onCancel?: () => void
  onSuccessAction?: () => void
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

const emptyForm = (defaultPartnerType?: PartnerTypeOption): FormState => ({
  firstname: '',
  lastname: '',
  Partner_type: defaultPartnerType ?? PARTNER_TYPE_OPTIONS[0],
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

export function PartnerRegistrationForm({
  defaultPartnerType,
  idPrefix = 'partner',
  variant = 'inline',
  className,
  onCancel,
  onSuccessAction,
}: PartnerRegistrationFormProps) {
  const [form, setForm] = useState<FormState>(() => emptyForm(defaultPartnerType))
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function resetForm() {
    setSubmitted(false)
    setSubmitError(null)
    setForm(emptyForm(defaultPartnerType))
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

  if (submitted) {
    return (
      <div
        className={cn(
          'text-center',
          variant === 'dialog' ? 'px-6 py-10 sm:px-8' : 'py-8 md:py-12',
          className,
        )}
      >
        <p className="font-heading text-xl font-semibold text-secondary">
          Thank you for your interest
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
          We have received your details and will contact you soon.
        </p>
        <Button
          type="button"
          className="mt-8 rounded-full px-8"
          onClick={onSuccessAction ?? resetForm}
        >
          {onSuccessAction ? 'Close' : 'Send another inquiry'}
        </Button>
      </div>
    )
  }

  const fields = (
    <div
      className={cn(
        'grid gap-5 sm:grid-cols-2',
        variant === 'dialog' && 'px-6 py-6 sm:px-8',
      )}
    >
      {submitError ? (
        <p
          className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive sm:col-span-2"
          role="alert"
        >
          {submitError}
        </p>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-firstname`}>First name</Label>
        <Input
          id={`${idPrefix}-firstname`}
          name="firstname"
          autoComplete="given-name"
          required
          value={form.firstname}
          onChange={(e) => update('firstname', e.target.value)}
          className="h-11 bg-background"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-lastname`}>Last name</Label>
        <Input
          id={`${idPrefix}-lastname`}
          name="lastname"
          autoComplete="family-name"
          required
          value={form.lastname}
          onChange={(e) => update('lastname', e.target.value)}
          className="h-11 bg-background"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-email`}>Email</Label>
        <Input
          id={`${idPrefix}-email`}
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
        <Label htmlFor={`${idPrefix}-phone`}>Phone number</Label>
        <Input
          id={`${idPrefix}-phone`}
          name="phonenumber"
          type="tel"
          autoComplete="tel"
          required
          value={form.phonenumber}
          onChange={(e) => update('phonenumber', e.target.value)}
          className="h-11 bg-background"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-company`}>Company</Label>
        <Input
          id={`${idPrefix}-company`}
          name="company"
          autoComplete="organization"
          required
          value={form.company}
          onChange={(e) => update('company', e.target.value)}
          className="h-11 bg-background"
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor={`${idPrefix}-type`}>Partner type</Label>
        <Select
          name="Partner_type"
          value={form.Partner_type}
          onValueChange={(v) => update('Partner_type', v as PartnerTypeOption)}
        >
          <SelectTrigger id={`${idPrefix}-type`} className="h-11 w-full bg-background">
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
        <Label htmlFor={`${idPrefix}-address`}>Business address</Label>
        <Textarea
          id={`${idPrefix}-address`}
          name="business_address"
          required
          rows={4}
          value={form.business_address}
          onChange={(e) => update('business_address', e.target.value)}
          className="min-h-[112px] resize-y bg-background"
        />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className={cn('flex flex-col', className)}>
      {fields}
      {variant === 'dialog' ? (
        <DialogFooter className="sticky inset-x-0 bottom-0 border-t border-border bg-muted px-6 py-4 sm:px-8">
          <Button
            type="button"
            variant="outline"
            className="rounded-full"
            disabled={submitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" className="rounded-full px-8" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </DialogFooter>
      ) : (
        <div className="mt-6 flex justify-center">
          <Button
            type="submit"
            className="w-full rounded-full px-10 sm:w-auto"
            disabled={submitting}
          >
            {submitting ? 'Submitting…' : 'Submit inquiry'}
          </Button>
        </div>
      )}
    </form>
  )
}

export function PartnerRegistrationFormDialog({
  open,
  onOpenChange,
  defaultPartnerType,
}: PartnerRegistrationFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[min(90vh,720px)] gap-0 overflow-y-auto p-0 sm:max-w-xl"
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

        <PartnerRegistrationForm
          defaultPartnerType={defaultPartnerType}
          idPrefix="partner-dialog"
          variant="dialog"
          onCancel={() => onOpenChange(false)}
          onSuccessAction={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
