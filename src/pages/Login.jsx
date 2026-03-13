import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CustomDialogLink from "../components/CustomDialogLink.jsx";
import { ParticlesBackground } from "../components/ParticlesBackground.jsx";
import * as Sentry from "@sentry/react";
// import "../../src/index.css";
import {
  Box,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import TextInputField from "../components/TextInputField.jsx";
import { IoMdPerson } from "react-icons/io";
import { sendResetPasswordEmail } from "../services/resetPassword.service";
import { sendRegistrationEmail } from "../services/registerService.js";
import axios from "axios";
import { useFormik } from "formik";
import { loginSchema } from "../schemas/LoginValidationSchema.jsx";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig.js";
import CustomSnackbar from "../components/CustomSnackbar.jsx";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate } from "react-router-dom";

const initialValues = {
  email: "",
  password: "",
};

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRemember, setRemember] = useState(false);
  const [apiError, setApiError] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("error");
  const [openDialog, setOpenDialog] = useState(false); // Renamed from openReset
  const [dialogMode, setDialogMode] = useState("reset"); // Add mode state: 'reset' or 'register'

  const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
    useFormik({
      initialValues,
      validationSchema: loginSchema,
      onSubmit: handleLoginFunction,
    });

  if (localStorage.getItem("authToken")) {
    return <Navigate to="/home" replace />;
  }

  const handleDialogSubmit = async (email) => {
    try {
      let response;

      if (dialogMode === "reset") {
        response = await sendResetPasswordEmail(email);
        setSeverity("success");
        setApiError("Password reset link sent to your email");
      } else {
        // Register mode
        response = await sendRegistrationEmail(email);
        setSeverity("success");
        setApiError("Registration link sent to your email");
      }

      console.log("response", response);
      setOpen(true);
      setOpenDialog(false);
    } catch (error) {
      setSeverity("error");
      const errorMessage =
        dialogMode === "reset"
          ? "Failed to send reset link"
          : "Failed to send registration link";
      setApiError(error.response?.data?.message || errorMessage);
      setOpen(true);
    }
  };

  const handleOpenResetDialog = () => {
    setDialogMode("reset");
    setOpenDialog(true);
  };

  const handleOpenRegisterDialog = () => {
    setDialogMode("register");
    setOpenDialog(true);
  };

  async function handleLoginFunction(values, action) {
    setLoading(true);

    try {
      console.log(BASE_URL);
      const response = await axios.post(
        `${BASE_URL}${ENDPOINTS.LOGIN}`,
        values,
      );
      console.log("Login Response is --->    ", response);

      setSeverity("success");
      setApiError("Login Success. Navigating to dashboard");
      setOpen(true);
      Sentry.setUser({
        id: response.data.id,
        email: response.data.email,
      });
      setTimeout(() => {
        setLoading(false);
        action.resetForm();
        localStorage.setItem("authToken", "true");
        localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        navigate("/home/dashboard", { replace: true });
      }, 2000);
    } catch (error) {
      Sentry.captureException(error);
      setSeverity("error");
      setApiError(error.response?.data?.message || "Login failed");
      setOpen(true);
      setLoading(false);
    }
  }

  const onSelectRememberMe = () => {
    console.log("Remember Me selected");
    setRemember(!isRemember);
  };

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#27586fff",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflowY: "hidden",
          py: { xs: 2, sm: 2 },
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{
            zIndex: 1,
            width: {
              xs: "80%",
              sm: 380,
              md: 420,
            },
            maxWidth: 440,
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
            style={{
              display: "block",
              margin: "0 auto",
              color: "#ffffff",
              fontSize: "clamp(64px, 20vw, 100px)",
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
              mb: 2,
              textAlign: "center",
              color: "#fff",
            }}
          >
            Admin Login
          </Typography>
          <Box>
            <Typography
              color="white"
              variant="caption"
              sx={{ mb: 0.0, display: "block", textAlign: "left" }}
            >
              Email
            </Typography>

            <TextInputField
              fullWidth
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
            <Typography
              color="white"
              variant="caption"
              sx={{ mt: 0.5, display: "block", textAlign: "left" }}
            >
              Password
            </Typography>
            <TextInputField
              fullWidth
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
                sx={{ mt: 0.5, display: "block", textAlign: "left" }}
              >
                {errors.password}
              </Typography>
            ) : null}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 0,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRemember}
                  onChange={onSelectRememberMe}
                  name="remember"
                  sx={{
                    color: "#ffffff",
                    "&.Mui-checked": { color: "#ffffff" },
                  }}
                />
              }
              label="Remember Me"
              sx={{
                color: "#ffffff",
                fontSize: "10px",
                boxSizing: "border-box",
              }}
            />

            <Link
              onClick={handleOpenResetDialog}
              sx={{
                textAlign: "right",
                textDecoration: "underline",
                textDecorationColor: "primary.main",
                textUnderlineOffset: "4px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#ffffff",
                "&:hover": {
                  color: "#8AA624",
                  textDecorationColor: "secondary.main",
                },
              }}
            >
              Forgot Password.
            </Link>
          </Box>

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
              "Login"
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{ mt: 2, color: "#ffffff" }}
            textAlign="center"
          >
            Don't have an account?{" "}
            <Link
              onClick={handleOpenRegisterDialog}
              sx={{
                textDecoration: "underline",
                textDecorationColor: "primary.main",
                textUnderlineOffset: "4px",
                cursor: "pointer",
                fontSize: "12px",
                color: "#ffffff",
                "&:hover": {
                  color: "#8AA624",
                  textDecorationColor: "secondary.main",
                },
              }}
            >
              Please Register.
            </Link>
            <br />
          </Typography>
        </Box>

        <CustomSnackbar
          message={apiError}
          open={open}
          setOpen={setOpen}
          severity={severity}
        />

        {openDialog && (
          <CustomDialogLink
            handleClose={() => setOpenDialog(false)}
            onSubmit={handleDialogSubmit}
            mode={dialogMode}
            buttonLabel={
              dialogMode === "reset"
                ? "SEND RESET LINK"
                : "SEND REGISTRATION LINK"
            }
          />
        )}

        <ParticlesBackground />
      </Box>
    </>
  );
}

export default Login;
// import { useNavigate } from "react-router-dom";
// import { useState } from "react";
// import CustomDialogLink from "../components/CustomDialogLink.jsx";
// import { ParticlesBackground } from "../components/ParticlesBackground.jsx";
// // import "../../src/index.css";
// import {
//   Box,
//   Button,
//   Typography,
//   Link,
//   FormControlLabel,
//   Checkbox,
// } from "@mui/material";
// import TextInputField from "../components/TextInputField.jsx";
// import { IoMdPerson } from "react-icons/io";
// import { sendResetPasswordEmail } from "../services/resetPassword.service";
// import axios from "axios";
// import { useFormik } from "formik";
// import { loginSchema } from "../schemas/LoginValidationSchema.jsx";
// import { BASE_URL, ENDPOINTS } from "../api/apiConfig.js";
// import CustomSnackbar from "../components/CustomSnackbar.jsx";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Navigate } from "react-router-dom";

// const initialValues = {
//   email: "",
//   password: "",
// };

// function Login() {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [isRemember, setRemember] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [open, setOpen] = useState(false);
//   const [severity, setSeverity] = useState("error");
//   const [openReset, setOpenReset] = useState(false);

//   const { values, handleBlur, handleChange, errors, handleSubmit, touched } =
//     useFormik({
//       initialValues,
//       validationSchema: loginSchema,
//       onSubmit: handleLoginFunction,
//     });
//   if (localStorage.getItem("authToken")) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleResetSubmit = async (email) => {
//     try {
//       const response = await sendResetPasswordEmail(email);
//       console.log("response", response);
//       setSeverity("success");
//       setApiError("Password reset link sent to your email");
//       setOpen(true);
//       setOpenReset(false);
//     } catch (error) {
//       setSeverity("error");
//       setApiError(error.response?.data?.message || "Failed to send reset link");
//       setOpen(true);
//     }
//   };

//   const handleOpenDiallog = () => {
//     setOpenReset(true);
//   };
//   async function handleLoginFunction(values, action) {
//     setLoading(true);

//     try {
//       console.log(BASE_URL);
//       const response = await axios.post(
//         `${BASE_URL}${ENDPOINTS.LOGIN}`,
//         values,
//       );
//       console.log("Login Response is --->    ", response);

//       setSeverity("success");
//       setApiError("Login Success. Navigating to dashboard");
//       setOpen(true);

//       setTimeout(() => {
//         setLoading(false);
//         action.resetForm();
//         localStorage.setItem("authToken", "true");
//         localStorage.setItem("accessToken", response.data.accessToken);
//         localStorage.setItem("refreshToken", response.data.refreshToken);
//         navigate("/dashboard", { replace: true, relative: "path" });
//       }, 2000);
//     } catch (error) {
//       setSeverity("error");
//       setApiError(error.response?.data?.message || "Login failed");
//       setOpen(true);
//       setLoading(false);
//     }
//   }

//   const navigateRegister = () => setOpenReset(true);

//   const onSelectRememberMe = () => {
//     console.log("Remember Me selected");
//     setRemember(!isRemember);
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           backgroundColor: "#27586fff",
//           height: "100vh",

//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           overflowY: "hidden",
//           py: { xs: 2, sm: 2 },
//         }}
//       >
//         <Box
//           component="form"
//           onSubmit={handleSubmit}
//           noValidate
//           sx={{
//             //  position: "relative",
//             zIndex: 1,
//             width: {
//               xs: "80%",
//               sm: 380,
//               md: 420,
//             },
//             maxWidth: 440,
//             mx: "auto",

//             mt: {
//               xs: 2,
//               sm: 6,
//               md: 10,
//             },

//             p: {
//               xs: 2,
//               sm: 3,
//               md: 4,
//             },
//             pt: 1,

//             borderRadius: {
//               xs: 2,
//               sm: 3,
//             },
//             background: "rgba(255, 255, 255, 0.15)",
//             backdropFilter: "blur(12px)",
//             WebkitBackdropFilter: "blur(12px)",
//             border: "1px solid rgba(255, 255, 255, 0.3)",
//             boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
//           }}
//         >
//           <IoMdPerson
//             size={100}
//             style={{
//               display: "block",
//               margin: "0 auto",
//               color: "#ffffff",
//               fontSize: "clamp(64px, 20vw, 100px)",
//             }}
//           />
//           <Typography
//             variant="h5"
//             sx={{
//               fontSize: { xs: "1.25rem", sm: "1.5rem" },
//               mb: 2,
//               textAlign: "center",
//               color: "#fff",
//             }}
//           >
//             Admin Login
//           </Typography>
//           <Box>
//             <Typography
//               color="white"
//               variant="caption"
//               sx={{ mb: 0.0, display: "block", textAlign: "left" }}
//             >
//               Email
//             </Typography>

//             <TextInputField
//               fullWidth
//               // label="Email"
//               name="email"
//               type="email"
//               margin="normal"
//               value={values.email}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.email && Boolean(errors.email)}
//             />

//             {touched.email && errors.email ? (
//               <Typography
//                 color="error"
//                 variant="caption"
//                 sx={{ mt: 0.5, display: "block", textAlign: "left" }}
//               >
//                 {errors.email}
//               </Typography>
//             ) : null}
//           </Box>
//           <Box>
//             {/* <label htmlFor="password" className="">
//               Password
//             </label> */}
//             <Typography
//               color="white"
//               variant="caption"
//               sx={{ mt: 0.5, display: "block", textAlign: "left" }}
//             >
//               Password
//             </Typography>
//             <TextInputField
//               fullWidth
//               // label="Password"
//               name="password"
//               type="password"
//               margin="normal"
//               hidePassword={true}
//               value={values.password}
//               onChange={handleChange}
//               onBlur={handleBlur}
//               error={touched.password && Boolean(errors.password)}
//             />

//             {touched.password && errors.password ? (
//               <Typography
//                 color="error"
//                 variant="caption"
//                 sx={{ mt: 0.5, display: "block", textAlign: "left" }}
//               >
//                 {errors.password}
//               </Typography>
//             ) : null}
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               mt: 0,
//             }}
//           >
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={isRemember}
//                   onChange={onSelectRememberMe}
//                   name="remember"
//                   sx={{
//                     color: "#ffffff",
//                     "&.Mui-checked": { color: "#ffffff" },
//                   }}
//                 />
//               }
//               label="Remember Me"
//               sx={{
//                 color: "#ffffff",
//                 fontSize: "10px",
//                 boxSizing: "border-box",
//               }}
//             />

//             <Link
//               // onClick={navigateForgotPassword}
//               onClick={handleOpenDiallog}
//               sx={{
//                 textAlign: "right",
//                 textDecoration: "underline",
//                 textDecorationColor: "primary.main",
//                 textUnderlineOffset: "4px",
//                 cursor: "pointer",
//                 fontSize: "12px",
//                 color: "#ffffff",
//                 "&:hover": {
//                   color: "#8AA624",
//                   textDecorationColor: "secondary.main",
//                 },
//               }}
//             >
//               Forgot Password.
//             </Link>
//           </Box>

//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 2, backgroundColor: "#8AA624" }}
//             disabled={loading}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="secondary" />
//             ) : (
//               "Login"
//             )}
//           </Button>

//           <Typography
//             variant="body2"
//             sx={{ mt: 2, color: "#ffffff" }}
//             textAlign="center"
//           >
//             Don't have an account?{" "}
//             <Link
//               onClick={navigateRegister}
//               sx={{
//                 textDecoration: "underline",
//                 textDecorationColor: "primary.main",
//                 textUnderlineOffset: "4px",
//                 cursor: "pointer",
//                 fontSize: "12px",

//                 color: "#ffffff",
//                 "&:hover": {
//                   color: "#8AA624",
//                   textDecorationColor: "secondary.main",
//                 },
//               }}
//             >
//               Please Register.
//             </Link>
//             <br />
//           </Typography>
//         </Box>
//         <CustomSnackbar
//           message={apiError}
//           open={open}
//           setOpen={setOpen}
//           severity={severity}
//         />
//         {openReset && (
//           <CustomDialogLink
//             // open={openReset}
//             handleClose={() => setOpenReset(false)}
//             onSubmit={handleResetSubmit}
//             buttonLebel={"SEND RESET LINK"}
//           />
//         )}

//         <ParticlesBackground />
//       </Box>
//     </>
//   );
// }
// export default Login;
