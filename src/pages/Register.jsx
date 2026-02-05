import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { registerSchema } from "../schemas/RegisterValidationSchema";
import TextInputField from "../components/TextInputField";
import { IoMdPerson } from "react-icons/io";
import CustomSnackbar from "../components/CustomSnackbar";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig.js";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  Snackbar,
} from "@mui/material";

export default function Register() {
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("error");
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
      onSubmit: handleRegisterFunction,
    });

  async function handleRegisterFunction(values, action) {
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}${ENDPOINTS.REGISTER}`, values);

      setApiError("Registration Successful! Redirecting to login...");
      setSeverity("success");
      setOpen(true);
      setTimeout(() => {
        setLoading(false);
        navigate("/login", { replace: true });
        action.resetForm();
      }, 3000);
    } catch (error) {
      setSeverity("error");
      setApiError(error.response?.data?.message || "Registration failed");
      setOpen(true);

      setLoading(false);
    }
  }

  return (
    // <Container maxWidth="sm" >
    <Box
      sx={{
        backgroundColor: "#27586fff",
        // height: "100vh",
        minHeight: "100dvh",
        width: "100vw",
        display: "flex",
        // alignItems: "center",
        alignItems: {
          xs: "flex-start",
          sm: "center",
        },
        justifyContent: "center",
        overflowY: "auto",
        py: { xs: 2, sm: 2 },
        // padding: 0,
        // margin: 0,
      }}
    >
      <Box
        // component="form"
        // onSubmit={handleSubmit}
        noValidate
        sx={{
          width: {
            xs: "80%", // phones
            sm: 380, // small tablets
            md: 420, // laptops
          },
          maxWidth: 440, // safety cap
          mx: "auto",

          mt: {
            xs: 2,
            sm: 6,
            md: 10,
          },

          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          pt: 1,

          borderRadius: {
            xs: 2,
            sm: 3,
          },
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
        }}
      >
        <IoMdPerson
          size={100}
          style={{ display: "block", margin: "0 auto", color: "#ffffff" }}
        />
        {/* <Paper elevation={0} sx={{ p: 4, width: "100%", backgroundColor: "#0ea4eaff"}}> */}
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 3, color: "#ffffff" }}
        >
          Register
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ textAlign: "left" }}
        >
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
            sx={{
              mb: 0,
              label: { color: "#ffffff" },
              color: "#ffffff",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffffff" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
              "& .MuiInputLabel-root": { color: "#ffffff" },
              "& .MuiInputBase-input": { color: "#ffffff" },
            }}
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
            sx={{
              mb: 0,
              label: { color: "#ffffff" },
              color: "#ffffff",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#ffffff" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
              "& .MuiInputLabel-root": { color: "#ffffff" },
              "& .MuiInputBase-input": { color: "#ffffff" },
            }}
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

          <TextInputField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            hidePassword={true}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && Boolean(errors.password)}
          />

          {touched.password && errors.password ? (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 0.5, mb: 2, textAlign: "left" }}
            >
              {errors.password}
            </Typography>
          ) : null}

          <TextInputField
            fullWidth
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            margin="normal"
            hidePassword={true}
            value={values.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword && Boolean(errors.confirmPassword)}
          />

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
            sx={{
              mt: 3,
              mb: 2,
              position: "relative",
              backgroundColor: "#8AA624",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="secondary" />
            ) : (
              "REGISTER"
            )}
          </Button>
        </Box>
        {/* </Paper> */}

        <CustomSnackbar
          message={apiError}
          open={open}
          setOpen={setOpen}
          severity={severity}
        />
      </Box>
    </Box>

    //</Container>
  );
}
