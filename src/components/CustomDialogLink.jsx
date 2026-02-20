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

export default function CustomDialogLink({
  handleClose,
  onSubmit,
  buttonLabel,
  mode = "reset",
}) {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: SentEmailForResetPasswordSchema,
    onSubmit: (values) => {
      onSubmit(values.email);
    },
  });

  const getTitle = () => {
    return mode === "reset" ? "Reset Password" : "Register Account";
  };

  const getDescription = () => {
    return mode === "reset"
      ? "Enter your registered email to receive a password reset link"
      : "Enter your email to receive a registration link";
  };

  return (
    <Dialog open={true} onClose={handleClose}>
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
        <Typography variant="h6">{getTitle()}</Typography>
        <IconButton onClick={handleClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {getDescription()}
          </Typography>
          <TextField
            fullWidth
            label={
              mode === "reset" ? "Enter Registered Email" : "Enter Your Email"
            }
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
            disabled={!formik.isValid || !formik.dirty}
            sx={{
              backgroundColor:
                !formik.isValid || !formik.dirty ? "#bdbdbd" : "#8AA624",
              color: "#fff",
              "&:hover": {
                backgroundColor:
                  !formik.isValid || !formik.dirty ? "#bdbdbd" : "#7a961f",
              },
            }}
          >
            {buttonLabel}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
