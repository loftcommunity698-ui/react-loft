import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { JobSummary, SENIORITY_LABELS } from '../types'
import { formatSalaryRange } from '../services/jobService'
import { cn } from '@/lib/utils'
import {
  MapPin,
  Edit,
  Trash2,
  Star,
  ExternalLink,
  Briefcase,
} from 'lucide-react'

interface JobCardProps {
  job: JobSummary
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleFeatured?: (isFeatured: boolean) => void
  className?: string
}

export function JobCard({
  job,
  onClick,
  onEdit,
  onDelete,
  onToggleFeatured,
  className,
}: JobCardProps) {
  const salary = formatSalaryRange(job.salaryMin, job.salaryMax, job.currency)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'bg-card/50 border-border hover:border-emerald-500/30 transition-all cursor-pointer',
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {job.featured && (
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                <CardTitle className="text-lg text-foreground">
                  {job.title}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Briefcase className="w-4 h-4" />
                {job.company}
              </div>
            </div>
            <Badge className="border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              {SENIORITY_LABELS[job.seniority] || job.seniority}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <MapPin className="w-4 h-4" />
            {job.remote ? (
              <span className="text-emerald-400">Remote</span>
            ) : (
              job.location || 'Location not specified'
            )}
          </div>

          {salary !== 'Not specified' && (
            <div className="text-emerald-400 font-medium text-sm">
              {salary}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-muted text-muted-foreground">
              {job.category}
            </Badge>
            {job.tags.slice(0, 4).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-muted text-muted-foreground">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2 border-t border-border">
            {onEdit && (
              <Button
                size="sm"
                variant="outline"
                className="border-border"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
            )}
            {onToggleFeatured && (
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  'border-border',
                  job.featured && 'text-yellow-400 border-yellow-400/30'
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFeatured(!job.featured)
                }}
              >
                <Star className={cn('w-4 h-4', job.featured && 'fill-yellow-400')} />
              </Button>
            )}
            {onDelete && (
              <Button
                size="sm"
                variant="outline"
                className="border-border text-red-400 hover:text-red-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-border ml-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              View
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default JobCard
