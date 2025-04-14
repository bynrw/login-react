/**
 * Validates a registration form
 * @param {string} username - Username value
 * @param {string} email - Email value
 * @param {string} password - Password value
 * @param {string} confirmPassword - Password confirmation value
 * @returns {Object} Object containing error messages if any
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
 * Validates a login form
 * @param {string} username - Username value
 * @param {string} password - Password value
 * @returns {Object} Object containing error flags
 */
export const validateLoginForm = (username, password) => {
  return {
    username: !username || username.trim() === '',
    password: !password || password.trim() === '',
  }
}
