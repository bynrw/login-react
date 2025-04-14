import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Register from './index'
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
  post: jest.fn(() => Promise.resolve({ data: { success: true } })),
}))

describe('Register-Komponente', () => {
  const renderRegisterComponent = () => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          <Register />
        </AuthProvider>
      </BrowserRouter>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('rendert Registrierungsformular', () => {
    renderRegisterComponent()
    expect(screen.getByText(/Registrieren/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Benutzername/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-Mail-Adresse/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^Passwort$/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Passwort bestätigen/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Registrieren/i })).toBeInTheDocument()
  })

  test('validiert leere Formularfelder', async () => {
    renderRegisterComponent()
    const registerButton = screen.getByRole('button', { name: /Registrieren/i })
    
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Benutzername wird benötigt/i)).toBeInTheDocument()
      expect(screen.getByText(/E-Mail wird benötigt/i)).toBeInTheDocument()
      expect(screen.getByText(/Passwort wird benötigt/i)).toBeInTheDocument()
    })
  })

  test('validiert ungültige E-Mail-Adresse', async () => {
    renderRegisterComponent()
    const usernameInput = screen.getByLabelText(/Benutzername/i)
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i)
    const registerButton = screen.getByRole('button', { name: /Registrieren/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText(/E-Mail ist ungültig/i)).toBeInTheDocument()
    })
  })

  test('validiert nicht übereinstimmende Passwörter', async () => {
    renderRegisterComponent()
    const usernameInput = screen.getByLabelText(/Benutzername/i)
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i)
    const passwordInput = screen.getByLabelText(/^Passwort$/i)
    const confirmPasswordInput = screen.getByLabelText(/Passwort bestätigen/i)
    const registerButton = screen.getByRole('button', { name: /Registrieren/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'different' } })
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Passwörter stimmen nicht überein/i)).toBeInTheDocument()
    })
  })

  test('führt erfolgreiche Registrierung durch', async () => {
    renderRegisterComponent()
    const usernameInput = screen.getByLabelText(/Benutzername/i)
    const emailInput = screen.getByLabelText(/E-Mail-Adresse/i)
    const passwordInput = screen.getByLabelText(/^Passwort$/i)
    const confirmPasswordInput = screen.getByLabelText(/Passwort bestätigen/i)
    const registerButton = screen.getByRole('button', { name: /Registrieren/i })
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } })
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: 'password123' } })
    fireEvent.change(confirmPasswordInput, { target: { value: 'password123' } })
    fireEvent.click(registerButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Registrierung erfolgreich!/i)).toBeInTheDocument()
    })

    // Nach der erfolgreichen Registrierung sollte der Timer für die Weiterleitung starten
    // Wir können den Timeout mocken und überprüfen
    jest.advanceTimersByTime(3000)
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/login')
    })
  })
})