import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Badge,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider
} from '@mui/material';
import {
  Home,
  People,
  Logout,
  Notifications,
  HelpOutline,
  Info
} from '@mui/icons-material';
import { DesktopNavContainer, NavDivider, NavButtonsContainer } from '../styles/styles';
import { NAV_LINKS, getInitials } from '../constants';

const DesktopNav = ({ 
  user, 
  logout, 
  unreadCount, 
  handleNotificationOpen, 
  handleUserMenuOpen,
  userMenuAnchor,
  handleUserMenuClose
}) => {
  // Mapping für Icons
  const getIcon = (iconName) => {
    const icons = {
      'Home': <Home />,
      'People': <People />,
      'HelpOutline': <HelpOutline />,
      'Info': <Info />
    };
    return icons[iconName] || null;
  };

  return (
    <DesktopNavContainer>
      {NAV_LINKS.map((link) => (
        <Button
          key={link.text}
          component={Link}
          to={link.path}
          startIcon={getIcon(link.icon)}
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

      <NavDivider />

      <NavButtonsContainer>
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
              {getInitials(user)}
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
      </NavButtonsContainer>
    </DesktopNavContainer>
  );
};

export default DesktopNav;