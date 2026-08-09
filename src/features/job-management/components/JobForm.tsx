import { useState } from 'react'
import MultipleSelector, { Option } from '@/components/ui/multiple-selector'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { CreateJobPayload, CATEGORY_LABELS, SENIORITY_LABELS } from '../types'
import { cn } from '@/lib/utils'
import { Save } from 'lucide-react'
import { searchTags as searchTagsRaw } from '@/lib/api'

interface JobFormProps {
  initialData?: CreateJobPayload
  onSubmit: (data: CreateJobPayload) => Promise<void>
  onCancel: () => void
  loading?: boolean
  className?: string
}

export function JobForm({
  initialData,
  onSubmit,
  onCancel,
  loading = false,
  className,
}: JobFormProps) {
  const [formData, setFormData] = useState<CreateJobPayload>({
    title: initialData?.title || '',
    company: initialData?.company || '',
    companyLogo: initialData?.companyLogo || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || [],
    responsibilities: initialData?.responsibilities || [],
    category: initialData?.category || '',
    seniority: initialData?.seniority || '',
    location: initialData?.location || '',
    remote: initialData?.remote || false,
    salaryMin: initialData?.salaryMin ?? undefined,
    salaryMax: initialData?.salaryMax ?? undefined,
    currency: initialData?.currency || 'USD',
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
  })
  const [requirementsText, setRequirementsText] = useState(initialData?.requirements?.join('\n') || '')
  const [responsibilitiesText, setResponsibilitiesText] = useState(initialData?.responsibilities?.join('\n') || '')

  const handleChange = (field: keyof CreateJobPayload, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const searchTags = async (query: string): Promise<Option[]> => {
    if (!query) return []
    const tags = await searchTagsRaw(query)
    return tags.map(tag => ({ value: tag.name, label: tag.name }))
  }

  const toOptions = (tags: string[]): Option[] =>
    tags.map(t => ({ value: t, label: t }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      ...formData,
      requirements: requirementsText.split('\n').map(s => s.trim()).filter(Boolean),
      responsibilities: responsibilitiesText.split('\n').map(s => s.trim()).filter(Boolean),
      tags: formData.tags || [],
    })
  }

  return (
    <div className={cn('space-y-6', className)}>
      <form onSubmit={handleSubmit}>
        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Basic Information</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the basic details about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-foreground/80">Job Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
                className="bg-muted border-border text-foreground mt-1"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company" className="text-foreground/80">Company *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="e.g., Acme Inc."
                  className="bg-muted border-border text-foreground mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="companyLogo" className="text-foreground/80">Company Logo URL</Label>
                <Input
                  id="companyLogo"
                  value={formData.companyLogo || ''}
                  onChange={(e) => handleChange('companyLogo', e.target.value)}
                  placeholder="https://..."
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-foreground/80">Job Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe the role and responsibilities..."
                className="bg-muted border-border text-foreground mt-1 min-h-[120px]"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Job Details</CardTitle>
            <CardDescription className="text-muted-foreground">
              Specify the category, seniority, and work setup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-foreground/80">Category *</Label>
                <select
                  value={formData.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  {CATEGORY_LABELS.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-foreground/80">Seniority *</Label>
                <select
                  value={formData.seniority}
                  onChange={(e) => handleChange('seniority', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                  required
                >
                  <option value="" disabled>Select a seniority</option>
                  {Object.entries(SENIORITY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-foreground/80">Location *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  className="bg-muted border-border text-foreground mt-1"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <Switch
                  id="remote"
                  checked={formData.remote || false}
                  onCheckedChange={(checked) => handleChange('remote', checked)}
                />
                <Label htmlFor="remote" className="text-foreground/80">Remote position</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Compensation</CardTitle>
            <CardDescription className="text-muted-foreground">
              Set the salary range for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="salaryMin" className="text-foreground/80">Minimum</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin ?? ''}
                  onChange={(e) => handleChange('salaryMin', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="50000"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label htmlFor="salaryMax" className="text-foreground/80">Maximum</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax ?? ''}
                  onChange={(e) => handleChange('salaryMax', e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="80000"
                  className="bg-muted border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-foreground/80">Currency</Label>
                <select
                  value={formData.currency || 'USD'}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-foreground mt-1"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Tags</CardTitle>
            <CardDescription className="text-muted-foreground">
              Search or create tags for this position
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MultipleSelector
              value={toOptions(formData.tags || [])}
              onChange={(options) => handleChange('tags', options.map(o => o.value))}
              onSearch={searchTags}
              placeholder="Search or type a tag..."
              delay={200}
              creatable
              className="bg-muted border-border text-foreground mt-1"
              badgeClassName="bg-emerald-500/20 text-emerald-400"
              hidePlaceholderWhenSelected
            />
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Requirements & Responsibilities</CardTitle>
            <CardDescription className="text-muted-foreground">
              One item per line
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requirements" className="text-foreground/80">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={requirementsText}
                  onChange={(e) => setRequirementsText(e.target.value)}
                  placeholder={'e.g.,\n5+ years of experience\nBachelor\'s degree'}
                  className="bg-muted border-border text-foreground mt-1 min-h-[120px]"
                />
              </div>
              <div>
                <Label htmlFor="responsibilities" className="text-foreground/80">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={responsibilitiesText}
                  onChange={(e) => setResponsibilitiesText(e.target.value)}
                  placeholder={'e.g.,\nBuild and ship features\nMentor junior engineers'}
                  className="bg-muted border-border text-foreground mt-1 min-h-[120px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border mb-6">
          <CardHeader>
            <CardTitle className="text-foreground">Listing</CardTitle>
            <CardDescription className="text-muted-foreground">
              Posting options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={formData.featured || false}
                onCheckedChange={(checked) => handleChange('featured', checked)}
              />
              <Label htmlFor="featured" className="text-foreground/80">Featured job</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} className="border-border">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {initialData ? 'Update Job' : 'Create Job'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default JobForm
