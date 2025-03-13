import React from 'react';
import { Box, useTheme } from '@mui/material';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Fixed position navbar */}
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar
      }}>
        <Navbar />
      </Box>

      {/* Main content with padding-top to account for navbar height */}
      <Box sx={{ 
        flexGrow: 1,
        width: '100%',
        paddingTop: { xs: '64px', sm: '64px' }, // Adjust based on your navbar height
        minHeight: '100vh'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 