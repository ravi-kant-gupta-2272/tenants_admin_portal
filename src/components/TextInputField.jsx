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
    />
  );
}

export default TextInputField;
