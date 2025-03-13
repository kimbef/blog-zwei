import React from "react";
import { Box, Skeleton, useTheme } from "@mui/material";

const LoadingScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: { xs: "20px", sm: "40px" },
        gap: 3,
        backgroundColor: theme.palette.background.default,
      }}
    >
      {/* Header Skeleton */}
      <Skeleton
        variant="text"
        width="60%"
        height={60}
        sx={{ bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }}
      />

      {/* Content Skeleton */}
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={200}
          sx={{
            mb: 2,
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
        <Skeleton
          variant="text"
          width="100%"
          height={32}
          sx={{
            mb: 1,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
        <Skeleton
          variant="text"
          width="80%"
          height={32}
          sx={{
            mb: 1,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
        <Skeleton
          variant="text"
          width="60%"
          height={32}
          sx={{
            mb: 1,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
      </Box>

      {/* Footer Skeleton */}
      <Box sx={{ width: "100%", maxWidth: "800px", display: "flex", gap: 2, justifyContent: "center" }}>
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
        <Skeleton
          variant="circular"
          width={40}
          height={40}
          sx={{
            bgcolor: theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingScreen; 