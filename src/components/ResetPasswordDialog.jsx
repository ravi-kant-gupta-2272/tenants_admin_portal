import SentEmailForResetPasswordSchema from "../schemas/SentEmailForResetPasswordSchema";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Button,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ResetPasswordDialog({ open, handleClose, onSubmit }) {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: SentEmailForResetPasswordSchema,
    onSubmit: (values) => {
      onSubmit(values.email);
    },
  });

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          backgroundColor: "#1f4e63",
          color: "white",
        }}
      >
        <Typography variant="h6">Reset Password</Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <TextField
            fullWidth
            label="Enter Registered Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
        </DialogContent>

        <DialogActions>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            style={{ backgroundColor: "#8AA624" }}
          >
            SEND RESET LINK
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

// import { useFormik } from "formik";
// import {
//   Dialog,
//   DialogContent,
//   DialogActions,
//   IconButton,
//   TextField,
//   Button,
//   Box,
//   Typography,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import { SentEmailForResetPasswordSchema } from "../schemas/SentEmailForResetPasswordSchema";
// export default function ResetPasswordDialog({ open, handleClose, onSubmit }) {

//     const { values, handleBlur, handleChange, errors, handleSubmit, touched } = useFormik({
//     initialValues: { email: "" },
//     validationSchema: SentEmailForResetPasswordSchema,

//     onSubmit: (values) => {
//       onSubmit?.(values.email);
//       handleClose();
//     },
//   });

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       slotProps={{
//         paper: {
//           elevation: 3,
//           sx: {
//             padding: 3,
//             borderRadius: "12px",
//             backgroundColor: "#fff",
//           },
//         },
//       }}
//     >
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           px: 2,
//           py: 1.5,
//           backgroundColor: "#1f4e63",
//           color: "white",
//         }}
//       >
//         <Typography variant="h6">Reset Password</Typography>

//         <IconButton onClick={handleClose} sx={{ color: "white" }}>
//           <CloseIcon />
//         </IconButton>
//       </Box>

//       <form onSubmit={handleSubmit}>
//         <DialogContent sx={{ mt: 2 }}>
//           <TextField
//             fullWidth
//             label="Enter Registered Email"
//             name="email"
//             // type="email"
//             variant="outlined"
//             value={values.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.email && Boolean(errors.email)}
//             helperText={touched.email && errors.email}
//           />
//         </DialogContent>

//         <DialogActions sx={{ px: 3 }}>
//           <Button
//            type="submit"
//             fullWidth
//             variant="contained"
//             sx={{
//               backgroundColor: "#1f4e63",
//               py: 1.2,
//               "&:hover": { backgroundColor: "#173c4d" },
//             }}
//           >
//             SEND RESET LINK
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }
