import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

vi.mock('@/data/jobs.json', () => ({
  default: {
    jobs: [
      {
        id: 'job-001',
        title: 'Senior React Engineer',
        company: 'Acme',
        location: 'Austin',
        remote: true,
        salaryMin: 120000,
        salaryMax: 150000,
        currency: 'USD',
        tags: ['react', 'typescript'],
        category: 'Engineering',
        seniority: 'senior',
        description: 'Build React apps',
        requirements: ['React'],
        responsibilities: ['Ship features'],
        postedDate: '2026-01-01',
        expiresAt: null,
        featured: true,
      },
      {
        id: 'job-002',
        title: 'Junior React Developer',
        company: 'Globex',
        location: 'New York',
        remote: false,
        salaryMin: 60000,
        salaryMax: 80000,
        currency: 'USD',
        tags: ['react', 'css'],
        category: 'Engineering',
        seniority: 'junior',
        description: 'Support React apps',
        requirements: ['React'],
        responsibilities: ['Fix bugs'],
        postedDate: '2026-02-01',
        expiresAt: null,
        featured: false,
      },
      {
        id: 'job-003',
        title: 'Product Designer',
        company: 'Acme',
        location: 'Austin',
        remote: true,
        salaryMin: 90000,
        salaryMax: 110000,
        currency: 'USD',
        tags: ['design', 'figma'],
        category: 'Design',
        seniority: 'mid',
        description: 'Design products',
        requirements: ['Figma'],
        responsibilities: ['Run research'],
        postedDate: '2026-03-01',
        expiresAt: null,
        featured: false,
      },
      {
        id: 'job-004',
        title: 'Marketing Manager',
        company: 'Initech',
        location: 'Chicago',
        remote: false,
        salaryMin: 70000,
        salaryMax: 90000,
        currency: 'USD',
        tags: ['marketing'],
        category: 'Marketing',
        seniority: 'lead',
        description: 'Run campaigns',
        requirements: [],
        responsibilities: [],
        postedDate: '2026-04-01',
        expiresAt: null,
        featured: true,
      },
      {
        id: 'job-005',
        title: 'Sales Engineer',
        company: 'Globex',
        location: 'Remote',
        remote: true,
        salaryMin: null,
        salaryMax: null,
        currency: 'USD',
        tags: ['sales'],
        category: 'Sales',
        seniority: 'senior',
        description: 'Support sales',
        requirements: [],
        responsibilities: [],
        postedDate: '2026-05-01',
        expiresAt: null,
        featured: false,
      },
      {
        id: 'job-006',
        title: 'DevOps Engineer',
        company: 'Umbrella',
        location: 'Seattle',
        remote: false,
        salaryMin: 130000,
        salaryMax: 170000,
        currency: 'USD',
        tags: ['aws', 'kubernetes'],
        category: 'Engineering',
        seniority: 'senior',
        description: 'Run infrastructure',
        requirements: [],
        responsibilities: [],
        postedDate: '2026-06-01',
        expiresAt: null,
        featured: false,
      },
    ],
  },
}))

import { getJobsFromJson, getJobFromJson, searchTagsFromJson } from '../json-service'

async function run<T>(fn: () => Promise<T>): Promise<T> {
  const promise = fn()
  await vi.advanceTimersByTimeAsync(1500)
  return promise
}

describe('json-service', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('searches jobs by title', async () => {
    const res = await run(() => getJobsFromJson({ search: 'DevOps' }))
    expect(res.success).toBe(true)
    expect(res.data.map(j => j.id)).toEqual(['job-006'])
    expect(res.pagination.total).toBe(1)
  })

  it('searches jobs by company', async () => {
    const res = await run(() => getJobsFromJson({ search: 'Acme' }))
    expect(res.data.map(j => j.id).sort()).toEqual(['job-001', 'job-003'])
  })

  it('searches jobs by tag', async () => {
    const res = await run(() => getJobsFromJson({ search: 'kubernetes' }))
    expect(res.data.map(j => j.id)).toEqual(['job-006'])
  })

  it('filters by category', async () => {
    const res = await run(() => getJobsFromJson({ category: 'Design' }))
    expect(res.data.map(j => j.id)).toEqual(['job-003'])
  })

  it('filters by seniority', async () => {
    const res = await run(() => getJobsFromJson({ seniority: 'senior' }))
    expect(res.data.map(j => j.id).sort()).toEqual(['job-001', 'job-005', 'job-006'])
  })

  it('filters by remote', async () => {
    const res = await run(() => getJobsFromJson({ remote: 'true' }))
    expect(res.data.map(j => j.id).sort()).toEqual(['job-001', 'job-003', 'job-005'])
  })

  it('sorts salary_high descending with nulls last', async () => {
    const res = await run(() => getJobsFromJson({ sort: 'salary_high' }))
    expect(res.data.map(j => j.id)).toEqual(['job-006', 'job-001', 'job-003', 'job-004', 'job-002', 'job-005'])
  })

  it('paginates via take + cursor keyset', async () => {
    const page1 = await run(() => getJobsFromJson({ sort: 'recent', take: '2' }))
    expect(page1.data.map(j => j.id)).toEqual(['job-006', 'job-005'])
    expect(page1.pagination.total).toBe(6)
    expect(page1.pagination.cursor).toBeTruthy()

    const page2 = await run(() => getJobsFromJson({ sort: 'recent', take: '2', cursor: page1.pagination.cursor! }))
    expect(page2.data.map(j => j.id)).toEqual(['job-004', 'job-003'])
    expect(page2.pagination.cursor).toBeTruthy()

    const page3 = await run(() => getJobsFromJson({ sort: 'recent', take: '2', cursor: page2.pagination.cursor! }))
    expect(page3.data.map(j => j.id)).toEqual(['job-002', 'job-001'])
    expect(page3.pagination.cursor).toBeNull()

    const all = [page1, page2, page3].flatMap(p => p.data.map(j => j.id))
    expect(all).toHaveLength(6)
    expect(new Set(all).size).toBe(6)
  })

  it('finds a job by id', async () => {
    const job = await run(() => getJobFromJson('job-003'))
    expect(job?.title).toBe('Product Designer')
  })

  it('returns null for unknown id', async () => {
    const job = await run(() => getJobFromJson('job-nope'))
    expect(job).toBeNull()
  })

  it('searches tags with counts', async () => {
    const res = await run(() => searchTagsFromJson('react'))
    expect(res.map(t => t.name).sort()).toEqual(['react'])
    expect(res[0].count).toBe(2)
  })
})
