import axios from 'axios'
import type {
  SavedJob,
  AuthResponse,
  LoginInput,
  RegisterInput,
  CompanyProfile,
  Notification,
  NotificationPrefs,
  JobMetrics,
  Candidate,
  ContactFormInput,
  ProfileData,
  Interview,
  InterviewType,
  InterviewStatus,
} from './types'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export default api

export interface ApiResponse<T> {
  data: T
  error?: string
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { data } = await api.post('/auth/login', input)
  return data
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { data } = await api.post('/auth/register', input)
  return data
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout')
}

export async function getSession(): Promise<{ user?: { email: string } }> {
  const { data } = await api.get('/auth/session')
  return data
}

export async function resetPassword(email: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/auth/reset-password', { email })
  return data
}

export async function updatePassword(token: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/auth/update-password', { token, newPassword, confirmPassword })
  return data
}

export async function verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
  const { data } = await api.get('/auth/verify-email', { params: { token } })
  return data
}

// ─── User / Profile ─────────────────────────────────────────────────────────

export async function getProfile(email?: string): Promise<ProfileData> {
  const params = email ? { email } : {}
  const { data } = await api.get('/users/profile', { params })
  return data
}

export async function updateProfile(body: Record<string, any>): Promise<{ user: any; profile?: any }> {
  const { data } = await api.patch('/users/profile', body)
  return data
}

export async function setUserRole(role: 'EMPLOYER' | 'JOB_SEEKER'): Promise<{ success: boolean; role: string }> {
  const { data } = await api.post('/users/role', { role })
  return data
}

// ─── Company ─────────────────────────────────────────────────────────────────

export async function getCompanyProfile(email?: string): Promise<CompanyProfile | null> {
  const params = email ? { email } : {}
  const { data } = await api.get('/companies/profile', { params })
  return data
}

export async function updateCompanyProfile(body: Partial<CompanyProfile>): Promise<{ success: boolean; profile: CompanyProfile }> {
  const { data } = await api.patch('/companies/profile', body)
  return data
}

export async function getCompanyJobs(email?: string): Promise<any[]> {
  const params = email ? { email } : {}
  const { data } = await api.get('/companies/jobs', { params })
  return data
}

// ─── Jobs ────────────────────────────────────────────────────────────────────

export async function applyToJob(id: string, body: { guestName?: string; guestEmail?: string; coverLetter?: string; resumeUrl?: string; contactEmail?: string }): Promise<any> {
  const { data } = await api.post(`/jobs/${id}/apply`, body)
  return data
}

export async function getAdminApplications(params?: Record<string, string>): Promise<{
  applications: any[]
  stats: Record<string, number>
  page: number
  totalPages: number
  limit: number
}> {
  const { data } = await api.get("/admin/applications", { params })
  return data
}

export async function getAdminApplication(id: number | string): Promise<any> {
  const { data } = await api.get(`/admin/applications/${id}`)
  return data
}

export async function getJobCandidates(id: string, sort?: string): Promise<{ job: any; candidates: Candidate[]; total: number }> {
  const params: Record<string, string> = {}
  if (sort) params.sort = sort
  const { data } = await api.get(`/jobs/${id}/candidates`, { params })
  return data
}

export async function getJobMetrics(id: string): Promise<JobMetrics> {
  const { data } = await api.get(`/jobs/${id}/metrics`)
  return data
}

export interface JobListParams {
  search?: string
  location?: string
  category?: string
  seniority?: string
  remote?: string
  sort?: string
  take?: string
  cursor?: string
}

export interface PaginatedJobsResponse<T> {
  success: boolean
  data: T[]
  pagination: { total: number; cursor: string | null }
}

export async function getJobs(params?: JobListParams): Promise<PaginatedJobsResponse<any>> {
  const { data } = await api.get('/jobs', { params })
  return data
}

export async function searchTags(query: string): Promise<{ name: string; count: number }[]> {
  const { data } = await api.get('/jobs/tags/search', { params: { q: query } })
  return data.data
}

// ─── Applications ────────────────────────────────────────────────────────────

export async function updateApplicationStatus(id: number, status: string, notes?: string): Promise<{ success: boolean; application: any }> {
  const { data } = await api.patch(`/applications/${id}/status`, { status, notes })
  return data
}

export async function toggleShortlist(id: number, isShortlisted: boolean): Promise<{ success: boolean; isShortlisted: boolean }> {
  const { data } = await api.patch(`/applications/${id}/shortlist`, { isShortlisted })
  return data
}

// ─── Interviews ───────────────────────────────────────────────────────────────

export async function scheduleInterview(
  applicationId: number,
  body: {
    scheduledAt: Date
    duration?: number
    type: InterviewType
    meetingLink?: string
    location?: string
  }
): Promise<{ success: boolean; interview: Interview }> {
  const { data } = await api.post(`/applications/${applicationId}/interviews`, body)
  return data
}

export async function updateInterview(
  interviewId: number,
  body: {
    status?: InterviewStatus
    notes?: string
    feedback?: string
    rating?: number
    completed?: boolean
    scheduledAt?: Date
    duration?: number
    type?: InterviewType
    meetingLink?: string
    location?: string
  }
): Promise<{ success: boolean; interview: Interview }> {
  const { data } = await api.patch(`/interviews/${interviewId}`, body)
  return data
}

// ─── Saved Jobs ──────────────────────────────────────────────────────────────

export async function fetchSavedJobs(email?: string): Promise<SavedJob[]> {
  const params = email ? { email } : {}
  const { data } = await api.get('/users/saved-jobs', { params })
  return data
}

export async function saveJob(jobId: string, email?: string): Promise<void> {
  const params = email ? { email } : {}
  await api.post('/users/saved-jobs', { jobId }, { params })
}

export async function unsaveJob(jobId: string, email?: string): Promise<void> {
  const params: Record<string, string> = { jobId }
  if (email) params.email = email
  await api.delete('/users/saved-jobs', { params })
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications(params?: { unreadOnly?: boolean; limit?: number }): Promise<{ notifications: Notification[]; unreadCount: number; total: number }> {
  const { data } = await api.get('/notifications', { params })
  return data
}

export async function markNotificationsRead(notificationIds: number[]): Promise<{ success: boolean }> {
  const { data } = await api.patch('/notifications', { notificationIds })
  return data
}

export async function markAllNotificationsRead(): Promise<{ success: boolean }> {
  const { data } = await api.patch('/notifications', { markAllRead: true })
  return data
}

// ─── Notification Preferences ────────────────────────────────────────────────

export async function getNotificationPrefs(): Promise<NotificationPrefs> {
  const { data } = await api.get('/users/notifications')
  return data
}

export async function updateNotificationPrefs(prefs: Partial<NotificationPrefs>): Promise<NotificationPrefs> {
  const { data } = await api.patch('/users/notifications', prefs)
  return data
}

// ─── Contact ─────────────────────────────────────────────────────────────────

export async function submitContactForm(input: ContactFormInput): Promise<{ success: boolean; message: string }> {
  const { data } = await api.post('/contact', input)
  return data
}

// ─── Generic ─────────────────────────────────────────────────────────────────

export async function fetchApi<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }
  return response.json()
}
