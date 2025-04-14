import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './index'
import { AuthProvider } from '../../context/AuthContext'

// Mock für den useNavigate-Hook von react-router-dom
const mockedUsedNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUsedNavigate,
}))

// Mock für den AuthContext
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: { username: 'testuser', email: 'test@example.com' },
    logout: jest.fn(() => Promise.resolve()),
    selectOrganization: jest.fn(() => Promise.resolve(true)),
  }),
  AuthProvider: ({ children }) => <div>{children}</div>,
}))

describe('Dashboard-Komponente', () => {
  const renderDashboardComponent = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
  }

  test('rendert Dashboard mit Benutzername', () => {
    renderDashboardComponent()
    expect(screen.getByText(/Herzlich Willkommen, testuser!/i)).toBeInTheDocument()
  })

  test('zeigt Benutzerprofil mit Avatar an', () => {
    renderDashboardComponent()
    expect(screen.getByText('T')).toBeInTheDocument() // Erster Buchstabe als Avatar
    expect(screen.getByText('testuser')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  test('zeigt Benutzerprofil-Bearbeitungs-Button an', () => {
    renderDashboardComponent()
    expect(screen.getByRole('button', { name: /Profil bearbeiten/i })).toBeInTheDocument()
  })

  test('zeigt Benutzerinformationen an', () => {
    renderDashboardComponent()
    expect(screen.getByText('Ihre Informationen')).toBeInTheDocument()
    
    // Prüfe die Listenpunkte
    const listItems = screen.getAllByRole('listitem')
    expect(listItems.length).toBeGreaterThanOrEqual(3)
    
    // Prüfe die wichtigsten Informationen
    expect(screen.getByText('Benutzername')).toBeInTheDocument()
    expect(screen.getByText('E-Mail')).toBeInTheDocument()
    expect(screen.getByText('Mitglied seit')).toBeInTheDocument()
  })

  test('enthält Organisationsauswahl', () => {
    renderDashboardComponent()
    expect(screen.getByText('Organisationsauswahl')).toBeInTheDocument()
    expect(screen.getByLabelText('Stadt')).toBeInTheDocument()
    expect(screen.getByLabelText('Organisation')).toBeInTheDocument()
  })

  test('aktualisiert Stadt- und Organisationsauswahl', async () => {
    renderDashboardComponent()
    
    // Stadt auswählen
    const stadtSelect = screen.getByLabelText('Stadt')
    fireEvent.mouseDown(stadtSelect) // Öffne das Dropdown
    
    // Warten bis die Optionen angezeigt werden
    await waitFor(() => {
      const stadtOption = screen.getByRole('option', { name: 'Köln' })
      fireEvent.click(stadtOption)
    })
    
    // Überprüfen, ob die Stadt-Auswahl aktualisiert wurde
    expect(stadtSelect).toHaveValue('Köln')
    
    // Organisation auswählen (jetzt sollte die Liste aktualisiert sein)
    const orgSelect = screen.getByLabelText('Organisation')
    fireEvent.mouseDown(orgSelect) // Öffne das Dropdown
    
    // Warten bis die Optionen angezeigt werden
    await waitFor(() => {
      const orgOption = screen.getByRole('option', { name: 'BF Köln' })
      fireEvent.click(orgOption)
    })
    
    // Überprüfen, ob die Organisations-Auswahl aktualisiert wurde
    expect(orgSelect).toHaveValue('BF Köln')
    
    // Überprüfen, ob die Erfolgsmeldung angezeigt wird
    expect(screen.getByText(/Ausgewählte Organisation: BF Köln/i)).toBeInTheDocument()
  })

  test('loggt den Benutzer aus und navigiert zurück zum Login', async () => {
    renderDashboardComponent()
    const logoutButton = screen.getByRole('button', { name: /Abmelden/i })
    
    fireEvent.click(logoutButton)
    
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('/login')
    })
  })
})