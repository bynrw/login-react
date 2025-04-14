import React from 'react'
import {
  Box,
  InputAdornment,
  CircularProgress,
  IconButton,
  Typography,
  Alert,
  Slide,
  Fade,
} from '@mui/material'
import {
  LockOutlined,
  AccountCircleOutlined,
  Visibility,
  VisibilityOff,
  ArrowForwardOutlined,
  ErrorOutlineOutlined,
} from '@mui/icons-material'
import { StyledTextField, PrimaryButton } from '../../styles/StyledComponents'
import { fadeIn, pulse } from '../../styles/animations'

/**
 * Login form component with username and password inputs
 */
const LoginForm = ({
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
}) => {
  return (
    <Fade in timeout={1000}>
      <Box sx={{ animation: `${fadeIn} 0.6s ease-out` }}>
        {/* Warning after failed login attempts */}
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

        {/* Welcome heading */}
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

        {/* Login form */}
        <Box component="form" onSubmit={onSubmit} noValidate>
          {/* Username field */}
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

          {/* Password field with toggle for visibility */}
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

          {/* Login button with loading animation */}
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
}

export default React.memo(LoginForm)
