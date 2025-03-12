import React, { useState, useContext, useEffect } from "react";
import { Container, TextField, Button, Typography, Alert } from "@mui/material";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.user) {
      navigate("/dashboard"); // ✅ Redirect after registration
    }
  }, [auth?.user, navigate]);

  const handleRegister = async () => {
    try {
      await auth?.register(email, password);
      navigate("/dashboard"); // ✅ Redirect immediately after registering
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to register. Try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4">Register</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField label="Email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button variant="contained" color="primary" onClick={handleRegister}>Register</Button>
    </Container>
  );
};

export default Register;

