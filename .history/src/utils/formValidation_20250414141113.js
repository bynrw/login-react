/**
 * Validiert ein Registrierungsformular
 * @param {string} username - Benutzername
 * @param {string} email - E-Mail-Adresse
 * @param {string} password - Passwort
 * @param {string} confirmPassword - Passwortbestätigung
 * @returns {Object} Objekt mit Fehlermeldungen, falls vorhanden
 */
export const validateRegistrationForm = (username, email, password, confirmPassword) => {
  const errors = {}

  if (!username || username.trim() === '') {
    errors.username = 'Benutzername wird benötigt'
  }

  if (!email || email.trim() === '') {
    errors.email = 'E-Mail wird benötigt'
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'E-Mail ist ungültig'
  }

  if (!password) {
    errors.password = 'Passwort wird benötigt'
  } else if (password.length < 6) {
    errors.password = 'Passwort muss mindestens 6 Zeichen haben'
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwörter stimmen nicht überein'
  }

  return errors
}

/**
 * Validiert ein Login-Formular
 * @param {string} username - Benutzername
 * @param {string} password - Passwort
 * @returns {Object} Objekt mit Fehler-Flags
 */
export const validateLoginForm = (username, password) => {
  return {
    username: !username || username.trim() === '',
    password: !password || password.trim() === '',
  }
}
