import { keyframes } from '@mui/system'

/**
 * Animation für Schimmer-Effekt auf Oberflächen
 */
export const shimmer = keyframes`
  0% { background-position: -468px 0 }
  100% { background-position: 468px 0 }
`

/**
 * Animation für sanftes Einblenden mit leichter Aufwärtsbewegung
 */
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`

/**
 * Animation für Pulsieren (für Warnungen oder Hervorhebungen)
 */
export const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(30, 60, 114, 0); }
  100% { box-shadow: 0 0 0 0 rgba(30, 60, 114, 0); }
`

/**
 * Animation für auf- und abschweben
 */
export const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`
