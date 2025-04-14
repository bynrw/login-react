import { styled } from '@mui/system'
import { Box, Button, TextField } from '@mui/material'
import { shimmer, fadeIn, pulse } from './animations'

/**
 * Common styled components to maintain consistent UI across the application
 */

// Background with gradient and pattern overlay
export const GradientBackground = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'linear-gradient(120deg, #0a1128 0%, #1a2c56 50%, #304b89 100%)',
  zIndex: -1,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: -100,
    left: -100,
    background:
      'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
  },
})

// Glassmorphic card for main content
export const GlassmorphicCard = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 1200,
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(20px)',
  borderRadius: '24px',
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px -10px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  overflow: 'hidden',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    background:
      'linear-gradient(105deg, transparent 40%, rgba(255, 255, 255, 0.1) 45%, rgba(255, 255, 255, 0.03) 50%, transparent 55%)',
    transform: 'translateX(-100%)',
    animation: `${shimmer} 10s infinite`,
  },
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    borderRadius: '20px',
    margin: theme.spacing(2),
  },
}))

// Styled text field with modern look
export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.07)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      boxShadow: '0 0 0 3px rgba(30, 60, 114, 0.1)',
    },
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiInputLabel-root': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '& .MuiInputBase-input': {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiInputAdornment-root .MuiSvgIcon-root': {
    color: 'rgba(255, 255, 255, 0.6)',
  },
}))

// Primary button with gradient and animations
export const PrimaryButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  padding: '12px 24px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  background: 'linear-gradient(90deg, #3366cc 0%, #5e85de 100%)',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: '0 4px 20px rgba(51, 102, 204, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: '0 6px 30px rgba(51, 102, 204, 0.5)',
    transform: 'translateY(-2px)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 10px rgba(51, 102, 204, 0.3)',
  },
}))
