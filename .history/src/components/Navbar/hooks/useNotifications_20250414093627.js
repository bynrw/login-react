import { useState } from 'react'

/**
 * Custom Hook für die Verwaltung von Benachrichtigungen
 * Beinhaltet alle Funktionen zum Anzeigen, Markieren und Löschen von Benachrichtigungen
 * 
 * @returns {Object} Benachrichtigungen und deren Verwaltungsfunktionen
 */
const useNotifications = () => {
  // Beispiel-Benachrichtigungen - diese sollten in einer echten Anwendung vom Backend kommen
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