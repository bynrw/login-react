import React, { useState } from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Badge,
  TextField,
  Avatar,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  Switch,
  IconButton,
  Checkbox,
  ListItemText,
  Grid,
  InputAdornment,
} from '@mui/material'
import {
  People,
  EventNote,
  Person,
  Add,
  Business,
  AdminPanelSettings,
  Email,
  Phone,
  Cancel,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Edit,
  Delete,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  Info,
  Search,
  SearchIcon,
} from '@mui/icons-material'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Divider from '@mui/material/Divider'
import Alert from '@mui/material/Alert'

import { useAuth } from './context/AuthContext'

const organisationsDaten = {
  'Kreisfreie Stadt': {
    Bonn: [
      'Verwaltung Bonn',
      'BF Bonn',
      'FF Bonn',
      'LTST Bonn',
      'Krisenstab Bonn',
    ],
    Wuppertal: ['Verwaltung Wuppertal', 'BF Wuppertal', 'FF Wuppertal'],
    Solingen: ['Verwaltung Solingen', 'BF Solingen', 'FF Solingen'],
  },
  Kreis: {
    Viersen: ['Verwaltung Viersen', 'BF Viersen'],
    Heinsberg: ['Verwaltung Heinsberg', 'BF Heinsberg'],
    RheinSieg: ['Verwaltung Rhein-Sieg', 'BF Rhein-Sieg'],
  },
}

const roleOptions = [
  'Erfasser',
  'Auswerter',
  'Superadmin',
  'Schadenslage',
  'Opta Erfasser',
]
const fullPermissionOptions = [
  'lesen',
  'schreiben',
  'bearbeiten',
  'löschen',
  'admin',
]

const rolePermissionMapping = {
  Erfasser: ['lesen', 'schreiben', 'bearbeiten'],
  Auswerter: ['lesen', 'schreiben', 'bearbeiten'],
  Schadenslage: ['schreiben'],
  'Opta Erfasser': ['schreiben'],
  Superadmin: fullPermissionOptions,
}

const MainPage = () => {
  const { user } = useAuth()
  const theme = useTheme()

  const [openDialog, setOpenDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [entries, setEntries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterOrgType, setFilterOrgType] = useState('Alle')
  const [filterStatus, setFilterStatus] = useState('Alle')
  const [filterRole, setFilterRole] = useState('Alle')
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 5
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)

  const [formData, setFormData] = useState({
    benutzer: { vorname: '', nachname: '', email: '', telefon: '' },
    organisationen: [
      {
        type: '',
        subeinheit: '',
        einheiten: [],
      },
    ],
    status: true,
  })
  const steps = [
    'Organisation',
    'Rolle & Berechtigungen',
    'Persönliche Daten',
    'Zusammenfassung',
  ]

  const handleOrganisationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      organisation: {
        ...prev.organisation,
        [field]: value,
        ...(field === 'type' && {
          subeinheit: '',
          einheiten: [],
          adresse: '',
        }),
        ...(field === 'subeinheit' && {
          einheiten: [],
          adresse: '',
        }),
      },
    }))
  }

  const TableHeaderCell = ({ children, sortKey }) => (
    <TableCell
      sx={{
        color: '#fff',
        fontWeight: 'bold',
        py: 1,
        px: { xs: 1, sm: 2 },
        fontSize: '0.8rem',
        whiteSpace: 'nowrap',
        cursor: sortKey ? 'pointer' : 'default',
        minWidth: 120,
      }}
      onClick={() => sortKey && handleSort(sortKey)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {children}
        {sortConfig.key === sortKey &&
          (sortConfig.direction === 'asc' ? (
            <ArrowUpward fontSize="small" />
          ) : (
            <ArrowDownward fontSize="small" />
          ))}
      </Box>
    </TableCell>
  )

  const updatePermissionsFromRoles = (roles) => {
    const allowed = new Set()
    roles.forEach((role) => {
      rolePermissionMapping[role]?.forEach((p) => allowed.add(p))
    })
    return Array.from(allowed)
  }

  const ResponsiveTableCell = ({ children, sx }) => (
    <TableCell
      sx={{
        py: 1,
        px: { xs: 1, sm: 2 },
        fontSize: '0.8rem',
        ...sx,
      }}
    >
      {children}
    </TableCell>
  )

  const getAllowedPermissions = () => {
    if (formData.rolle.name?.includes('Superadmin'))
      return fullPermissionOptions
    const allowedSet = new Set()
    formData.rolle.name.forEach((role) => {
      rolePermissionMapping[role]?.forEach((p) => allowedSet.add(p))
    })
    return Array.from(allowedSet)
  }

  const handleNext = () =>
    setActiveTab((prev) => Math.min(prev + 1, steps.length - 1))
  const handleBack = () => setActiveTab((prev) => Math.max(prev - 1, 0))

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.organisationen.every(
          (org) => org.type && org.subeinheit && org.einheiten.length > 0
        )

      case 1:
        return formData.organisationen.every((org) =>
          org.einheiten.every((einheit) => einheit.roles?.length > 0)
        )

      case 2:
        return (
          !!formData.benutzer.vorname &&
          !!formData.benutzer.nachname &&
          !!formData.benutzer.email
        )

      case 3:
        return validateStep(0) && validateStep(1) && validateStep(2)

      default:
        return false
    }
  }
  const [editingIndex, setEditingIndex] = useState(null)

  const handleSave = () => {
    if (validateStep(3)) {
      const newEntry = {
        benutzer: formData.benutzer,
        organisationen: formData.organisationen.map((org) => ({
          type: org.type,
          subeinheit: org.subeinheit,
          einheiten: org.einheiten.map((einheit) => ({
            name: einheit.name,
            roles: einheit.roles,
          })),
        })),
        status: formData.status,
      }

      if (editingIndex !== null) {
        const updated = [...entries]
        updated[editingIndex] = newEntry
        setEntries(updated)
      } else {
        setEntries([...entries, newEntry])
      }
      handleCloseDialog()
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({
      benutzer: { vorname: '', nachname: '', email: '', telefon: '' },
      organisationen: [
        {
          type: '',
          subeinheit: '',
          einheiten: [],
        },
      ],
      status: true,
    })
    setActiveTab(0)
    setEditingIndex(null)
  }

  const addOrganisation = () => {
    setFormData((prev) => ({
      ...prev,
      organisationen: [
        ...prev.organisationen,
        { type: '', subeinheit: '', einheiten: [] },
      ],
    }))
  }

  const handleEdit = (index) => {
    const entry = entries[index]
    setFormData({
      benutzer: entry.benutzer,
      organisationen: entry.organisationen.map((org) => ({
        type: org.type,
        subeinheit: org.subeinheit,
        einheiten: org.einheiten.map((einheit) => ({
          name: einheit.name,
          roles: einheit.roles,
        })),
      })),
      status: entry.status,
    })
    setEditingIndex(index)
    setOpenDialog(true)
  }

  const InfoItem = ({ icon, label, value, sx = {} }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, ...sx }}>
      {icon}
      <Box>
        <Typography variant="subtitle2" sx={{ color: '#757575' }}>
          {label}
        </Typography>
        <Typography variant="h6">{value}</Typography>
      </Box>
    </Box>
  )

  const LabeledInfo = ({ label, value, sx = {} }) => (
    <Box sx={sx}>
      <Typography variant="subtitle2" sx={{ color: '#757575' }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    </Box>
  )

  const handleDelete = (index) => {
    if (window.confirm('Soll dieser Eintrag wirklich gelöscht werden?')) {
      setEntries(entries.filter((_, i) => i !== index))
    }
  }

  const handleToggleStatus = (index) => {
    const updated = [...entries]
    updated[index].status = !updated[index].status
    setEntries(updated)
  }

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const filteredEntries = entries.filter((entry) => {
    const fullName =
      `${entry.benutzer.vorname} ${entry.benutzer.nachname}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      entry.benutzer.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesOrgType =
      filterOrgType === 'Alle' ||
      entry.organisationen.some((org) => org.type === filterOrgType)

    const matchesStatus =
      filterStatus === 'Alle' || entry.status === (filterStatus === 'Aktiv')

    const matchesRole =
      filterRole === 'Alle' ||
      entry.organisationen.some((org) =>
        org.einheiten.some((e) => e.roles.includes(filterRole))
      )

    return matchesSearch && matchesOrgType && matchesStatus && matchesRole
  })

  const labelStyle = {
    backgroundColor: '#BBDEFB', // Pastellblau
    color: '#1976D2', // Blau
    padding: '4px 8px',
    borderRadius: '4px',
    fontFamily: '"Roboto", sans-serif', // Schriftart für das Label
  }

  const blueTagStyle = {
    backgroundColor: '#ffffff', // Weißer Hintergrund
    border: '1px solid #1976d2', // Blaue Umrandung
    color: '#1976d2', // Blaue Schrift
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: '4px',
    padding: '4px 8px',
  }

  const greenTagStyle = {
    backgroundColor: '#ffffff', // Weißer Hintergrund
    border: '1px solid #4caf50', // Grüne Umrandung
    color: '#4caf50', // Grüne Schrift
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: '4px',
    padding: '4px 8px',
  }

  const valueTagStyle = {
    backgroundColor: '#e3f2fd',
    border: '1px solid #1976d2',
    fontWeight: 600,
    fontSize: '0.875rem',
    borderRadius: '4px',
    padding: '4px 8px',
  }

  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (!sortConfig.key) return 0
    const aValue = String(getSortValue(a, sortConfig.key)).toLowerCase()
    const bValue = String(getSortValue(b, sortConfig.key)).toLowerCase()

    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const getSortValue = (entry, key) => {
    switch (key) {
      case 'benutzer':
        return `${entry.benutzer.vorname} ${entry.benutzer.nachname}`
      case 'organisationen':
        return entry.organisationen[0]?.type || ''
      case 'einheit':
        return entry.organisationen
          .flatMap((org) => org.einheiten.map((e) => e.name))
          .join(', ')
      case 'rolle':
        return entry.organisationen
          .flatMap((org) => org.einheiten.flatMap((e) => e.roles))
          .join(', ')
      case 'status':
        return entry.status
      default:
        return ''
    }
  }
  const getAllPermissions = () => {
    const allRoles = formData.organisation.einheiten.flatMap((e) => e.roles)
    const permissions = new Set()

    allRoles.forEach((role) => {
      rolePermissionMapping[role]?.forEach((p) => permissions.add(p))
    })

    return Array.from(permissions)
  }
  const handleOrgChange = (orgIndex, field, value) => {
    setFormData((prev) => {
      const updatedOrganisationen = [...prev.organisationen]

      if (field === 'einheiten') {
        // Konvertiere Strings zu Objekten mit leeren Rollen
        updatedOrganisationen[orgIndex].einheiten = value.map((name) => ({
          name,
          roles: [],
        }))
      } else {
        updatedOrganisationen[orgIndex] = {
          ...updatedOrganisationen[orgIndex],
          [field]: value,
        }
      }

      return { ...prev, organisationen: updatedOrganisationen }
    })
  }

  const handleRollenChange = (orgIndex, einheitIndex, selectedRoles) => {
    setFormData((prev) => {
      const updatedOrganisationen = [...prev.organisationen]
      const updatedEinheiten = [...updatedOrganisationen[orgIndex].einheiten]

      updatedEinheiten[einheitIndex] = {
        ...updatedEinheiten[einheitIndex],
        roles: selectedRoles,
      }

      updatedOrganisationen[orgIndex] = {
        ...updatedOrganisationen[orgIndex],
        einheiten: updatedEinheiten,
      }

      return { ...prev, organisationen: updatedOrganisationen }
    })
  }

  const removeOrganisation = (orgIndex) => {
    setFormData((prev) => ({
      ...prev,
      organisationen: prev.organisationen.filter(
        (_, index) => index !== orgIndex
      ),
    }))
  }

  const totalPages = Math.ceil(sortedEntries.length / entriesPerPage)
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  )

  const resetPage = () => setCurrentPage(1)

  const renderRoles = (roles) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {roles.slice(0, 3).map((rolle, i) => (
        <Chip
          key={i}
          label={rolle}
          size="small"
          sx={{ bgcolor: '#f0f4c3', fontSize: '0.7rem', maxWidth: 100 }}
        />
      ))}
      {roles.length > 3 && (
        <Tooltip title={roles.slice(3).join(', ')}>
          <Chip label={`+${roles.length - 3}`} size="small" />
        </Tooltip>
      )}
    </Box>
  )

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
        p: 3,
        fontFamily: '"Montserrat", "Roboto", sans-serif',
      }}
    >
      {/* AppBar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: '12px 12px 12px 12px',
          boxShadow: '0 4px 12px rgba(30, 60, 114, 0.15)',
          marginBottom: 3,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 }, py: 1.5 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              px: 1.5,
              py: 0.5,
              transition: 'all 0.3s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.18)',
                transform: 'translateY(-1px)',
              },
            }}
          >
            <People
              sx={{
                color: 'white',
                mr: 1.5,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
                fontSize: { xs: '1.1rem', sm: '1.2rem' },
                letterSpacing: '0.5px',
                color: 'white',
                textShadow: '0px 1px 2px rgba(0,0,0,0.2)',
              }}
            >
              Benutzerverwaltung
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Search and Filter Panel */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          flexWrap: 'wrap',
          gap: 2.5,
          p: 3,
          backgroundColor: '#fff',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
          mb: 3,
        }}
      >
        <TextField
          label="Suche..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            resetPage()
          }}
          size="small"
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" sx={{ color: '#1e3c72' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: '100%', sm: '240px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(30, 60, 114, 0.08)',
              },
              '&.Mui-focused': {
                boxShadow: '0 2px 8px rgba(30, 60, 114, 0.12)',
                borderColor: '#1e3c72',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1e3c72',
            },
          }}
        />

        <FormControl
          variant="outlined"
          size="small"
          sx={{
            minWidth: { xs: '100%', sm: '200px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              transition: 'all 0.3s',
              '&:hover': {
                boxShadow: '0 2px 8px rgba(30, 60, 114, 0.08)',
              },
              '&.Mui-focused': {
                boxShadow: '0 2px 8px rgba(30, 60, 114, 0.12)',
                borderColor: '#1e3c72',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#1e3c72',
            },
          }}
        >
          <InputLabel
            id="org-filter-label"
            sx={{ backgroundColor: 'white', px: 0.5 }}
          >
            Organisation
          </InputLabel>
          <Select
            labelId="org-filter-label"
            value={filterOrgType}
            onChange={(e) => setFilterOrgType(e.target.value)}
            startAdornment={
              <InputAdornment position="start">
                <Business
                  fontSize="small"
                  sx={{ color: '#1976d2', opacity: 0.8 }}
                />
              </InputAdornment>
            }
          >
            <MenuItem value="Alle">Alle</MenuItem>
            {Object.keys(organisationsDaten).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            borderRadius: '8px',
            background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
            boxShadow: '0 2px 6px rgba(30, 60, 114, 0.2)',
            textTransform: 'none',
            fontWeight: 500,
            fontSize: '0.95rem',
            px: 2.5,
            py: 1,
            transition: 'all 0.3s',
            '&:hover': {
              background: 'linear-gradient(90deg, #1e3c72 0%, #395eaf 100%)',
              boxShadow: '0 4px 8px rgba(30, 60, 114, 0.25)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          Benutzer hinzufügen
        </Button>
      </Box>
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.03)',
        }}
      >
        <TableContainer sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Table>
            <TableHead
              sx={{
                background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)',
                position: 'sticky',
                top: 0,
                zIndex: 1,
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 2,
                  }}
                >
                  Benutzer
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 2,
                  }}
                >
                  Organisation & Rollen
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 2,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    py: 2,
                  }}
                >
                  Aktionen
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedEntries.map((entry, index) => (
                <TableRow
                  key={index}
                  hover
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.03)',
                      transition: 'background-color 0.2s ease',
                    },
                    borderBottom: '1px solid rgba(0, 0, 0, 0.04)',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  {/* User Column */}
                  <TableCell sx={{ py: 1.5, width: '15%' }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: entry.status ? '#1976d2' : '#9e9e9e',
                          fontSize: '0.875rem',
                          transition: 'all 0.3s ease',
                          boxShadow: entry.status
                            ? '0 2px 6px rgba(25, 118, 210, 0.2)'
                            : 'none',
                        }}
                      >
                        {entry.benutzer.vorname[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {entry.benutzer.vorname} {entry.benutzer.nachname}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Organization Hierarchy Column */}
                  <TableCell sx={{ py: 1, width: '55%' }}>
                    {entry.organisationen?.map((org, orgIndex) => (
                      <Box
                        key={orgIndex}
                        sx={{
                          mb: 1,
                          p: 1,
                          borderRadius: '8px',
                          border: '1px solid rgba(25, 118, 210, 0.15)',
                          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                          background:
                            'linear-gradient(to right, rgba(25, 118, 210, 0.02), transparent)',
                        }}
                      >
                        {/* Org Type & Subunit Header */}
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color: '#1976d2',
                              fontWeight: 600,
                              fontSize: '0.8rem',
                            }}
                          >
                            {org.type}
                          </Typography>

                          {org.subeinheit && (
                            <>
                              <Typography
                                sx={{
                                  mx: 1,
                                  color: '#757575',
                                  fontSize: '0.7rem',
                                }}
                              >
                                •
                              </Typography>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: '#4CAF50',
                                  fontWeight: 500,
                                  fontSize: '0.8rem',
                                }}
                              >
                                {org.subeinheit}
                              </Typography>
                            </>
                          )}
                        </Box>

                        {/* Units & Roles */}
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0.75,
                            ml: 1,
                          }}
                        >
                          {org.einheiten?.map((einheit, einheitIndex) => {
                            const visibleRoles = einheit.roles.slice(0, 3)
                            const extraRolesCount = einheit.roles.length - 3
                            const hasExtraRoles = extraRolesCount > 0

                            return (
                              <Box
                                key={`${orgIndex}-${einheitIndex}`}
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  p: 0.5,
                                  pl: 1,
                                  borderLeft:
                                    '2px solid rgba(156, 39, 176, 0.4)',
                                  borderTopLeftRadius: 2,
                                  borderBottomLeftRadius: 2,
                                  bgcolor: 'rgba(156, 39, 176, 0.04)',
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#9c27b0',
                                    minWidth: '20%',
                                    maxWidth: '30%',
                                  }}
                                >
                                  {einheit.name}:
                                </Typography>

                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 0.5,
                                  }}
                                >
                                  {einheit.roles.map((role, roleIndex) => (
                                    <Chip
                                      key={roleIndex}
                                      label={role}
                                      size="small"
                                      color={
                                        role === 'Superadmin'
                                          ? 'error'
                                          : 'primary'
                                      }
                                      sx={{
                                        borderRadius: 1,
                                        fontWeight: 500,
                                        fontSize: '0.7rem',
                                        mb: 0.5,
                                      }}
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )
                          })}
                        </Box>
                      </Box>
                    ))}
                  </TableCell>

                  {/* Status Column */}
                  <TableCell sx={{ py: 1.5, width: '15%' }}>
                    <Box
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}
                    >
                      <Switch
                        checked={entry.status}
                        onChange={() => handleToggleStatus(index)}
                        color="primary"
                        size="small"
                        sx={{
                          '& .MuiSwitch-switchBase.Mui-checked': {
                            color: '#1976d2',
                          },
                          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                            {
                              backgroundColor: '#1976d2',
                            },
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: entry.status ? '#4CAF50' : '#f44336',
                          fontWeight: 500,
                          borderRadius: '6px',
                          px: 1,
                          py: 0.25,
                          bgcolor: entry.status
                            ? 'rgba(76, 175, 80, 0.08)'
                            : 'rgba(244, 67, 54, 0.08)',
                          border: entry.status
                            ? '1px solid rgba(76, 175, 80, 0.12)'
                            : '1px solid rgba(244, 67, 54, 0.12)',
                        }}
                      >
                        {entry.status ? 'Aktiv' : 'Inaktiv'}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Actions Column */}
                  <TableCell sx={{ py: 1.5, width: '15%' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setSelectedEntry(entry)
                          setViewDialogOpen(true)
                        }}
                        sx={{
                          color: '#1976d2',
                          border: '1px solid rgba(25, 118, 210, 0.12)',
                          bgcolor: 'rgba(25, 118, 210, 0.05)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(index)}
                        sx={{
                          color: '#1976d2',
                          border: '1px solid rgba(25, 118, 210, 0.12)',
                          bgcolor: 'rgba(25, 118, 210, 0.05)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(25, 118, 210, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(index)}
                        sx={{
                          color: '#f44336',
                          border: '1px solid rgba(244, 67, 54, 0.12)',
                          bgcolor: 'rgba(244, 67, 54, 0.05)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(244, 67, 54, 0.1)',
                            transform: 'translateY(-1px)',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                          },
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Lesansicht Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle
            sx={{
              background: 'linear-gradient(45deg, #1e3c72 30%, #2a5298 90%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              py: 3,
            }}
          >
            <Visibility sx={{ fontSize: 32 }} />
            <Typography variant="h5">Benutzerdetails</Typography>
          </DialogTitle>

          <DialogContent dividers sx={{ py: 3, backgroundColor: '#f8f9fa' }}>
            {selectedEntry && (
              <Box sx={{ maxWidth: 800, margin: '0 auto' }}>
                {/* Personal Information */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: 24,
                    }}
                  >
                    <People sx={{ fontSize: 24 }} />
                    Persönliche Informationen
                  </Typography>

                  <Paper
                    sx={{
                      p: 2,
                      borderLeft: '4px solid #1976d2',
                      backgroundColor: '#fff',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <InfoItem
                          icon={
                            <Person sx={{ color: '#1976d2', fontSize: 32 }} />
                          }
                          label={<Box sx={labelStyle}>Name</Box>}
                          value={`${selectedEntry.benutzer.vorname} ${selectedEntry.benutzer.nachname}`}
                        />

                        <InfoItem
                          icon={
                            <Phone sx={{ color: '#1976d2', fontSize: 32 }} />
                          }
                          label={<Box sx={labelStyle}>Telefonnummer</Box>}
                          value={
                            selectedEntry.benutzer.telefon || 'Keine Angabe'
                          }
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <InfoItem
                          icon={
                            <Email sx={{ color: '#1976d2', fontSize: 32 }} />
                          }
                          label={<Box sx={labelStyle}>E-Mail Adresse</Box>}
                          value={selectedEntry.benutzer.email}
                        />

                        <InfoItem
                          icon={
                            <EventNote
                              sx={{ color: '#1976d2', fontSize: 32 }}
                            />
                          }
                          label={<Box sx={labelStyle}>Erstellt am</Box>}
                          value={new Date().toLocaleDateString()}
                        />
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>

                {/* Organization Data */}
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      fontSize: 24,
                    }}
                  >
                    <Business sx={{ fontSize: 24 }} />
                    Organisationszuordnungen
                  </Typography>

                  {selectedEntry.organisationen.map((org, index) => (
                    <Paper
                      key={index}
                      sx={{
                        mb: 2,
                        p: 2,
                        borderLeft: '4px solid #1976d2',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                      }}
                    >
                      <Grid container spacing={2} alignItems="flex-start">
                        {/* Linke Spalte */}
                        <Grid item xs={12} md={5.8}>
                          <LabeledInfo
                            label={<Box sx={labelStyle}>Organisationstyp</Box>}
                            value={
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 3,
                                }}
                              >
                                <Chip
                                  label={org.type}
                                  sx={{
                                    backgroundColor: '#ffffff', // Weißer Hintergrund
                                    border: '1px solid #1976d2', // Blaue Umrandung
                                    color: '#1976d2', // Blaue Schrift
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    borderRadius: '4px',
                                    padding: '4px 8px',
                                    mt: 1.5,
                                  }}
                                />
                              </Box>
                            }
                            sx={{ mt: 2 }}
                          />

                          <LabeledInfo
                            label={<Box sx={labelStyle}>Subeinheit</Box>}
                            value={
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: 1.5,
                                }}
                              >
                                <Chip
                                  label={org.subeinheit}
                                  sx={{
                                    backgroundColor: '#ffffff', // Weißer Hintergrund
                                    border: '1px solid #4caf50', // Grüne Umrandung
                                    color: '#4caf50', // Grüne Schrift
                                    fontWeight: 600, // Schriftgewicht
                                    fontSize: '0.875rem', // Schriftgröße
                                    borderRadius: '4px', // Abgerundete Ecken
                                    padding: '4px 8px', // Padding
                                    mt: 1.5, // Oberer Abstand
                                    fontFamily: '"Roboto", sans-serif', // Schriftart anpassen
                                  }}
                                />
                              </Box>
                            }
                            sx={{ mt: 2 }}
                          />
                        </Grid>

                        {/* Vertikaler Divider (wird auf kleineren Bildschirmen ausgeblendet) */}
                        <Grid
                          item
                          xs={12}
                          md={0.4}
                          sx={{
                            display: { xs: 'none', md: 'flex' },
                            justifyContent: 'center',
                          }}
                        >
                          <Divider orientation="vertical" flexItem />
                        </Grid>

                        {/* Rechte Spalte */}
                        <Grid item xs={12} md={5.8}>
                          <LabeledInfo
                            label={
                              <Box sx={labelStyle}>Einheiten & Rollen</Box>
                            }
                            value={
                              <Box sx={{ mt: 1.5 }}>
                                {org.einheiten.length === 0 ? (
                                  <Typography
                                    sx={{
                                      color: '#757575',
                                      fontSize: '0.875rem',
                                    }}
                                  >
                                    Keine Einheiten
                                  </Typography>
                                ) : (
                                  org.einheiten.map((einheit, ei) => (
                                    <Box key={ei} sx={{ mb: 2 }}>
                                      {/* Kräftiger Divider */}
                                      <Divider
                                        sx={{
                                          mb: 1,
                                          borderBottomWidth: 3,
                                          borderBottomColor: '#1976d2',
                                        }}
                                      />{' '}
                                      {/* Blau und dicker */}
                                      <Chip
                                        label={einheit.name}
                                        size="small"
                                        sx={{
                                          borderRadius: 1,
                                          bgcolor: 'rgba(156, 39, 176, 0.08)',
                                          color: '#9c27b0',
                                          fontWeight: 500,
                                          fontSize: '0.7rem',
                                          mb: 1, // Abstand nach unten
                                        }}
                                      />
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          gap: 0.75,
                                        }}
                                      >
                                        {einheit.roles.map((role, ri) => (
                                          <Chip
                                            key={ri}
                                            label={role}
                                            size="small"
                                            color={
                                              role === 'Superadmin'
                                                ? 'error'
                                                : 'primary'
                                            }
                                            sx={{
                                              borderRadius: 1,
                                              fontWeight: 500,
                                              fontSize: '0.7rem',
                                            }}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  ))
                                )}
                              </Box>
                            }
                            sx={{ mt: 2 }}
                          />
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>

                {/* Account Status */}
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#fff',
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    borderLeft: '4px solid #1976d2',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#1976d2',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}
                  >
                    <AdminPanelSettings sx={{ fontSize: 24 }} />
                    Kontostatus:
                  </Typography>
                  <Chip
                    label={selectedEntry.status ? 'Aktiv' : 'Inaktiv'}
                    color={selectedEntry.status ? 'success' : 'error'}
                    icon={selectedEntry.status ? <CheckCircle /> : <Cancel />}
                    sx={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      px: 1,
                      py: 0.5,
                    }}
                  />
                </Paper>
              </Box>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={() => setViewDialogOpen(false)}
              variant="contained"
              color="primary"
              startIcon={<ArrowBack />}
            >
              Zurück zur Übersicht
            </Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="body2">
            {sortedEntries.length} Einträge
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Zurück
            </Button>
            <Button
              variant="outlined"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Weiter
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Dialog mit Stepper (Neuer Eintrag / Bearbeiten) */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            p: 4,
            background: 'linear-gradient(120deg, #2c3e50, #3498db)',
            color: '#fff',
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header mit Icon und Titel */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                p: 1,
                mr: 2,
              }}
            >
              <Business sx={{ fontSize: 28 }} />
            </Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              Benutzer hinzufügen
            </Typography>
          </Box>
          <Stepper
            activeStep={activeTab}
            alternativeLabel
            sx={{
              '& .MuiStepLabel-root': {
                padding: '0 8px',
              },
              '& .MuiStepLabel-label': {
                color: 'rgba(255,255,255,0.6) !important',
                fontSize: '0.8rem',
                fontWeight: 500,
                '&.Mui-active': {
                  color: '#fff !important',
                  fontWeight: 700,
                },
                '&.Mui-completed': {
                  color: '#2ecc71 !important',
                },
              },
              '& .MuiStepIcon-root': {
                color: 'rgba(255,255,255,0.3)',
                fontSize: '2rem',
                border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '50%',
                padding: '2px',
                '&.Mui-active': {
                  color: '#2ecc71',
                  border: '3px solid #fff',
                  boxShadow: '0 0 60px rgba(0, 251, 100, 0.5)',
                  fontSize: '2.2rem',
                  '& .MuiStepIcon-text': {
                    fill: '#fff',
                  },
                },
                '&.Mui-completed': {
                  color: '#2ecc71',
                  borderColor: '#2ecc71',
                },
              },
              '& .MuiStepIcon-text': {
                fontSize: '0.9rem',
                fontWeight: 'bold',
              },
              '& .MuiStepConnector-root': {
                top: 16,
              },
              '& .MuiStepConnector-line': {
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopWidth: 3,
              },
              '& .Mui-active .MuiStepConnector-line': {
                borderColor: '#fff',
              },
              '& .Mui-completed .MuiStepConnector-line': {
                borderColor: '#2ecc71',
              },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 4, background: '#f8f9fa' }}>
          <Box sx={{ maxWidth: 900, margin: '0 auto' }}>
            {/* Schritt 1: Organisationen */}
            {activeTab === 0 && (
              <Box sx={{ display: 'grid', gap: 4 }}>
                {formData.organisationen.map((org, orgIndex) => (
                  <Paper
                    key={orgIndex}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.08)',
                      position: 'relative',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Business fontSize="small" />
                      {orgIndex === 0
                        ? 'Organisation'
                        : `Organisation ${orgIndex + 1}`}
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth variant="outlined" size="medium">
                          <InputLabel>Organisationstyp *</InputLabel>
                          <Select
                            value={org.type}
                            onChange={(e) =>
                              handleOrgChange(orgIndex, 'type', e.target.value)
                            }
                            label="Organisationstyp *"
                          >
                            {Object.keys(organisationsDaten).map((type) => (
                              <MenuItem key={type} value={type}>
                                {type}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        {org.type && (
                          <FormControl
                            fullWidth
                            variant="outlined"
                            size="medium"
                          >
                            <InputLabel>Subeinheit *</InputLabel>
                            <Select
                              value={org.subeinheit}
                              onChange={(e) =>
                                handleOrgChange(
                                  orgIndex,
                                  'subeinheit',
                                  e.target.value
                                )
                              }
                              label="Subeinheit *"
                              disabled={!org.type}
                            >
                              {Object.keys(
                                organisationsDaten[org.type] || []
                              ).map((ort) => (
                                <MenuItem key={ort} value={ort}>
                                  {ort}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      </Grid>
                    </Grid>

                    {org.subeinheit && (
                      <Box sx={{ mt: 3 }}>
                        <FormControl fullWidth variant="outlined" size="medium">
                          <InputLabel>Einheiten *</InputLabel>
                          <Select
                            multiple
                            value={org.einheiten.map((e) => e.name)}
                            onChange={(e) =>
                              handleOrgChange(
                                orgIndex,
                                'einheiten',
                                e.target.value
                              )
                            }
                            label="Einheiten *"
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((name) => (
                                  <Chip
                                    key={name}
                                    label={name}
                                    size="small"
                                    sx={{
                                      borderRadius: 1,
                                      bgcolor: 'primary.main',
                                      color: 'white',
                                    }}
                                  />
                                ))}
                              </Box>
                            )}
                          >
                            {(
                              organisationsDaten[org.type]?.[org.subeinheit] ||
                              []
                            ).map((einheit) => (
                              <MenuItem key={einheit} value={einheit}>
                                <Checkbox
                                  checked={org.einheiten.some(
                                    (e) => e.name === einheit
                                  )}
                                />
                                <ListItemText primary={einheit} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Box>
                    )}

                    {orgIndex > 0 && (
                      <Box
                        sx={{
                          mt: 3,
                          display: 'flex',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <Button
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteOutlineIcon />}
                          onClick={() => removeOrganisation(orgIndex)}
                          size="small"
                        >
                          Organisation entfernen
                        </Button>
                      </Box>
                    )}
                  </Paper>
                ))}

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Add />}
                    onClick={addOrganisation}
                    size="medium"
                    sx={{ borderRadius: 4, px: 3 }}
                  >
                    Weitere Organisation hinzufügen
                  </Button>
                </Box>
              </Box>
            )}

            {/* Schritt 2: Rollen */}
            {activeTab === 1 && (
              <Box sx={{ display: 'grid', gap: 4 }}>
                {formData.organisationen.map((org, orgIndex) => (
                  <Paper
                    key={orgIndex}
                    elevation={2}
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      border: '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <Business fontSize="small" />
                      {org.type}: {org.subeinheit}
                    </Typography>

                    <Grid container spacing={3}>
                      {org.einheiten.map((einheit, einheitIndex) => (
                        <Grid
                          item
                          xs={12}
                          md={6}
                          key={`${orgIndex}-${einheitIndex}`}
                        >
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 2,
                              borderRadius: 1,
                              borderLeft: '3px solid #1976d2',
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{
                                mb: 1.5,
                                fontWeight: 500,
                                color: '#555',
                              }}
                            >
                              {einheit.name}
                            </Typography>

                            <FormControl
                              fullWidth
                              variant="outlined"
                              size="small"
                            >
                              <InputLabel>Rollen</InputLabel>
                              <Select
                                multiple
                                value={einheit.roles}
                                onChange={(e) =>
                                  handleRollenChange(
                                    orgIndex,
                                    einheitIndex,
                                    e.target.value
                                  )
                                }
                                label="Rollen"
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 0.5,
                                    }}
                                  >
                                    {selected.map((role) => (
                                      <Chip
                                        key={role}
                                        label={role}
                                        size="small"
                                        color={
                                          role === 'Superadmin'
                                            ? 'error'
                                            : 'primary'
                                        }
                                        sx={{
                                          borderRadius: 1,
                                          fontSize: '0.7rem',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                )}
                              >
                                {roleOptions.map((role) => (
                                  <MenuItem key={role} value={role}>
                                    <Checkbox
                                      checked={einheit.roles.includes(role)}
                                    />
                                    <ListItemText
                                      primary={role}
                                      secondary={
                                        role === 'Superadmin'
                                          ? '(globaler Zugriff)'
                                          : ''
                                      }
                                    />
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Paper>
                ))}
              </Box>
            )}

            {/* Schritt 3: Persönliche Daten */}
            {activeTab === 2 && (
              <Paper
                elevation={2}
                sx={{
                  p: 4,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#1976d2',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Person fontSize="small" />
                  Persönliche Informationen
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Vorname *"
                      variant="outlined"
                      value={formData.benutzer.vorname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benutzer: {
                            ...formData.benutzer,
                            vorname: e.target.value,
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Nachname *"
                      variant="outlined"
                      value={formData.benutzer.nachname}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benutzer: {
                            ...formData.benutzer,
                            nachname: e.target.value,
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="E-Mail *"
                      type="email"
                      variant="outlined"
                      value={formData.benutzer.email}
                      error={!formData.benutzer.email.includes('@')}
                      helperText={
                        !formData.benutzer.email.includes('@') &&
                        'Ungültige E-Mail-Adresse'
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benutzer: {
                            ...formData.benutzer,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Telefon"
                      variant="outlined"
                      value={formData.benutzer.telefon}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          benutzer: {
                            ...formData.benutzer,
                            telefon: e.target.value,
                          },
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Paper>
            )}

            {/* Schritt 4: Zusammenfassung */}
            {activeTab === 3 && (
              <Paper
                elevation={3}
                sx={{
                  p: 0,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `2px solid ${validateStep(3) ? '#4CAF50' : '#f44336'}`,
                }}
              >
                {/* Header Section */}
                <Box
                  sx={{
                    bgcolor: validateStep(3) ? '#e8f5e9' : '#ffebee',
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  {validateStep(3) ? (
                    <CheckCircle sx={{ color: '#4CAF50', fontSize: 28 }} />
                  ) : (
                    <ErrorOutlineIcon sx={{ color: '#f44336', fontSize: 28 }} />
                  )}
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Übersicht der Benutzerdaten
                  </Typography>
                </Box>

                {/* Content */}
                <Box sx={{ p: 3, bgcolor: '#fff' }}>
                  {/* Persönliche Daten */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        pb: 1,
                        borderBottom: '1px solid #e0e0e0',
                      }}
                    >
                      <Person fontSize="small" />
                      Persönliche Informationen
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderLeft: '4px solid #1976d2',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            borderRadius: 1,
                            height: '100%',
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <Avatar
                              sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                            >
                              <Person />
                            </Avatar>
                            <Box>
                              <Typography sx={{ fontWeight: 600 }}>
                                {formData.benutzer.vorname}{' '}
                                {formData.benutzer.nachname}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {formData.benutzer.email}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              ml: 1,
                            }}
                          >
                            <Phone fontSize="small" sx={{ color: '#757575' }} />
                            <Typography variant="body2">
                              {formData.benutzer.telefon || 'Keine Angabe'}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Box
                          sx={{
                            p: 2,
                            borderLeft: '4px solid #1976d2',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            borderRadius: 1,
                            height: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <EventNote
                              fontSize="small"
                              sx={{ color: '#757575' }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ color: '#757575' }}
                              >
                                Erstellt am
                              </Typography>
                              <Typography variant="body1">
                                {new Date().toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <LockOutlinedIcon
                              fontSize="small"
                              sx={{ color: '#757575' }}
                            />
                            <Box>
                              <Typography
                                variant="body2"
                                sx={{ color: '#757575' }}
                              >
                                Kontostatus
                              </Typography>
                              <Chip
                                label={formData.status ? 'Aktiv' : 'Inaktiv'}
                                color={formData.status ? 'success' : 'error'}
                                size="small"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Organisationsübersicht */}
                  <Box sx={{ mb: 4 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: '#1976d2',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        pb: 1,
                        borderBottom: '1px solid #e0e0e0',
                        mt: 8,
                      }}
                    >
                      <Business sx={{ fontSize: 24 }} />
                      Organisationszuordnungen
                    </Typography>

                    <Grid container spacing={2}>
                      {formData.organisationen.map((org, index) => (
                        <Grid item xs={12} key={index}>
                          <Paper
                            sx={{
                              p: 2,
                              borderLeft: '4px solid #1976d2',
                              backgroundColor: '#fff',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            }}
                            variant="outlined"
                          >
                            {/* Bereich Organisation */}
                            <Box sx={{ mb: 2 }}>
                              <Box sx={labelStyle}>Organisation</Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                  mt: 1,
                                }}
                              >
                                <Chip
                                  label={org.type}
                                  size="small"
                                  sx={blueTagStyle}
                                />
                                <Chip
                                  label={org.subeinheit}
                                  size="small"
                                  sx={greenTagStyle}
                                />
                              </Box>
                            </Box>

                            <Divider
                              sx={{
                                my: 2,
                                borderBottomWidth: 2,
                                borderBottomColor: '#1976d2',
                              }}
                            />

                            {/* Einheiten */}
                            {org.einheiten.map((einheit, ei) => (
                              <Box key={ei} sx={{ mb: 2 }}>
                                {/* Einheit */}
                                <Box sx={labelStyle}>Einheit</Box>
                                <Box sx={{ mt: 1 }}>
                                  <Chip
                                    label={einheit.name}
                                    size="small"
                                    sx={blueTagStyle}
                                  />
                                </Box>

                                {/* Rollen */}
                                <Box sx={{ mt: 1 }}>
                                  <Box sx={labelStyle}>Rollen</Box>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 1,
                                      mt: 1,
                                    }}
                                  >
                                    {einheit.roles.map((role, ri) => (
                                      <Chip
                                        key={ri}
                                        label={role}
                                        size="small"
                                        color={
                                          role === 'Superadmin'
                                            ? 'error'
                                            : 'primary'
                                        }
                                        sx={{
                                          borderRadius: 1,
                                          fontSize: '0.7rem',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                                <Divider
                                  sx={{
                                    my: 2,
                                    borderBottomWidth: 2,
                                    borderBottomColor: '#1976d2',
                                  }}
                                />
                              </Box>
                            ))}
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Validation Status */}
                  {validateStep(3) ? (
                    <Alert
                      severity="success"
                      icon={<CheckCircle />}
                      sx={{ mt: 2 }}
                    >
                      Alle Daten sind vollständig und korrekt. Klicken Sie auf
                      "Speichern", um den Benutzer anzulegen.
                    </Alert>
                  ) : (
                    <Alert
                      severity="warning"
                      icon={<ErrorOutlineIcon />}
                      sx={{ mt: 2 }}
                    >
                      Bitte überprüfen Sie die eingegebenen Daten auf
                      Vollständigkeit.
                    </Alert>
                  )}
                </Box>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{ p: 3, borderTop: `1px solid ${theme.palette.divider}` }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              startIcon={<ArrowBack />}
              onClick={handleBack}
              disabled={activeTab === 0}
              variant="outlined"
              sx={{ textTransform: 'none' }}
            >
              Zurück
            </Button>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {activeTab === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={!validateStep(activeTab)}
                  startIcon={<CheckCircle />}
                  sx={{
                    bgcolor: '#27ae60',
                    '&:hover': { bgcolor: '#219a52' },
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  Speichern
                </Button>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!validateStep(activeTab)}
                  endIcon={<ArrowForward />}
                  sx={{
                    px: 4,
                    py: 1,
                    textTransform: 'none',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  }}
                >
                  Weiter
                </Button>
              )}
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default MainPage
