import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMerchant } from "../../services/merchant.service";
import { useFormik } from "formik";
import { updateMerchantSchema } from "../../schemas/updateMerchantSchema";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { InputAdornment } from "@mui/material";
import { useState } from "react";
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

function UpdateMerchantForm({ open, onClose, merchantData }) {
  const [showClientSecret, setShowClientSecret] = useState(false);
  const [showWebhookPassword, setShowWebhookPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const queryClient = useQueryClient();
  const updateMerchantMutation = useMutation({
    mutationFn: (data) => updateMerchant(merchantData.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      setSnackbarMessage("Merchant updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    },
    onError: (error) => {
      Sentry.captureException(error);
      setSnackbarMessage(
        error?.response?.data?.message || "Failed to update merchant",
      );
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    },
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: merchantData?.name || "",
      merchantId: merchantData?.merchant_id || "",
      environment: merchantData?.environment || "SANDBOX",
      clientId: merchantData?.client_id || "",
      clientVersion: merchantData?.client_version || 1,
      clientSecret: merchantData?.client_secret || "",
      callbackUrl: merchantData?.callback_url || "",
      webhookUsername: merchantData?.webhook_username || "",
      webhookPassword: merchantData?.webhook_password || "",
    },
    validationSchema: updateMerchantSchema,
    onSubmit: (values) => {
      updateMerchantMutation.mutate(values);
    },
  });

  if (!merchantData) return null;

  const textFieldProps = (field) => ({
    name: field,
    value: formik.values[field],
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    error: formik.touched[field] && Boolean(formik.errors[field]),
    helperText: formik.touched[field] && formik.errors[field],
    fullWidth: true,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          background: "linear-gradient(135deg, #5e35b1 0%, #311b92 100%)",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        Update PhonePe Merchant
        <IconButton
          onClick={onClose}
          disabled={updateMerchantMutation.isPending}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Basic Information
              </Typography>

              <TextField label="Merchant Name" {...textFieldProps("name")} />

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

          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                API Credentials
              </Typography>

              <TextField label="Client ID" {...textFieldProps("clientId")} />

              <Box mt={2}>
                <TextField
                  type="number"
                  label="Client Version"
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
                Webhook Configuration
              </Typography>

              <TextField
                label="Callback URL"
                {...textFieldProps("callbackUrl")}
              />

              <Box mt={2}>
                <TextField
                  label="Webhook Username"
                  {...textFieldProps("webhookUsername")}
                />
              </Box>

              <Box mt={2}>
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
              </Box>
            </CardContent>
          </Card>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={updateMerchantMutation.isPending}
          >
            {updateMerchantMutation.isPending ? (
              <CircularProgress size={20} />
            ) : (
              "Update Merchant"
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

export default UpdateMerchantForm;
