import { send as emailjsSend } from '@emailjs/browser'

export type EmailType = 'contact' | 'application_confirmation' | 'email_verify' | 'password_reset'

export type EmailParams = Record<string, string>

export class EmailError extends Error {
  code: string
  fields?: string[]

  constructor(code: string, message: string, fields?: string[]) {
    super(message)
    this.name = 'EmailError'
    this.code = code
    this.fields = fields
  }
}

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim() || ''
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() || ''
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() || ''
const SUPPORT_EMAIL = import.meta.env.VITE_EMAILJS_SUPPORT_EMAIL?.trim() || 'loftcommunity698@gmail.com'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function assertConfigured(): void {
  if (!PUBLIC_KEY || !SERVICE_ID || !TEMPLATE_ID) {
    throw new EmailError('MISSING_CONFIG', 'Email service is not configured')
  }
}

function assertRecipient(email: string, type: EmailType): void {
  if (!EMAIL_REGEX.test(email)) {
    throw new EmailError('INVALID_RECIPIENT', `Invalid recipient for ${type} email: ${email}`, ['recipient'])
  }
}

interface EmailPayload {
  recipient: string
  fromName: string
  fromEmail: string
  subject: string
  message: string
  extra?: EmailParams
}

async function sendByType(type: EmailType, payload: EmailPayload): Promise<void> {
  assertConfigured()
  assertRecipient(payload.recipient, type)

  const params: EmailParams = {
    to_email: payload.recipient,
    from_name: payload.fromName,
    from_email: payload.fromEmail,
    reply_to: payload.fromEmail,
    subject: payload.subject,
    message: payload.message,
    ...(payload.extra ?? {}),
  }

  try {
    const res = await emailjsSend(SERVICE_ID, TEMPLATE_ID, params, { publicKey: PUBLIC_KEY })
    if (res.status !== 200) {
      throw new EmailError('EMAILJS_API_ERROR', `EmailJS returned status ${res.status}`, ['type'])
    }
  } catch (err) {
    if (err instanceof EmailError) throw err
    const message = err instanceof Error ? err.message : 'Unknown error'
    const lower = message.toLowerCase()
    const code = lower.includes('network')
      ? 'NETWORK_FAILURE'
      : lower.includes('rate')
        ? 'RATE_LIMITED'
        : 'EMAILJS_API_ERROR'
    throw new EmailError(code, message, ['recipient'])
  }
}

export async function sendContactEmail(input: { name: string; email: string; subject: string; message: string }): Promise<void> {
  const { name, email, subject, message } = input
  await sendByType('contact', {
    recipient: SUPPORT_EMAIL,
    fromName: name,
    fromEmail: email,
    subject: `[Contact Support] ${subject}`,
    message: `From: ${name} (${email})\nSubject: ${subject}\n\n${message}`,
  })
}

export async function sendApplicationConfirmation(input: {
  to: string
  applicantName: string
  jobTitle: string
  companyName: string
  dashboardUrl?: string
}): Promise<void> {
  const { to, applicantName, jobTitle, companyName } = input
  const dashboardUrl = input.dashboardUrl ?? `${window.location.origin}/dashboard/applications`
  await sendByType('application_confirmation', {
    recipient: to,
    fromName: 'LoftCommunity',
    fromEmail: 'noreply@loftcommunity.com',
    subject: `Application Submitted - ${jobTitle}`,
    message: [
      `Hi ${applicantName},`,
      '',
      `Your application for ${jobTitle} at ${companyName} has been submitted and will be reviewed.`,
      'We will carry out any further communication about this application through your email, so please keep an eye on your inbox.',
      '',
      'Here are the next steps:',
      '1. The employer will review your application and resume.',
      '2. Keep your profile and availability up to date - employers check it before reaching out.',
      '3. Watch your email and the notification bell for status updates (shortlisted, interviewing, offered).',
      '4. If shortlisted, you may be invited to schedule an interview - respond promptly to confirm a time.',
      '5. Track your application status anytime in your LoftCommunity dashboard.',
      '',
      `Track your application: ${dashboardUrl}`,
      '',
      'You received this email because you applied for a position on LoftCommunity.',
    ].join('\n'),
  })
}

export async function sendEmailVerification(input: { to: string; name: string; verificationUrl: string }): Promise<void> {
  const { to, name, verificationUrl } = input
  await sendByType('email_verify', {
    recipient: to,
    fromName: 'LoftCommunity',
    fromEmail: 'noreply@loftcommunity.com',
    subject: 'Verify your LoftCommunity email',
    message: [
      `Hi ${name},`,
      '',
      'Welcome to LoftCommunity! Please confirm your email address by clicking the link below:',
      verificationUrl,
      '',
      'This link expires in 24 hours.',
      'If you did not sign up for a LoftCommunity account, you can safely ignore this email.',
    ].join('\n'),
  })
}

export async function sendPasswordReset(input: { to: string; resetUrl: string }): Promise<void> {
  const { to, resetUrl } = input
  await sendByType('password_reset', {
    recipient: to,
    fromName: 'LoftCommunity',
    fromEmail: 'noreply@loftcommunity.com',
    subject: 'Reset your LoftCommunity password',
    message: [
      'We received a request to reset your password for LoftCommunity.',
      'Click the link below to set a new password. This link expires in 1 hour:',
      resetUrl,
      '',
      "If you didn't request this, you can safely ignore this email.",
    ].join('\n'),
  })
}

export function emailErrorMessage(err: unknown): string {
  if (err instanceof EmailError) {
    switch (err.code) {
      case 'INVALID_RECIPIENT':
        return 'That email address looks incorrect.'
      case 'MISSING_CONFIG':
        return 'Email sending is not configured yet.'
      case 'RATE_LIMITED':
        return 'Too many attempts - please try again later.'
      case 'NETWORK_FAILURE':
        return 'Could not reach the email service. Check your connection and try again.'
      default:
        return 'Could not send right now. Please try again or email us directly.'
    }
  }
  return 'Could not send right now. Please try again or email us directly.'
}