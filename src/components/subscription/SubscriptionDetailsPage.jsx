import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const SubscriptionDetailsPage = ({ merchantData, subscriptions }) => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");

    navigate("/login");
  };

  const handleBack = () => {
    navigate("/dashboard");
  };
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#fff",
          color: "white",
          borderBottom: "1px solid #eee",
          display: "flex-col",
          justifyContent: "space-evenly",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            backgroundColor: "#27586F",
          }}
        >
          {/* 🔹 LEFT SECTION */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton onClick={handleBack} sx={{ color: "white" }}>
              <ArrowBackIcon />
            </IconButton>

            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: "white",
                left: "50%",
                position: "absolute",
                transform: "translateX(-50%)",
              }}
            >
              Manage Your Subscription
            </Typography>
          </Box>

          {/* 🔹 RIGHT SECTION */}
          <Box>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} sx={{ color: "white" }}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: 1100, margin: "auto" }}>
        {/*  MERCHANT INFO CARD */}

        <Card
          sx={{
            mb: 4,
            borderLeft: "6px solid #27586F",
            borderRadius: 2,
            boxShadow: "0 4px 18px rgba(0,0,0,0.05)",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* 🔹 Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600}>
                Merchant Configuration
              </Typography>

              <Button
                sx={{ backgroundColor: "#8AA624", color: "white" }}
                onClick={() => setShowForm((prev) => !prev)}
              >
                {showForm ? "Close Form" : "Add Subscription"}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* 🔹 Details Grid */}
            <Grid container spacing={4}>
              {/* PhonePe Merchant */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  PhonePe Merchant
                </Typography>
                <Typography fontWeight={600}>
                  {merchantData?.merchant_name || "-"}
                </Typography>
              </Grid>

              {/* Merchant ID */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Merchant ID
                </Typography>
                <Typography fontWeight={600}>
                  {merchantData?.merchant_id || "-"}
                </Typography>
              </Grid>

              {/* Environment */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Environment
                </Typography>
                <Chip
                  label={merchantData?.environment}
                  size="small"
                  color={
                    merchantData?.environment === "PRODUCTION"
                      ? "success"
                      : "warning"
                  }
                  sx={{ mt: 0.5 }}
                />
              </Grid>

              {/* Client Version */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Client Version
                </Typography>
                <Typography fontWeight={600}>
                  {merchantData?.client_version || "-"}
                </Typography>
              </Grid>

              {/* Callback URL */}
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">
                  Callback URL
                </Typography>
                <Typography fontWeight={500} sx={{ wordBreak: "break-all" }}>
                  {merchantData?.callback_url || "-"}
                </Typography>
              </Grid>

              {/* Client ID */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Client ID
                </Typography>
                <Typography fontWeight={600}>
                  {merchantData?.client_id || "-"}
                </Typography>
              </Grid>

              {/* Client Secret */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Client Secret
                </Typography>
                <Typography fontWeight={600}>••••••••••••••••</Typography>
              </Grid>

              {/* Created At */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Created At
                </Typography>
                <Typography fontWeight={500}>
                  {merchantData?.created_at
                    ? new Date(merchantData.created_at).toLocaleString()
                    : "-"}
                </Typography>
              </Grid>

              {/* Updated At */}
              <Grid item xs={12} md={6}>
                <Typography variant="caption" color="text.secondary">
                  Updated At
                </Typography>
                <Typography fontWeight={500}>
                  {merchantData?.updated_at
                    ? new Date(merchantData.updated_at).toLocaleString()
                    : "-"}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Divider sx={{ mb: 3 }} />

        {/* 🔹 EXISTING SUBSCRIPTIONS TABLE */}
        <Typography fontWeight={600} mb={2}>
          Existing Subscriptions
        </Typography>

        <Paper elevation={0} sx={{ border: "1px solid #eee" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created At</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {subscriptions?.length > 0 ? (
                subscriptions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell>{sub.plan_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={sub.status}
                        size="small"
                        color={sub.status === "ACTIVE" ? "success" : "default"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(sub.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No subscriptions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </Box>
    </>
  );
};

export default SubscriptionDetailsPage;
