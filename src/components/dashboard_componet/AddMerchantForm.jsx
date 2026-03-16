import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMerchant } from "../../services/merchant.service";
import { useFormik } from "formik";
import { addMerchantSchema } from "../../schemas/AddMerchantValidationSchema";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import { useState, useEffect } from "react";
import "../../index.css";
import CustomSnackbar from "../CustomSnackbar";
import * as Sentry from "@sentry/react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  IconButton,
  Divider,
  Card,
  CardContent,
  MenuItem,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function AddMerchantForm({ open, onClose }) {
  const [showClientSecret, setShowClientSecret] = useState(false);
  // const [showWebhookPassword, setShowWebhookPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const queryClient = useQueryClient();

  const addMerchantMutation = useMutation({
    mutationFn: (data) => addMerchant(data),
    onSuccess: () => {
      setSnackbarMessage("Merchant added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      //queryClient.setQueryData();

      setTimeout(() => {
        setShowClientSecret(false);
        // setShowWebhookPassword(false);
        setSnackbarOpen(false);
        setSnackbarMessage("");
        setSnackbarSeverity("success");

        formik.resetForm();
        onClose();
      }, 1500);
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to add merchant";
      Sentry.captureException(error);
      setSnackbarMessage(errorMessage);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });
  const formik = useFormik({
    initialValues: {
      name: "",
      merchantId: "",
      environment: "SANDBOX",
      clientId: "",
      clientVersion: 1,
      clientSecret: "",
      callbackUrl: "",
      //  webhookUsername: "",
      //   webhookPassword: "",
    },
    validationSchema: addMerchantSchema,
    onSubmit: (values) => {
      addMerchantMutation.mutate(values);
    },
  });

  useEffect(() => {
    if (open) {
      formik.resetForm();
    }
  }, [open]);

  const textFieldProps = (field) => ({
    name: field,
    value: formik.values[field],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[field] && Boolean(formik.errors[field]),

    helperText: formik.touched[field] && formik.errors[field],
    fullWidth: true,
  });

  const handleClose = () => {
    if (!addMerchantMutation.isPending) {
      formik.resetForm();

      setSnackbarOpen(false);
      setSnackbarMessage("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #5e35b1 0%, #311b92 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Add PhonePe Merchant
        <IconButton
          onClick={handleClose}
          disabled={addMerchantMutation.isPending}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ backgroundColor: "#fafafa" }}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>

              <TextField
                label="Merchant Account Name"
                {...textFieldProps("name")}
              />

              <Box mt={2}>
                <TextField
                  label="Merchant ID"
                  {...textFieldProps("merchantId")}
                />
              </Box>

              <Box mt={2}>
                <TextField
                  select
                  label="Environment"
                  {...textFieldProps("environment")}
                >
                  <MenuItem value="SANDBOX">Sandbox</MenuItem>
                  <MenuItem value="PRODUCTION">Production</MenuItem>
                </TextField>
              </Box>
            </CardContent>
          </Card>

          {/* API Credentials */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                API Credentials
              </Typography>

              <TextField label="Client ID" {...textFieldProps("clientId")} />

              <Box mt={2}>
                <TextField
                  label="Client Version"
                  type="number"
                  {...textFieldProps("clientVersion")}
                />
              </Box>

              <Box mt={2}>
                <TextField
                  label="Client Secret"
                  type={showClientSecret ? "text" : "password"}
                  {...textFieldProps("clientSecret")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowClientSecret((prev) => !prev)}
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showClientSecret ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Callback Url Configuration
              </Typography>

              <TextField
                label="Callback URL"
                {...textFieldProps("callbackUrl")}
              />

              {/* <Box mt={2}>
                <TextField
                  label="Webhook Username"
                  {...textFieldProps("webhookUsername")}
                />
              </Box> */}

              {/* <Box mt={2}>
                <TextField
                  sx={{}}
                  label="Webhook Password"
                  type={showWebhookPassword ? "text" : "password"}
                  {...textFieldProps("webhookPassword")}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            setShowWebhookPassword((prev) => !prev)
                          }
                          onMouseDown={(e) => e.preventDefault()}
                          edge="end"
                        >
                          {showWebhookPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box> */}
            </CardContent>
          </Card>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={addMerchantMutation.isPending}
          >
            {addMerchantMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Add Merchant"
            )}
          </Button>
        </DialogActions>
      </form>

      <CustomSnackbar
        open={snackbarOpen}
        setOpen={setSnackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </Dialog>
  );
}

export default AddMerchantForm;
