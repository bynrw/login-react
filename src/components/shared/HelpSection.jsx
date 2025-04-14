import React from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Typography,
  Grid,
  Button,
  Divider,
  Tooltip,
  Fade,
} from '@mui/material'
import { 
  HelpOutlineOutlined, 
  KeyOutlined, 
  LockOutlined, 
  EmailOutlined 
} from '@mui/icons-material'

/**
 * Gemeinsamer Hilfe- und Support-Bereich, der am unteren Rand der Authentifizierungsseiten angezeigt wird
 * @param {Object} props - Komponenten-Props
 * @param {boolean} props.showUnlockAccount - Ob die Option "Konto entsperren" angezeigt werden soll
 * @param {boolean} props.showBackToLogin - Ob die Option "Zurück zur Anmeldung" angezeigt werden soll
 */
const HelpSection = ({ showUnlockAccount = false, showBackToLogin = false }) => {
  const currentYear = new Date().getFullYear()
  
  return (
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
            {showBackToLogin && (
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="Anmelden" arrow placement="top">
                  <Button 
                    component={RouterLink} 
                    to="/login" 
                    sx={{ color: 'white' }}
                  >
                    <KeyOutlined fontSize="small" sx={{ mr: 1 }} />
                    Zurück zur Anmeldung
                  </Button>
                </Tooltip>
              </Grid>
            )}
            
            {!showBackToLogin && (
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="Passwort zurücksetzen" arrow placement="top">
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
            )}
            
            {showUnlockAccount && (
              <Grid item xs={12} sm={6} md={3}>
                <Tooltip title="Konto entsperren" arrow placement="top">
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
            )}
            
            <Grid item xs={12} sm={6} md={3}>
              <Tooltip title="Support kontaktieren" arrow placement="top">
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
            © {currentYear} IG NRW • Alle Rechte vorbehalten
          </Typography>
        </Box>
      </Fade>
    </Box>
  )
}

export default React.memo(HelpSection)
