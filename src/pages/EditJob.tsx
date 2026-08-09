import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { JobForm } from '@/features/job-management'
import { updateJob, getJob } from '@/features/job-management/services/jobService'
import { toast } from 'sonner'
import type { CreateJobPayload } from '@/features/job-management/types'

export default function EditJob() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initialData, setInitialData] = useState<CreateJobPayload | undefined>()

  useEffect(() => {
    if (!id) return
    getJob(id)
      .then((job) => {
        setInitialData({
          title: job.title,
          description: job.description,
          company: job.company,
          companyLogo: job.companyLogo || undefined,
          location: job.location,
          remote: job.remote,
          salaryMin: job.salaryMin ?? undefined,
          salaryMax: job.salaryMax ?? undefined,
          currency: job.currency,
          tags: job.tags,
          category: job.category,
          seniority: job.seniority,
          requirements: job.requirements,
          responsibilities: job.responsibilities,
          featured: job.featured,
        })
      })
      .catch(() => toast.error('Failed to load job'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (data: CreateJobPayload) => {
    if (!id) return
    setSaving(true)
    try {
      await updateJob(id, data)
      toast.success('Changes saved successfully!')
      navigate('/employer/dashboard')
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-emerald-400" /></div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-3xl mx-auto">
        <Link to="/employer/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Link>
        <JobForm
          initialData={initialData}
          onSubmit={handleSave}
          onCancel={() => navigate('/employer/dashboard')}
          loading={saving}
        />
      </div>
    </div>
  )
}
