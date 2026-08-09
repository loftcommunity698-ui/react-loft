export function normalizeJob(raw: any) {
  return {
    ...raw,
    company: raw.company || '',
    companyLogo: raw.companyLogo ?? null,
    remote: raw.remote ?? false,
    salaryMin: raw.salaryMin ?? null,
    salaryMax: raw.salaryMax ?? null,
    currency: raw.currency || 'USD',
    tags: raw.tags || raw.skills || [],
    category: raw.category || '',
    seniority: raw.seniority || '',
    requirements: Array.isArray(raw.requirements) ? raw.requirements : [],
    responsibilities: Array.isArray(raw.responsibilities) ? raw.responsibilities : [],
    postedDate: raw.postedDate ?? raw.publishedAt ?? '',
    expiresAt: raw.expiresAt ?? null,
    featured: raw.featured ?? raw.isFeatured ?? false,
    isFeatured: raw.featured ?? raw.isFeatured ?? false,
    source: raw.source || 'local',
  }
}

export function formatSalary(min: number | null, max: number | null, currency = 'USD'): string | null {
  if (!min && !max) return null
  const fmt = (n: number) => {
    if (currency === 'USD') return `$${(n / 1000).toFixed(0)}k`
    return `${n.toLocaleString()} ${currency}`
  }
  if (min && max) return `${fmt(min)} - ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
