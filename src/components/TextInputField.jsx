import { TextField } from "@mui/material";

function TextInputField({
  fullWidth = true,
  label,
  name,
  type,
  margin,
  value,
  onChange,
  required,
}) {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={type}
      margin={margin}
      value={value}
      onChange={onChange}
      required={required}
      sx={{
        label: { color: "#ffffff" },
        color: "#ffffff", // this applies to text and label in most cases
        '& .MuiOutlinedInput-root': {
          '& fieldset': { borderColor: "#ffffff" },
          '&:hover fieldset': { borderColor: "#ffffff" },
          '&.Mui-focused fieldset': { borderColor: "#ffffff" },
        },
        '& .MuiInputLabel-root': { color: "#ffffff" },
        '& .MuiInputBase-input': { color: "#ffffff" },
      }}
    />
  );
}

export default TextInputField;
