import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import * as Sentry from "@sentry/react";
import {
  addSubscriptionPlan,
  getAllSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
} from "../../services/subscription.services";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Fade,
  Slide,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  StoreMallDirectory as MerchantIcon,
  Security as SecurityIcon,
  ContentCopy as CopyIcon,
  CheckCircle as CheckIcon,
  LinkOutlined as LinkIcon,
  Badge as BadgeIcon,
} from "@mui/icons-material";

const PLAN_TYPES = ["TRIAL", "MONTHLY", "QUARTERLY", "YEARLY"];

const PLAN_COLORS = {
  TRIAL: { bg: "#fff8f0", color: "#e65100", border: "#ffcc80" },
  MONTHLY: { bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" },
  QUARTERLY: { bg: "#e3f2fd", color: "#1565c0", border: "#90caf9" },
  YEARLY: { bg: "#f3e5f5", color: "#6a1b9a", border: "#ce93d8" },
};

const emptyForm = {
  plan_name: "",
  plan_type: "TRIAL",
  amount: "",
  duration_days: "",
  billing_cycle_months: 0,
  is_active: true,
};

const FadeIn = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <Fade in={visible} timeout={550}>
      <Box>{children}</Box>
    </Fade>
  );
};

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Tooltip title={copied ? "Copied!" : "Copy"} arrow>
      <IconButton
        size="small"
        onClick={handleCopy}
        sx={{ ml: 0.5, p: 0.4, flexShrink: 0 }}
      >
        {copied ? (
          <CheckIcon sx={{ fontSize: 13, color: "#2e7d32" }} />
        ) : (
          <CopyIcon sx={{ fontSize: 13, color: "#b0bec5" }} />
        )}
      </IconButton>
    </Tooltip>
  );
};

const InfoRow = ({ label, value, copyable, truncate }) => (
  <Box sx={{ mb: 1.8, textAlign: "left" }}>
    <Typography
      variant="caption"
      sx={{
        display: "block",
        color: "#90a4ae",
        fontWeight: 700,
        letterSpacing: 0.7,
        textTransform: "uppercase",
        fontSize: "0.61rem",
        mb: 0.3,
      }}
    >
      {label}
    </Typography>
    <Box display="flex" alignItems="flex-start" justifyContent="flex-start">
      <Typography
        variant="body2"
        fontWeight={500}
        sx={{
          color: "#263238",
          wordBreak: truncate ? "break-all" : "normal",
          fontSize: "0.83rem",
          lineHeight: 1.5,
        }}
      >
        {value || "—"}
      </Typography>
      {copyable && value && <CopyButton value={value} />}
    </Box>
  </Box>
);

const cardSx = {
  borderRadius: 3,
  height: "100%",
  border: "1px solid #e8edf2",
  boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
  transition: "box-shadow 0.25s ease, transform 0.25s ease",
  "&:hover": {
    boxShadow: "0 8px 28px rgba(39,88,111,0.13)",
    transform: "translateY(-3px)",
  },
};

const CardHeader = ({ icon, label, color, borderColor }) => (
  <Box
    display="flex"
    alignItems="center"
    gap={1.2}
    mb={2.5}
    pb={1.5}
    sx={{ borderBottom: `1px solid ${borderColor}` }}
  >
    <Avatar sx={{ bgcolor: `${color}18`, width: 34, height: 34 }}>
      {icon}
    </Avatar>
    <Typography
      variant="subtitle2"
      fontWeight={800}
      color={color}
      letterSpacing={0.3}
    >
      {label}
    </Typography>
  </Box>
);

export default function TestSubscriptionPage() {
  const { merchantId } = useParams();
  const location = useLocation();
  const merchantData = location.state?.merchantData || {};
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ✅ Only TRIAL gets duration & billing cycle
  const isTrial = form.plan_type === "TRIAL";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await getAllSubscriptionPlan(merchantId);
        setPlans(response.data.data || []);
      } catch (error) {
        Sentry.captureException(error);
        setPlans([]);
      } finally {
        setLoading(false);
      }
    };
    if (merchantId) fetchPlans();
  }, [merchantId]);

  const handleOpenAdd = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setDialogOpen(true);
  };
  const handleOpenEdit = (plan) => {
    setForm({
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      amount: plan.amount,
      duration_days: plan.duration_days,
      billing_cycle_months: plan.billing_cycle_months,
      is_active: plan.is_active,
    });
    setIsEditing(true);
    setEditingId(plan.id);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setForm(emptyForm);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    // ✅ When switching plan type away from TRIAL, clear duration & billing
    if (name === "plan_type") {
      setForm((p) => ({
        ...p,
        plan_type: value,
        duration_days: value !== "TRIAL" ? "" : p.duration_days,
        billing_cycle_months: value !== "TRIAL" ? 0 : p.billing_cycle_months,
      }));
      return;
    }

    // ✅ Block duration_days outside 1–15 for TRIAL
    if (name === "duration_days") {
      const num = Number(value);
      if (value !== "" && (num < 1 || num > 15)) return;
    }

    // ✅ Block billing_cycle_months outside 1–28 for TRIAL
    if (name === "billing_cycle_months") {
      const num = Number(value);
      if (value !== "" && (num < 1 || num > 28)) return;
    }

    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await updateSubscriptionPlan({
          subscription_id: editingId,
          merchant_id: Number(merchantId),
          plan_name: form.plan_name,
          plan_type: form.plan_type,
          amount: Number(form.amount),
          duration_days: Number(form.duration_days),
          billing_cycle_months: Number(form.billing_cycle_months),
          is_active: form.is_active,
        });
        const refreshed = await getAllSubscriptionPlan(merchantId);
        setPlans(refreshed.data.data || []);
      } else {
        const response = await addSubscriptionPlan({
          merchant_id: Number(merchantId),
          plan_name: form.plan_name,
          plan_type: form.plan_type,
          amount: Number(form.amount),
          duration_days: Number(form.duration_days),
          billing_cycle_months: Number(form.billing_cycle_months),
          is_active: form.is_active,
        });
        const newPlan = response.data.data || response.data;
        setPlans((p) => [...p, newPlan]);
      }
      handleCloseDialog();
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteSubscriptionPlan(deletingId);
      const refreshed = await getAllSubscriptionPlan(merchantId);
      setPlans(refreshed.data.data || []);
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      console.error("Failed to delete plan:", error);
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      await updateSubscriptionPlan({
        subscription_id: plan.id,
        merchant_id: Number(merchantId),
        plan_name: plan.plan_name,
        plan_type: plan.plan_type,
        amount: Number(plan.amount),
        duration_days: Number(plan.duration_days),
        billing_cycle_months: Number(plan.billing_cycle_months),
        is_active: !plan.is_active,
      });
      const refreshed = await getAllSubscriptionPlan(merchantId);
      setPlans(refreshed.data.data || []);
    } catch (error) {
      Sentry.captureException(error);
    }
  };

  const fmt = (d) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        minHeight: "100vh",
        background: "#f4f6f9",
        backgroundImage: "radial-gradient(#c9d8e3 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ── Page Header ── */}
      <FadeIn delay={0}>
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          mb={3.5}
          px={2.5}
          py={2}
          sx={{
            background: "#fff",
            borderRadius: 3,
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#27586f",
              width: 48,
              height: 48,
              boxShadow: "0 4px 14px rgba(39,88,111,0.3)",
            }}
          >
            <MerchantIcon />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              fontWeight={800}
              color="#1a3d4f"
              lineHeight={1.1}
            >
              {merchantData.name || "Merchant Details"}
            </Typography>
            <Typography variant="caption" color="#90a4ae" fontWeight={500}>
              Merchant ID: {merchantData.merchant_id || merchantId}
            </Typography>
          </Box>
          {merchantData.environment && (
            <Chip
              label={merchantData.environment}
              size="small"
              sx={{
                ml: "auto",
                bgcolor: "#ff6f00",
                color: "#fff",
                fontWeight: 800,
                fontSize: "0.7rem",
                px: 0.5,
                borderRadius: 1.5,
              }}
            />
          )}
        </Box>
      </FadeIn>

      {/* ── 3 Category Cards ── */}
      <Grid container spacing={2.5} mb={4}>
        <Grid item xs={12} md={4}>
          <FadeIn delay={100}>
            <Card sx={cardSx}>
              <CardContent sx={{ textAlign: "left" }}>
                <CardHeader
                  icon={<BadgeIcon sx={{ fontSize: 17, color: "#1565c0" }} />}
                  label="Basic Info"
                  color="#1565c0"
                  borderColor="#e3f2fd"
                />
                <InfoRow label="Merchant Name" value={merchantData.name} />
                <InfoRow
                  label="Merchant ID"
                  value={String(merchantData.merchant_id || "")}
                  copyable
                />
                <InfoRow
                  label="Client Version"
                  value={String(merchantData.client_version || "")}
                />
                <Box sx={{ textAlign: "left", mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      color: "#90a4ae",
                      fontWeight: 700,
                      fontSize: "0.61rem",
                      textTransform: "uppercase",
                      letterSpacing: 0.7,
                      mb: 0.4,
                    }}
                  >
                    Environment
                  </Typography>
                  <Chip
                    label={merchantData.environment || "—"}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      borderRadius: 1,
                      bgcolor:
                        merchantData.environment === "SANDBOX"
                          ? "#fff3e0"
                          : "#e8f5e9",
                      color:
                        merchantData.environment === "SANDBOX"
                          ? "#e65100"
                          : "#2e7d32",
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>

        <Grid item xs={12} md={4}>
          <FadeIn delay={200}>
            <Card
              sx={{
                ...cardSx,
                "&:hover": {
                  ...cardSx["&:hover"],
                  boxShadow: "0 8px 28px rgba(198,40,40,0.11)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "left" }}>
                <CardHeader
                  icon={
                    <SecurityIcon sx={{ fontSize: 17, color: "#c62828" }} />
                  }
                  label="Security Credentials"
                  color="#c62828"
                  borderColor="#fce4ec"
                />
                <InfoRow
                  label="Client ID"
                  value={merchantData.client_id}
                  copyable
                />
                <InfoRow
                  label="Client Secret"
                  value={merchantData.client_secret}
                  copyable
                />
                <Box
                  mt={2}
                  px={1.5}
                  py={1}
                  sx={{
                    background: "#fff8f8",
                    borderRadius: 1.5,
                    border: "1px dashed #ef9a9a",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.68rem",
                      color: "#b71c1c",
                      lineHeight: 1.5,
                    }}
                  >
                    🔒 Keep credentials confidential — never share publicly.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>

        <Grid item xs={12} md={4}>
          <FadeIn delay={300}>
            <Card
              sx={{
                ...cardSx,
                "&:hover": {
                  ...cardSx["&:hover"],
                  boxShadow: "0 8px 28px rgba(46,125,50,0.11)",
                },
              }}
            >
              <CardContent sx={{ textAlign: "left" }}>
                <CardHeader
                  icon={<LinkIcon sx={{ fontSize: 17, color: "#2e7d32" }} />}
                  label="Integration & Dates"
                  color="#2e7d32"
                  borderColor="#e8f5e9"
                />
                <InfoRow
                  label="Callback URL"
                  value={merchantData.callback_url}
                  copyable
                  truncate
                />
                <Grid container spacing={2} mt={0.2}>
                  <Grid item xs={6} sx={{ textAlign: "left" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#90a4ae",
                        fontWeight: 700,
                        fontSize: "0.61rem",
                        textTransform: "uppercase",
                        letterSpacing: 0.7,
                        mb: 0.3,
                      }}
                    >
                      Created
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      fontSize="0.81rem"
                      color="#37474f"
                    >
                      {fmt(merchantData.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ textAlign: "left" }}>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#90a4ae",
                        fontWeight: 700,
                        fontSize: "0.61rem",
                        textTransform: "uppercase",
                        letterSpacing: 0.7,
                        mb: 0.3,
                      }}
                    >
                      Last Updated
                    </Typography>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      fontSize="0.81rem"
                      color="#37474f"
                    >
                      {fmt(merchantData.updatedAt)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </FadeIn>
        </Grid>
      </Grid>

      {/* ── Subscription Plans ── */}
      <FadeIn delay={380}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box>
            <Typography variant="h6" fontWeight={800} color="#1a3d4f">
              Subscription Plans
            </Typography>
            <Typography variant="caption" color="#90a4ae">
              {plans.length} plan{plans.length !== 1 ? "s" : ""} configured
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenAdd}
            sx={{
              bgcolor: "#27586f",
              borderRadius: 2,
              fontWeight: 700,
              textTransform: "none",
              px: 2.5,
              boxShadow: "0 4px 14px rgba(39,88,111,0.28)",
              "&:hover": {
                bgcolor: "#1e4356",
                boxShadow: "0 6px 20px rgba(39,88,111,0.38)",
                transform: "translateY(-1px)",
              },
              transition: "all 0.2s",
            }}
          >
            Add Subscription
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
            overflow: "hidden",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(90deg, #27586f 0%, #3a7d9f 100%)",
                }}
              >
                {[
                  "Plan Name",
                  "Type",
                  "Amount",
                  "Duration",
                  "Billing Cycle",
                  "Status",
                  "Created",
                  "Actions",
                ].map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: "0.75rem",
                      py: 1.8,
                      letterSpacing: 0.4,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                    sx={{ py: 5, color: "#90a4ae" }}
                  >
                    Loading plans...
                  </TableCell>
                </TableRow>
              ) : plans.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 7 }}>
                    <Avatar
                      sx={{
                        bgcolor: "#eceff1",
                        width: 52,
                        height: 52,
                        mx: "auto",
                        mb: 1.5,
                      }}
                    >
                      <AddIcon sx={{ color: "#b0bec5", fontSize: 28 }} />
                    </Avatar>
                    <Typography
                      color="text.secondary"
                      fontSize="0.88rem"
                      mb={1}
                    >
                      No subscription plans yet
                    </Typography>
                    <Button
                      size="small"
                      onClick={handleOpenAdd}
                      sx={{
                        textTransform: "none",
                        color: "#27586f",
                        fontWeight: 600,
                      }}
                    >
                      + Create your first plan
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                plans.map((plan, idx) => {
                  const pc = PLAN_COLORS[plan.plan_type] || PLAN_COLORS.MONTHLY;
                  return (
                    <TableRow
                      key={plan.id}
                      hover
                      sx={{
                        bgcolor: idx % 2 === 0 ? "#fff" : "#fafbfc",
                        "&:hover": { bgcolor: "#f0f6fa" },
                        transition: "background 0.15s",
                      }}
                    >
                      <TableCell
                        sx={{
                          fontWeight: 600,
                          fontSize: "0.84rem",
                          color: "#263238",
                        }}
                      >
                        {plan.plan_name}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={plan.plan_type}
                          size="small"
                          sx={{
                            bgcolor: pc.bg,
                            color: pc.color,
                            border: `1px solid ${pc.border}`,
                            fontWeight: 700,
                            fontSize: "0.68rem",
                            borderRadius: 1,
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#27586f" }}>
                        ₹{plan.amount}
                      </TableCell>
                      <TableCell sx={{ color: "#546e7a" }}>
                        {plan.duration_days}d
                      </TableCell>
                      <TableCell sx={{ color: "#546e7a" }}>
                        {plan.billing_cycle_months} mo.
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={0.8}>
                          <Tooltip
                            title={
                              plan.is_active
                                ? "Click to Deactivate"
                                : "Click to Activate"
                            }
                            arrow
                          >
                            <Switch
                              checked={plan.is_active}
                              onChange={() => handleToggleActive(plan)}
                              color="success"
                              size="small"
                            />
                          </Tooltip>
                          <Chip
                            label={plan.is_active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.63rem",
                              fontWeight: 700,
                              borderRadius: 1,
                              bgcolor: plan.is_active ? "#e8f5e9" : "#f5f5f5",
                              color: plan.is_active ? "#2e7d32" : "#9e9e9e",
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{
                          fontSize: "0.78rem",
                          color: "#78909c",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {fmt(plan.created_at)}
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={0.8}
                          alignItems="center"
                        >
                          <Tooltip title="Edit Plan" arrow>
                            <IconButton
                              size="small"
                              onClick={() => handleOpenEdit(plan)}
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: 1.5,
                                bgcolor: "#e3f2fd",
                                color: "#1565c0",
                                "&:hover": {
                                  bgcolor: "#1565c0",
                                  color: "#fff",
                                },
                                transition: "all 0.18s",
                              }}
                            >
                              <EditIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Plan" arrow>
                            <IconButton
                              size="small"
                              onClick={() => {
                                setDeletingId(plan.id);
                                setDeleteDialogOpen(true);
                              }}
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: 1.5,
                                bgcolor: "#ffebee",
                                color: "#c62828",
                                "&:hover": {
                                  bgcolor: "#c62828",
                                  color: "#fff",
                                },
                                transition: "all 0.18s",
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </FadeIn>

      {/* ── Add / Edit Dialog ── */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: "up" }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(90deg, #27586f, #3a7d9f)",
            color: "#fff",
            fontWeight: 700,
            py: 2,
          }}
        >
          {isEditing ? "Edit Subscription Plan" : "➕  New Subscription Plan"}
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Box display="flex" flexDirection="column" gap={2.5} mt={2}>
            <TextField
              label="Plan Name"
              name="plan_name"
              value={form.plan_name}
              onChange={handleFormChange}
              fullWidth
              required
              size="small"
            />

            <TextField
              label="Plan Type"
              name="plan_type"
              value={form.plan_type}
              onChange={handleFormChange}
              select
              fullWidth
              required
              size="small"
            >
              {PLAN_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Amount (₹)"
                  name="amount"
                  value={form.amount}
                  onChange={handleFormChange}
                  type="number"
                  fullWidth
                  required
                  size="small"
                />
              </Grid>

              {/* ✅ Duration — enabled ONLY for TRIAL, range 1–15 */}
              <Grid item xs={6}>
                <Tooltip
                  title={
                    !isTrial
                      ? "Only available for TRIAL plan type"
                      : "Enter between 1–15 days"
                  }
                  arrow
                >
                  <span>
                    <TextField
                      label="Duration (days)"
                      name="duration_days"
                      value={isTrial ? form.duration_days : ""}
                      onChange={handleFormChange}
                      type="number"
                      fullWidth
                      required={isTrial}
                      size="small"
                      disabled={!isTrial}
                      slotProps={{ min: 1, max: 15 }}
                      helperText={
                        isTrial ? "Range: 1–15 days" : "Only for TRIAL"
                      }
                      sx={{
                        "& .MuiInputBase-root.Mui-disabled": {
                          bgcolor: "#f5f5f5",
                        },
                        "& .MuiFormHelperText-root": {
                          color: isTrial ? "#27586f" : "#bdbdbd",
                          fontSize: "0.65rem",
                        },
                      }}
                    />
                  </span>
                </Tooltip>
              </Grid>
            </Grid>

            {/* ✅ Billing Cycle — enabled ONLY for TRIAL, range 1–28 */}
            <Tooltip
              title={
                isTrial
                  ? "Only available for SUBSCRIPTION plan type"
                  : "Enter between 1–28 months"
              }
              arrow
            >
              <span>
                <TextField
                  label="Billing Cycle (months)"
                  name="billing_cycle_months"
                  value={isTrial ? form.billing_cycle_months : ""}
                  onChange={handleFormChange}
                  type="number"
                  fullWidth
                  size="small"
                  disabled={isTrial}
                  slotProps={{
                    input: {
                      inputProps: {
                        min: 1,
                        max: 28,
                      },
                    },
                  }}
                  helperText={
                    !isTrial ? "Range: 1–28 months" : "Only for SUBSCRIPTION"
                  }
                  sx={{
                    "& .MuiInputBase-root.Mui-disabled": { bgcolor: "#f5f5f5" },
                    "& .MuiFormHelperText-root": {
                      color: isTrial ? "#27586f" : "#bdbdbd",
                      fontSize: "0.65rem",
                    },
                  }}
                />
              </span>
            </Tooltip>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              px={2}
              py={1.2}
              sx={{
                borderRadius: 2,
                border: "1px solid #e0e7ef",
                bgcolor: form.is_active ? "#f1f8e9" : "#fafafa",
                transition: "background 0.2s",
              }}
            >
              <Typography
                variant="body2"
                fontWeight={600}
                color={form.is_active ? "#2e7d32" : "#9e9e9e"}
              >
                {form.is_active ? "✅ Plan Active" : "⏸ Plan Inactive"}
              </Typography>
              <Switch
                name="is_active"
                checked={form.is_active}
                onChange={handleFormChange}
                color="success"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#27586f",
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 700,
              px: 3,
              "&:hover": { bgcolor: "#1e4356" },
            }}
          >
            {isEditing ? "Save Changes" : "Create Plan"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── Delete Confirm Dialog ── */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#c62828" }}>
          🗑 Delete Plan
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary" fontSize="0.9rem">
            Are you sure? This action <strong>cannot be undone</strong>.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            variant="outlined"
            color="inherit"
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
