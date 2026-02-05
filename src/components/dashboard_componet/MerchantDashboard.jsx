import React from 'react';
import { 
  Box, 
  Container, 
  Button, 
  TextField, 
  IconButton,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function MerchantDashboard() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <Box sx={{ bgcolor: '#f5f5f5', minHeight: '100vh',  }}>
      <Container maxWidth={false} sx={{ px: 3 }}>
        {/* Top Bar - Full Width with Actions */}
        <Box
          sx={{
            width: '100%',
            bgcolor: '#1e5a6e',
            borderRadius: 2,
            boxShadow: 2,
            p: 1,
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            flexWrap: 'wrap',
            
          }}
        >
          {/* Left Side - Actions */}
          <Box sx={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Add Merchant Button */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                bgcolor: 'white',
                color: '#1e5a6e',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              Add Merchant
            </Button>

            {/* Search Merchant */}
            <TextField
              placeholder="Search Merchant"
              size="small"
              sx={{
                bgcolor: 'white',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { border: 'none' },
                },
              }}
              InputProps={{
                endAdornment: <SearchIcon sx={{ color: '#666' }} />,
              }}
            />

            {/* Refresh Button */}
            <IconButton
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              {/* <FilterListIcon sx={{ color: '#1e5a6e' }} />  */}
              <RefreshIcon />
              
            </IconButton>
          </Box>

          {/* Right Side - Dark Mode */}
          <Box>
            <IconButton
              onClick={() => setDarkMode(!darkMode)}
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
              <DarkModeIcon sx={{ color: '#1e5a6e' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Merchant Card - Single Card (You'll iterate this later) */}
        <Card
          sx={{
            borderRadius: 2,
            boxShadow: 3,
            '&:hover': {
              boxShadow: 4,
              transform: 'translateY(-2px)',
              transition: 'all 0.3s ease',
            },
        
          }}
        >
          <CardContent sx={{ p: 3 }}>
            {/* Merchant Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e5a6e', mb: 1 }}>
                  PhonePay
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  ID: MERCH001
                </Typography>
              </Box>
              <Box
                sx={{
                  bgcolor: '#4caf50',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}
              >
                Active
              </Box>
             
               <Box
                sx={{
                  bgcolor: 'white',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.575rem',
                  fontWeight: 300,
                }}
              >
               <IconButton
              sx={{
                bgcolor: 'white',
                '&:hover': { bgcolor: '#f0f0f0' },
              }}
            >
             
              <RefreshIcon />
              
            </IconButton>
              </Box>
            </Box>

            {/* Merchant Details */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  merchant@example.com
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  +1 234 567 8900
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Location
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  New York, USA
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Joined Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Jan 15, 2024
                </Typography>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="small" sx={{ color: '#1e5a6e', borderColor: '#1e5a6e' }}>
                View Details
              </Button>
              <Button variant="contained" size="small" sx={{ bgcolor: '#1e5a6e' }}>
                Edit
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* You can add more cards here or map through an array */}
      </Container>
    </Box>
  );
}