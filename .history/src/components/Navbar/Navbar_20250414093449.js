import React from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery
} from '@mui/material'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '@mui/material/styles'
import DesktopNav from './components/DesktopNav'
import MobileNav from './components/MobileNav'
import useNotifications from './hooks/useNotifications'
import { appBarStyles, logoStyles, logoTextStyles } from './Navbar.styles'

/**
 * Hauptnavigationsleiste der Anwendung
 * Zeigt verschiedene Navigationsoptionen basierend auf der Bildschirmgröße an
 */
const Navbar = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:768px)')
  const { 
    notifications, 
    unreadCount, 
    notificationAnchorEl, 
    notificationOpen, 
    handleNotificationOpen, 
    handleNotificationClose,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications()

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={appBarStyles}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
        {isMobile && user && (
          <MobileNav 
            notifications={notifications}
            unreadCount={unreadCount}
            handleNotificationOpen={handleNotificationOpen}
          />
        )}

        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: isMobile ? 1 : 0,
            textDecoration: 'none',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box
            component="span"
            sx={logoStyles}
          >
            IG NRW
          </Box>
          {!isMobile && (
            <Box
              component="span"
              sx={logoTextStyles}
            />
          )}
        </Typography>

        {user && !isMobile && (
          <DesktopNav 
            notifications={notifications} 
            unreadCount={unreadCount}
            notificationAnchorEl={notificationAnchorEl}
            notificationOpen={notificationOpen}
            handleNotificationOpen={handleNotificationOpen}
            handleNotificationClose={handleNotificationClose}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            markAllAsRead={markAllAsRead}
          />
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Navbar