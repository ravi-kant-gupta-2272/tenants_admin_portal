import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { passwordResetSchema } from "../schemas/PasswordResetValidationSchema.jsx";
import { IoMdPerson } from "react-icons/io";
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
      component="form"
      onSubmit={handleSubmit}
      noValidate
      sx={{
        width: {
          xs: "80%",     // phones
          sm: 380,       // small tablets
          md: 420,       // laptops
        },
        maxWidth: 440,   // safety cap
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
      <IoMdPerson size={100} style={{ display: "block", margin: "0 auto", color:"#ffffff"}} />
      <Typography variant="h5" mb={3} textAlign="center" color="#ffffff">
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
        hidePassword={true}
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
        hidePassword={true}
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
        sx={{ mt: 2, backgroundColor: "#8AA624" }}
        disabled={loading}
        
      >
        {loading ? (
                 <CircularProgress size={24}  color="secondary"/>
               ) : (
                 "RESET"
               )}
      </Button>

      <Typography variant="body2" sx={{ mt: 3, color: "#ffffff" }} textAlign="center">
        Remember your password?{" "}
        <Link
          onClick={navigateLogin}
          sx={{
            textDecoration: "underline",
            textDecorationColor: "primary.main",
            textUnderlineOffset: "4px",
            cursor: "pointer",
           color: "#ffffff",
            "&:hover": {
              color: "#8AA624",
              textDecorationColor: "secondary.main"
            },
          }}
        >
          Back to Login
        </Link>
      </Typography>
      <CustomSnackbar message={apiError} open={open} setOpen={setOpen} severity={severity}/>
    </Box>
    </Box>
  );
}

export default ResetPassword;
