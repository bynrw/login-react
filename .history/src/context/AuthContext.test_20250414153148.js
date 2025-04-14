import { render, act, renderHook, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

// Mock für localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    removeItem: jest.fn((key) => {
      delete store[key]
    }),
    clear: jest.fn(() => {
      store = {}
    }),
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock für Axios
jest.mock('axios', () => ({
  defaults: {
    headers: { common: {} },
    baseURL: '',
  },
  get: jest.fn(),
  post: jest.fn(),
}))

const axios = require('axios')

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  test('stellt einen initialisierten AuthContext bereit', () => {
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    expect(result.current).toEqual(
      expect.objectContaining({
        currentUser: null,
        isAuthenticated: false,
        isLoading: expect.any(Boolean),
        error: null,
        login: expect.any(Function),
        register: expect.any(Function),
        logout: expect.any(Function),
        clearError: expect.any(Function),
      })
    )
  })

  test('login aktualisiert den Authentifizierungsstatus', async () => {
    // Mock der Serverantwort für login
    axios.post.mockResolvedValueOnce({
      data: {
        token: 'test-token',
        user: { id: 1, username: 'testuser', email: 'test@example.com' },
      },
    })
    
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      const success = await result.current.login('testuser', 'password123')
      expect(success).toBe(true)
    })
    
    expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
      username: 'testuser',
      password: 'password123',
    })
    
    expect(localStorage.setItem).toHaveBeenCalledWith('token', 'test-token')
    
    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.currentUser).toEqual(
        expect.objectContaining({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        })
      )
    })
  })

  test('register sendet Registrierungsanfrage', async () => {
    axios.post.mockResolvedValueOnce({ data: { success: true } })
    
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    await act(async () => {
      const success = await result.current.register(
        'newuser',
        'new@example.com',
        'password123'
      )
      expect(success).toBe(true)
    })
    
    expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
      username: 'newuser',
      email: 'new@example.com',
      password: 'password123',
    })
  })

  test('logout entfernt Authentifizierung', async () => {
    // Mock des angemeldeten Zustands
    axios.post.mockResolvedValueOnce({ data: {} })
    localStorage.setItem('token', 'test-token')
    
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    const { result } = renderHook(() => useAuth(), { wrapper })
    
    // Manuell den angemeldeten Zustand setzen
    act(() => {
      result.current.currentUser = { username: 'testuser' }
      result.current.isAuthenticated = true
    })
    
    await act(async () => {
      await result.current.logout()
    })
    
    expect(axios.post).toHaveBeenCalledWith('/api/auth/logout')
    expect(localStorage.removeItem).toHaveBeenCalledWith('token')
    
    expect(result.current.currentUser).toBe(null)
    expect(result.current.isAuthenticated).toBe(false)
  })

  test('überprüft Authentifizierungsstatus beim Laden', async () => {
    // Mock eines existierenden Tokens
    localStorage.setItem('token', 'existing-token')
    
    // Mock der Serverantwort für die Benutzerabfrage
    axios.get.mockResolvedValueOnce({
      data: { id: 1, username: 'testuser', email: 'test@example.com' },
    })
    
    const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>
    
    await act(async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })
      
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
      
      expect(axios.get).toHaveBeenCalledWith('/api/auth/me')
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer existing-token')
      
      expect(result.current.currentUser).toEqual(
        expect.objectContaining({
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
        })
      )
      expect(result.current.isAuthenticated).toBe(true)
    })
  })
})