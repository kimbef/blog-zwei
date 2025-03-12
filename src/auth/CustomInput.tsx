import React from "react";
import { TextField, Box } from "@mui/material";

interface CustomInputProps {
  label: string;
  type?: string;
  darkMode: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, type = "text", darkMode }) => {
  return (
    <Box sx={{ width: "100%", marginBottom: "15px" }}>
      <TextField
        fullWidth
        type={type}
        label={label}
        variant="outlined"
        InputProps={{
          sx: {
            backgroundColor: darkMode ? "#000000" : "#ffffff", // ✅ Background color
            color: darkMode ? "#ffffff" : "#000000", // ✅ Text color
            borderRadius: "5px",
            "& input": { color: darkMode ? "#ffffff" : "#000000" }, // ✅ Input text color
            "& fieldset": { borderColor: darkMode ? "#ffffff" : "#000000" }, // ✅ Border color
            "&:hover fieldset": { borderColor: darkMode ? "#bbbbbb" : "#333333" }, // ✅ Hover border color
            "&.Mui-focused fieldset": { borderColor: darkMode ? "#ffffff" : "#000000" }, // ✅ Focus border color
          },
        }}
        InputLabelProps={{
          sx: {
            color: darkMode ? "#ffffff" : "#000000", // ✅ Placeholder & label color
          },
        }}
      />
    </Box>
  );
};

export default CustomInput;
