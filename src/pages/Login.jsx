import { useNavigate } from 'react-router-dom';
import * as React from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import TextInputField from '../components/TextInputField.jsx';

function Login() {
    const navigate = useNavigate();
  const [form, setForm] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

   
    const navigateRegister = () => {
        navigate("/register")//{ replace: true }
    }

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form Data:", form);

    setTimeout(() => {
      setLoading(false);
      alert("Login submitted!");
    }, 1000);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 360,
        mx: "auto",
        mt: 10,
        p: 4,
        boxShadow: 1,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        Admin Login
      </Typography>

      <TextInputField
        fullWidth
        label="Email"
        name="email"
        type="email"
        margin="normal"
        value={form.email}
        onChange={handleChange}
        required
      />


      <TextInputField
        fullWidth
        label="Password"
        name="password"
        type="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? "Submitting..." : "Login"}
      </Button>

      <Typography variant="h9" sx={{ mt: 3 }} textAlign="center">
        Don't have an account? <Link onClick={navigateRegister} 
        sx={{ 
            // textDecoration: "underline", 
            // cursor: "pointer" 
            textDecoration: "underline",
            textDecorationColor: "primary.main",
            textUnderlineOffset: "4px",
            cursor: "pointer",
            color: "primary.main",
            "&:hover": {
            color: "secondary.main",      // hover text color
            textDecorationColor: "secondary.main", // hover underline color
            },
            }}
        >Please Register.</Link> 
      </Typography>

    </Box>
  );
}


export default Login;
