import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MapPin, Briefcase, DollarSign, Calendar, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface JobDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  job: any
}

export function JobDetailsModal({ isOpen, onClose, job }: JobDetailsModalProps) {
  if (!job) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-foreground">{job.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {job.remote && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">Remote</Badge>
            )}
            {job.category && <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400">{job.category}</Badge>}
            {job.seniority && <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">{job.seniority}</Badge>}
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            {(job.company || job.location) && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                <span>{job.company} {job.location ? `• ${job.location}` : ''}</span>
              </div>
            )}
            {job.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /><span>{job.location}</span></div>}
            {(job.salaryMin || job.salaryMax) && (
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>{job.salaryMin ? `$${job.salaryMin.toLocaleString()}` : ''}{job.salaryMin && job.salaryMax ? ' - ' : ''}{job.salaryMax ? `$${job.salaryMax.toLocaleString()}` : ''} {job.currency || 'USD'}</span>
              </div>
            )}
            {job.postedDate && <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /><span>Posted {new Date(job.postedDate).toLocaleDateString()}</span></div>}
          </div>
          {job.description && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{job.description}</p>
            </div>
          )}
          {job.tags?.length > 0 && (
            <div>
              <h4 className="font-medium text-foreground mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Link to={`/jobs/${job.id}`} onClick={onClose}>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <ExternalLink className="w-4 h-4 mr-2" /> View Full Details
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
