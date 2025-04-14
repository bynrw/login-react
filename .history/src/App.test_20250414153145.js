import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'

// Mock für Axios-Aufrufe
jest.mock('axios', () => ({
  defaults: {
    headers: { common: {} },
    baseURL: '',
    timeout: 0,
  },
  get: jest.fn(() => Promise.resolve({ data: {} })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
}))

// Hilfsfunktion zum Rendern von Komponenten mit benötigten Providern
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      <AuthProvider>{ui}</AuthProvider>
    </BrowserRouter>
  )
}

describe('App-Komponente', () => {
  test('rendert ohne Fehler', () => {
    renderWithProviders(<App />)
  })

  test('enthält Hauptnavigation wenn der Benutzer authentifiziert ist', () => {
    // Hier könnte ein Test für die Navigation implementiert werden,
    // nachdem ein Benutzer angemeldet ist
  })
})