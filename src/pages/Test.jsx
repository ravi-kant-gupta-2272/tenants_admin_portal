import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Box, Button, Typography, Link, Alert } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { RiAdminFill } from "react-icons/ri";
import axios from "axios";
import { useFormik } from "formik";
import { loginSchema } from "../schemas/LoginValidationSchema.jsx";

const initialValues = {
  email: "",
  password: "",
};
function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: loginSchema,
      onSubmit: (values, action) => {
        console.log("Login values", values);
        action.resetForm();
      },
    });
  // console.log(values);
  console.log(errors);

  // const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleChange = (e) =>
  //   setForm({ ...form, [e.target.name]: e.target.value });

  const navigateRegister = () => navigate("/register");

  const navigateForgotPassword = () => {
    navigate("/forgotpassword");
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   try {
  //     await axios.post("http://192.168.50.165:3000/api/user/login", {
  //       email: form.email,
  //       password: form.password,
  //     });

  //     navigate("/dashboard", { replace: true });
  //   } catch (error) {
  //     if (error.response) {
  //       setError(error.response.data.message || "Invalid email or password");
  //     } else if (error.request) {
  //       setError("Server not responding. Please check your connection.");
  //     } else {
  //       setError("An error occurred. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )} */}
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
      />
      {/* // Condition logic to check when error should display */}
      {touched.email && errors.email && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 0.5, display: "block" }}
        >
          {errors.email}
        </Typography>
      )}
      <TextInputField
        fullWidth
        label="Password"
        name="password"
        type="password"
        margin="normal"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {/* // Condition logic to check when error should display */}
      {touched.password && errors.password && (
        <Typography
          color="error"
          variant="caption"
          sx={{ mt: 0.5, display: "block" }}
        >
          {errors.password}
        </Typography>
      )}
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
