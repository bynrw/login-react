import React from 'react';
import { Link } from 'react-router-dom';
import {
  IconButton,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Box,
  Button
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Logout,
  Home,
  People,
  HelpOutline,
  Info
} from '@mui/icons-material';
import { DrawerContainer, DrawerHeader, DrawerFooter } from '../styles/styles';
import { NAV_LINKS } from '../constants';

const MobileNav = ({
  drawerOpen,
  toggleDrawer,
  unreadCount,
  handleNotificationOpen,
  logout
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
        <DrawerContainer>
          <DrawerHeader>
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
          </DrawerHeader>

          <Divider sx={{ mx: 2, mb: 2 }} />

          <List sx={{ flexGrow: 1 }}>
            {NAV_LINKS.map((link) => (
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
                    {getIcon(link.icon)}
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

          <DrawerFooter>
            <Button
              fullWidth
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={() => {
                logout();
                toggleDrawer();
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
          </DrawerFooter>
        </DrawerContainer>
      </Drawer>
    </>
  );
};

export default MobileNav;