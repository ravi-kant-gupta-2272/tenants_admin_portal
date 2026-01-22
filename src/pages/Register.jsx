import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "../components/PasswordField";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate(); // Initialize navigate hook
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        await axios.post("http://192.168.50.165:3000/api/user/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Show success message
        setSnackbar({
          open: true,
          message: "Registration successful! Redirecting to login...",
          severity: "success",
        });

        // Redirect to login page after 1.5 seconds
        setTimeout(() => {
          navigate("/login"); // Navigate to login page
        }, 1500);
      } catch (error) {
        let message = "Registration failed. Please try again.";
        if (error.status === 400) {
          message = error.response.data.message;
        }

        setSnackbar({
          open: true,
          message: `${message}`,
          severity: "error",
        });
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          py: 4,
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
          >
            Register
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              margin="normal"
              required
              disabled={loading}
              autoComplete="name"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin="normal"
              required
              disabled={loading}
              autoComplete="email"
            />

            <PasswordField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={Boolean(errors.confirmPassword)}
              helperText={errors.confirmPassword}
              required
              disabled={loading}
              autoComplete="new-password"
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, position: "relative" }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ position: "absolute" }} />
                  <span style={{ visibility: "hidden" }}>Register</span>
                </>
              ) : (
                "Register"
              )}
            </Button>
          </Box>
        </Paper>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
