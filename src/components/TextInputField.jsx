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
              sx={{color:"#ffffff"}}
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
            color: "#ffffff",          
          },
          "& .MuiInputLabel-root": {
            color: "#ffffff",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#ffffff",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "#ffffff" },
            "&:hover fieldset": { borderColor: "#ffffff" },
            "&.Mui-focused fieldset": { borderColor: "#ffffff" },
          },
      }}
    />

  );
}

export default TextInputField;
