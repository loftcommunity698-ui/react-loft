import { useState } from 'react'
import { Bookmark, Loader2 } from 'lucide-react'
import { useAuth } from '@/providers/AuthProvider'
import { useNavigate, useLocation } from 'react-router-dom'
import api from '@/lib/api'

interface SaveJobButtonProps {
  jobId: string
  initiallySaved?: boolean
  className?: string
}

export default function SaveJobButton({ jobId, initiallySaved = false, className = '' }: SaveJobButtonProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [saved, setSaved] = useState(initiallySaved)
  const [loading, setLoading] = useState(false)

  if (!user) {
    return (
      <button
        type="button"
        className={`text-neutral-500 hover:text-neutral-300 transition-colors ${className}`}
        aria-label="Sign in to save jobs"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          navigate('/login', { state: { redirect: location.pathname + location.search } })
        }}
      >
        <Bookmark className="w-5 h-5" />
      </button>
    )
  }

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    try {
      if (saved) {
        await api.delete('/users/saved-jobs', { params: { jobId: String(jobId) } })
        setSaved(false)
      } else {
        await api.post('/users/saved-jobs', { jobId })
        setSaved(true)
      }
    } catch { /* silent */ } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`transition-colors ${
        saved ? 'text-emerald-400' : 'text-neutral-500 hover:text-neutral-300'
      } ${className}`}
      aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <Bookmark className={`w-5 h-5 ${saved ? 'fill-emerald-400' : ''}`} />
      )}
    </button>
  )
}
