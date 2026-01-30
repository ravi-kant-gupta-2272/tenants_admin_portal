import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { passwordResetSchema } from "../schemas/PasswordResetValidationSchema.jsx";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig.js";
import CustomSnackbar from "../components/CustomSnackbar.jsx";
import { ENDPOINTS } from "../api/apiConfig.js";
import CircularProgress from '@mui/material/CircularProgress';
function ResetPassword() {
  
  const initialValues = {
    email: "",
    password: "",
    forgotPassword: ""
  };
  const navigate = useNavigate();
  const [apiError,setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("error"); 

  const navigateLogin = () => {
    navigate("/login");
  };
  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema: passwordResetSchema,
      onSubmit: handleResetPasswordFunction
    });

    async function handleResetPasswordFunction(values, action) {
  setLoading(true);

  try {
    const resp = await axios.post(
      `${BASE_URL}${ENDPOINTS.RESET}`,
      values
    );

    setApiError("Password Reset Success! Navigating to login page");
    setSeverity("success");
    setOpen(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/login", { replace: true });
      action.resetForm();
    }, 2000);

  } catch (error) {

    setApiError(error.response?.data?.message || "Reset Password failed");
    setSeverity("error");
    setOpen(true);
    setLoading(false);
  }
}
  return (
    <Box
      component="form"
      noValidate
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

      <TextInputField
        fullWidth
        label="Email"
        name="email"
        type="email"
        margin="normal"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}

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
        label="Enter New Password"
        name="password"
        type="password"
        margin="normal"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}

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
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        margin="normal"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.confirmPassword}
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
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 2 }}
        disabled={loading}
      >
        {loading ? (
                 <CircularProgress size={24}  color="secondary"/>
               ) : (
                 "RESET"
               )}
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
      <CustomSnackbar message={apiError} open={open} setOpen={setOpen} severity={severity}/>
    </Box>
  );
}

export default ResetPassword;
