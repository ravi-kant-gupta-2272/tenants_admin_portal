import { TextField, IconButton, InputAdornment } from "@mui/material";
import { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function TextInputField({
  fullWidth = true,
  label,
  name,
  type,
  margin,
  value,
  onChange,
  required,
  hidePassword = false
}) {
  const [isObscure, setobscure] = useState(hidePassword);

  const handleClickShowPassword = () => setobscure((show) => !show);

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={hidePassword ? (isObscure ? type : "text" ): type}
      margin={margin}
      value={value}
      onChange={onChange}
      required={required}
      InputProps={{
        endAdornment: hidePassword && (
          <InputAdornment position="end">
            <IconButton
              aria-label={isObscure ? "Show password" : "Hide password"}
              onClick={handleClickShowPassword}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
              sx={{color:"#ffffff", p: {
      xs: 0.5,
      sm: 1,
    }}}
            >
              {isObscure ? <VisibilityOff color="#ffffff" /> : <Visibility color="#ffffff"/>}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        label: { color: "#ffffff" },
        color: "#ffffff",
         "& .MuiInputBase-input": {
    color: "#fff",
    fontSize: {
      xs: "0.9rem",
      sm: "1rem",
    },
    padding: {
      xs: "12px",
      sm: "14px",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#fff",
    fontSize: {
      xs: "0.85rem",
      sm: "0.95rem",
    },
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#fff",
  },

  "& .MuiOutlinedInput-root": {
    minHeight: {
      xs: 48,   // 👈 mobile tap target
      sm: 56,
    },
    "& fieldset": { borderColor: "#fff" },
    "&:hover fieldset": { borderColor: "#fff" },
    "&.Mui-focused fieldset": { borderColor: "#fff" },
  },
      }}
    />

  );
}

export default TextInputField;
