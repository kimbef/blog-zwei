import React, { useContext } from "react";
import { Container, Typography } from "@mui/material";
import { AuthContext } from "../context/AuthContext.tsx";

const Profile: React.FC = () => {
  const auth = useContext(AuthContext);

  return (
    <Container>
      <Typography variant="h4">Profile</Typography>
      <Typography variant="h6">Welcome, {auth?.user?.email}</Typography>
    </Container>
  );
};

export default Profile;
