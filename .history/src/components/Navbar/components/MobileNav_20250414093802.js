import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IconButton,
  Badge,
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Button,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Notifications,
  Logout,
  Home,
  People,
  HelpOutline,
  Info
} from '@mui/icons-material'
import { useAuth } from '../../../context/AuthContext'
import {
  mobileMenuButtonStyles,
  mobileNotificationButtonStyles,
  notificationBadgeStyles,
  drawerPaperStyles,
  drawerContainerStyles,
  drawerHeaderStyles,
  drawerLinkStyles,
  drawerIconStyles,
  drawerLogoutButtonStyles
} from '../Navbar.styles'

/**
 * Mobile-Navigation für kleinere Bildschirme
 * Enthält ein Hamburger-Menü und ein Drawer mit allen Navigationsoptionen
 */
const MobileNav = ({ notifications, unreadCount, handleNotificationOpen }) => {
  const { logout } = useAuth()
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Navigationslinks für das Drawer-Menü
  const navLinks = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Benutzerverwaltung', path: '/benutzerverwaltung', icon: <People /> },
    { text: 'Hilfe', path: '/hilfe', icon: <HelpOutline /> },
    { text: 'Info', path: '/info', icon: <Info /> },
  ]

  /**
   * Öffnet oder schließt das Drawer-Menü
   */
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  /**
   * Kombiniert Logout-Aktion mit dem Schließen des Drawer
   */
  const handleLogoutAndClose = () => {
    logout()
    toggleDrawer()
  }

  return (
    <>
      {/* Hamburger-Menü für mobiles Layout */}
      <IconButton
        edge="start"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={mobileMenuButtonStyles}
      >
        <MenuIcon />
      </IconButton>

      {/* Benachrichtigungen-Button für mobiles Layout */}
      <IconButton
        onClick={handleNotificationOpen}
        sx={mobileNotificationButtonStyles}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={notificationBadgeStyles}
        >
          <Notifications />
        </Badge>
      </IconButton>

      {/* Drawer für Navigationsoptionen */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: drawerPaperStyles
        }}
      >
        <Box sx={drawerContainerStyles}>
          {/* Logo und Titel im Drawer */}
          <Box sx={drawerHeaderStyles}>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                letterSpacing: '-0.5px',
              }}
            >
              IG NRW
            </Typography>
          </Box>

          <Divider sx={{ mx: 2, mb: 2 }} />

          {/* Navigationslinks im Drawer */}
          <List sx={{ flexGrow: 1 }}>
            {navLinks.map((link) => (
              <ListItem key={link.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={toggleDrawer}
                  sx={drawerLinkStyles}
                >
                  <ListItemIcon sx={drawerIconStyles}>
                    {link.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={link.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ mx: 2, mt: 2, mb: 2 }} />

          {/* Abmelden-Button im Drawer */}
          <Box sx={{ px: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogoutAndClose}
              sx={drawerLogoutButtonStyles}
            >
              Abmelden
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )
}

export default MobileNav