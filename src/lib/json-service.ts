import rawData from '@/data/jobs.json'
import type { Job } from './types'
import { normalizeJob } from './mappers'

const BASE_DELAY = 400
const JITTER = 300
const CACHE_TTL = 60000

let cache: Record<string, { data: any; ts: number }> = {}

function randomDelay(): Promise<void> {
  const ms = BASE_DELAY + Math.random() * JITTER
  return new Promise(r => setTimeout(r, ms))
}

function fromCache<T>(key: string): T | null {
  const entry = cache[key]
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data as T
  return null
}

function toCache(key: string, data: any): void {
  cache[key] = { data, ts: Date.now() }
}

function encodeCursor(value: unknown): string {
  return btoa(JSON.stringify(value)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeCursor(cursor?: string): Record<string, unknown> | null {
  if (!cursor) return null
  try {
    const base64 = cursor.replace(/-/g, '+').replace(/_/g, '/')
    const parsed = JSON.parse(atob(base64))
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

function matchJob(job: any, params: Record<string, string>): boolean {
  for (const [key, val] of Object.entries(params)) {
    if (!val) continue
    const lower = val.toLowerCase()
    if (key === 'search') {
      const match = job.title?.toLowerCase().includes(lower)
        || (job.company || '').toLowerCase().includes(lower)
        || (job.tags || []).some((t: string) => t.toLowerCase().includes(lower))
      if (!match) return false
    } else if (key === 'category') {
      if ((job.category || '').toLowerCase() !== lower) return false
    } else if (key === 'seniority') {
      if ((job.seniority || '').toLowerCase() !== lower) return false
    } else if (key === 'remote') {
      if (val === 'true' && !job.remote) return false
    } else if (key === 'featured') {
      if (val === 'true' && !job.featured) return false
    } else if (key === 'location') {
      if (!(job.location || '').toLowerCase().includes(lower)) return false
    } else if (key === 'salaryMin') {
      if (!job.salaryMin || job.salaryMin < Number(val)) return false
    } else if (key === 'salaryMax') {
      if (!job.salaryMax || job.salaryMax > Number(val)) return false
    }
  }
  return true
}

function byIdDesc(a: any, b: any): number {
  return String(b.id).localeCompare(String(a.id))
}

function byRecent(a: any, b: any): number {
  const at = new Date(a.postedDate).getTime() || 0
  const bt = new Date(b.postedDate).getTime() || 0
  if (bt !== at) return bt - at
  return byIdDesc(a, b)
}

function bySalaryHigh(a: any, b: any): number {
  const am = a.salaryMax ?? -Infinity
  const bm = b.salaryMax ?? -Infinity
  if (bm !== am) return bm - am
  return byIdDesc(a, b)
}

function bySalaryLow(a: any, b: any): number {
  const am = a.salaryMax ?? Infinity
  const bm = b.salaryMax ?? Infinity
  if (am !== bm) return am - bm
  return byIdDesc(a, b)
}

function byRemoteFirst(a: any, b: any): number {
  if (b.remote !== a.remote) return Number(b.remote) - Number(a.remote)
  return byRecent(a, b)
}

const SORTERS: Record<string, (a: any, b: any) => number> = {
  recent: byRecent,
  salary_high: bySalaryHigh,
  salary_low: bySalaryLow,
  remote_first: byRemoteFirst,
}

export async function getJobsFromJson(params?: Record<string, string>): Promise<{
  success: boolean
  data: Job[]
  pagination: { total: number; cursor: string | null }
}> {
  const cacheKey = 'jobs:' + JSON.stringify(params)
  const cached = fromCache<{ success: boolean; data: Job[]; pagination: { total: number; cursor: string | null } }>(cacheKey)
  if (cached) return cached

  await randomDelay()

  let results = (rawData.jobs || []).map(normalizeJob)

  if (params) {
    results = results.filter(j => matchJob(j, params))
  }

  const sort = params?.sort && SORTERS[params.sort] ? params.sort : 'recent'
  results = [...results].sort(SORTERS[sort])

  const take = params?.take ? Math.max(1, parseInt(params.take, 10)) : 12
  const total = results.length

  let start = 0
  const cursor = params?.cursor ? decodeCursor(params.cursor) : null
  if (cursor && typeof cursor.id === 'string') {
    const idx = results.findIndex(j => String(j.id) === cursor.id)
    if (idx >= 0) start = idx + 1
  }

  const paged = results.slice(start, start + take)
  let nextCursor: string | null = null
  if (start + take < total && paged.length > 0) {
    nextCursor = encodeCursor({ id: paged[paged.length - 1].id })
  }

  const out = { success: true, data: paged, pagination: { total, cursor: nextCursor } }
  toCache(cacheKey, out)
  return out
}

export async function getJobFromJson(id: string): Promise<Job | null> {
  const cacheKey = 'job:' + id
  const cached = fromCache<Job | null>(cacheKey)
  if (cached !== null) return cached

  await randomDelay()
  const job = (rawData.jobs || []).find(j => String(j.id) === id || j.slug === id) || null
  const result = job ? normalizeJob(job) : null
  toCache(cacheKey, result)
  return result
}

export async function searchTagsFromJson(query: string): Promise<{ name: string; count: number }[]> {
  await randomDelay()
  const counts = new Map<string, number>()
  const allJobs = rawData.jobs as any[]
  for (const job of allJobs) {
    for (const tag of job.tags || []) {
      if (tag.toLowerCase().includes(query.toLowerCase())) {
        counts.set(tag, (counts.get(tag) || 0) + 1)
      }
    }
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 20)
}
