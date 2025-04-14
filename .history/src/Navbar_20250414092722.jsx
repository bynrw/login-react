import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Popover,
  Divider,
  ListItemButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material'
import {
  Home,
  People,
  Logout,
  Menu as MenuIcon,
  Notifications,
  MarkEmailRead,
  Delete,
  HelpOutline,
  Info,
  Visibility
} from '@mui/icons-material'
import { useAuth } from './context/AuthContext'
import { useTheme } from '@mui/material/styles'

const Navbar = () => {
  const { user, logout } = useAuth()
  const theme = useTheme()
  const isMobile = useMediaQuery('(max-width:768px)')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [userMenuAnchor, setUserMenuAnchor] = useState(null)

  // Example notifications - these should come from your backend
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Neue Anfrage von Benutzer XYZ',
      read: false,
      time: '10:30',
    },
    {
      id: 2,
      text: 'Benutzer ABC hat einen Kommentar hinzugefügt',
      read: false,
      time: 'Gestern',
    },
    {
      id: 3,
      text: 'System-Update wurde abgeschlossen',
      read: true,
      time: 'Vor 2 Tagen',
    },
  ])

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    )
  }

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    )
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length
  const notificationOpen = Boolean(notificationAnchorEl)

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const navLinks = [
    { text: 'Home', path: '/', icon: <Home /> },
    {
      text: 'Benutzerverwaltung',
      path: '/benutzerverwaltung',
      icon: <People />,
    },
    { text: 'Hilfe', path: '/hilfe', icon: <HelpOutline /> },
    { text: 'Info', path: '/info', icon: <Info /> },
  ]

  // Get user initials for avatar
  const getInitials = () => {
    if (!user || !user.name) return 'U'
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
  }

  const desktopNav = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {navLinks.map((link) => (
        <Button
          key={link.text}
          component={Link}
          to={link.path}
          startIcon={link.icon}
          sx={{
            color: 'white',
            borderRadius: '8px',
            padding: '6px 16px',
            textTransform: 'none',
            fontWeight: 500,
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {link.text}
        </Button>
      ))}

      <Box
        sx={{
          height: '24px',
          width: '1px',
          bgcolor: 'rgba(255,255,255,0.3)',
          mx: 1,
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Notification center */}
        <IconButton
          color="inherit"
          onClick={handleNotificationOpen}
          sx={{
            position: 'relative',
            transition: 'all 0.3s',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <Notifications />
          </Badge>
        </IconButton>

        <Tooltip title="Benutzerprofil">
          <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                width: 36,
                height: 36,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                cursor: 'pointer',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                }
              }}
            >
              {getInitials()}
            </Avatar>
          </IconButton>
        </Tooltip>

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

        <Button
          color="error"
          variant="contained"
          onClick={logout}
          startIcon={<Logout />}
          sx={{
            textTransform: 'none',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            background: 'linear-gradient(45deg, #FF5252 30%, #FF7676 90%)',
            '&:hover': {
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Abmelden
        </Button>
      </Box>
    </Box>
  )

  const mobileNav = (
    <>
      <IconButton
        edge="start"
        aria-label="menu"
        onClick={toggleDrawer}
        sx={{
          color: 'white',
          borderRadius: '12px',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <IconButton
        onClick={handleNotificationOpen}
        sx={{
          color: 'white',
          ml: 1.5,
          borderRadius: '12px',
          transition: 'all 0.2s',
          '&:hover': { transform: 'scale(1.05)' },
        }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.7rem',
              height: '18px',
              minWidth: '18px',
              padding: '0 4px',
            },
          }}
        >
          <Notifications />
        </Badge>
      </IconButton>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        <Box
          sx={{
            width: 270,
            pt: 3,
            pb: 3,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box sx={{ px: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
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

          <List sx={{ flexGrow: 1 }}>
            {navLinks.map((link, index) => (
              <ListItem key={link.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={toggleDrawer}
                  sx={{
                    borderRadius: '0 30px 30px 0',
                    mx: 1,
                    py: 1.2,
                    transition: 'all 0.2s',
                    position: 'relative',
                    '&:hover': {
                      backgroundColor: 'rgba(30, 60, 114, 0.08)',
                      pl: 3,
                    },
                    '&.active': {
                      backgroundColor: 'rgba(30, 60, 114, 0.12)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 8,
                        bottom: 8,
                        width: 4,
                        borderRadius: '0 4px 4px 0',
                        backgroundColor: 'primary.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: 'primary.main',
                      opacity: 0.9,
                    }}
                  >
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

          <Box sx={{ px: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={() => {
                logout()
                toggleDrawer()
              }}
              sx={{
                borderRadius: '12px',
                py: 1.2,
                textTransform: 'none',
                fontWeight: 500,
                '&:hover': {
                  backgroundColor: 'rgba(244, 67, 54, 0.06)',
                },
              }}
            >
              Abmelden
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  )

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background:
          'linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #395eaf 100%)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 0.5 }}>
        {isMobile && user && mobileNav}

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
            sx={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.25rem',
              letterSpacing: '0.5px',
              WebkitBackgroundClip: 'text',
              color: 'white',
              textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            IG NRW
          </Box>
          {!isMobile && (
            <Box
              component="span"
              sx={{
                ml: 1,
                fontSize: '0.9rem',
                opacity: 0.8,
                fontWeight: 300,
                letterSpacing: '0.5px',
              }}
            />
          )}
        </Typography>

        {user && !isMobile && desktopNav}

        {/* Notification Popover */}
        <Popover
          open={notificationOpen}
          anchorEl={notificationAnchorEl}
          onClose={handleNotificationClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              borderRadius: '12px',
              overflow: 'hidden',
            },
          }}
        >
          <Box
            sx={{
              p: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            }}
          >
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              Mitteilungen
            </Typography>
            <Button
              startIcon={<MarkEmailRead />}
              size="small"
              onClick={markAllAsRead}
              sx={{ textTransform: 'none' }}
            >
              Alle gelesen
            </Button>
          </Box>

          <Box
            sx={{
              maxHeight: 320,
              overflow: 'auto',
              '&::-webkit-scrollbar': { width: 6 },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 3,
              },
            }}
          >
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <Box
                  key={notification.id}
                  sx={{
                    p: 2,
                    borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
                    backgroundColor: notification.read
                      ? 'transparent'
                      : 'rgba(25, 118, 210, 0.05)',
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ maxWidth: 'calc(100% - 80px)' }}
                    >
                      {notification.text}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => markAsRead(notification.id)}
                        sx={{ padding: 0.5 }}
                        disabled={notification.read}
                      >
                        <MarkEmailRead
                          fontSize="small"
                          color={notification.read ? 'disabled' : 'primary'}
                        />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => deleteNotification(notification.id)}
                        sx={{ padding: 0.5 }}
                      >
                        <Delete fontSize="small" color="error" />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 0.5 }}
                  >
                    {notification.time}
                  </Typography>

                  {!notification.read && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: 4,
                        backgroundColor: 'primary.main',
                      }}
                    />
                  )}
                </Box>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Keine Mitteilungen vorhanden
                </Typography>
              </Box>
            )}
          </Box>
        </Popover>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar
