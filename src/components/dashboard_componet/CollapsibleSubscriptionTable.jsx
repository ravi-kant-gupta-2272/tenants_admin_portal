import { useState } from "react";
import PropTypes from "prop-types";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Grid,
  Pagination,
} from "@mui/material";

import { useMerchants } from "./hooks/useMerchants";

import ManageSubsctionAction from "./ManageSubsctionAction";

/* ================= ROW COMPONENT ================= */

function Row({ row }) {
  return (
    <>
      {/* Main Row */}
      <TableRow
        sx={{
          "& > *": { borderBottom: "unset" },
          "&:hover": {
            backgroundColor: "#f9fafb",
            transition: "0.2s",
          },
        }}
      >
        <TableCell>{/* empty space to manage cell spacing */}</TableCell>

        <TableCell component="th" scope="row">
          <Typography fontWeight={500}>{row.name}</Typography>
        </TableCell>

        <TableCell align="right">{row.merchant_id}</TableCell>

        <TableCell align="right">
          <Chip
            label={row.environment}
            color={row.environment === "PRODUCTION" ? "success" : "warning"}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </TableCell>

        <TableCell align="right">{row.client_version}</TableCell>

        <TableCell align="right">
          <ManageSubsctionAction merchantData={row} />
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.object.isRequired,
};

/* ================= MAIN TABLE ================= */

export default function CollapsibleSubscriptionTable() {
  const [page, setPage] = useState(1);
  const limit = 2;

  const { data, isFetching } = useMerchants(page, limit);

  const merchants = data?.data?.data || [];
  const total = data?.data?.count || 0;
  const totalPages = Math.ceil(total / limit);
  const emptyRows = limit - merchants.length;

  if (!isFetching && merchants.length === 0) {
    return (
      <TableContainer component={Paper}>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No merchant data available
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <TableContainer
      component={Paper}
      sx={{
        height: 420,
        overflowY: "auto",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        // borderRadius: 3,
        // boxShadow: 1,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: "#f3f4f6",
              "& th": {
                fontWeight: 600,
                fontSize: "0.875rem",
              },
            }}
          >
            <TableCell />
            <TableCell>PhonePe Merchant</TableCell>
            <TableCell align="right">Merchant ID</TableCell>
            <TableCell align="right">Environment</TableCell>
            <TableCell align="right">Client Version</TableCell>
            <TableCell align="center">Manage Subscription</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {merchants.map((row) => (
            <Row key={row.id} row={row} />
          ))}

          {emptyRows > 0 &&
            Array.from(new Array(emptyRows)).map((_, index) => (
              <TableRow key={`empty-${index}`} sx={{ height: 73 }}>
                <TableCell colSpan={6} />
              </TableRow>
            ))}
        </TableBody>
      </Table>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 2,
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "#fff",
        }}
      >
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          shape="rounded"
        />
      </Box>
    </TableContainer>
  );
}
