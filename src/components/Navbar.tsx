import React, { useContext, useState, useEffect } from "react";
import { Paper, Box, IconButton, Typography, Button, useMediaQuery } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  AccountCircle as ProfileIcon,
  Create as CreatePostIcon,
  List as MyPostsIcon,
  ExitToApp as LogoutIcon,
  Login as LoginIcon,
  PersonAdd as RegisterIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Palette as PaletteIcon,
  FormatColorText as TextColorIcon,
} from "@mui/icons-material";

const Navbar: React.FC = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [collapsed, setCollapsed] = useState<boolean>(() => localStorage.getItem("navbarCollapsed") === "true");
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");
  const [buttonColor, setButtonColor] = useState<string>(() => localStorage.getItem("buttonColor") || "#1976d2");
  const [fontColor, setFontColor] = useState<string>(() => localStorage.getItem("fontColor") || "#ffffff");

  useEffect(() => {
    localStorage.setItem("navbarCollapsed", String(collapsed));
    localStorage.setItem("darkMode", String(darkMode));
    localStorage.setItem("buttonColor", buttonColor);
    localStorage.setItem("fontColor", fontColor);

    document.body.style.backgroundColor = darkMode ? "#ffffff" : "#000000";
    document.body.style.color = darkMode ? "#000000" : "#ffffff";
  }, [collapsed, darkMode, buttonColor, fontColor]);

  const handleLogout = () => {
    auth?.logout();
    navigate("/");
    window.location.reload();
  };

  return (
    <Paper
      elevation={5}
      sx={{
        position: "fixed",
        left: isMobile && collapsed ? "-230px" : "0",
        top: 0,
        height: "100vh",
        width: collapsed ? "60px" : "220px",
        padding: "15px",
        backgroundColor: darkMode ? "#ffffff" : "#000000",
        color: fontColor,
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
        transition: "left 0.3s ease-in-out, width 0.3s ease-in-out",
        boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "8px 8px 20px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {/* 🔹 Menu Expand/Collapse Button (Always Visible, Switches Color) */}
      <IconButton
        onClick={() => setCollapsed(!collapsed)}
        sx={{
          color: darkMode ? "#000000" : "#FFFFFF", // ✅ Changes color based on mode
        }}
      >
        {collapsed ? <MenuIcon /> : <CloseIcon />}
      </IconButton>

      {auth?.user && !collapsed && (
        <Typography variant="body1" align="center" sx={{ marginBottom: "10px" }}>
          {auth.user.email}
        </Typography>
      )}

      {/* 🔹 Dark Mode Toggle (Always Visible, Switches Color) */}
      <IconButton
        onClick={() => setDarkMode(!darkMode)}
        sx={{
          color: darkMode ? "#000000" : "#FFFFFF", // ✅ Changes color based on mode
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: darkMode ? "#FFFFFF" : "#000000",
        }}
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

      {/* 🔹 Color Pickers */}
      {!collapsed && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: "10px", width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PaletteIcon sx={{ color: fontColor }} />
            <input
              type="color"
              value={buttonColor}
              onChange={(e) => {
                setButtonColor(e.target.value);
                localStorage.setItem("buttonColor", e.target.value);
              }}
              style={{ width: "40px", height: "30px", cursor: "pointer", border: "none", background: "transparent" }}
            />
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <TextColorIcon sx={{ color: fontColor }} />
            <input
              type="color"
              value={fontColor}
              onChange={(e) => {
                setFontColor(e.target.value);
                localStorage.setItem("fontColor", e.target.value);
              }}
              style={{ width: "40px", height: "30px", cursor: "pointer", border: "none", background: "transparent" }}
            />
          </Box>
        </Box>
      )}

      {/* 🔹 Navigation Buttons */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {!auth?.user ? (
          <>
            <Button component={Link} to="/login" sx={buttonStyle(buttonColor, fontColor)} startIcon={<LoginIcon />}>
              {!collapsed && "Login"}
            </Button>
            <Button component={Link} to="/register" sx={buttonStyle(buttonColor, fontColor)} startIcon={<RegisterIcon />}>
              {!collapsed && "Register"}
            </Button>
          </>
        ) : (
          <>
            <Button component={Link} to="/" sx={buttonStyle(buttonColor, fontColor)} startIcon={<HomeIcon />}>
              {!collapsed && "Home"}
            </Button>
            <Button component={Link} to="/dashboard" sx={buttonStyle(buttonColor, fontColor)} startIcon={<DashboardIcon />}>
              {!collapsed && "Dashboard"}
            </Button>
            <Button component={Link} to="/profile" sx={buttonStyle(buttonColor, fontColor)} startIcon={<ProfileIcon />}>
              {!collapsed && "Profile"}
            </Button>
            <Button component={Link} to="/create" sx={buttonStyle(buttonColor, fontColor)} startIcon={<CreatePostIcon />}>
              {!collapsed && "Create Post"}
            </Button>
            <Button component={Link} to="/my-posts" sx={buttonStyle(buttonColor, fontColor)} startIcon={<MyPostsIcon />}>
              {!collapsed && "My Posts"}
            </Button>
            <Button onClick={handleLogout} sx={buttonStyle("#d32f2f", "#ffffff")} startIcon={<LogoutIcon />}>
              {!collapsed && "Logout"}
            </Button>
          </>
        )}
      </Box>
    </Paper>
  );
};

// 🔹 Button Styling (Color Pickers Only Change Buttons, Not Navbar)
const buttonStyle = (bgColor: string, textColor: string) => ({
  backgroundColor: bgColor,
  color: textColor,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    transform: "scale(1.05)",
  },
});

export default Navbar;
