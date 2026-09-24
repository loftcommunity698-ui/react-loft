import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Briefcase, Globe, Clock, DollarSign, Loader2, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import PageShell from '@/components/layout/PageShell'
import SaveJobButton from '@/components/sections/jobs/SaveJobButton'
import ApplyJobModal from '@/components/modals/ApplyJobModal'
import { useJob, useApplyToJob } from '@/lib/api-hooks'
import { sendApplicationConfirmation } from '@/lib/email-service'
import { useAuth } from '@/providers/AuthProvider'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatSalary, formatRelativeTime } from '@/lib/mappers'
import { toast } from 'sonner'

export default function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const reduced = useReducedMotion()
  const { job, loading, error } = useJob(id)
  const { apply: applyToJob, applying } = useApplyToJob()
  const [showApply, setShowApply] = useState(false)

  async function handleApply(data: { jobId?: string; guestName?: string; coverLetter: string; resumeUrl?: string; contactEmail?: string }) {
    try {
      await applyToJob(id!, {
        guestName: data.guestName,
        guestEmail: data.contactEmail?.trim() || undefined,
        contactEmail: data.contactEmail,
        coverLetter: data.coverLetter,
        resumeUrl: data.resumeUrl,
      })
      const applicantEmail = data.contactEmail?.trim() || user?.email || ''
      const applicantName = data.guestName || user?.firstName || 'there'
      if (applicantEmail && job) {
        sendApplicationConfirmation({
          to: applicantEmail,
          applicantName,
          jobTitle: job.title,
          companyName: job.company,
        }).catch(() => {})
      }
      if (isAuthenticated) {
        toast.success('Application submitted! We\'ll review your application and reach out via email for any further updates.')
        setShowApply(false)
        navigate('/dashboard', { state: { applySuccess: true } })
      } else {
        toast.success(`Application submitted! We'll notify you at ${applicantEmail}`)
        setShowApply(false)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to apply')
    }
  }

  if (loading) {
    return (
      <PageShell>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
        </div>
      </PageShell>
    )
  }

  if (error || !job) {
    return (
      <PageShell>
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
          <p className="text-neutral-400 mb-4">{error || 'Job not found'}</p>
          <Link to="/jobs">
            <Button variant="outline"><ArrowLeft className="h-4 w-4 mr-2" /> Back to Jobs</Button>
          </Link>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <div className="container px-4 md:px-6 py-16 sm:py-20 max-w-4xl mx-auto">
        <motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <Card className="mb-8">
            <CardContent className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                    {job.companyLogo ? (
                      <img src={job.companyLogo} alt={job.company} className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src="/images/Company%20Avatar%20Placeholder.png"
                        alt=""
                        className="w-full h-full object-cover opacity-60"
                      />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{job.title}</h1>
                    <p className="text-neutral-400">{job.company}</p>
                    <div className="flex flex-wrap gap-3 mt-3">
                      {job.category && <Badge variant="default">{job.category}</Badge>}
                      {job.seniority && <Badge variant="outline" className="capitalize">{job.seniority}</Badge>}
                      {job.remote && (
                        <Badge variant="outline">
                          <Globe className="h-3 w-3 mr-1" /> Remote
                        </Badge>
                      )}
                      {job.featured && <Badge variant="featured">Featured</Badge>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SaveJobButton jobId={job.id} />
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setShowApply(true)}>
                    <Send className="h-4 w-4 mr-2" /> Apply Now
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] mb-6">
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <MapPin className="h-4 w-4 text-emerald-400" />
                  <span>{job.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-400">
                  <Briefcase className="h-4 w-4 text-emerald-400" />
                  <span>{job.category}</span>
                </div>
                {job.postedDate && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>{formatRelativeTime(job.postedDate)}</span>
                  </div>
                )}
                {formatSalary(job.salaryMin, job.salaryMax, job.currency) && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400">
                    <DollarSign className="h-4 w-4 text-emerald-400" />
                    <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>

              {job.requirements.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start text-neutral-300">
                        <span className="text-emerald-400 mr-2 mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.responsibilities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Responsibilities</h3>
                  <ul className="space-y-2">
                    {job.responsibilities.map((resp, index) => (
                      <li key={index} className="flex items-start text-neutral-300">
                        <span className="text-emerald-400 mr-2 mt-1">•</span>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.tags.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag, i) => (
                      <Badge key={i} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <ApplyJobModal
        isOpen={showApply}
        onClose={() => setShowApply(false)}
        job={job}
        defaultEmail={user?.email ?? ''}
        defaultName={user ? [user.firstName, user.lastName].filter(Boolean).join(' ') : ''}
        onSubmit={handleApply}
        isSubmitting={applying}
      />
    </PageShell>
  )
}
