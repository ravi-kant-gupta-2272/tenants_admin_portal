import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordField } from "../components/PasswordField";
import axios from "axios";
import { useFormik } from "formik";
import { registerSchema } from "../schemas/RegisterValidationSchema";
import TextInputField from "../components/TextInputField";
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
  Grid,
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema: registerSchema,
      onSubmit: (values, action) => {
        console.log(values.email, values.password);

        //setLoading(true);

        action.resetForm();
      },
    });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ textAlign: "left" }}
          >
            {/* <Box sx={{ mt: 2 }}> */}
            <TextField
              fullWidth
              label="Name"
              name="name"
              variant="outlined"
              value={values.name}
              margin="normal"
              disabled={loading}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && Boolean(errors.name)}
              sx={{ mb: 0 }}
            />
            {touched.name && errors.name ? (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, mb: 2, textAlign: "left" }}
              >
                {errors.name}
              </Typography>
            ) : null}
            {/* </Box> */}
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              margin="normal"
              disabled={loading}
              error={touched.email && Boolean(errors.email)}
              sx={{ mb: 0 }}
            />
            {touched.email && errors.email ? (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, mb: 2, textAlign: "left" }}
              >
                {errors.email}
              </Typography>
            ) : null}

            {/* <Box sx={{ mt: 2 }}> */}
            {/* <label htmlFor="Confirm Password"></label> */}
            <TextInputField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
            />
            {/* </Box> */}
            {touched.password && errors.password ? (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, mb: 2, textAlign: "left" }}
              >
                {errors.password}
              </Typography>
            ) : null}

            {/* <Box sx={{ mt: 2 }}> */}
            {/* <label htmlFor="confirmPassword"></label> */}
            <TextInputField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              margin="normal"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.confirmPassword && Boolean(errors.confirmPassword)}
            />
            {/* </Box> */}
            {touched.confirmPassword && errors.confirmPassword ? (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, mb: 2, textAlign: "left" }}
              >
                {errors.confirmPassword}
              </Typography>
            ) : null}

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
