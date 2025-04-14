import React from 'react'
import {
  Box,
  InputAdornment,
  IconButton,
  Typography,
  CircularProgress,
  Fade,
} from '@mui/material'
import {
  AccountCircleOutlined,
  LockOutlined,
  EmailOutlined,
  Visibility,
  VisibilityOff,
  ArrowForwardOutlined,
} from '@mui/icons-material'
import { StyledTextField, PrimaryButton } from '../../styles/StyledComponents'
import { fadeIn, pulse } from '../../styles/animations'

/**
 * Registrierungsformular-Komponente mit Eingabefeldern für die Benutzerregistrierung
 */
const RegisterForm = ({
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
}) => {
  return (
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
          {/* Benutzernamenfeld */}
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

          {/* E-Mail-Feld */}
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

          {/* Passwortfeld */}
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

          {/* Passwort-Bestätigungsfeld */}
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

          {/* Registrieren-Button */}
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
}

export default React.memo(RegisterForm)
