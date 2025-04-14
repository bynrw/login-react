import React from 'react'
import {
  Popover,
  Box,
  Typography,
  Button,
  IconButton,
} from '@mui/material'
import {
  MarkEmailRead,
  Delete
} from '@mui/icons-material'
import {
  notificationPopoverStyles,
  notificationHeaderStyles,
  notificationContentStyles,
  notificationItemStyles
} from '../Navbar.styles'

/**
 * Komponente für die Anzeige von Benachrichtigungen im Dropdown-Menü
 * Zeigt alle Benachrichtigungen mit Aktionsmöglichkeiten an
 */
const NotificationMenu = ({
  notifications,
  open,
  anchorEl,
  handleClose,
  markAsRead,
  deleteNotification,
  markAllAsRead
}) => {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        sx: notificationPopoverStyles
      }}
    >
      {/* Header des Notification Menus */}
      <Box sx={notificationHeaderStyles}>
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

      {/* Scrollbarer Bereich für Benachrichtigungen */}
      <Box sx={notificationContentStyles}>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
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
  )
}

/**
 * Einzelne Benachrichtigung mit Aktions-Buttons
 */
const NotificationItem = ({ notification, markAsRead, deleteNotification }) => {
  return (
    <Box
      sx={notificationItemStyles(notification.read)}
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

      {/* Farbiger Indikator für ungelesene Benachrichtigungen */}
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
  )
}

export default NotificationMenu