import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  InputAdornment,
  CircularProgress,
  Link,
  IconButton,
  Alert,
  useMediaQuery,
  Grid,
  Chip,
  Divider,
  Tooltip,
  Slide,
  Fade,
} from '@mui/material'
import {
  LockOutlined,
  AccountCircleOutlined,
  Visibility,
  VisibilityOff,
  AccessTimeOutlined,
  KeyOutlined,
  EmailOutlined,
  HelpOutlineOutlined,
  ArrowForwardOutlined,
  ErrorOutlineOutlined,
  WarningAmberOutlined,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { styled, keyframes } from '@mui/system'

/**
 * ANIMATION KEYFRAMES
 * Definiert Animationen für verschiedene UI-Elemente
 */
// Animation für glänzenden Effekt auf Oberflächen
const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`

// Animation für sanftes Einblenden mit leichter Aufwärtsbewegung
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

// Animation für Pulsieren (z.B. für Warnungen oder Hervorhebungen)
const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 60, 114, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0); }
`

// Animation für schwebendes Auf und Ab
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`

/**
 * STYLED COMPONENTS
 * Vordefinierte, gestylte Komponenten für konsistentes Design
 */

// Hintergrund mit Farbverlauf und Muster-Overlay
const GradientBackground = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, #0a1128 0%, #1a2c56 50%, #304b89 100%)',
  zIndex: -1,
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

// Glassmorphic-Karte für den Hauptinhalt
const GlassmorphicCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
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
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderRadius: '20px',
    margin: theme.spacing(2),
  },
}))

// Stilisierte Benachrichtigungsbox
const ModernNotification = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: 'rgba(255, 130, 0, 0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: '16px',
  margin: theme.spacing(3),
  border: '1px solid rgba(255, 130, 0, 0.2)',
  boxShadow: '0 8px 32px rgba(255, 130, 0, 0.1)',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(255, 130, 0, 0.15)',
  },
}))

// Container für animierte Icons
const AnimatedIcon = styled(Box)({
  animation: `${float} 3s ease-in-out infinite`,
})

// Stilisiertes Textfeld mit modernem Look
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
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

// Stilisierter primärer Button mit Farbverlauf und Animationen
const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(90deg, #3366cc 0%, #5e85de 100%)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(51, 102, 204, 0.3)',
  transition: 'all 0.3s ease',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background:
      'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.2) 45%, rgba(255, 255, 255, 0.1) 50%, transparent 55%)',
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 0,
  },
  '&:hover': {
    boxShadow: '0 6px 30px rgba(51, 102, 204, 0.5)',
    transform: 'translateY(-2px)',
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 10px rgba(51, 102, 204, 0.3)',
  },
  '& .MuiButton-label': {
    position: 'relative',
    zIndex: 1,
  },
}))

// Support-Link mit Hover-Effekten
const SupportLink = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(1.5, 2),
  borderRadius: '12px',
  backgroundColor: 'rgba(255, 255, 255, 0.03)',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  transition: 'all 0.3s ease',
  color: 'rgba(255, 255, 255, 0.9)',
  textDecoration: 'none !important',
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
}))

/**
 * Wartungsbenachrichtigung
 * Zeigt eine auffällige Warnung für geplante Systemwartungen an
 */
const MaintenanceAlert = () => (
  <Fade in timeout={800}>
    <ModernNotification
      sx={{
        backgroundColor: 'rgba(255, 70, 0, 0.15)',
        border: '2px solid rgba(255, 100, 0, 0.4)',
        boxShadow: '0 8px 32px rgba(255, 80, 0, 0.25)',
        animation: `${pulse} 2s infinite`,
        padding: 3.5,
        margin: '16px 16px 24px 16px',
        borderRadius: '20px',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <AnimatedIcon sx={{ animation: `${float} 2s ease-in-out infinite` }}>
            <WarningAmberOutlined sx={{ fontSize: 48, color: '#ff6b00' }} />
          </AnimatedIcon>
        </Grid>
        <Grid item xs>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: 'rgba(255, 255, 255, 0.98)',
              mb: 1,
              textTransform: 'uppercase',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            WARTUNGSARBEITEN GEPLANT
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 500,
            }}
          >
            <AccessTimeOutlined fontSize="small" />
            15.07.2025 • 20:00 - 22:00 Uhr • System nicht verfügbar
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'rgba(255, 255, 255, 0.9)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              fontWeight: 500,
            }}
          >
            <AccessTimeOutlined fontSize="small" />
            23.07.2025 • 10:00 - 12:00 Uhr • Update
          </Typography>
        </Grid>
        <Grid item>
          <Chip
            label="INFO"
            size="medium"
            sx={{
              background: 'rgba(255, 80, 0, 0.3)',
              border: '1px solid rgba(255, 80, 0, 0.5)',
              color: '#ffb547',
              fontWeight: 700,
              fontSize: '0.8rem',
              px: 1,
            }}
          />
        </Grid>
      </Grid>
    </ModernNotification>
  </Fade>
)

/**
 * Login-Formular Komponente
 * Enthält die Eingabefelder und den Anmelde-Button
 */
const LoginForm = ({
  handleSubmit,
  handleInputChange,
  errors,
  isLoading,
  showPassword,
  setShowPassword,
  attempts,
  showLockWarning,
}) => {
  return (
    <Fade in timeout={1000}>
      <Box sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
        {/* Warnung nach fehlgeschlagenen Anmeldeversuchen */}
        {showLockWarning && (
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
                '& .MuiAlert-icon': {
                  color: 'white',
                  opacity: 0.9,
                },
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

        {/* Willkommensüberschrift */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: 'white',
            mb: 1,
          }}
        >
          Willkommen zurück
        </Typography>

        {/* Unterüberschrift */}
        <Typography
          variant="body2"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            mb: 4,
          }}
        >
          Bitte melden Sie sich an, um Zugriff zu erhalten
        </Typography>

        {/* Login-Formular */}
        <Box component="form" onSubmit={handleSubmit}>
          {/* Benutzernamefeld */}
          <StyledTextField
            fullWidth
            label="Benutzername"
            variant="outlined"
            name="username"
            error={errors.username}
            helperText={errors.username && 'Dieses Feld ist erforderlich'}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleOutlined
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  />
                </InputAdornment>
              ),
            }}
            onChange={handleInputChange}
          />

          {/* Passwortfeld mit Toggle für Sichtbarkeit */}
          <StyledTextField
            fullWidth
            label="Passwort"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            name="password"
            error={errors.password}
            helperText={errors.password && 'Dieses Feld ist erforderlich'}
            sx={{ mb: 4 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    sx={{ color: 'rgba(255, 255, 255, 0.6)' }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={handleInputChange}
          />

          {/* Anmelde-Button mit Lade-Animation */}
          <PrimaryButton
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            disabled={isLoading}
            sx={{
              py: 1.5,
              animation: isLoading ? `${pulse} 1.5s infinite` : 'none',
            }}
            endIcon={!isLoading && <ArrowForwardOutlined />}
          >
            {isLoading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Anmelden'
            )}
          </PrimaryButton>
        </Box>
      </Box>
    </Fade>
  )
}

/**
 * Hilfe und Support Sektion
 * Zeigt Links für Hilfethemen und Supportkontakte an
 */
const HelpSection = () => (
  <Box
    sx={{
      padding: 3,
      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
      mt: 4,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      backdropFilter: 'blur(10px)',
    }}
  >
    <Fade in timeout={1200}>
      <Box>
        {/* Überschrift für Support-Bereich */}
        <Typography
          variant="subtitle1"
          sx={{
            color: 'rgba(255, 255, 255, 0.9)',
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

        {/* Support-Links Grid */}
        <Grid container spacing={2}>
          {/* Passwort zurücksetzen */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Passwort zurücksetzen" arrow placement="top">
              <SupportLink href="#">
                <KeyOutlined fontSize="small" />
                Passwort vergessen
              </SupportLink>
            </Tooltip>
          </Grid>
          {/* Konto entsperren */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Konto entsperren" arrow placement="top">
              <SupportLink href="#">
                <LockOutlined fontSize="small" />
                Konto entsperren
              </SupportLink>
            </Tooltip>
          </Grid>
          {/* Support kontaktieren */}
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Support kontaktieren" arrow placement="top">
              <SupportLink href="#">
                <EmailOutlined fontSize="small" />
                Support kontaktieren
              </SupportLink>
            </Tooltip>
          </Grid>
        </Grid>

        {/* Teiler vor Footer */}
        <Divider
          sx={{
            my: 3,
            bgcolor: 'rgba(255, 255, 255, 0.05)',
          }}
        />

        {/* Copyright und Versionsinformation */}
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.4)',
            display: 'block',
            textAlign: 'center',
          }}
        >
          © 2025 IG NRW • Alle Rechte vorbehalten •
        </Typography>
      </Box>
    </Fade>
  </Box>
)

/**
 * Hauptkomponente für die Login-Seite
 */
const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  // Navigation-Hook für Routing

  // Media Query für responsive Anpassungen
  const isMobile = useMediaQuery('(max-width:600px)')

  // State Management
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    username: false,
    password: false,
  })
  const [attempts, setAttempts] = useState(0)
  const [showLockWarning, setShowLockWarning] = useState(false)

  /**
   * Verarbeitet das Absenden des Anmeldeformulars
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    // 1. Validierung der Eingabefelder
    const newErrors = {
      username: !credentials.username,
      password: !credentials.password,
    }

    setErrors(newErrors)
    setShowLockWarning(true)

    // 2. Abbruch bei Validierungsfehlern
    if (newErrors.username || newErrors.password) {
      setAttempts((prev) => prev + 1)
      return
    }

    // 3. Login-Prozess starten
    setIsLoading(true)

    // 4. Simulierter API-Call
    setTimeout(() => {
      setIsLoading(false)

      // 5. Erfolgreiche Anmeldung simulieren
      const loginSuccessful = true

      if (loginSuccessful) {
        // 6. User-Daten an AuthContext übergeben
        const userData = {
          username: credentials.username,
          token: 'simuliertes-token',
        }
        login(userData)

        // 7. ZUR HOMEPAGE NAVIGIEREN
        navigate('/') // Geändert von '/benutzerverwaltung' zu '/'
      } else {
        // 8. Fehlgeschlagene Anmeldung behandeln
        setAttempts((prev) => {
          const newAttempts = prev + 1
          if (newAttempts >= 3) {
            alert('Ihre Kennung wurde gesperrt!')
          }
          return newAttempts
        })
      }
    }, 1500)
  }

  /**
   * Verarbeitet Änderungen in den Eingabefeldern
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    // Aktualisiere Credentials und setze Fehler zurück
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  /**
   * Effekt zum Überwachen der maximalen Anmeldeversuche
   */
  useEffect(() => {
    if (attempts >= 3) {
      alert('Ihre Kennung wurde gesperrt! Bitte kontaktieren Sie den Support.')
    }
  }, [attempts])

  return (
    <div
      style={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}
    >
      {/* Hintergrund mit Farbverlauf */}
      <GradientBackground />

      {/* Hauptcontainer für zentrierte Ausrichtung */}
      <Container
        maxWidth={false}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: isMobile ? 2 : 4,
        }}
      >
        {/* Glassmorphic Card als Hauptcontainer */}
        <GlassmorphicCard>
          {/* Wartungshinweis */}
          <MaintenanceAlert />

          {/* Zwei-Spalten-Layout */}
          <Grid container>
            {/* Linke Spalte mit Logo und Beschreibung */}
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
                padding: 4,
                position: 'relative',
                overflow: 'hidden',
                borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <Fade in timeout={700}>
                <Box
                  sx={{
                    position: 'relative',
                    textAlign: 'center',
                    maxWidth: 350,
                    zIndex: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 180,
                      height: 180,
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 4,
                      boxShadow:
                        '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -5,
                        left: -5,
                        right: -5,
                        bottom: -5,
                        borderRadius: '50%',
                        background:
                          'linear-gradient(45deg, rgba(51, 102, 204, 0.4), rgba(94, 133, 222, 0.1))',
                        zIndex: -1,
                        filter: 'blur(10px)',
                      },
                    }}
                  >
                    <img
                      src="/ignrw.jpg"
                      alt="IG NRW Logo"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'contain',
                        filter:
                          'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3)) brightness(1.1)',
                      }}
                    />
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      color: 'white',
                      fontWeight: 700,
                      mb: 2,
                      letterSpacing: '0.5px',
                      textShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
                    }}
                  >
                    IG NRW
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'rgba(255, 255, 255, 0.7)',
                      lineHeight: 1.6,
                    }}
                  >
                    Internes Verwaltungssystem für Mitarbeiter und autorisierte
                    Benutzer
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            <Grid
              item
              xs={12}
              md={7}
              sx={{
                padding: isMobile ? 3 : 6,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <LoginForm
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                errors={errors}
                isLoading={isLoading}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                attempts={attempts}
                showLockWarning={showLockWarning}
              />
            </Grid>
          </Grid>

          <HelpSection />
        </GlassmorphicCard>
      </Container>
    </div>
  )
}

export default LoginPage
