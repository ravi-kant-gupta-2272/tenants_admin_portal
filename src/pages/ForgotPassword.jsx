import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { Box, Button, Typography, Link } from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { passwordResetSchema } from "../schemas/PasswordResetValidationSchema.jsx";
import { IoMdPerson } from "react-icons/io";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../api/apiConfig.js";
import CustomSnackbar from "../components/CustomSnackbar.jsx";
import { ENDPOINTS } from "../api/apiConfig.js";
import CircularProgress from "@mui/material/CircularProgress";
import { useSearchParams } from "react-router-dom";
import * as Sentry from "@sentry/react";

function ResetPassword() {
  const initialValues = {
    password: "",
    forgotPassword: "",
  };

  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [tokenStatus, setTokenStatus] = useState("reset");
  console.log("token isssssssssss", token);
  const navigateLogin = () => {
    navigate("/login");
  };
  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema: passwordResetSchema,
      onSubmit: handleResetPasswordFunction,
    });

  // Get token on mount

  useEffect(() => {
    if (!token) {
      setTokenStatus("invalid");
      return;
    }
    async function verifyToken() {
      try {
        await axios.get(`${BASE_URL}${ENDPOINTS.VALIDATE_TOKEN_STATUS}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setTokenStatus("valid");
      } catch (error) {
        Sentry.captureException(error);
        setTokenStatus("invalid");
      }
    }

    verifyToken();
  }, [token]);

  console.log("Token Status is------>", tokenStatus);
  async function handleResetPasswordFunction(values, action) {
    setLoading(true);

    try {
      await axios.post(`${BASE_URL}${ENDPOINTS.RESET}`, {
        ...values,
        token: `${token}`,
      });

      setApiError("Password Reset Success! Navigating to login page");
      setSeverity("success");
      console.log("api----message--->", apiError);
      setOpen(true);

      setTimeout(() => {
        setLoading(false);
        navigate("/login", { replace: true });
        action.resetForm();
      }, 2000);
    } catch (error) {
      setApiError(error.response?.data?.message || "Reset Password failed");
      console.log(
        "error.response?.data?.message",
        error.response?.data?.message,
      );
      Sentry.captureException(error);
      setSeverity("error");
      setOpen(true);
      setLoading(false);
    }
  }
  console.log("Api Error--->", apiError);
  if (tokenStatus === "invalid") {
    return (
      <>
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#27586fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "#ffffff",
            textAlign: "center",
            px: 3,
          }}
        >
          <Typography variant="h4" mb={2}>
            Reset Link Expired
          </Typography>

          <Typography variant="body1" mb={4}>
            This password reset link is no longer valid or has expired.
          </Typography>

          {/* <Button
            variant="contained"
            sx={{ backgroundColor: "#8AA624" }}
            onClick={() => navigate("/forgotpassword")}
          >
            Request New Link
          </Button> */}
        </Box>
      </>
    );
  }
  return (
    tokenStatus === "valid" && (
      <>
        {console.log("apierror---", apiError)}
        <Box
          sx={{
            backgroundColor: "#27586fff",

            minHeight: "100dvh",
            width: "100vw",
            display: "flex",

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
            <Typography variant="h5" mb={3} textAlign="center" color="#ffffff">
              Reset Password
            </Typography>

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
                <CircularProgress size={24} color="secondary" />
              ) : (
                "RESET"
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 3, color: "#ffffff" }}
              textAlign="center"
            >
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
                    textDecorationColor: "secondary.main",
                  },
                }}
              >
                Back to Login
              </Link>
            </Typography>
          </Box>
          <CustomSnackbar
            message={apiError}
            open={open}
            setOpen={setOpen}
            severity={severity}
          />
        </Box>
      </>
    )
  );
}

export default ResetPassword;
