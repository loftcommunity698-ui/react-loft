export interface RenderedEmail {
  subject: string
  message: string
  html: string
}

export interface ContactEmailInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface ApplicationConfirmationInput {
  applicantName: string
  jobTitle: string
  companyName: string
  dashboardUrl: string
}

export const SUPPORT_EMAIL = 'loftcommunity698@gmail.com'

const FONT_FAMILY = "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

const LOGO_SRC = 'cid:email-logo.png'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;')
}

function assertSafeUrl(url: string, what: string): string {
  if (!/^(https:\/\/|mailto:)/i.test(url)) {
    throw new Error(`${what} must be an absolute https:// or mailto: URL`)
  }
  return url
}

function buildHead(title: string): string {
  return `<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${escapeHtml(title)}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    @media only screen and (max-width:600px) {
      .container { width:100% !important; }
      .mobile-x-padding { padding-left:16px !important; padding-right:16px !important; }
    }
    @media (prefers-color-scheme: dark) {
      .email-bg { background:#1b161d !important; }
      .text-body { color:#fcf7f2 !important; }
      .text-muted { color:#a8a29b !important; }
      .header-bar { background-color:#1b161d !important; }
      .divider { border-color:#3b343f !important; }
      .cta-button { background-color:#059669 !important; border-color:#059669 !important; }
      a { color:#4da6ff !important; }
    }
    [data-ogsc] .email-bg { background:#1b161d !important; }
    [data-ogsc] .text-body { color:#fcf7f2 !important; }
    [data-ogsc] .text-muted { color:#a8a29b !important; }
    [data-ogsc] .header-bar { background-color:#1b161d !important; }
    [data-ogsc] .divider { border-color:#3b343f !important; }
    [data-ogsc] .cta-button { background-color:#059669 !important; border-color:#059669 !important; }
    [data-ogsc] a { color:#4da6ff !important; }
  </style>
</head>`
}

function headerBand(origin: string): string {
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing:border-box; mso-table-lspace:0; mso-table-rspace:0;">
  <tr>
    <td class="header-bar" align="center" bgcolor="#1b161d" style="box-sizing:border-box; padding:24px 16px; text-align:center; background-color:#1b161d;">
      <a href="${escapeHtml(origin)}" rel="noopener" target="_blank" style="box-sizing:border-box; text-decoration:none;">
        <img class="email-logo" alt="LoftCommunity" width="300" height="192" src="${LOGO_SRC}" style="display:block;max-width:300px;height:auto;border:0;margin:0 auto;">
      </a>
    </td>
  </tr>
</table>`
}

function card(content: string): string {
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing:border-box; mso-table-lspace:0; mso-table-rspace:0;">
  <tr>
    <td class="email-bg mobile-x-padding" bgcolor="#ffffff" style="box-sizing:border-box; background-color:#ffffff; padding:32px 40px 40px 40px;">
    ${content}
    </td>
  </tr>
</table>`
}

function dividerRow(): string {
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing:border-box; mso-table-lspace:0; mso-table-rspace:0;">
  <tr>
    <td class="divider" height="1" style="box-sizing:border-box; border-bottom:1px solid #e5e1dc; font-size:0; line-height:0; height:1px; mso-line-height-rule:exactly;">&nbsp;</td>
  </tr>
</table>`
}

function footerRow(): string {
  const year = new Date().getFullYear()
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing:border-box; mso-table-lspace:0; mso-table-rspace:0;">
  <tr>
    <td align="center" class="text-muted" style="box-sizing:border-box; padding:16px 40px 32px 40px; text-align:center;">
      <p class="text-muted" style="box-sizing:border-box; margin:0; font-family:${FONT_FAMILY}; font-size:14px; line-height:20px; color:#6b7280;">&copy; ${year} LoftCommunity</p>
    </td>
  </tr>
</table>`
}

function h1(text: string): string {
  return `<h1 class="text-body" style="box-sizing:border-box; margin:0 0 4px; font-family:${FONT_FAMILY}; font-size:24px; line-height:32px; font-weight:700; color:#1a1a2e;">${escapeHtml(text)}</h1>`
}

function h2(text: string): string {
  return `<h2 class="text-muted" style="box-sizing:border-box; margin:0 0 16px; font-family:${FONT_FAMILY}; font-size:18px; line-height:26px; font-weight:600; color:#6b7280;">${escapeHtml(text)}</h2>`
}

function body(text: string): string {
  return `<p class="text-body" style="box-sizing:border-box; margin:0 0 16px; font-family:${FONT_FAMILY}; font-size:16px; line-height:24px; color:#1a1a2e;">${escapeHtml(text)}</p>`
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td valign="top" width="96" class="text-muted" style="box-sizing:border-box; width:96px; padding:0 12px 8px 0; font-family:${FONT_FAMILY}; font-size:14px; line-height:20px; color:#6b7280;">${escapeHtml(label)}</td>
    <td valign="top" class="text-body" style="box-sizing:border-box; padding:0 0 8px; font-family:${FONT_FAMILY}; font-size:14px; line-height:20px; color:#1a1a2e;">${escapeHtml(value)}</td>
  </tr>`
}

function detailBlock(rows: Array<[string, string]>): string {
  if (rows.length === 0) return ''
  const rowsHtml = rows.map(([label, value]) => detailRow(label, value)).join('\n    ')
  return `<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="box-sizing:border-box; mso-table-lspace:0; mso-table-rspace:0; margin:0 0 24px;">
    ${rowsHtml}
  </table>`
}

function ctaButton(href: string, text: string): string {
  return `<table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="box-sizing:border-box; margin:0 auto; mso-table-lspace:0; mso-table-rspace:0;">
  <tr>
    <td align="center" class="cta-button" bgcolor="#059669" style="box-sizing:border-box; border-radius:4px; background-color:#059669; border:1px solid #059669; padding:13px 40px; mso-table-lspace:0; mso-table-rspace:0;">
      <a href="${escapeHtml(href)}" rel="noopener" target="_blank" style="box-sizing:border-box; display:block; color:#ffffff; text-decoration:none; font-family:${FONT_FAMILY}; font-size:16px; line-height:22px; font-weight:600; white-space:nowrap;">${escapeHtml(text)}</a>
    </td>
  </tr>
</table>`
}

function inlineLink(href: string, text: string): string {
  return `<a href="${escapeHtml(href)}" rel="noopener" target="_blank" style="box-sizing:border-box; color:#059669; text-decoration:underline;">${escapeHtml(text)}</a>`
}

function signoff(blessing: string): string {
  return `<p class="text-body" style="box-sizing:border-box; margin:24px 0 0; font-family:${FONT_FAMILY}; font-size:16px; line-height:24px; color:#1a1a2e;">${escapeHtml(blessing)},<br><span class="text-muted" style="color:#6b7280;">The LoftCommunity Team</span></p>`
}

function renderShell(opts: {
  title: string
  origin: string
  preheader: string
  cardContent: string
}): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
${buildHead(opts.title)}
<body class="email-bg" style="margin:0; padding:0; background-color:#f4f4f7;">
  <span style="display:none!important; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; mso-hide:all;">${escapeHtml(opts.preheader)}&nbsp;&zwnj;</span>
  <!--[if mso]>
  <table role="presentation" width="600" align="center" cellspacing="0" cellpadding="0" border="0"><tr><td>
  <![endif]-->
  <div class="container" style="box-sizing:border-box; max-width:600px; margin:0 auto;">
    ${headerBand(opts.origin)}
    ${card(opts.cardContent)}
    ${dividerRow()}
    ${footerRow()}
  </div>
  <!--[if mso]>
  </td></tr></table>
  <![endif]-->
</body>
</html>`
}

export function renderContactEmail(input: ContactEmailInput): RenderedEmail {
  const subject = `[Contact Support] ${input.subject}`
  const message = [`From: ${input.name} (${input.email})`, `Subject: ${input.subject}`, '', input.message].join('\n')
  const origin = window.location.origin
  const cardContent = [
    h1('Hi LoftCommunity team,'),
    h2('New contact message'),
    body(input.message),
    detailBlock([
      ['From', input.name],
      ['Email', input.email],
      ['Subject', input.subject],
    ]),
    ctaButton(`mailto:${SUPPORT_EMAIL}`, 'Email LoftCommunity'),
    `<p class="text-muted" style="box-sizing:border-box; margin:16px 0 0; font-family:${FONT_FAMILY}; font-size:14px; line-height:20px; color:#6b7280; text-align:center;">Prefer the website? ${inlineLink(`${origin}/contact`, 'Open the contact page')} instead.</p>`,
    signoff('Thanks'),
  ].join('\n    ')
  const html = renderShell({
    title: subject,
    origin,
    preheader: `New contact message from ${input.name}`,
    cardContent,
  })
  return { subject, message, html }
}

export function renderApplicationConfirmation(input: ApplicationConfirmationInput): RenderedEmail {
  const subject = `Application Submitted - ${input.jobTitle}`
  const dashboardUrl = assertSafeUrl(input.dashboardUrl, 'dashboardUrl')
  const message = [
    `Hi ${input.applicantName},`,
    '',
    `Your application for ${input.jobTitle} at ${input.companyName} has been submitted and will be reviewed.`,
    'We will carry out any further communication about this application through your email, so please keep an eye on your inbox.',
    '',
    'Here are the next steps:',
    '1. The employer will review your application and resume.',
    '2. Keep your profile and availability up to date - employers check it before reaching out.',
    '3. Watch your email and the notification bell for status updates (shortlisted, interviewing, offered).',
    '4. If shortlisted, you may be invited to schedule an interview - respond promptly to confirm a time.',
    '5. Track your application status anytime in your LoftCommunity dashboard.',
    '',
    `Track your application: ${input.dashboardUrl}`,
    '',
    'You received this email because you applied for a position on LoftCommunity.',
  ].join('\n')
  const origin = window.location.origin
  const cardContent = [
    h1(`Hi ${input.applicantName},`),
    h2('Application Submitted'),
    body(
      `Your application for ${input.jobTitle} at ${input.companyName} has been submitted and will be reviewed. ` +
        'We will carry out any further communication about this application through your email, so please keep an eye on your inbox.',
    ),
    detailBlock([
      ['Job title', input.jobTitle],
      ['Company', input.companyName],
    ]),
    ctaButton(dashboardUrl, 'Track application'),
    `<p class="text-muted" style="box-sizing:border-box; margin:16px 0 0; font-family:${FONT_FAMILY}; font-size:14px; line-height:20px; color:#6b7280; text-align:center;">If the button does not work, ${inlineLink(dashboardUrl, 'track your application here')} instead.</p>`,
    signoff('Good luck'),
  ].join('\n    ')
  const html = renderShell({
    title: subject,
    origin,
    preheader: `Your application for ${input.jobTitle} at ${input.companyName} has been submitted.`,
    cardContent,
  })
  return { subject, message, html }
}