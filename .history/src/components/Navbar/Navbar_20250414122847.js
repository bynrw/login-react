import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../context/AuthContext';

// Import components
import DesktopNav from './components/DesktopNav';
import MobileNav from './components/MobileNav';
import NotificationMenu from './components/NotificationMenu';

// Import hooks and constants
import useNotifications from './hooks/useNotifications';
import { LogoText, LogoSubText } from './styles/styles';

const Navbar = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width:768px)');
  
  // User menu state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  
  // Use the notifications hook
  const {
    notifications,
    unreadCount,
    notificationAnchorEl,
    handleNotificationOpen,
    handleNotificationClose,
    markAsRead,
    deleteNotification,
    markAllAsRead
  } = useNotifications();

  // Handler functions
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

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
        {isMobile && user && (
          <MobileNav 
            drawerOpen={drawerOpen}
            toggleDrawer={toggleDrawer}
            unreadCount={unreadCount}
            handleNotificationOpen={handleNotificationOpen}
            logout={logout}
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
          <LogoText isMobile={isMobile}>
            IG NRW
          </LogoText>
          {!isMobile && <LogoSubText />}
        </Typography>

        {user && !isMobile && (
          <DesktopNav 
            user={user}
            logout={logout}
            unreadCount={unreadCount}
            handleNotificationOpen={handleNotificationOpen}
            handleUserMenuOpen={handleUserMenuOpen}
            userMenuAnchor={userMenuAnchor}
            handleUserMenuClose={handleUserMenuClose}
          />
        )}

        <NotificationMenu 
          notifications={notifications}
          notificationAnchorEl={notificationAnchorEl}
          handleNotificationClose={handleNotificationClose}
          markAsRead={markAsRead}
          deleteNotification={deleteNotification}
          markAllAsRead={markAllAsRead}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;