import { useState, useEffect, useCallback } from 'react'
import type {
  JobSummary,
  JobWithRelations,
  JobMetrics,
  CreateJobPayload,
  UpdateJobPayload,
  JobFilters,
} from '../types'
import {
  getEmployerJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  toggleFeatured,
  getJobMetrics,
} from '../services/jobService'

interface UseJobManagementState {
  jobs: JobSummary[]
  currentJob: JobWithRelations | null
  metrics: JobMetrics | null
  loading: boolean
  error: string | null
}

export function useJobManagement(filters?: JobFilters) {
  const [state, setState] = useState<UseJobManagementState>({
    jobs: [],
    currentJob: null,
    metrics: null,
    loading: true,
    error: null,
  })

  const fetchJobs = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const jobs = await getEmployerJobs(filters)
      setState(prev => ({ ...prev, jobs, loading: false }))
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch jobs',
      }))
    }
  }, [filters])

  const fetchJob = useCallback(async (jobId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const job = await getJob(jobId)
      setState(prev => ({ ...prev, currentJob: job, loading: false }))
      return job
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch job',
      }))
      throw error
    }
  }, [])

  const addJob = useCallback(async (data: CreateJobPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const job = await createJob(data)
      setState(prev => ({
        ...prev,
        jobs: [...prev.jobs, job],
        currentJob: job,
        loading: false,
      }))
      return job
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to create job',
      }))
      throw error
    }
  }, [])

  const editJob = useCallback(async (jobId: string, data: UpdateJobPayload) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    try {
      const job = await updateJob(jobId, data)
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job : j),
        currentJob: job,
        loading: false,
      }))
      return job
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to update job',
      }))
      throw error
    }
  }, [])

  const removeJob = useCallback(async (jobId: string) => {
    try {
      await deleteJob(jobId)
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.filter(j => j.id !== jobId),
      }))
    } catch (error) {
      throw error
    }
  }, [])

  const setFeatured = useCallback(async (jobId: string, featured: boolean) => {
    try {
      const job = await toggleFeatured(jobId, featured)
      setState(prev => ({
        ...prev,
        jobs: prev.jobs.map(j => j.id === jobId ? job : j),
      }))
      return job
    } catch (error) {
      throw error
    }
  }, [])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  return {
    ...state,
    fetchJobs,
    fetchJob,
    addJob,
    editJob,
    deleteJob: removeJob,
    setFeatured,
  }
}

export function useJobMetrics(jobId: string) {
  const [metrics, setMetrics] = useState<JobMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMetrics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getJobMetrics(jobId)
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }, [jobId])

  useEffect(() => {
    if (jobId) {
      fetchMetrics()
    }
  }, [jobId, fetchMetrics])

  return { metrics, loading, error, refetch: fetchMetrics }
}
