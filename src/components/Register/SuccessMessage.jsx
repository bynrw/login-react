import React from 'react'
import { Box, Typography, CircularProgress, Fade } from '@mui/material'
import { CheckCircleOutlined } from '@mui/icons-material'
import { styled } from '@mui/system'
import { fadeIn } from '../../styles/animations'

// Benutzerdefinierte Erfolgsbenachrichtigungsbox mit Glasmorphismus-Stil
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

/**
 * Erfolgsmeldungskomponente, die nach erfolgreicher Registrierung angezeigt wird
 */
const SuccessMessage = () => {
  return (
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
  )
}

export default React.memo(SuccessMessage)
