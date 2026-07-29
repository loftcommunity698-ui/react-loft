import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'

window.scrollTo = vi.fn()

vi.mock('axios', () => {
  const mockAxios = {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: { count: 0 } }),
    patch: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    create: vi.fn(() => mockAxios),
    defaults: {},
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn() },
    },
  }
  return { default: mockAxios }
})

describe('App', () => {
  it('renders the home page with expected content', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Jobs')).toBeInTheDocument()

    const signIn = await screen.findByText('Sign In')
    expect(signIn).toBeInTheDocument()
    expect(await screen.findByText('Get Started')).toBeInTheDocument()

    expect(screen.getByText('Dream Job')).toBeInTheDocument()
  })

  it('renders the 404 page for unknown routes', async () => {
    render(
      <MemoryRouter initialEntries={['/nonexistent']}>
        <App />
      </MemoryRouter>
    )

    expect(await screen.findByText('404')).toBeInTheDocument()
    expect(screen.getByText('Page not found')).toBeInTheDocument()
  })
})
