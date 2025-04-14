import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from './index'
import { AuthProvider } from '../../context/AuthContext'

// Mock für den useNavigate-Hook von react-router-dom
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

// Mock für Axios-Anfragen
jest.mock('axios', () => ({
  defaults: {
    headers: { common: {} },
    baseURL: '',
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ 
    data: {
      token: 'fake-token',
      user: { username: 'testuser', email: 'test@example.com' }
    }
  })),
}))

describe('Login-Komponente', () => {
  const renderLoginComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('rendert Login-Formular', () => {
    renderLoginComponent()
    expect(screen.getByText(/Willkommen zurück/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Benutzername/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Anmelden/i })).toBeInTheDocument()
  })

  test('zeigt Fehlermeldung bei leerem Formular', async () => {
    renderLoginComponent()
    const loginButton = screen.getByRole('button', { name: /Anmelden/i })
    
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Dieses Feld ist erforderlich/i)).toBeInTheDocument()
    })
  })

  test('führt Login durch und navigiert zum Dashboard', async () => {
    renderLoginComponent()
    const usernameInput = screen.getByLabelText(/Benutzername/i)
    const passwordInput = screen.getByLabelText(/Passwort/i)
    const loginButton = screen.getByRole('button', { name: /Anmelden/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.click(loginButton)
    
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })

  test('wechselt Passwort-Sichtbarkeit', () => {
    renderLoginComponent()
    const passwordInput = screen.getByLabelText(/Passwort/i)
    const toggleButton = screen.getByLabelText(/Passwort anzeigen/i)
    
    // Standardmäßig sollte das Passwort verborgen sein
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Nach Klick sollte es sichtbar sein
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'text')
    
    // Erneuter Klick sollte es wieder verbergen
    fireEvent.click(toggleButton)
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})