/**
 * Ausgelagerte Styles für die Navbar-Komponente
 * Zentrale Stelle für alle Style-Definitionen der Navbar
 */

// Styles für die AppBar
export const appBarStyles = {
  background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 50%, #395eaf 100%)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
}

// Styles für das Logo
export const logoStyles = {
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: { xs: '1rem', sm: '1.25rem' },
  letterSpacing: '0.5px',
  WebkitBackgroundClip: 'text',
  color: 'white',
  textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
}

// Styles für den Text neben dem Logo
export const logoTextStyles = {
  ml: 1,
  fontSize: '0.9rem',
  opacity: 0.8,
  fontWeight: 300,
  letterSpacing: '0.5px',
}

// Styles für die Navigationslinks
export const navLinkStyles = {
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
}

// Styles für das Trennzeichen zwischen Navigationslinks und Buttons
export const dividerStyles = {
  height: '24px',
  width: '1px',
  bgcolor: 'rgba(255,255,255,0.3)',
  mx: 1,
}

// Styles für Notification-Button
export const notificationButtonStyles = {
  position: 'relative',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    transform: 'translateY(-2px)',
  },
}

// Styles für den Benutzer-Avatar
export const userAvatarStyles = {
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
}

// Styles für den Abmelden-Button
export const logoutButtonStyles = {
  textTransform: 'none',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
  background: 'linear-gradient(45deg, #FF5252 30%, #FF7676 90%)',
  '&:hover': {
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    transform: 'translateY(-2px)',
  },
}

// Styles für den mobilen Menü-Button
export const mobileMenuButtonStyles = {
  color: 'white',
  borderRadius: '12px',
  transition: 'transform 0.2s',
  '&:hover': { transform: 'scale(1.05)' },
}

// Styles für den mobilen Notification-Button
export const mobileNotificationButtonStyles = {
  color: 'white',
  ml: 1.5,
  borderRadius: '12px',
  transition: 'all 0.2s',
  '&:hover': { transform: 'scale(1.05)' },
}

// Styles für das Notification-Badge
export const notificationBadgeStyles = {
  '& .MuiBadge-badge': {
    fontSize: '0.7rem',
    height: '18px',
    minWidth: '18px',
    padding: '0 4px',
  },
}

// Styles für das Notification-Popover
export const notificationPopoverStyles = {
  width: 320,
  maxHeight: 400,
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
  borderRadius: '12px',
  overflow: 'hidden',
}

// Styles für den Notification-Header
export const notificationHeaderStyles = {
  p: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
}

// Styles für den Notification-Content Container
export const notificationContentStyles = {
  maxHeight: 320,
  overflow: 'auto',
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
  },
}

// Styles für einen einzelnen Notification-Eintrag
export const notificationItemStyles = (read) => ({
  p: 2,
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: read ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
  position: 'relative',
})

// Styles für das Drawer
export const drawerPaperStyles = {
  borderTopRightRadius: '16px',
  borderBottomRightRadius: '16px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
}

// Styles für den Drawer-Container
export const drawerContainerStyles = {
  width: 270,
  pt: 3,
  pb: 3,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}

// Styles für den Drawer-Header
export const drawerHeaderStyles = {
  px: 3, 
  mb: 3, 
  display: 'flex', 
  alignItems: 'center'
}

// Styles für die Drawer-Links
export const drawerLinkStyles = {
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
}

// Styles für die Drawer-Icons
export const drawerIconStyles = {
  minWidth: 40,
  color: 'primary.main',
  opacity: 0.9,
}

// Styles für den Drawer-Logout-Button
export const drawerLogoutButtonStyles = {
  borderRadius: '12px',
  py: 1.2,
  textTransform: 'none',
  fontWeight: 500,
  '&:hover': {
    backgroundColor: 'rgba(244, 67, 54, 0.06)',
  },
}