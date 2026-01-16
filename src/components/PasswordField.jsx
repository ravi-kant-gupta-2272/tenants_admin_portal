import { useState } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export function PasswordField({
  label = "Password",
  name = "password",
  value,
  onChange,
  error,
  helperText,
  required = true,
  disabled = false,
  autoComplete = "current-password",
  fullWidth = true,
  margin = "normal",
  ...otherProps
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      margin={margin}
      required={required}
      disabled={disabled}
      autoComplete={autoComplete}
      slotProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              disabled={disabled}
              aria-label="toggle password visibility"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...otherProps}
    />
  );
}
