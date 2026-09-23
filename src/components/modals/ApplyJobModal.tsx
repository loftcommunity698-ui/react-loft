import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Building,
  MapPin,
  Globe,
  DollarSign,
  X,
  Send,
  Upload,
  FileText,
  Trash2,
  Loader2,
} from 'lucide-react'
import type { Job } from '@/lib/types'
import { formatSalary } from '@/lib/mappers'
import { toast } from 'sonner'
import { uploadResume } from '@/lib/cloudinary'

interface ApplyJobModalProps {
  isOpen: boolean
  onClose: () => void
  job: Job | null
  defaultEmail?: string
  defaultName?: string
  onSubmit: (data: { jobId?: string; guestName?: string; coverLetter: string; resumeUrl?: string; contactEmail?: string }) => Promise<void>
  isSubmitting?: boolean
}

export default function ApplyJobModal({ isOpen, onClose, job, defaultEmail = '', defaultName = '', onSubmit, isSubmitting = false }: ApplyJobModalProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeUrl, setResumeUrl] = useState('')
  const [resumeFileName, setResumeFileName] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [guestName, setGuestName] = useState(defaultName)
  const [contactEmail, setContactEmail] = useState(defaultEmail)
  const [uploadingResume, setUploadingResume] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleApplyClick = () => setShowApplicationForm(true)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingResume(true)
    try {
      const url = await uploadResume(file)
      setResumeUrl(url)
      setResumeFileName(file.name)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Resume upload failed')
      e.target.value = ''
    } finally {
      setUploadingResume(false)
    }
  }

  const removeResume = () => {
    setResumeUrl('')
    setResumeFileName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onSubmit({
        jobId: job?.id,
        guestName: guestName.trim() || undefined,
        coverLetter,
        resumeUrl: resumeUrl || undefined,
        contactEmail: contactEmail.trim() ? contactEmail.trim().toLowerCase() : undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setShowApplicationForm(false)
    setCoverLetter('')
    setResumeUrl('')
    setResumeFileName('')
    setGuestName(defaultName)
    setContactEmail(defaultEmail)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onClose()
  }



  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white z-10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white mb-4">
                {job?.title || 'Job Title Not Available'}
              </h2>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                {job?.company && (
                  <div className="flex items-center text-neutral-300">
                    <Building className="w-4 h-4 mr-2 text-emerald-500" />
                    {job.company}
                  </div>
                )}

                {job?.location && (
                  <div className="flex items-center text-neutral-300">
                    <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                    {job.location}
                  </div>
                )}

                {job?.remote && (
                  <div className="flex items-center text-emerald-400">
                    <Globe className="w-4 h-4 mr-2" />
                    Remote
                  </div>
                )}

                {job?.category && (
                  <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium">
                    {job.category}
                  </span>
                )}

                {job?.seniority && (
                  <span className="capitalize bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm font-medium border border-neutral-700">
                    {job.seniority}
                  </span>
                )}

                {job && formatSalary(job.salaryMin, job.salaryMax, job.currency) && (
                  <span className="flex items-center text-neutral-300">
                    <DollarSign className="w-4 h-4 mr-2 text-emerald-500" />
                    {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
                  </span>
                )}
              </div>
            </div>

            {job?.description && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Job Description</h3>
                <p className="text-neutral-300 leading-relaxed">{job.description}</p>
              </div>
            )}

            {job?.tags && job.tags.length > 0 && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-neutral-800 text-neutral-300 px-3 py-1 rounded-full text-sm font-medium border border-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {job?.requirements && job.requirements.length > 0 && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Requirements</h3>
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

            {job?.responsibilities && job.responsibilities.length > 0 && !showApplicationForm && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-white mb-3">Responsibilities</h3>
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

            {showApplicationForm ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6 pb-4 border-b border-neutral-800">
                  <h3 className="text-lg font-bold text-white mb-2">Apply for this Position</h3>
                  <p className="text-neutral-400 text-sm">
                    Submit your application for {job?.title} at {job?.company}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="resume" className="text-sm font-medium text-neutral-300 mb-2 block">
                      Resume (PDF, DOC, DOCX)
                    </Label>
                    {resumeUrl ? (
                      <div className="flex items-center gap-3 bg-neutral-800 border border-neutral-700 rounded-lg p-3">
                        <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm truncate">{resumeFileName || 'Resume uploaded'}</p>
                          <p className="text-xs text-neutral-400">Uploaded successfully</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeResume}
                          className="text-neutral-400 hover:text-red-400 transition-colors p-2"
                          aria-label="Remove resume"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : uploadingResume ? (
                      <div className="flex items-center justify-center gap-2 bg-neutral-800 border border-dashed border-neutral-700 rounded-lg p-6">
                        <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                        <span className="text-sm text-neutral-400">Uploading resume…</span>
                      </div>
                    ) : (
                      <label
                        htmlFor="resume"
                        className="flex flex-col items-center justify-center gap-2 bg-neutral-800 border border-dashed border-neutral-700 rounded-lg p-6 cursor-pointer hover:border-neutral-500 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-neutral-400" />
                        <span className="text-sm text-neutral-300">Click to choose a file</span>
                        <span className="text-xs text-neutral-500">PDF, DOC, or DOCX up to 10 MB</span>
                        <input
                          ref={fileInputRef}
                          id="resume"
                          name="resume"
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileChange}
                          className="sr-only"
                          aria-label="Upload resume"
                          disabled={uploadingResume}
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-2">
                      Cover Letter
                    </label>
                    <Textarea
                      placeholder="Tell us why you are excited about this opportunity and why you would be a great fit..."
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500 min-h-[150px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-neutral-500 mt-1 flex justify-between">
                      <span>Tell the employer why you are a great fit</span>
                      <span>{coverLetter.length}/500</span>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="guestName" className="text-sm font-medium text-neutral-300 mb-2 block">
                      Full name
                    </Label>
                    <Input
                      id="guestName"
                      name="guestName"
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Jane Doe"
                      autoComplete="name"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail" className="text-sm font-medium text-neutral-300 mb-2 block">
                      How can we contact you?
                    </Label>
                    <p className="text-xs text-neutral-500 mb-3">
                      We&apos;ll use this email to continue the application process. All follow-up will be sent here.
                    </p>
                    <Input
                      id="contactEmail"
                      name="contactEmail"
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. jane@example.com"
                      autoComplete="email"
                      className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowApplicationForm(false)}
                      className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      disabled={submitting || isSubmitting}
                    >
                      Back to Details
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting || isSubmitting}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting || isSubmitting ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                      ) : (
                        <><Send className="w-4 h-4 mr-2" /> Submit Application</>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <button
                onClick={handleApplyClick}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center text-lg"
              >
                <Upload className="w-5 h-5 mr-2" />
                Apply for This Position
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
