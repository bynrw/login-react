import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Material UI Komponenten
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

// Material UI Icons
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

// Gestylte Komponenten und Animationen
import {
  GradientBackground,
  GlassmorphicCard,
  StyledTextField,
  PrimaryButton,
} from '../styles/StyledComponents'
import { fadeIn, pulse } from '../styles/animations'

/**
 * Login-Formular-Komponente mit Benutzername- und Passwort-Eingabefeldern
 */
const LoginForm = React.memo(
  ({
    onSubmit,
    onInputChange,
    errors,
    isSubmitting,
    showPassword,
    togglePassword,
    username,
    password,
    attempts,
    showLockWarning,
  }) => (
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

        <Typography variant="h4" sx={{ fontWeight: 800, color: 'white', mb: 1 }}>
          Willkommen zurück
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}>
          Bitte melden Sie sich an, um Zugriff zu erhalten
        </Typography>

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
// Anzeigename für besseres Debugging hinzufügen
LoginForm.displayName = 'LoginForm'

/**
 * Hilfe- und Support-Bereich
 */
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
                component={Link}
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
                component={Link}
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
                component={Link}
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
// Anzeigename für besseres Debugging hinzufügen
HelpSection.displayName = 'HelpSection'

/**
 * Haupt-Login-Komponente, die die Authentifizierung verarbeitet
 */
const Login = () => {
  const navigate = useNavigate()
  const { login, error } = useAuth()

  // Zustandsverwaltung
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({ username: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showLockWarning, setShowLockWarning] = useState(false)

  // Überprüfung auf zu viele fehlgeschlagene Anmeldeversuche
  useEffect(() => {
    if (attempts >= 3) {
      alert('Ihre Kennung wurde gesperrt! Bitte kontaktieren Sie den Support.')
    }
  }, [attempts])

  // Formular-Absendehandler
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validierung der Eingaben
    const newErrors = {
      username: !credentials.username,
      password: !credentials.password,
    }

    setErrors(newErrors)
    setShowLockWarning(true)

    if (newErrors.username || newErrors.password) {
      setAttempts((prev) => prev + 1)
      return
    }

    setIsSubmitting(true)
    try {
      const success = await login(credentials.username, credentials.password)
      if (success) {
        navigate('/dashboard')
      } else {
        setAttempts((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Anmeldefehler:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Eingabeänderungshandler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  // Passwort-Sichtbarkeit umschalten
  const togglePassword = () => setShowPassword((prev) => !prev)

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
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
                    Internes Verwaltungssystem für Mitarbeiter und autorisierte Benutzer
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            {/* Rechte Seite: Anmeldeformular */}
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
              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>
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
          
          <HelpSection />
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Login
