import React from 'react';
import {
  Popover,
  Typography,
  Button,
  IconButton,
  Box
} from '@mui/material';
import {
  MarkEmailRead,
  Delete
} from '@mui/icons-material';
import {
  NotificationHeader,
  NotificationsContainer,
  NotificationItem,
  NotificationContent,
  NotificationActions,
  NotificationUnreadIndicator,
  EmptyNotificationsBox
} from '../styles/styles';

const NotificationMenu = ({
  notifications,
  notificationAnchorEl,
  handleNotificationClose,
  markAsRead,
  deleteNotification,
  markAllAsRead
}) => {
  const open = Boolean(notificationAnchorEl);

  return (
    <Popover
      open={open}
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
      <NotificationHeader>
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
      </NotificationHeader>

      <NotificationsContainer>
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem key={notification.id} read={notification.read}>
              <NotificationContent>
                <Typography
                  variant="body2"
                  sx={{ maxWidth: 'calc(100% - 80px)' }}
                >
                  {notification.text}
                </Typography>
                <NotificationActions>
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
                </NotificationActions>
              </NotificationContent>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 0.5 }}
              >
                {notification.time}
              </Typography>

              {!notification.read && <NotificationUnreadIndicator />}
            </NotificationItem>
          ))
        ) : (
          <EmptyNotificationsBox>
            <Typography variant="body2" color="text.secondary">
              Keine Mitteilungen vorhanden
            </Typography>
          </EmptyNotificationsBox>
        )}
      </NotificationsContainer>
    </Popover>
  );
};

export default NotificationMenu;