export interface User {
  id: number
  clerkId: string
  email: string
  name: string | null
  firstName: string | null
  lastName: string | null
  profileImage: string | null
  phone: string | null
  isEmployer: boolean
  isApplicant: boolean
  isVerified: boolean
  isAdmin?: boolean
  needsOnboarding?: boolean
}

export interface Job {
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
  source: string
}

export interface Application {
  id: number
  jobId: string
  userId: string
  status: string
  coverLetter: string | null
  appliedAt: string
  reviewedAt: string | null
  interviewAt: string | null
  englishTestScore: number | null
  englishTestRequired: boolean
  employerNotes: string | null
  isShortlisted: boolean
  resumeUrl?: string
  passedScreening?: boolean
  rejectedAt?: string | null
  acceptedAt?: string | null
  interviews?: Interview[]
  job: {
    id: string
    title: string
    company: string
    companyLogo: string | null
    location: string
    remote: boolean
    category: string
    seniority: string
    tags: string[]
  }
  candidate?: {
    id: number
    clerkId?: string
    firstName: string | null
    lastName: string | null
    email: string
    profileImage: string | null
  }
}

export interface Message {
  id: number
  content: string
  jobId: number | null
  readAt: string | null
  createdAt: string
  isOwn: boolean
  sender: {
    id: number
    clerkId: string
    name: string | null
    firstName: string | null
    lastName: string | null
    profileImage: string | null
  }
  receiver: {
    id: number
    clerkId: string
    name: string | null
    firstName: string | null
    lastName: string | null
    profileImage: string | null
  }
}

export interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantEmail: string
  participantImage: string | null
  lastMessage: string
  lastMessageAt: string
  unread: boolean
  messages: Message[]
}

export interface AuthResponse {
  success: boolean
  user?: User
  message?: string
  verificationToken?: string
}

export interface LoginInput {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterInput {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  role: 'employer' | 'job_seeker'
  phone?: string
}

export interface SavedJob {
  id: string
  jobId: string
  savedAt: string
  job: {
    id: string
    title: string
    company: string
    companyLogo: string | null
    location: string
    remote: boolean
    category: string
    seniority: string
    salaryMin: number | null
    salaryMax: number | null
    currency: string
    tags: string[]
  }
}

export interface PaginatedResponse<T> {
  jobs?: T[]
  applications?: T[]
  total: number
  page: number
  totalPages: number
}

export type HiringStage =
  | 'JOB_IDENTIFIED'
  | 'JOB_APPLICATION'
  | 'APPLICATIONS_RECEIVED'
  | 'RESUME_SCREENING'
  | 'HR_INTERVIEW'
  | 'SKILLS_TEST'
  | 'TECHNICAL_INTERVIEW'
  | 'BEHAVIORAL_INTERVIEW'
  | 'FINAL_HIRING_MANAGER'
  | 'BACKGROUND_CHECKS'
  | 'OFFER_LETTER'
  | 'HIRING'
  | 'ONBOARDING'

export type ApplicationStatus =
  | 'PENDING'
  | 'REVIEWING'
  | 'SHORTLISTED'
  | 'INTERVIEW'
  | 'OFFERED'
  | 'HIRED'
  | 'REJECTED'
  | 'WITHDRAWN'

export interface StageConfig {
  id: HiringStage
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'rejected'
  order: number
  icon?: string
}

export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE' | 'TECHNICAL' | 'FINAL'

export type InterviewStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED'

export interface Interview {
  id: number
  applicationId: number
  scheduledAt: Date
  duration: number
  type: InterviewType
  meetingLink?: string
  location?: string
  status: InterviewStatus
  completed: boolean
  notes?: string
  feedback?: string
  rating?: number
  createdAt: Date
  updatedAt: Date
}

export interface WorkflowMetrics {
  totalApplications: number
  applicationsByStage: Record<HiringStage, number>
  averageTimeToHire: number
  conversionRates: Record<string, number>
}

export interface TimelineEntry {
  stage: HiringStage
  date: Date
  status: 'completed' | 'current' | 'pending'
  notes?: string
}

export interface Candidate {
  id: number
  status: string
  coverLetter?: string | null
  appliedAt: string
  matchScore: number
  matchedSkills: number
  totalRequired: number
  candidate: {
    id: number
    clerkId: string
    name: string
    firstName: string
    lastName: string
    email: string
    profileImage: string
    profile: {
      jobTitle: string
      summary: string
      skills: string[]
      experienceYears: number
      skillsRelation: { skill: { name: string }; level: string }[]
    }
  }
}

export interface CompanyProfile {
  id?: number
  companyName: string
  companyWebsite?: string | null
  companySize?: string | null
  industry?: string | null
  description?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  city?: string | null
  country?: string | null
  logo?: string | null
  linkedIn?: string | null
  twitter?: string | null
  hiringMode?: string | null
  userId?: string
}

export interface Notification {
  id: number
  userId: string
  title: string
  message: string
  type: string
  data?: any
  link?: string | null
  isRead: boolean
  createdAt: string
  readAt: string | null
}

export interface NotificationPrefs {
  applicationUpdates: boolean
  newMessages: boolean
  jobAlerts: boolean
  marketing: boolean
}

export interface JobMetrics {
  jobId: number
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

export interface ContactFormInput {
  name: string
  email: string
  subject: string
  message: string
}

export interface JobReportInput {
  reason: string
}

export interface ProfileData {
  user: {
    id: string
    email: string
    firstName?: string | null
    lastName?: string | null
    name?: string | null
    phone?: string | null
    profileImage?: string | null
    isEmployer?: boolean
    isApplicant?: boolean
    isVerified?: boolean
    needsOnboarding?: boolean
  }
  profile?: {
    id?: number
    userId?: string
    jobTitle?: string | null
    summary?: string | null
    experienceYears?: number | null
    skills?: string[] | null
    skillsRelation?: { skill: { name: string }; level?: string }[]
    remoteWork?: boolean
    relocate?: boolean
    expectedSalary?: number | null
    availability?: string | null
  } | null
  resume?: any
}
