import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from 'react'
import axios from 'axios'

// Erstellen eines Kontextes für Authentifizierung
const AuthContext = createContext(null)

// Provider-Komponente, die den Authentifizierungsstatus und Funktionen bereitstellt
export const AuthProvider = ({ children }) => {
  // Lokaler Zustand für den aktuellen Benutzer, Authentifizierung, Ladezustand und Fehler
  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Funktion, die prüft, ob der Benutzer bereits eingeloggt ist
  const checkLoggedIn = useCallback(async () => {
    setLoading(true)
    try {
      // Token aus dem lokalen Speicher holen
      const token = localStorage.getItem('token')
      if (!token) {
        return false
      }

      // Token zu den Axios-Headern hinzufügen
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // API-Aufruf, um Benutzerdaten abzurufen
      const response = await axios.get('/api/auth/me')
      setCurrentUser(response.data)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      console.error('Error fetching user:', err)
      // Falls Token ungültig, aus lokalem Speicher entfernen
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setCurrentUser(null)
      setIsAuthenticated(false)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  // Beim ersten Rendern wird geprüft, ob der Benutzer bereits angemeldet ist
  useEffect(() => {
    checkLoggedIn()
  }, [checkLoggedIn])

  // ----------------------------
  // Login-Funktion
  // ----------------------------
  const login = async (username, password) => {
    try {
      setError(null)
      // Anfrage an den API-Endpunkt zum Einloggen senden
      const response = await axios.post('/api/auth/login', {
        username,
        password,
      })

      // Aus der Antwort den Token extrahieren
      const { accessToken } = response.data

      // Token speichern und in Axios-Header einfügen
      localStorage.setItem('token', accessToken)
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      // Benutzerdaten abrufen
      const userResponse = await axios.get('/api/auth/me')
      setCurrentUser(userResponse.data)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      // Fehlernachricht aus der Antwort ermitteln oder Standardnachricht verwenden
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        'Ein Fehler ist aufgetreten'
      setError(errorMessage)
      return false
    }
  }

  // ----------------------------
  // Registrierungs-Funktion
  // ----------------------------
  const register = async (username, email, password) => {
    try {
      setError(null)
      // Anfrage an den API-Endpunkt zur Registrierung senden
      await axios.post('/api/auth/register', { username, email, password })
      return true
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        'Ein Fehler ist aufgetreten'
      setError(errorMessage)
      return false
    }
  }

  // ----------------------------
  // Logout-Funktion
  // ----------------------------
  const logout = useCallback(async () => {
    try {
      // Anfrage zum Ausloggen senden
      await axios.post('/api/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Token entfernen und Benutzer-Daten zurücksetzen
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
      setCurrentUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  // Funktion zum Löschen von Fehlernachrichten
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Zusammenfassen aller Funktionen und Zustände, die wir bereitstellen wollen
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
    refreshUser: checkLoggedIn, // Ermöglicht es, den Benutzerstatus manuell zu aktualisieren
  }

  // AuthContext.Provider stellt den oben definierten Wert allen untergeordneten Komponenten zur Verfügung
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hilfsfunktion, um auf den AuthContext zuzugreifen
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
