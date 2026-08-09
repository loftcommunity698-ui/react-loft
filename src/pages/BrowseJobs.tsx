import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, MapPin, Briefcase, ChevronDown, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import PageShell from '@/components/layout/PageShell'
import SaveJobButton from '@/components/sections/jobs/SaveJobButton'
import JobListSkeleton from '@/components/skeletons/JobListSkeleton'
import { useJobs } from '@/lib/api-hooks'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatSalary, formatRelativeTime } from '@/lib/mappers'

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Product']
const SENIORITIES = ['junior', 'mid', 'senior', 'lead', 'executive', 'expert']
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recent' },
  { value: 'relevance', label: 'Best Match' },
  { value: 'salary_high', label: 'Highest Salary' },
  { value: 'salary_low', label: 'Lowest Salary' },
  { value: 'remote_first', label: 'Remote First' },
]

export default function BrowseJobs() {
  const reduced = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [seniority, setSeniority] = useState(searchParams.get('seniority') || '')
  const [remote, setRemote] = useState(searchParams.get('remote') === 'true')
  const [sort, setSort] = useState(searchParams.get('sort') || 'recent')
  const [showAllTake, setShowAllTake] = useState<string | null>(null)

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next, { replace: true })
  }

  const params: Record<string, string> = { sort }
  if (search) params.search = search
  if (location) params.location = location
  if (category) params.category = category
  if (seniority) params.seniority = seniority
  if (remote) params.remote = 'true'
  if (showAllTake) params.take = showAllTake

  const { jobs, loading, error, total } = useJobs(params)

  const hasMore = total > jobs.length

  const clearFilters = () => {
    setSearch('')
    setLocation('')
    setCategory('')
    setSeniority('')
    setRemote(false)
    setSort('recent')
    setShowAllTake(null)
    setSearchParams({}, { replace: true })
  }

  return (
    <PageShell>
      <div className="container px-4 md:px-6 py-16 sm:py-20">
        <motion.div initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {error ? (
            <div className="flex items-center justify-center min-h-[60vh] px-4">
              <Card className="w-full max-w-md">
                <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-red-400" />
                  <p className="text-neutral-400">{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
          <>
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Browse Jobs</h1>
            <p className="text-neutral-400 max-w-xl mx-auto">Find your next opportunity from top companies</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search jobs or companies..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); updateParam('search', e.target.value) }}
                className="pl-10"
              />
            </div>
            <div className="relative flex-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Filter by location..."
                value={location}
                onChange={(e) => { setLocation(e.target.value); updateParam('location', e.target.value) }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 max-w-2xl mx-auto mb-10">
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); updateParam('category', e.target.value) }}
              className="h-10 min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white flex-1 min-w-[140px]"
              aria-label="Filter by category"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={seniority}
              onChange={(e) => { setSeniority(e.target.value); updateParam('seniority', e.target.value) }}
              className="h-10 min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white flex-1 min-w-[140px]"
              aria-label="Filter by seniority"
            >
              <option value="">All Seniorities</option>
              {SENIORITIES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); updateParam('sort', e.target.value) }}
              className="h-10 min-h-[44px] rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white flex-1 min-w-[140px]"
              aria-label="Sort jobs"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-neutral-400 cursor-pointer select-none px-1">
              <Switch
                checked={remote}
                onCheckedChange={(checked) => { setRemote(checked); updateParam('remote', checked ? 'true' : '') }}
                aria-label="Remote only"
              />
              Remote only
            </label>
          </div>

          {loading ? (
            <JobListSkeleton />
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <img
                src="/images/No%20Jobs.png"
                alt="No jobs found"
                className="w-48 h-48 object-contain mx-auto mb-4 opacity-60"
              />
              <p className="text-neutral-400 mb-2">No jobs found matching your criteria</p>
              <p className="text-sm text-neutral-500 mb-6">Try adjusting your search or filters</p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-white/10"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {jobs.map((job, i) => (
                  <motion.div
                    key={job.id}
                    initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ delay: reduced ? 0 : i * 0.05 }}
                  >
                    <Link to={`/jobs/${job.id}`}>
                      <Card className="h-full hover:border-emerald-500/30 transition-all duration-300 group">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center overflow-hidden">
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
                            <div className="flex items-center gap-1">
                              <SaveJobButton jobId={job.id} />
                            </div>
                          </div>
                          <h3 className="font-semibold text-white group-hover:text-emerald-400 transition-colors mb-1">{job.title}</h3>
                          <p className="text-sm text-neutral-400 mb-3">{job.company}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-neutral-500">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {job.category}
                            </span>
                            {job.seniority && <span className="capitalize">{job.seniority}</span>}
                            {job.remote && <span className="text-emerald-400">Remote</span>}
                          </div>
                          {job.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {job.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            {formatSalary(job.salaryMin, job.salaryMax, job.currency) && (
                              <p className="text-sm text-emerald-400 font-medium">{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</p>
                            )}
                            {job.postedDate && (
                              <p className="text-xs text-neutral-500">{formatRelativeTime(job.postedDate)}</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllTake(String(total))}
                    className="border-white/10 text-white gap-2 px-8"
                  >
                    <ChevronDown className="h-4 w-4" />
                    Show All ({total} jobs)
                  </Button>
                </div>
              )}
            </>
          )}
          </>
          )}
        </motion.div>
      </div>
    </PageShell>
  )
}
