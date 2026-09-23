const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx']
const MAX_SIZE_BYTES = 10 * 1024 * 1024

export async function uploadResume(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary not configured')
  }

  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error('Please upload a PDF, DOC, or DOCX file')
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('File must be 10 MB or smaller')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.secure_url) {
    throw new Error(data?.error?.message || 'Resume upload failed. Please try again.')
  }

  return data.secure_url as string
}
