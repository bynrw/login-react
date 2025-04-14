import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Box,
  Container,
  Grid,
  Typography,
  Alert,
  Fade,
} from '@mui/material'
import { PersonAddOutlined } from '@mui/icons-material'
import { GradientBackground, GlassmorphicCard } from '../../styles/StyledComponents'
import RegisterForm from './RegisterForm'
import SuccessMessage from './SuccessMessage'
import HelpSection from '../shared/HelpSection'

/**
 * Registrierungsseiten-Komponente, die die Benutzerregistrierung verarbeitet
 */
const Register = () => {
  const navigate = useNavigate()
  const { register, error } = useAuth()

  // Zustand für Formulardaten
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Passwort-Sichtbarkeit umschalten
  const togglePassword = () => setShowPassword((prev) => !prev)

  // Formularvalidierung
  const validateForm = () => {
    const errors = {}

    if (!username) {
      errors.username = 'Benutzername wird benötigt'
    }

    if (!email) {
      errors.email = 'E-Mail wird benötigt'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'E-Mail ist ungültig'
    }

    if (!password) {
      errors.password = 'Passwort wird benötigt'
    } else if (password.length < 6) {
      errors.password = 'Passwort muss mindestens 6 Zeichen haben'
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwörter stimmen nicht überein'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Behandelt Formular-Eingabeänderungen
  const handleInputChange = (e) => {
    const { name, value } = e.target
    switch (name) {
      case 'username':
        setUsername(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
      default:
        break
    }
  }

  // Behandelt Formularabsendung
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const success = await register(username, email, password)
      if (success) {
        // Erfolgsnachricht anzeigen
        setRegistrationSuccess(true)

        // Verzögerte Navigation, damit der Benutzer die Erfolgsmeldung sehen kann
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Registrierungsfehler:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Hintergrund mit Farbverlauf */}
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
        {/* Glasmorphische Karte als zentrales Element */}
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
                    <PersonAddOutlined
                      sx={{ fontSize: 80, color: 'white', opacity: 0.8 }}
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
                    Konto erstellen für Zugang zum internen Verwaltungssystem
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            {/* Rechte Seite: Registrierungsformular oder Erfolgsmeldung */}
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
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: '12px',
                  }}
                >
                  {error}
                </Alert>
              )}

              {registrationSuccess ? (
                <SuccessMessage />
              ) : (
                <RegisterForm
                  onSubmit={handleSubmit}
                  onInputChange={handleInputChange}
                  formErrors={formErrors}
                  isSubmitting={isSubmitting}
                  showPassword={showPassword}
                  togglePassword={togglePassword}
                  username={username}
                  email={email}
                  password={password}
                  confirmPassword={confirmPassword}
                />
              )}
            </Grid>
          </Grid>

          {/* Hilfe- und Supportbereich */}
          <HelpSection showBackToLogin={true} />
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Register
