// Importieren von React und benötigten Komponenten aus React und react-router-dom
import React from 'react'
import {
  BrowserRouter as Router, // Ermöglicht das Routing in der Browser-Umgebung
  Routes, // Definiert mehrere Routen in der App
  Route, // Eine einzelne Route
  Navigate, // Ermöglicht das Weiterleiten (Redirect) von Routen
} from 'react-router-dom'

// Importieren von Material UI Komponenten zur Gestaltung und Theming
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

// Importieren der Komponenten für Login, Registrierung und Dashboard
import Login from './components/Login'
import MainPage from './MainPage'
import Register from './components/Register'
import Dashboard from './components/Dashboard'

// Importieren des AuthContext, um auf Authentifizierungsdaten zuzugreifen
import { AuthProvider, useAuth } from './context/AuthContext'

// ----------------------------
// Route Guard für geschützte Routen
// ----------------------------
// PrivateRoute stellt sicher, dass nur authentifizierte Benutzer auf bestimmte Seiten zugreifen können.
const PrivateRoute = ({ children }) => {
  // Aus dem AuthContext holen wir den aktuellen Authentifizierungsstatus und Ladezustand
  const { isAuthenticated, loading } = useAuth()

  // Wenn noch Daten geladen werden, zeigen wir einen Ladehinweis
  if (loading) {
    return <div>Laden...</div>
  }

  // Wenn der Benutzer authentifiziert ist, wird der Inhalt (children) angezeigt.
  // Andernfalls wird der Benutzer zur Login-Seite umgeleitet.
  return isAuthenticated ? children : <Navigate to="/login" />
}

// ----------------------------
// Erstellen eines Themes mit Material UI
// ----------------------------
// Das Theme legt das Farbschema, Schriftarten, Abstände, etc. fest.
const theme = createTheme({
  palette: {
    mode: 'light', // Legt den Modus (hell/dunkel) fest
    primary: {
      main: '#1976d2', // Hauptfarbe
      light: '#42a5f5', // Helle Variante der Primärfarbe
      dark: '#1565c0', // Dunkle Variante der Primärfarbe
      contrastText: '#ffffff', // Textfarbe, die auf der Primärfarbe gut lesbar ist
    },
    secondary: {
      main: '#dc004e', // Sekundärfarbe
      light: '#ff4081',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5', // Standardhintergrundfarbe der App
      paper: '#ffffff', // Hintergrundfarbe von "Papier"-Elementen (z.B. Karten)
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Definiert die Standardschriftarten
    button: {
      textTransform: 'none', // Verhindert, dass Buttons automatisch in Großbuchstaben dargestellt werden
    },
  },
  shape: {
    borderRadius: 8, // Globale Rundung der Ecken für Komponenten
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Überschreibt die Standard-Eckenrundung der Button-Komponente
        },
      },
    },
  },
})

// ----------------------------
// Haupt-App-Komponente
// ----------------------------
function App() {
  return (
    // ThemeProvider stellt das definierte Theme für alle untergeordneten Komponenten bereit
    <ThemeProvider theme={theme}>
      {/* CssBaseline sorgt für einen konsistenten Basisstil in allen Browsern */}
      <CssBaseline />
      {/* AuthProvider stellt den Authentifizierungskontext (z.B. Login-Status) bereit */}
      <AuthProvider>
        {/* Router ermöglicht die Navigation zwischen verschiedenen Seiten */}
        <Router>
          {/* Definiert die Routen der App */}
          <Routes>
            {/* Route zur Login-Seite */}
            <Route path="/login" element={<Login />} />
            {/* Route zur Registrierungs-Seite */}
            <Route path="/register" element={<Register />} />
            {/* Geschützte Route zur MainPage */}
            <Route
              path="/main"
              element={
                <PrivateRoute>
                  <MainPage />
                </PrivateRoute>
              }
            />
            {/* Geschützte Route zum Dashboard */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            {/* Standardroute, die auf /dashboard umleitet, wenn authentifiziert */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Navigate to="/dashboard" />
                </PrivateRoute>
              }
            />
            {/* Alle unbekannten Routen werden auf /login umgeleitet */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
