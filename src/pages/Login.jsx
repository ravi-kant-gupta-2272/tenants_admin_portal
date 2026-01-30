import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography, Link, Alert } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { RiAdminFill } from "react-icons/ri";
import axios from "axios";
import { useFormik } from "formik";
import { loginSchema } from "../schemas/LoginValidationSchema.jsx";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig.js";
import CustomSnackbar from "../components/CustomSnackbar.jsx";
import CircularProgress from '@mui/material/CircularProgress';

const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error"); 

  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: handleLoginFunction,
    });

    async function handleLoginFunction(values, action) {
  setLoading(true);

  try {
   
    await axios.post(`${BASE_URL}${ENDPOINTS.LOGIN}`, values);

    setSeverity("success");
    setApiError("Login Success. Navigating to dashboard");
    setOpen(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard", { replace: true });
      action.resetForm();
    }, 2000);

  } catch (error) {
    setSeverity("error");
    setApiError(error.response?.data?.message || "Login failed");
    setOpen(true);
    setLoading(false);
  }
}

  const navigateRegister = () => navigate("/register");
  const navigateForgotPassword = () => {
    navigate("/forgotpassword");
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate 
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
      <Box>
        <label htmlFor="email"></label>
        <TextInputField
          fullWidth
          label="Email"
          name="email"
          type="email"
          margin="normal"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email && Boolean(errors.email)}
        />

        {touched.email && errors.email ? (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 0.5, display: "block", textAlign: "left" }}
          >
            {errors.email}
          </Typography>
        ) : null}
      </Box>
      <Box>
        <label htmlFor="password"></label>
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

        {touched.password && errors.password ? (
          <Typography
            color="error"
            variant="caption"
            sx={{ mt: 0.5, display: "block", textAlign: "left" }}
          >
            {errors.password}
          </Typography>
        ) : null}
      </Box>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
      
         {loading ? (
          <CircularProgress size={24}  color="secondary"/>
        ) : (
          "Login"
        )}
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
              textDecorationColor: "secondary.main"
            },
          }}
        >
          Please Register.
        </Link>
        <br />
        <br />
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
      <CustomSnackbar message={apiError} open={open} setOpen={setOpen} severity={severity}/>
    </Box>
  );
}
export default Login;
