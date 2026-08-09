import api from '@/lib/api'
import { formatSalary } from '@/lib/mappers'
import type {
  JobWithRelations,
  JobSummary,
  JobMetrics,
  CreateJobPayload,
  UpdateJobPayload,
  JobFilters,
} from '../types'

export async function getEmployerJobs(filters?: JobFilters): Promise<JobSummary[]> {
  const params: Record<string, string> = {}
  if (filters?.search) params.search = filters.search
  if (filters?.category) params.category = filters.category
  if (filters?.seniority) params.seniority = filters.seniority
  if (filters?.remote) params.remote = filters.remote
  if (filters?.featured) params.featured = filters.featured

  const { data } = await api.get('/companies/jobs', { params })
  return data
}

export async function getJob(jobId: string): Promise<JobWithRelations> {
  const { data } = await api.get(`/jobs/${jobId}`)
  return data.data ?? data
}

export async function createJob(payload: CreateJobPayload): Promise<JobWithRelations> {
  const { data } = await api.post('/jobs', payload)
  return data.data ?? data
}

export async function updateJob(jobId: string, payload: UpdateJobPayload): Promise<JobWithRelations> {
  const { data } = await api.patch(`/jobs/${jobId}`, payload)
  return data.data ?? data
}

export async function deleteJob(jobId: string): Promise<void> {
  await api.delete(`/jobs/${jobId}`)
}

export async function toggleFeatured(jobId: string, featured: boolean): Promise<JobWithRelations> {
  return updateJob(jobId, { featured })
}

export async function getJobMetrics(jobId: string): Promise<JobMetrics> {
  const { data } = await api.get(`/jobs/${jobId}/metrics`)
  return data.data ?? data
}

export function formatSalaryRange(
  min?: number | null,
  max?: number | null,
  currency: string = 'USD'
): string {
  if (!min && !max) return 'Not specified'

  const formatted = formatSalary(min ?? null, max ?? null, currency)
  if (!formatted) return 'Not specified'

  return formatted
}
