import { useNavigate } from "react-router-dom";

import { useState } from "react";
import { Box, Button, Typography, Link, Alert } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { RiAdminFill } from "react-icons/ri";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const navigateRegister = () => navigate("/register"); //{ replace: true }

  const navigateForgotPassword = () => {
    navigate("/forgotpassword");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("Form Data:", form); // This is your form data log

    try {
      console.log("Attempting login...");

      const response = await axios.post(
        "http://192.168.50.165:3000/api/user/login",
        {
          email: form.email,
          password: form.password,
        },
      );

      console.log("Login successful:", response.data);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setError(error.response.data.message || "Invalid email or password");
      } else if (error.request) {
        setError("Server not responding. Please check your connection.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
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
      <RiAdminFill />
      <Typography variant="h5" mb={3} textAlign="center">
        Admin Login
      </Typography>
      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
        {loading ? "Logging in..." : "Login"}
      </Button>
      <Typography variant="body2" sx={{ mt: 3 }} textAlign="center">
        Don't have an account?{" "}
        <Link
          onClick={navigateRegister}
          sx={{
            textDecoration: "underline",
            textDecorationColor: "primary.main",
            textUnderlineOffset: "4px",
            cursor: "pointer",
            color: "primary.main",
            "&:hover": {
              color: "secondary.main",
              textDecorationColor: "secondary.main",
            },
          }}
        >
          Please Register.
        </Link>
        <br></br>
        <br></br>
        <Link
          onClick={navigateForgotPassword}
          sx={{
            textDecoration: "underline",
            textDecorationColor: "primary.main",
            textUnderlineOffset: "4px",
            cursor: "pointer",
            color: "primary.main",
            "&:hover": {
              color: "secondary.main",
              textDecorationColor: "secondary.main",
            },
          }}
        >
          Forgot Password.
        </Link>
      </Typography>
    </Box>
  );
}

export default Login;
