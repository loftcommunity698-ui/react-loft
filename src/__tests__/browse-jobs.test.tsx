import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BrowseJobs from '../pages/BrowseJobs'
import { AuthProvider } from '../providers/AuthProvider'

window.scrollTo = vi.fn()

const mockUseJobs = vi.fn()

vi.mock('@/lib/api-hooks', () => ({
  useJobs: (...args: unknown[]) => mockUseJobs(...args),
}))

vi.mock('@/components/sections/jobs/SaveJobButton', () => ({
  default: () => <span data-testid="save-button" />,
}))

vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}))

function makeJob(i: number) {
  return {
    id: `job-${String(i).padStart(3, '0')}`,
    title: `Software Engineer ${i}`,
    company: 'Acme',
    companyLogo: null,
    location: 'San Francisco, CA',
    remote: false,
    salaryMin: 50000,
    salaryMax: 80000,
    currency: 'USD',
    tags: [],
    category: 'Engineering',
    seniority: 'mid',
    postedDate: '2026-01-01',
  }
}

function renderBrowse() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/jobs']}>
        <BrowseJobs />
      </MemoryRouter>
    </AuthProvider>
  )
}

describe('BrowseJobs', () => {
  beforeEach(() => {
    mockUseJobs.mockReset()
    mockUseJobs.mockReturnValue({ jobs: [], loading: false, error: null, total: 0 })
  })

  it('renders a subset and shows "Show All" when there are more jobs', async () => {
    mockUseJobs.mockReturnValue({
      jobs: Array.from({ length: 6 }, (_, i) => makeJob(i + 1)),
      loading: false,
      error: null,
      total: 12,
    })

    renderBrowse()

    expect(await screen.findByText('Software Engineer 1')).toBeInTheDocument()
    expect(screen.queryByText('Software Engineer 12')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Show All \(12 jobs\)/i })).toBeInTheDocument()
  })

  it('refetches with take equal to total when "Show All" is clicked', async () => {
    mockUseJobs.mockReturnValue({
      jobs: Array.from({ length: 6 }, (_, i) => makeJob(i + 1)),
      loading: false,
      error: null,
      total: 12,
    })

    renderBrowse()

    fireEvent.click(screen.getByRole('button', { name: /Show All \(12 jobs\)/i }))

    await waitFor(() => {
      expect(mockUseJobs).toHaveBeenLastCalledWith(expect.objectContaining({ take: '12' }))
    })
  })
})
