export type Seniority = 'junior' | 'mid' | 'senior' | 'lead' | 'executive' | 'expert'

export interface CreateJobPayload {
  title: string
  description: string
  company: string
  companyLogo?: string
  location: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  currency?: string
  tags?: string[]
  category: string
  seniority: string
  requirements?: string[]
  responsibilities?: string[]
  featured?: boolean
}

export interface UpdateJobPayload extends Partial<CreateJobPayload> {}

export interface JobWithRelations {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  tags: string[]
  category: string
  seniority: string
  description: string
  requirements: string[]
  responsibilities: string[]
  postedDate: string
  expiresAt: string | null
  featured: boolean
  employerId: string
  employer?: { email: string; firstName: string; lastName: string }
  createdAt: string
  updatedAt: string
}

export interface JobSummary {
  id: string
  title: string
  company: string
  companyLogo: string | null
  location: string
  remote: boolean
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  tags: string[]
  category: string
  seniority: string
  description: string
  requirements: string[]
  responsibilities: string[]
  postedDate: string
  expiresAt: string | null
  featured: boolean
  employerId: string
  employer?: { email: string; firstName: string; lastName: string }
  createdAt: string
  updatedAt: string
}

export interface JobMetrics {
  jobId: string
  totalApplications: number
  pendingApplications: number
  reviewingApplications: number
  shortlistedApplications: number
  interviewingApplications: number
  offeredApplications: number
  hiredApplications: number
  rejectedApplications: number
  conversionRate: number
  avgMatchScore: number
  totalCandidates: number
}

export interface JobFilters {
  search?: string
  category?: string
  seniority?: string
  remote?: string
  featured?: string
}

export const CATEGORY_LABELS = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Product',
  'Support',
]

export const SENIORITY_LABELS: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-Level',
  senior: 'Senior',
  lead: 'Lead',
  executive: 'Executive',
  expert: 'Expert',
}
