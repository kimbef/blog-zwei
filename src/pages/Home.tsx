import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h2" gutterBottom>SIEG HEIL</Typography>
      <Typography variant="h5" gutterBottom>
        ein VOLK ~ ein REICH ~ ein FÜHRER !
      </Typography>
      <Box mt={3}>
        <Button variant="contained" color="primary" component={Link} to="/login">
         - Los -
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
