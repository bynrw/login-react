import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  AppBar,
  Box,
  Button,
  Container,
  Toolbar,
  Typography,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Paper,
  Alert,
  Slide,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Email as EmailIcon,
  DateRange as DateRangeIcon,
  ExitToApp as ExitToAppIcon,
  Edit as EditIcon,
  LockReset as LockResetIcon,
  VerifiedUser as VerifiedUserIcon,
} from '@mui/icons-material'
import { GradientBackground } from '../../styles/StyledComponents'
import { fadeIn } from '../../styles/animations'
import { styled } from '@mui/system'

// Styled component specific to Dashboard
const GlassmorphicCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: 'rgba(0, 0, 0, 0.3) 0px 20px 60px -10px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  overflow: 'hidden',
  position: 'relative',
  animation: `${fadeIn} 0.6s ease-out`,
}))

// Sample organization data
const organisations = {
  'Kreisfreie Stadt': {
    Bonn: [
      'Verwaltung Bonn',
      'BF Bonn',
      'FF Bonn',
      'LTST Bonn',
      'Krisenstab Bonn',
    ],
    Köln: ['Verwaltung Köln', 'BF Köln', 'FF Köln', 'LTST Köln'],
    Düsseldorf: ['Verwaltung Düsseldorf', 'BF Düsseldorf', 'Stab Düsseldorf'],
  },
}

/**
 * Dashboard component that displays user information and organization selection
 */
const Dashboard = () => {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('')

  // Handle city selection change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value)
    setSelectedOrg('')
  }

  // Handle organization selection change
  const handleOrgChange = (event) => {
    setSelectedOrg(event.target.value)
  }

  // Dummy functions for UI interactions
  const handleProfileEdit = () => alert('Profilbearbeitung wird geöffnet...')
  const handleChangePassword = () => alert('Passwortänderung wird geöffnet...')
  const handleTwoFactor = () =>
    alert('2-Faktor-Authentifizierung aktivieren...')
  
  // Handle logout
  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const cityOptions = Object.keys(organisations['Kreisfreie Stadt'])
  const orgOptions = selectedCity
    ? organisations['Kreisfreie Stadt'][selectedCity]
    : []

  return (
    <Box sx={{ flexGrow: 1 }}>
      <GradientBackground />
      <AppBar position="static" sx={{ background: 'rgba(0, 0, 0, 0.05)' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Benutzer-Dashboard
          </Typography>
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            aria-label="Abmelden"
          >
            Abmelden
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <GlassmorphicCard sx={{ p: { xs: 2, md: 4 } }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 3 }}>
            Herzlich Willkommen, {currentUser?.username || 'Benutzer'}!
          </Typography>

          <Grid container spacing={3}>
            {/* User profile section */}
            <Grid item xs={12} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'transparent',
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  {currentUser?.username?.charAt(0).toUpperCase() || '?'}
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ color: 'white' }}>
                  {currentUser?.username}
                </Typography>
                <Typography variant="body2" sx={{ color: '#e0e0e0' }}>
                  {currentUser?.email}
                </Typography>
                <Tooltip title="Ihr Profil bearbeiten">
                  <Button
                    variant="outlined"
                    sx={{ mt: 2, borderColor: 'white', color: 'white' }}
                    startIcon={<EditIcon />}
                    onClick={handleProfileEdit}
                  >
                    Profil bearbeiten
                  </Button>
                </Tooltip>
              </Paper>
            </Grid>

            {/* User information section */}
            <Grid item xs={12} md={8}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'transparent',
                  color: 'white',
                }}
              >
                <Typography variant="h6" gutterBottom>
                  Ihre Informationen
                </Typography>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
                <List>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Benutzername"
                      secondary={currentUser?.username}
                      secondaryTypographyProps={{ color: '#e0e0e0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="E-Mail"
                      secondary={currentUser?.email}
                      secondaryTypographyProps={{ color: '#e0e0e0' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon sx={{ color: 'white' }}>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Mitglied seit"
                      secondary="01.01.2024"
                      secondaryTypographyProps={{ color: '#e0e0e0' }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>

            {/* Organization selection section */}
            <Grid item xs={12}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                  Organisationsauswahl
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.3)' }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'white' }}>Stadt</InputLabel>
                      <Select
                        value={selectedCity}
                        onChange={handleCityChange}
                        label="Stadt"
                        sx={{
                          color: 'white',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#0a1128',
                              color: 'white',
                            },
                          },
                        }}
                      >
                        {cityOptions.map((city) => (
                          <MenuItem key={city} value={city}>
                            {city}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'white' }}>
                        Organisation
                      </InputLabel>
                      <Select
                        value={selectedOrg}
                        onChange={handleOrgChange}
                        label="Organisation"
                        disabled={!selectedCity}
                        sx={{
                          color: 'white',
                          '.MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255,255,255,0.3)',
                          },
                        }}
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              bgcolor: '#0a1128',
                              color: 'white',
                            },
                          },
                        }}
                      >
                        {orgOptions.map((org) => (
                          <MenuItem key={org} value={org}>
                            {org}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                {selectedOrg && (
                  <Alert
                    severity="success"
                    sx={{
                      mt: 2,
                      bgcolor: 'rgba(46, 125, 50, 0.15)',
                      color: '#a5d6a7',
                    }}
                  >
                    Ausgewählte Organisation: {selectedOrg}
                  </Alert>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Slide direction="up" in timeout={600}>
            <Alert
              severity="info"
              sx={{
                mt: 4,
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.15)',
                color: 'white',
              }}
            >
              Wählen Sie Ihre Organisation aus der Liste oben aus
            </Alert>
          </Slide>
        </GlassmorphicCard>
      </Container>
    </Box>
  )
}

export default Dashboard
