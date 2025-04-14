import { useState } from 'react'
import { DEFAULT_NOTIFICATIONS } from '../constants'

/**
 * Custom Hook für die Verwaltung von Benachrichtigungen
 * Beinhaltet alle Funktionen zum Anzeigen, Markieren und Löschen von Benachrichtigungen
 * 
 * @returns {Object} Benachrichtigungen und deren Verwaltungsfunktionen
 */
const useNotifications = () => {
  // Benachrichtigungen aus den Konstanten importieren
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS)

  // State für das Notification-Popover
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  
  // Anzahl ungelesener Benachrichtigungen
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length
  
  // Status ob das Notification-Popover geöffnet ist
  const notificationOpen = Boolean(notificationAnchorEl)

  /**
   * Öffnet das Notification-Popover
   * @param {React.MouseEvent} event - Das Event, das die Öffnung auslöst
   */
  const handleNotificationOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget)
  }

  /**
   * Schließt das Notification-Popover
   */
  const handleNotificationClose = () => {
    setNotificationAnchorEl(null)
  }

  /**
   * Markiert eine Benachrichtigung als gelesen
   * @param {number} id - ID der zu markierenden Benachrichtigung
   */
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  /**
   * Löscht eine Benachrichtigung
   * @param {number} id - ID der zu löschenden Benachrichtigung
   */
  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    )
  }

  /**
   * Markiert alle Benachrichtigungen als gelesen
   */
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    )
  }

  return {
    notifications,
    unreadCount,
    notificationAnchorEl,
    notificationOpen,
    handleNotificationOpen,
    handleNotificationClose,
    markAsRead,
    deleteNotification,
    markAllAsRead
  }
}

export default useNotifications