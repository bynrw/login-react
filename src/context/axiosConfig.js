import axios from 'axios'

// Basis-URL für alle API-Anfragen; nutzt Umgebungsvariablen oder einen Standardwert
axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || 'http://localhost:8080'

// Setzt ein Timeout von 10 Sekunden für alle Anfragen
axios.defaults.timeout = 10000 // 10 Sekunden

// Standardheader für alle Anfragen (Inhaltstyp)
axios.defaults.headers.common['Content-Type'] = 'application/json'

// ----------------------------
// Request Interceptor: Wird vor jeder Anfrage ausgeführt
// ----------------------------
axios.interceptors.request.use(
  (config) => {
    // Token aus dem lokalen Speicher holen
    const token = localStorage.getItem('token')
    if (token) {
      // Falls vorhanden, Token zu den Headern hinzufügen
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ----------------------------
// Response Interceptor: Wird nach jeder Antwort ausgeführt
// ----------------------------
axios.interceptors.response.use(
  (response) => {
    // Antwort unverändert zurückgeben
    return response
  },
  (error) => {
    // Fehlerbehandlung bei bestimmten HTTP-Statuscodes
    if (error.response) {
      const { status } = error.response
      if (status === 401) {
        // 401 Unauthorized: Token ungültig oder abgelaufen
        localStorage.removeItem('token')
        // Umleiten zur Login-Seite, falls nicht bereits dort
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login'
        }
      } else if (status === 403) {
        // 403 Forbidden: Keine Berechtigung für die angefragte Ressource
        console.error('You do not have permission to access this resource')
      } else if (status === 500) {
        // 500 Server Error: Fehler auf Serverseite
        console.error('Server error occurred')
      }
    } else if (error.request) {
      // Anfrage wurde gesendet, aber keine Antwort erhalten
      console.error('No response received from server')
    } else {
      // Fehler beim Einrichten der Anfrage
      console.error('Error setting up request:', error.message)
    }
    return Promise.reject(error)
  }
)

// ----------------------------
// Helper Methoden für API-Operationen
// ----------------------------
// Diese Methoden vereinfachen den Aufruf von GET, POST, PUT und DELETE Anfragen.
const api = {
  get: (url, config = {}) => {
    return axios.get(url, config).then((response) => response.data)
  },
  post: (url, data = {}, config = {}) => {
    return axios.post(url, data, config).then((response) => response.data)
  },
  put: (url, data = {}, config = {}) => {
    return axios.put(url, data, config).then((response) => response.data)
  },
  delete: (url, config = {}) => {
    return axios.delete(url, config).then((response) => response.data)
  },
}

export default api
