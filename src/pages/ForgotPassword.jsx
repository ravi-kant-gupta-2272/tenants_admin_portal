import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography, Link, Alert } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { PasswordField } from "../components/PasswordField.jsx";

import axios from "axios";

function ResetPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Navigate to lOGIN page
  const navigateLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // check password and confirm password
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    //  length must be greater than or equal 6
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://192.168.50.165:3000/api/user/reset",
        {
          email: form.email,
          password: form.password,
        },
      );
      console.log(response);

      setSuccess("Password reset successful! Redirecting to login...");

      //navigate to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Reset password error:", error);

      if (error.response) {
        setError(error.response.data.message || "Failed to reset password.");
      } else if (error.request) {
        setError(
          "Server not responding. Please check your internet connection.",
        );
      } else {
        setError("error occurred. Please try again.");
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
      <Typography variant="h5" mb={3} textAlign="center">
        Reset Password
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Success Alert */}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
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

      <PasswordField
        fullWidth
        label="Enter New Password"
        name="password"
        margin="normal"
        value={form.password}
        onChange={handleChange}
        required
      />

      <PasswordField
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        margin="normal"
        value={form.confirmPassword}
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
        {loading ? "Resetting..." : "RESET"}
      </Button>

      <Typography variant="body2" sx={{ mt: 3 }} textAlign="center">
        Remember your password?{" "}
        <Link
          onClick={navigateLogin}
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
          Back to Login
        </Link>
      </Typography>
    </Box>
  );
}

export default ResetPassword;
