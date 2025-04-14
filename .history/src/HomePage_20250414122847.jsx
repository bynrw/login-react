import React from 'react'
import { Box, Typography, Button, Container } from '@mui/material'
import { Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import { useTheme } from '@mui/material/styles'

const HomePage = () => {
  const theme = useTheme()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
      }}
    >
      <Navbar />
      <Container maxWidth="xl" sx={{ pt: 8, pb: 10 }}>
        <Box
          sx={{
            textAlign: 'center',
            padding: { xs: 3, md: 6 },
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              boxShadow: '0 15px 50px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              background: 'linear-gradient(90deg, #1e3c72 0%, #4286f4 100%)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
              animation: 'fadeIn 0.8s ease-out',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            Willkommen!
          </Typography>
          <Box
            sx={{
              mt: 6,
              animation: 'fadeIn 0.8s ease-out 0.4s backwards',
              '@keyframes fadeIn': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(10px)',
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)',
                },
              },
            }}
          >
            <Button
              variant="contained"
              component={Link}
              to="/benutzerverwaltung"
              size="large"
              sx={{
                px: { xs: 4, md: 6 },
                py: 2,
                fontSize: { xs: '1rem', md: '1.1rem' },
                borderRadius: '50px',
                background: 'linear-gradient(45deg, #1e3c72 0%, #4286f4 100%)',
                boxShadow: '0 10px 20px rgba(30, 60, 114, 0.2)',
                '&:hover': {
                  background:
                    'linear-gradient(45deg, #1e3c72 20%, #4286f4 100%)',
                  boxShadow: '0 10px 25px rgba(30, 60, 114, 0.4)',
                  transform: 'translateY(-3px)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                  boxShadow: '0 5px 15px rgba(30, 60, 114, 0.3)',
                },
                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Zur Benutzerverwaltung
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default HomePage
