import React, { useContext } from "react";
import { Container, Typography, Box, Avatar, Paper, useTheme } from "@mui/material";
import { AuthContext } from "../context/AuthContext";

const Profile: React.FC = () => {
  const theme = useTheme();
  const auth = useContext(AuthContext);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          p: 4, 
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          gap: 4
        }}>
          <Avatar 
            src={auth?.user?.photoURL || undefined}
            sx={{ 
              width: 120, 
              height: 120,
              border: `4px solid ${theme.palette.primary.main}`,
              boxShadow: '0 4px 14px rgba(0,0,0,0.15)'
            }}
          >
            {auth?.user?.email?.[0].toUpperCase()}
          </Avatar>
          
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
              Profile
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {auth?.user?.email}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Member since: {auth?.user?.metadata.creationTime ? 
                new Date(auth.user.metadata.creationTime).toLocaleDateString() : 
                'Unknown'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 