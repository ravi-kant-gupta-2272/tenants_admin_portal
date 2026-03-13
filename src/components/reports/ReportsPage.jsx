import { useState, useEffect, useMemo } from "react";
import * as Sentry from "@sentry/react";
import Chart from "react-apexcharts";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Fade,
} from "@mui/material";
import {
  TrendingUp,
  People,
  Subscriptions,
  CheckCircle,
  FileDownload,
  Assessment,
  EventNote,
} from "@mui/icons-material";
// import { getAllMerchants } from "../../services/merchant.services";
import { getAllMerchants } from "../../services/merchant.service";
import { getAllSubscriptionPlan } from "../../services/subscription.services";

// ─── Helpers ──────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const getDaysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
};

const filterByDays = (items, days, dateKey = "created_at") => {
  if (!days) return items;
  const cutoff = getDaysAgo(days);
  return items.filter((i) => new Date(i[dateKey]) >= cutoff);
};

// ─── Stat Card ────────────────────────────────────────────────
const StatCard = ({ label, value, icon, color, bg, sub }) => (
  <Card
    sx={{
      borderRadius: 3,
      border: "1px solid #e8edf2",
      height: "100%",
      boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
      transition: "transform 0.22s, box-shadow 0.22s",
      "&:hover": {
        transform: "translateY(-3px)",
        boxShadow: "0 8px 24px rgba(39,88,111,0.13)",
      },
    }}
  >
    <CardContent>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#90a4ae",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.62rem",
              letterSpacing: 0.7,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            color={color}
            lineHeight={1}
          >
            {value}
          </Typography>
          {sub && (
            <Typography
              variant="caption"
              color="#90a4ae"
              mt={0.5}
              display="block"
            >
              {sub}
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: bg, width: 50, height: 50 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

// ─── Export CSV ───────────────────────────────────────────────
const exportToCSV = (rows, filename) => {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]).join(",");
  const body = rows.map((r) => Object.values(r).join(",")).join("\n");
  const blob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ─── Main Component ───────────────────────────────────────────
export default function ReportsPage() {
  const [merchants, setMerchants] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dayFilter, setDayFilter] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const mRes = await getAllMerchants(100, 0);
        const mList = mRes.data.data || [];
        setMerchants(mList);

        const planResults = await Promise.all(
          mList.map((m) =>
            getAllSubscriptionPlan(m.id)
              .then((r) =>
                (r.data.data || []).map((p) => ({
                  ...p,
                  merchantName: m.name,
                })),
              )
              .catch(() => []),
          ),
        );
        setAllPlans(planResults.flat());
      } catch (error) {
        Sentry.captureException(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ── Filtered data by time window ──────────────────────────
  const filteredPlans = useMemo(
    () => filterByDays(allPlans, dayFilter),
    [allPlans, dayFilter],
  );
  // const filteredMerchants = useMemo(
  //   () => filterByDays(merchants, dayFilter),
  //   [merchants, dayFilter],
  // );

  // ── Stats ─────────────────────────────────────────────────
  const totalMerchants = merchants.length;
  const activeMerchants = merchants.filter((m) => {
    const plans = allPlans.filter((p) => p.merchant_id === m.id);
    return plans.some((p) => p.is_active);
  }).length;
  const totalPlans = filteredPlans.length;
  const activePlans = filteredPlans.filter((p) => p.is_active).length;
  const inactivePlans = filteredPlans.filter((p) => !p.is_active).length;

  // ── Revenue per merchant (sum of amounts) ─────────────────
  const revenueByMerchant = merchants.map((m) => ({
    name: m.name,
    revenue: filteredPlans
      .filter((p) => p.merchant_id === m.id && p.is_active)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0),
    plans: filteredPlans.filter((p) => p.merchant_id === m.id).length,
  }));

  // ── Plans by type ─────────────────────────────────────────
  const planTypes = ["TRIAL", "MONTHLY", "QUARTERLY", "YEARLY"];
  const planTypeCounts = planTypes.map(
    (t) => filteredPlans.filter((p) => p.plan_type === t).length,
  );

  // ── Merchant growth — joined by day (last N days) ────────
  const growthDays = Array.from({ length: dayFilter }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (dayFilter - 1 - i));
    return d.toISOString().split("T")[0];
  });
  const merchantGrowth = growthDays.map(
    (day) => merchants.filter((m) => m.created_at?.startsWith(day)).length,
  );
  const planGrowth = growthDays.map(
    (day) => allPlans.filter((p) => p.created_at?.startsWith(day)).length,
  );

  // ── Chart configs ──────────────────────────────────────────
  const revenueChart = {
    series: [
      {
        name: "Active Plan Revenue (₹)",
        data: revenueByMerchant.map((r) => r.revenue),
      },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#27586f"],
      xaxis: {
        categories: revenueByMerchant.map((r) => r.name),
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      plotOptions: { bar: { borderRadius: 5, columnWidth: "50%" } },
      dataLabels: { enabled: false },
      yaxis: { labels: { formatter: (v) => `₹${v}` } },
      tooltip: { y: { formatter: (v) => `₹${v}` } },
      title: {
        text: "Revenue per Merchant (Active Plans)",
        style: { color: "#1a3d4f", fontWeight: 700, fontSize: "14px" },
      },
    },
  };

  const planTypeChart = {
    series: [{ name: "Plans", data: planTypeCounts }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#3a7d9f"],
      xaxis: { categories: planTypes },
      plotOptions: { bar: { borderRadius: 5, columnWidth: "50%" } },
      dataLabels: {
        enabled: true,
        style: { fontSize: "12px", colors: ["#fff"] },
      },
      title: {
        text: "Plans Created by Type",
        style: { color: "#1a3d4f", fontWeight: 700, fontSize: "14px" },
      },
    },
  };

  const activeInactiveChart = {
    series: [
      {
        name: "Active",
        data: revenueByMerchant.map(
          (r) =>
            filteredPlans.filter(
              (p) =>
                p.merchant_id ===
                  merchants.find((m) => m.name === r.name)?.id && p.is_active,
            ).length,
        ),
      },
      {
        name: "Inactive",
        data: revenueByMerchant.map(
          (r) =>
            filteredPlans.filter(
              (p) =>
                p.merchant_id ===
                  merchants.find((m) => m.name === r.name)?.id && !p.is_active,
            ).length,
        ),
      },
    ],
    options: {
      chart: { type: "bar", stacked: true, toolbar: { show: false } },
      colors: ["#2e7d32", "#e53935"],
      xaxis: {
        categories: revenueByMerchant.map((r) => r.name),
        labels: { rotate: -30, style: { fontSize: "11px" } },
      },
      plotOptions: { bar: { borderRadius: 3, columnWidth: "50%" } },
      dataLabels: { enabled: false },
      legend: { position: "top" },
      title: {
        text: "Active vs Inactive Plans per Merchant",
        style: { color: "#1a3d4f", fontWeight: 700, fontSize: "14px" },
      },
    },
  };

  const growthChart = {
    series: [
      { name: "New Merchants", data: merchantGrowth },
      { name: "New Plans", data: planGrowth },
    ],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#27586f", "#ff6f00"],
      xaxis: {
        categories: growthDays.map((d) =>
          new Date(d).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
          }),
        ),
        labels: { style: { fontSize: "10px" } },
      },
      plotOptions: { bar: { borderRadius: 3, columnWidth: "60%" } },
      dataLabels: { enabled: false },
      legend: { position: "top" },
      title: {
        text: `Merchant & Plan Growth — Last ${dayFilter} Days`,
        style: { color: "#1a3d4f", fontWeight: 700, fontSize: "14px" },
      },
    },
  };

  // ── Table rows for export ──────────────────────────────────
  const tableRows = filteredPlans.map((p) => ({
    Merchant: p.merchantName || "—",
    "Plan Name": p.plan_name,
    Type: p.plan_type,
    "Amount (₹)": p.amount,
    "Duration (days)": p.duration_days,
    "Billing (mo.)": p.billing_cycle_months,
    Status: p.is_active ? "Active" : "Inactive",
    Created: fmt(p.created_at),
  }));

  const PLAN_COLORS = {
    TRIAL: { bg: "#fff8f0", color: "#e65100" },
    MONTHLY: { bg: "#e8f5e9", color: "#2e7d32" },
    QUARTERLY: { bg: "#e3f2fd", color: "#1565c0" },
    YEARLY: { bg: "#f3e5f5", color: "#6a1b9a" },
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
        flexDirection="column"
        gap={2}
      >
        <CircularProgress sx={{ color: "#27586f" }} />
        <Typography color="#90a4ae">Loading reports...</Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          p: { xs: 2, md: 3 },
          minHeight: "100vh",
          background: "#f4f6f9",
          backgroundImage: "radial-gradient(#c9d8e3 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* ── Header ──────────────────────────────────── */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          px={2.5}
          py={2}
          sx={{
            background: "#fff",
            borderRadius: 3,
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ bgcolor: "#27586f", width: 44, height: 44 }}>
              <Assessment />
            </Avatar>
            <Box sx={{ pr: 100 }}>
              <Typography
                variant="h5"
                fontWeight={800}
                color="#1a3d4f"
                lineHeight={1.1}
              >
                Reports
              </Typography>
              <Typography variant="caption" color="#90a4ae">
                Analytics across all merchants & plans
              </Typography>
            </Box>
          </Box>

          {/* ── Time Filter ── */}
          <Box display="flex" alignItems="center" gap={1}>
            <EventNote sx={{ color: "#90a4ae", fontSize: 18 }} />
            <Typography variant="caption" color="#90a4ae" fontWeight={600}>
              Last:
            </Typography>
            <ToggleButtonGroup
              value={dayFilter}
              exclusive
              onChange={(_, v) => v && setDayFilter(v)}
              size="small"
            >
              {[7, 30, 90].map((d) => (
                <ToggleButton
                  key={d}
                  value={d}
                  sx={{
                    px: 1.5,
                    py: 0.4,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    "&.Mui-selected": {
                      bgcolor: "#27586f",
                      color: "#fff",
                      "&:hover": { bgcolor: "#1e4356" },
                    },
                  }}
                >
                  {d}d
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* ── Stat Cards ──────────────────────────────── */}
        <Grid container spacing={2.5} mb={3.5}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Merchants"
              value={totalMerchants}
              color="#27586f"
              bg="#e3f2fd"
              icon={<People sx={{ color: "#27586f", fontSize: 24 }} />}
              sub={`${activeMerchants} with active plans`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Active Merchants"
              value={activeMerchants}
              color="#2e7d32"
              bg="#e8f5e9"
              icon={<CheckCircle sx={{ color: "#2e7d32", fontSize: 24 }} />}
              sub={`${totalMerchants - activeMerchants} inactive`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label={`Plans (last ${dayFilter}d)`}
              value={totalPlans}
              color="#6a1b9a"
              bg="#f3e5f5"
              icon={<Subscriptions sx={{ color: "#6a1b9a", fontSize: 24 }} />}
              sub={`${activePlans} active · ${inactivePlans} inactive`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              label="Total Revenue (Active)"
              value={`₹${revenueByMerchant.reduce((s, r) => s + r.revenue, 0).toLocaleString()}`}
              color="#e65100"
              bg="#fff3e0"
              icon={<TrendingUp sx={{ color: "#e65100", fontSize: 24 }} />}
              sub="Sum of active plan amounts"
            />
          </Grid>
        </Grid>

        {/* ── Charts Row 1 ────────────────────────────── */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf2",
                p: 2,
                boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
              }}
            >
              <Chart
                options={revenueChart.options}
                series={revenueChart.series}
                type="bar"
                height={280}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf2",
                p: 2,
                boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
              }}
            >
              <Chart
                options={planTypeChart.options}
                series={planTypeChart.series}
                type="bar"
                height={280}
              />
            </Card>
          </Grid>
        </Grid>

        {/* ── Charts Row 2 ────────────────────────────── */}
        <Grid container spacing={2.5} mb={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf2",
                p: 2,
                boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
              }}
            >
              <Chart
                options={activeInactiveChart.options}
                series={activeInactiveChart.series}
                type="bar"
                height={280}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf2",
                p: 2,
                boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
              }}
            >
              <Chart
                options={growthChart.options}
                series={growthChart.series}
                type="bar"
                height={280}
              />
            </Card>
          </Grid>
        </Grid>

        {/* ── Data Table with Export ───────────────────── */}
        <Card
          sx={{
            borderRadius: 3,
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
            overflow: "hidden",
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={3}
            py={2}
            sx={{ borderBottom: "1px solid #e8edf2", background: "#fafbfc" }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={800} color="#1a3d4f">
                All Subscription Plans
              </Typography>
              <Typography variant="caption" color="#90a4ae">
                {filteredPlans.length} plans in last {dayFilter} days
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<FileDownload />}
              onClick={() =>
                exportToCSV(tableRows, `subscription-plans-last-${dayFilter}d`)
              }
              sx={{
                bgcolor: "#27586f",
                textTransform: "none",
                borderRadius: 2,
                fontWeight: 700,
                fontSize: "0.8rem",
                boxShadow: "0 4px 12px rgba(39,88,111,0.25)",
                "&:hover": { bgcolor: "#1e4356" },
              }}
            >
              Export CSV
            </Button>
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(90deg, #27586f 0%, #3a7d9f 100%)",
                  }}
                >
                  {[
                    "Merchant",
                    "Plan Name",
                    "Type",
                    "Amount",
                    "Duration",
                    "Billing Cycle",
                    "Status",
                    "Created",
                  ].map((col) => (
                    <TableCell
                      key={col}
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.73rem",
                        py: 1.5,
                        letterSpacing: 0.3,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPlans.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      align="center"
                      sx={{ py: 5, color: "#90a4ae" }}
                    >
                      No plans found in last {dayFilter} days
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPlans.map((plan, idx) => {
                    const pc = PLAN_COLORS[plan.plan_type] || {
                      bg: "#f5f5f5",
                      color: "#555",
                    };
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
                            fontSize: "0.82rem",
                            color: "#263238",
                          }}
                        >
                          {plan.merchantName}
                        </TableCell>
                        <TableCell sx={{ fontSize: "0.82rem" }}>
                          {plan.plan_name}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={plan.plan_type}
                            size="small"
                            sx={{
                              bgcolor: pc.bg,
                              color: pc.color,
                              fontWeight: 700,
                              fontSize: "0.65rem",
                              borderRadius: 1,
                              height: 20,
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
                          <Chip
                            label={plan.is_active ? "Active" : "Inactive"}
                            size="small"
                            sx={{
                              height: 20,
                              fontSize: "0.63rem",
                              fontWeight: 700,
                              borderRadius: 1,
                              bgcolor: plan.is_active ? "#e8f5e9" : "#ffebee",
                              color: plan.is_active ? "#2e7d32" : "#c62828",
                            }}
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            fontSize: "0.75rem",
                            color: "#78909c",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {fmt(plan.created_at)}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </Box>
    </Fade>
  );
}
