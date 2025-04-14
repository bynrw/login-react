import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Fade,
  Slide,
  Tooltip,
  Divider,
} from '@mui/material'
import {
  PersonAddOutlined,
  AccountCircleOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
  EmailOutlined,
  HelpOutlineOutlined,
  ArrowForwardOutlined,
  KeyOutlined,
  CheckCircleOutlined,
} from '@mui/icons-material'
import { styled, keyframes } from '@mui/system'

// ----------------------------
// Animation Definitions
// ----------------------------
const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 60, 114, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0); }
`

// ----------------------------
// Styled Components
// ----------------------------
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

// Custom success alert
const SuccessAlertBox = styled(Box)(({ theme }) => ({
  borderRadius: '16px',
  backgroundColor: 'rgba(46, 125, 50, 0.9)',
  color: 'white',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  animation: `${fadeIn} 0.5s ease-out`,
}))

// ----------------------------
// RegisterForm Component
// ----------------------------
const RegisterForm = React.memo(
  ({
    onSubmit,
    onInputChange,
    formErrors,
    isSubmitting,
    showPassword,
    togglePassword,
    username,
    email,
    password,
    confirmPassword,
  }) => (
    <Fade in timeout={1000}>
      <Box sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: 'white', mb: 1 }}
        >
          Registrieren
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: 'rgba(255,255,255,0.6)', mb: 4 }}
        >
          Erstellen Sie ein neues Konto, um Zugriff zu erhalten
        </Typography>

        <Box component="form" onSubmit={onSubmit} noValidate>
          <StyledTextField
            fullWidth
            label="Benutzername"
            name="username"
            value={username}
            error={!!formErrors.username}
            helperText={formErrors.username || ''}
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
            label="E-Mail-Adresse"
            name="email"
            value={email}
            error={!!formErrors.email}
            helperText={formErrors.email || ''}
            sx={{ mb: 3 }}
            onChange={onInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} />
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
            error={!!formErrors.password}
            helperText={formErrors.password || ''}
            sx={{ mb: 3 }}
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
          <StyledTextField
            fullWidth
            label="Passwort bestätigen"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={confirmPassword}
            error={!!formErrors.confirmPassword}
            helperText={formErrors.confirmPassword || ''}
            sx={{ mb: 4 }}
            onChange={onInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: 'rgba(255,255,255,0.6)' }} />
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
              'Registrieren'
            )}
          </PrimaryButton>
        </Box>
      </Box>
    </Fade>
  )
)
// Add display name for debugging
RegisterForm.displayName = 'RegisterForm'

// ----------------------------
// Success Message Component
// ----------------------------
const SuccessMessage = React.memo(() => (
  <Fade in timeout={800}>
    <SuccessAlertBox>
      <CheckCircleOutlined sx={{ fontSize: 64, mb: 2, color: 'white' }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Registrierung erfolgreich!
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Ihr Konto wurde erfolgreich erstellt. Sie werden in Kürze zur
        Anmeldeseite weitergeleitet.
      </Typography>
      <CircularProgress size={24} sx={{ color: 'white', opacity: 0.7 }} />
    </SuccessAlertBox>
  </Fade>
))
// Add display name for debugging
SuccessMessage.displayName = 'SuccessMessage'

// ----------------------------
// HelpSection Component
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
            <Tooltip title="Anmelden" arrow>
              <Button component={Link} to="/login" sx={{ color: 'white' }}>
                <KeyOutlined fontSize="small" sx={{ mr: 1 }} />
                Zurück zur Anmeldung
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
// Add display name for debugging
HelpSection.displayName = 'HelpSection'

// ----------------------------
// Main Register Component
// ----------------------------
const Register = () => {
  const navigate = useNavigate()
  const { register, error } = useAuth()

  // State for form data
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // State for registration success
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev)

  // Form validation
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

  // Handle form input changes
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const success = await register(username, email, password)
      if (success) {
        // Show success message
        setRegistrationSuccess(true)

        // Delay navigation to allow user to see the success message
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      }
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Background with gradient */}
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
        {/* GlassmorphicCard as central element */}
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

            {/* Right side: Registration form or Success message */}
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

          {/* Help and support section */}
          <HelpSection />
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Register
