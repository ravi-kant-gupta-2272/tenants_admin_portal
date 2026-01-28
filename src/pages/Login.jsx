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

const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);

  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginSchema,
      onSubmit: () => handleLoginFunction(),
    });

  async function handleLoginFunction(values, action) {
    console.log("handleLoginFunction clicked");

    setLoading(true);
    try {
      console.log(`${BASE_URL}${ENDPOINTS.LOGIN}`);
      const response = await axios.post(`${BASE_URL}${ENDPOINTS.LOGIN}`, {
        email: values.email,
        password: values.password,
      });
      console.log("response ", response);
      navigate("/dashboard");
      action.resetForm();
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 401) {
        setApiError(error.response.data.message);
        setOpen(true);
      }
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
      noValidate // <-- html5 ke default  validation behaviour(email) ko disable kar deta hai ye
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
      <CustomSnackbar message={apiError} open={open} setOpen={setOpen} />;
    </Box>
  );
}

export default Login;
