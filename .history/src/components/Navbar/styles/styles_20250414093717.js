import { styled } from '@mui/system';

// Navigation styles
export const NavContainer = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

// Desktop Navigation styles
export const DesktopNavContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
});

export const NavDivider = styled('div')({
  height: '24px',
  width: '1px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  margin: '0 8px',
});

export const NavButtonsContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
});

// Mobile Navigation styles
export const DrawerContainer = styled('div')(({ theme }) => ({
  width: 270,
  paddingTop: 24,
  paddingBottom: 24,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
}));

export const DrawerHeader = styled('div')({
  paddingLeft: 24,
  paddingRight: 24,
  marginBottom: 24,
  display: 'flex',
  alignItems: 'center',
});

export const DrawerFooter = styled('div')({
  padding: '0 16px',
});

// Logo style
export const LogoText = styled('span')(({ isMobile }) => ({
  fontFamily: 'Montserrat, sans-serif',
  fontWeight: 600,
  fontSize: isMobile ? '1rem' : '1.25rem',
  letterSpacing: '0.5px',
  color: 'white',
  textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
}));

export const LogoSubText = styled('span')({
  marginLeft: 8,
  fontSize: '0.9rem',
  opacity: 0.8,
  fontWeight: 300,
  letterSpacing: '0.5px',
});

// Notification styles
export const NotificationHeader = styled('div')({
  padding: 16,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
});

export const NotificationsContainer = styled('div')({
  maxHeight: 320,
  overflow: 'auto',
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 3,
  },
});

export const NotificationItem = styled('div')(({ read }) => ({
  padding: 16,
  borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
  backgroundColor: read ? 'transparent' : 'rgba(25, 118, 210, 0.05)',
  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.03)' },
  position: 'relative',
}));

export const NotificationContent = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
});

export const NotificationActions = styled('div')({
  display: 'flex', 
  alignItems: 'center', 
  gap: 8,
});

export const NotificationUnreadIndicator = styled('div')({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
  backgroundColor: 'primary.main',
});

export const EmptyNotificationsBox = styled('div')({
  padding: 24,
  textAlign: 'center',
});