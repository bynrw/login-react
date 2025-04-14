import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  IconButton,
  Badge,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material'
import {
  Home,
  People,
  Logout,
  Notifications,
  HelpOutline,
  Info
} from '@mui/icons-material'
import { useAuth } from '../../../context/AuthContext'
import NotificationMenu from './NotificationMenu'
import {
  navLinkStyles,
  dividerStyles,
  notificationButtonStyles,
  userAvatarStyles,
  logoutButtonStyles
} from '../Navbar.styles'

/**
 * Desktop-Navigation für größere Bildschirme
 * Enthält Navigationslinks, Benutzermenü und Benachrichtigungen
 */
const DesktopNav = ({ 
  notifications, 
  unreadCount, 
  notificationAnchorEl,
  notificationOpen,
  handleNotificationOpen,
  handleNotificationClose,
  markAsRead,
  deleteNotification,
  markAllAsRead
}) => {
  const { user, logout } = useAuth()
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  // Navigationslinks für die Hauptnavigation
  const navLinks = [
    { text: 'Home', path: '/', icon: <Home /> },
    { text: 'Benutzerverwaltung', path: '/benutzerverwaltung', icon: <People /> },
    { text: 'Hilfe', path: '/hilfe', icon: <HelpOutline /> },
    { text: 'Info', path: '/info', icon: <Info /> },
  ]

  /**
   * Öffnet das Benutzermenü
   */
  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  /**
   * Schließt das Benutzermenü
   */
  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  /**
   * Generiert Initialen des Benutzers für den Avatar
   */
  const getInitials = () => {
    if (!user || !user.name) return 'U'
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Navigationslinks */}
      {navLinks.map((link) => (
        <Button
          key={link.text}
          component={Link}
          to={link.path}
          startIcon={link.icon}
          sx={navLinkStyles}
        >
          {link.text}
        </Button>
      ))}

      {/* Trennstrich zwischen Links und Aktions-Buttons */}
      <Box sx={dividerStyles} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Benachrichtigungen-Button */}
        <IconButton
          color="inherit"
          onClick={handleNotificationOpen}
          sx={notificationButtonStyles}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        {/* Benachrichtigungs-Popover */}
        <NotificationMenu 
          notifications={notifications}
          open={notificationOpen}
          anchorEl={notificationAnchorEl}
          handleClose={handleNotificationClose}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          markAllAsRead={markAllAsRead}
        />

        {/* Benutzer-Avatar mit Menü */}
        <Tooltip title="Benutzerprofil">
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar sx={userAvatarStyles}>
              {getInitials()}
            </Avatar>
          </IconButton>
        </Tooltip>

        {/* Benutzermenü */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          PaperProps={{
            elevation: 3,
            sx: {
              borderRadius: 2,
              minWidth: 180,
              overflow: 'visible',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }
          }}
        >
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon><People fontSize="small" /></ListItemIcon>
            <ListItemText>Mein Profil</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <ListItemIcon><HelpOutline fontSize="small" /></ListItemIcon>
            <ListItemText>Einstellungen</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={logout}>
            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
            <ListItemText>Abmelden</ListItemText>
          </MenuItem>
        </Menu>

        {/* Abmelden-Button */}
        <Button
          color="error"
          variant="contained"
          onClick={logout}
          startIcon={<Logout />}
          sx={logoutButtonStyles}
        >
          Abmelden
        </Button>
      </Box>
    </Box>
  )
}

export default DesktopNav