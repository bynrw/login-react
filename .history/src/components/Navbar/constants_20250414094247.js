// Navigation Links für die Navbar
export const NAV_LINKS = [
  { text: 'Home', path: '/', icon: 'Home' },
  {
    text: 'Benutzerverwaltung',
    path: '/benutzerverwaltung',
    icon: 'People',
  },
  { text: 'Hilfe', path: '/hilfe', icon: 'HelpOutline' },
  { text: 'Info', path: '/info', icon: 'Info' },
];

// Standardbenachrichtigungen für Testzwecke
export const DEFAULT_NOTIFICATIONS = [
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
];

// Hilfsfunktionen
export const getInitials = (user) => {
  if (!user || !user.name) return 'U';
  return user.name
    .split(' ')
    .map((n) => n[0])
    .join('');
};