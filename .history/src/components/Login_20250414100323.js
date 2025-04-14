import React, { useState, useEffect } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Importieren von Material UI Komponenten und Icons
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  CircularProgress,
  Alert,
  IconButton,
  Grid,
  Divider,
  Tooltip,
  Fade,
  Slide,
} from '@mui/material'
import {
  LockOutlined,
  AccountCircleOutlined,
  Visibility,
  VisibilityOff,
  KeyOutlined,
  EmailOutlined,
  HelpOutlineOutlined,
  ArrowForwardOutlined,
  ErrorOutlineOutlined,
} from '@mui/icons-material'
import { styled, keyframes } from '@mui/system'

// ----------------------------
// Definition von Animationen mittels keyframes
// ----------------------------
// shimmer: Erzeugt einen schimmernden Effekt für Hintergründe
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`

// fadeIn: Lässt Elemente sanft erscheinen (Einblendeffekt)
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

// pulse: Erzeugt einen pulsierenden Effekt, z.B. bei einem Button im Ladezustand
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 60, 114, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0); }
`

// ----------------------------
// Styled Components zur besseren Wiederverwendung und Kapselung des Stils
// ----------------------------

// GradientBackground: Vollflächiger, animierter Hintergrund
const GradientBackground = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, #0a1128 0%, #1a2c56 50%, #304b89 100%)',
  zIndex: -1, // Hinter anderen Inhalten platzieren
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: -100,
    left: -100,
    background:
      'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
  },
})

// GlassmorphicCard: Ein "Glassmorphism"-Stil für Karten, die halbtransparent und verschwommen sind
const GlassmorphicCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  background: 'rgba(255, 255, 255, 0.05)', // Leicht transparent
  backdropFilter: 'blur(20px)', // Weichzeichner-Effekt für den Hintergrund
  borderRadius: '24px',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px -10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background:
      'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.03) 50%, transparent 55%)',
    transform: 'translateX(-100%)',
    animation: `${shimmer} 10s infinite`,
  },
  // Responsive Anpassungen für kleinere Bildschirme
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderRadius: '20px',
    margin: theme.spacing(2),
  },
}))

// StyledTextField: Angepasster TextField für konsistentes Styling in Formularen
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(30, 60, 114, 0.1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
}))

// PrimaryButton: Ein individuell gestylter Button mit Animationseffekten
const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(90deg, #3366cc 0%, #5e85de 100%)',
  boxShadow: '0 4px 20px rgba(51, 102, 204, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 30px rgba(51, 102, 204, 0.5)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 10px rgba(51, 102, 204, 0.3)',
  },
}))

// ----------------------------
// LoginForm-Komponente (wird mit React.memo optimiert, um unnötige Renderings zu vermeiden)
// ----------------------------
const LoginForm = React.memo(
  ({
    onSubmit, // Funktion, die beim Absenden des Formulars aufgerufen wird
    onInputChange, // Funktion, die bei Änderungen in den Eingabefeldern aufgerufen wird
    errors, // Fehlerobjekt, das anzeigt, ob ein Feld leer ist oder einen Fehler hat
    isSubmitting, // Boolean, der anzeigt, ob das Formular gerade abgesendet wird (Ladezustand)
    showPassword, // Boolean, ob das Passwort sichtbar ist oder als Punkte angezeigt wird
    togglePassword, // Funktion, um die Sichtbarkeit des Passworts umzuschalten
    username, // Aktueller Wert des Benutzernamen-Feldes
    password, // Aktueller Wert des Passwort-Feldes
    attempts, // Anzahl der bisherigen Fehlversuche
    showLockWarning, // Boolean, ob eine Warnung angezeigt wird, wenn zu viele Fehlversuche stattfinden
  }) => (
    // Fade sorgt für einen sanften Einblendeffekt
    <Fade in timeout={1000}>
      <Box sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
        {showLockWarning && (
          // Slide lässt die Warnung von oben hereinrutschen
          <Slide direction="down" in timeout={400}>
            <Alert
              severity="warning"
              variant="filled"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 171, 0, 0.8)',
                boxShadow: '0 8px 16px rgba(255, 171, 0, 0.2)',
                backdropFilter: 'blur(10px)',
                alignItems: 'center',
                '& .MuiAlert-icon': { color: 'white', opacity: 0.9 },
              }}
              icon={<ErrorOutlineOutlined />}
            >
              <Box>
                {attempts > 0 && (
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.5 }}
                  >
                    Fehlversuche: {attempts}
                  </Typography>
                )}
                <Typography variant="body2">
                  Nach 3 Fehlversuchen wird Ihr Konto gesperrt!
                </Typography>
              </Box>
            </Alert>
          </Slide>
        )}

        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: 'white', mb: 1 }}
        >
          Willkommen zurück
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}
        >
          Bitte melden Sie sich an, um Zugriff zu erhalten
        </Typography>
        {/* Formular, das beim Absenden die handleSubmit-Funktion ausführt */}
        <Box component="form" onSubmit={onSubmit} noValidate>
          <StyledTextField
            fullWidth
            label="Benutzername"
            name="username"
            value={username}
            error={Boolean(errors.username)}
            helperText={errors.username ? 'Dieses Feld ist erforderlich' : ''}
            sx={{ mb: 3 }}
            onChange={onInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlined
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  />
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            fullWidth
            label="Passwort"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            error={Boolean(errors.password)}
            helperText={errors.password ? 'Dieses Feld ist erforderlich' : ''}
            sx={{ mb: 4 }}
            onChange={onInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={
                      showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'
                    }
                    onClick={togglePassword}
                    edge="end"
                    sx={{ color: 'rgba(255,255,255,0.6)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <PrimaryButton
            fullWidth
            type="submit"
            disabled={isSubmitting}
            sx={{
              py: 1.5,
              animation: isSubmitting ? `${pulse} 1.5s infinite` : 'none',
              color: 'white',
            }}
            endIcon={!isSubmitting && <ArrowForwardOutlined />}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Anmelden'
            )}
          </PrimaryButton>
        </Box>
      </Box>
    </Fade>
  )
)

// ----------------------------
// HelpSection-Komponente: Bereich für Hilfetexte und Support-Links
// ----------------------------
const HelpSection = React.memo(() => (
  <Box
    sx={{
      p: 3,
      borderTop: '1px solid rgba(255,255,255,0.05)',
      mt: 4,
      backgroundColor: 'rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <Fade in timeout={1200}>
      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(255,255,255,0.9)',
            mb: 3,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <HelpOutlineOutlined sx={{ fontSize: 20 }} />
          Hilfe & Support
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Passwort zurücksetzen" arrow>
              <Button
                component={RouterLink}
                to="/reset-password"
                sx={{ color: 'white' }}
              >
                <KeyOutlined fontSize="small" sx={{ mr: 1 }} />
                Passwort vergessen
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Konto entsperren" arrow>
              <Button
                component={RouterLink}
                to="/unlock-account"
                sx={{ color: 'white' }}
              >
                <LockOutlined fontSize="small" sx={{ mr: 1 }} />
                Konto entsperren
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Support kontaktieren" arrow>
              <Button
                component={RouterLink}
                to="/contact-support"
                sx={{ color: 'white' }}
              >
                <EmailOutlined fontSize="small" sx={{ mr: 1 }} />
                Support kontaktieren
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.4)',
            textAlign: 'center',
            display: 'block',
          }}
        >
          © {new Date().getFullYear()} IG NRW • Alle Rechte vorbehalten
        </Typography>
      </Box>
    </Fade>
  </Box>
))

// ----------------------------
// Haupt-Login-Komponente
// ----------------------------
const Login = () => {
  // useNavigate erlaubt die Navigation (Weiterleitung) zu anderen Seiten
  const navigate = useNavigate()
  // Aus dem AuthContext holen wir die login-Funktion und eventuelle Fehlernachrichten
  const { login, error } = useAuth()

  // Lokaler Zustand für Benutzereingaben, Fehler, Passwortsichtbarkeit, Ladezustand und Fehlversuche
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({ username: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showLockWarning, setShowLockWarning] = useState(false)

  // useEffect, das prüft, ob zu viele Fehlversuche gemacht wurden, und ggf. eine Warnung auslöst
  useEffect(() => {
    if (attempts >= 3) {
      // In einer produktiven App würde hier eher ein modales Fenster genutzt werden
      alert('Ihre Kennung wurde gesperrt! Bitte kontaktieren Sie den Support.')
    }
  }, [attempts])

  // handleSubmit wird beim Absenden des Formulars aufgerufen
  const handleSubmit = async (e) => {
    e.preventDefault() // Standardverhalten des Formulars verhindern

    // Validierung: Überprüfen, ob beide Felder ausgefüllt sind
    const newErrors = {
      username: !credentials.username,
      password: !credentials.password,
    }

    // Fehlerzustand setzen und Warnung anzeigen
    setErrors(newErrors)
    setShowLockWarning(true)

    // Wenn es Validierungsfehler gibt, wird die Anzahl der Fehlversuche erhöht
    if (newErrors.username || newErrors.password) {
      setAttempts((prev) => prev + 1)
      return
    }

    // Setze den Ladezustand (isSubmitting) während des Login-Prozesses
    setIsSubmitting(true)
    try {
      // login-Funktion aus dem AuthContext wird aufgerufen
      const success = await login(credentials.username, credentials.password)
      if (success) {
        // Bei Erfolg Weiterleitung zum Dashboard statt zur MainPage
        navigate('/dashboard')
      } else {
        // Bei Misserfolg wird die Fehlversuchsanzahl erhöht
        setAttempts((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      // Ladezustand zurücksetzen
      setIsSubmitting(false)
    }
  }

  // handleInputChange aktualisiert den lokalen Zustand bei Änderung der Eingabefelder
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  // Umschalten der Passwortsichtbarkeit
  const togglePassword = () => setShowPassword((prev) => !prev)

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hintergrund mit Gradient */}
      <GradientBackground />
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: { xs: 2, md: 4 },
        }}
      >
        {/* GlassmorphicCard als zentrales Element */}
        <GlassmorphicCard>
          <Grid container>
            {/* Linke Seite: Logo und Branding */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                backgroundImage:
                  'linear-gradient(135deg, rgba(0,20,70,0.8) 0%, rgba(0,40,120,0.7) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 4,
                borderRight: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <Fade in timeout={700}>
                <Box sx={{ textAlign: 'center', maxWidth: 350 }}>
                  <Box
                    sx={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      position: 'relative',
                      boxShadow:
                        '0 10px 30px rgba(0,0,0,0.1), inset 0 0 0 1px rgba(255,255,255,0.1)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background:
                          'linear-gradient(45deg, rgba(51,102,204,0.4), rgba(94,133,222,0.1))',
                        filter: 'blur(10px)',
                        zIndex: -1,
                      },
                    }}
                  >
                    {/* Logo-Bild mit Alternativtext */}
                    <img
                      src="/ignrw.jpg"
                      alt="IG NRW Logo"
                      style={{ width: 120, height: 120, objectFit: 'contain' }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ color: 'white', fontWeight: 700, mb: 2 }}
                  >
                    IG NRW
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}
                  >
                    Internes Verwaltungssystem für Mitarbeiter und autorisierte
                    Benutzer
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            {/* Rechte Seite: Formular für die Anmeldung */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                p: { xs: 3, md: 6 },
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Zeige eine Fehlermeldung, falls login einen Fehler zurückliefert */}
              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    borderRadius: '12px',
                  }}
                >
                  {error}
                </Alert>
              )}
              <LoginForm
                onSubmit={handleSubmit}
                onInputChange={handleInputChange}
                errors={errors}
                isSubmitting={isSubmitting}
                showPassword={showPassword}
                togglePassword={togglePassword}
                username={credentials.username}
                password={credentials.password}
                attempts={attempts}
                showLockWarning={showLockWarning}
              />
            </Grid>
          </Grid>
          {/* Bereich für Hilfestellungen und Support-Links */}
          <HelpSection />
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Login
