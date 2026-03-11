// DashboardContent.jsx
import { useState, useEffect } from "react";
import React from "react";
import Chart from "react-apexcharts";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  People,
  Subscriptions,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
//import { getAllMerchants } from "../../services/merchant.services";
import { getAllMerchants } from "../../services/dashboard.service";
import { getAllSubscriptionPlan } from "../../services/subscription.services";

export default function DashboardContent() {
  const [merchants, setMerchants] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ✅ Fetch all merchants — using large limit to get all
        const merchantRes = await getAllMerchants(100, 0);
        const merchantList = merchantRes.data.data || [];
        setMerchants(merchantList);

        // ✅ Fetch plans for ALL merchants in parallel
        const planPromises = merchantList.map(
          (m) =>
            getAllSubscriptionPlan(m.id)
              .then((res) => res.data.data || [])
              .catch(() => []), // if one fails, don't break the whole dashboard
        );
        const planResults = await Promise.all(planPromises);
        setAllPlans(planResults.flat());
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ── Derived stats ──────────────────────────────────────────
  const totalMerchants = merchants.length;
  const totalPlans = allPlans.length;
  const activePlans = allPlans.filter((p) => p.is_active).length;
  const inactivePlans = allPlans.filter((p) => !p.is_active).length;

  // Plans per type
  const planTypes = ["TRIAL", "MONTHLY", "QUARTERLY", "YEARLY"];
  const planTypeCounts = planTypes.map(
    (type) => allPlans.filter((p) => p.plan_type === type).length,
  );

  // Plans per merchant
  const merchantNames = merchants.map((m) => m.name);
  const plansPerMerchant = merchants.map(
    (m) => allPlans.filter((p) => p.merchant_id === m.id).length,
  );

  // ── Chart configs ──────────────────────────────────────────
  const planTypeChart = {
    series: [{ name: "Plans", data: planTypeCounts }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#27586f"],
      xaxis: { categories: planTypes },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
      dataLabels: { enabled: false },
      title: {
        text: "Plans by Type",
        style: { color: "#1a3d4f", fontWeight: 700 },
      },
    },
  };

  const merchantPlanChart = {
    series: [{ name: "Plans", data: plansPerMerchant }],
    options: {
      chart: { type: "bar", toolbar: { show: false } },
      colors: ["#3a7d9f"],
      xaxis: {
        categories: merchantNames,
        labels: { rotate: -35, style: { fontSize: "11px" } },
      },
      plotOptions: { bar: { borderRadius: 6, columnWidth: "50%" } },
      dataLabels: { enabled: false },
      title: {
        text: "Plans per Merchant",
        style: { color: "#1a3d4f", fontWeight: 700 },
      },
    },
  };

  const donutChart = {
    series: [activePlans, inactivePlans],
    options: {
      chart: { type: "donut" },
      labels: ["Active", "Inactive"],
      colors: ["#2e7d32", "#e53935"],
      legend: { position: "bottom" },
      title: {
        text: "Plan Status",
        style: { color: "#1a3d4f", fontWeight: 700 },
      },
    },
  };

  const statCards = [
    {
      label: "Total Merchants",
      value: totalMerchants,
      icon: <People />,
      color: "#27586f",
      bg: "#e3f2fd",
    },
    {
      label: "Total Plans",
      value: totalPlans,
      icon: <Subscriptions />,
      color: "#6a1b9a",
      bg: "#f3e5f5",
    },
    {
      label: "Active Plans",
      value: activePlans,
      icon: <CheckCircle />,
      color: "#2e7d32",
      bg: "#e8f5e9",
    },
    {
      label: "Inactive Plans",
      value: inactivePlans,
      icon: <Cancel />,
      color: "#c62828",
      bg: "#ffebee",
    },
  ];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress sx={{ color: "#27586f" }} />
        <Typography ml={2} color="#90a4ae">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 3,
        minHeight: "100vh",
        background: "#f4f6f9",
        backgroundImage: "radial-gradient(#c9d8e3 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* ── Stat Cards ────────────────────────────── */}
      <Grid container spacing={2.5} mb={4}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.label}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf2",
                boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0 8px 24px rgba(39,88,111,0.12)",
                },
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#90a4ae",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        fontSize: "0.65rem",
                        letterSpacing: 0.6,
                        display: "block",
                        mb: 0.5,
                      }}
                    >
                      {card.label}
                    </Typography>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      color={card.color}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: card.bg, width: 52, height: 52 }}>
                    {React.cloneElement(card.icon, {
                      sx: { color: card.color, fontSize: 26 },
                    })}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ── Charts Row 1 ──────────────────────────── */}
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
              options={planTypeChart.options}
              series={planTypeChart.series}
              type="bar"
              height={300}
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
              options={donutChart.options}
              series={donutChart.series}
              type="donut"
              height={300}
            />
          </Card>
        </Grid>
      </Grid>

      {/* ── Charts Row 2 ──────────────────────────── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid #e8edf2",
              p: 2,
              boxShadow: "0 2px 10px rgba(39,88,111,0.06)",
            }}
          >
            <Chart
              options={merchantPlanChart.options}
              series={merchantPlanChart.series}
              type="bar"
              height={320}
            />
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
