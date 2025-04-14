import React, { useState, useEffect } from 'react'
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
import { GradientBackground, GlassmorphicCard } from '../../styles/StyledComponents'
import LoginForm from './LoginForm'
import HelpSection from '../shared/HelpSection'

/**
 * Login page component that handles user authentication
 */
const Login = () => {
  const navigate = useNavigate()
  const { login, error } = useAuth()

  // State for form data and UI
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({ username: false, password: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [showLockWarning, setShowLockWarning] = useState(false)

  // Effect for monitoring login attempts
  useEffect(() => {
    if (attempts >= 3) {
      alert('Ihre Kennung wurde gesperrt! Bitte kontaktieren Sie den Support.')
    }
  }, [attempts])

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate inputs
    const newErrors = {
      username: !credentials.username,
      password: !credentials.password,
    }

    setErrors(newErrors)
    setShowLockWarning(true)

    // Stop if there are validation errors
    if (newErrors.username || newErrors.password) {
      setAttempts((prev) => prev + 1)
      return
    }

    // Start login process
    setIsSubmitting(true)
    try {
      const success = await login(credentials.username, credentials.password)
      if (success) {
        navigate('/dashboard')
      } else {
        setAttempts((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCredentials((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev)

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Gradient background */}
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
        {/* Main card content */}
        <GlassmorphicCard>
          <Grid container>
            {/* Left side: Logo and branding */}
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
                    Internes Verwaltungssystem für Mitarbeiter und autorisierte
                    Benutzer
                  </Typography>
                </Box>
              </Fade>
            </Grid>

            {/* Right side: Login form */}
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

          {/* Help section */}
          <HelpSection showUnlockAccount={true} />
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Login
