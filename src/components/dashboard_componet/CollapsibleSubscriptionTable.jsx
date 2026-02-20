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
  // const [open, setOpen] = useState(false);

  // const formatDate = (dateString) => new Date(dateString).toLocaleString();
  // const label = { slotProps: { input: { "aria-label": "Checkbox demo" } } };

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

// import { useState } from "react";
// import PropTypes from "prop-types";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import Tooltip from "@mui/material/Tooltip";
// import {
//   Box,
//   Collapse,
//   IconButton,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Typography,
//   Paper,
//   Chip,
//   Grid,
//   Pagination,
// } from "@mui/material";
// import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
// import MerchantAction from "./MerchantAction";
// import { useMerchants } from "./hooks/useMerchants";

// /* ================= ROW COMPONENT ================= */

// function Row({ row }) {
//   const [open, setOpen] = useState(false);

//   const formatDate = (dateString) => new Date(dateString).toLocaleString();

//   return (
//     <>
//       {/* Main Row */}
//       <TableRow
//         sx={{
//           "& > *": { borderBottom: "unset" },
//           "&:hover": {
//             backgroundColor: "#f9fafb",
//             transition: "0.2s",
//           },
//         }}
//       >
//         <TableCell>
//           <IconButton
//             size="small"
//             onClick={() => setOpen(!open)}
//             sx={{
//               transition: "0.3s",
//               transform: open ? "rotate(180deg)" : "rotate(0deg)",
//             }}
//           >
//             <KeyboardArrowDownIcon />
//           </IconButton>
//         </TableCell>

//         <TableCell component="th" scope="row">
//           <Typography fontWeight={500}>{row.name}</Typography>
//         </TableCell>

//         <TableCell align="right">{row.merchant_id}</TableCell>

//         <TableCell align="right">
//           <Chip
//             label={row.environment}
//             color={row.environment === "PRODUCTION" ? "success" : "warning"}
//             size="small"
//             sx={{ fontWeight: 600 }}
//           />
//         </TableCell>

//         <TableCell align="right">{row.client_version}</TableCell>

//         <TableCell align="right">
//           <MerchantAction merchantData={row} />
//         </TableCell>
//       </TableRow>

//       {/* Collapsible Section */}
//       <TableRow>
//         <TableCell colSpan={6} sx={{ p: 0 }}>
//           <Collapse in={open} timeout={400} unmountOnExit>
//             <Box
//               sx={{
//                 p: 2,
//                 backgroundColor: "#f4f6f8",
//                 borderTop: "1px solid #e5e7eb",
//               }}
//             >
//               <Box
//                 sx={{
//                   backgroundColor: "#ffffff",
//                   borderRadius: 3,
//                   boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
//                   borderLeft: "4px solid #1976d2", // 🔵 Accent border
//                   overflow: "hidden",
//                   transition: "all 0.3s ease",
//                 }}
//               >
//                 {/* Header */}
//                 <Box
//                   sx={{
//                     px: 4,
//                     py: 3,
//                     borderBottom: "1px solid #f1f5f9",
//                     backgroundColor: "#fafafa",
//                   }}
//                 >
//                   <Typography variant="h6" sx={{ fontWeight: 600 }}>
//                     Configuration Details
//                   </Typography>
//                 </Box>

//                 {/* Content */}
//                 <Grid container>
//                   {[
//                     { label: "Callback URL", value: row.callback_url },
//                     { label: "Webhook Username", value: row.webhook_username },
//                     {
//                       label: "Webhook Password",
//                       value: "*".repeat(row.webhook_password?.length || 0),
//                     },
//                     { label: "Client ID", value: row.client_id },
//                     {
//                       label: "Client Secret",
//                       value: "*".repeat(row.client_secret?.length || 0),
//                     },
//                     { label: "Created By", value: row.created_by },
//                     {
//                       label: "Created At",
//                       value: formatDate(row.createdAt),
//                     },
//                     {
//                       label: "Updated At",
//                       value: formatDate(row.updatedAt),
//                     },
//                   ].map((item, index) => (
//                     <Grid
//                       item
//                       xs={12}
//                       md={6}
//                       key={index}
//                       sx={{
//                         p: 3,
//                         borderBottom: index < 6 ? "1px solid #f1f5f9" : "none",
//                         borderRight:
//                           index % 2 === 0 ? "1px solid #f1f5f9" : "none",
//                         transition: "background 0.2s",
//                         "&:hover": {
//                           backgroundColor: "#f9fafb", // subtle hover
//                         },
//                       }}
//                     >
//                       <Typography
//                         variant="caption"
//                         sx={{
//                           color: "text.secondary",
//                           fontWeight: 600,
//                           letterSpacing: 0.5,
//                         }}
//                       >
//                         {item.label}
//                       </Typography>

//                       <Box
//                         sx={{
//                           mt: 1,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "space-between",
//                         }}
//                       >
//                         <Typography
//                           variant="body1"
//                           sx={{
//                             fontWeight: 500,
//                             wordBreak: "break-word",
//                           }}
//                         >
//                           {item.value || "-"}
//                         </Typography>

//                         {/* Copy Button */}
//                         {item.value && (
//                           <Tooltip title="Copy">
//                             <ContentCopyIcon
//                               fontSize="small"
//                               sx={{
//                                 cursor: "pointer",
//                                 color: "#94a3b8",
//                                 "&:hover": {
//                                   color: "#1976d2",
//                                 },
//                               }}
//                               onClick={() =>
//                                 navigator.clipboard.writeText(item.value)
//                               }
//                             />
//                           </Tooltip>
//                         )}
//                       </Box>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// Row.propTypes = {
//   row: PropTypes.object.isRequired,
// };

// /* ================= MAIN TABLE ================= */

// export default function CollapsibleSubscriptionTable() {
//   const [page, setPage] = useState(1);
//   const limit = 2;

//   const { data, isFetching } = useMerchants(page, limit);

//   const merchants = data?.data?.data || [];
//   const total = data?.data?.count || 0;
//   const totalPages = Math.ceil(total / limit);
//   const emptyRows = limit - merchants.length;

//   if (!isFetching && merchants.length === 0) {
//     return (
//       <TableContainer component={Paper}>
//         <Box sx={{ p: 4, textAlign: "center" }}>
//           <Typography variant="body1" color="text.secondary">
//             No merchant data available
//           </Typography>
//         </Box>
//       </TableContainer>
//     );
//   }

//   return (
//     <TableContainer
//       component={Paper}
//       sx={{
//         height: 420,
//         overflowY: "auto",
//         borderRadius: 3,
//         boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
//         // borderRadius: 3,
//         // boxShadow: 1,
//       }}
//     >
//       <Table stickyHeader>
//         <TableHead>
//           <TableRow
//             sx={{
//               backgroundColor: "#f3f4f6",
//               "& th": {
//                 fontWeight: 600,
//                 fontSize: "0.875rem",
//               },
//             }}
//           >
//             <TableCell />
//             <TableCell>PhonePe Merchant</TableCell>
//             <TableCell align="right">Merchant ID</TableCell>
//             <TableCell align="right">Environment</TableCell>
//             <TableCell align="right">Client Version</TableCell>
//             <TableCell align="center">Action</TableCell>
//           </TableRow>
//         </TableHead>

//         <TableBody>
//           {merchants.map((row) => (
//             <Row key={row.id} row={row} />
//           ))}

//           {emptyRows > 0 &&
//             Array.from(new Array(emptyRows)).map((_, index) => (
//               <TableRow key={`empty-${index}`} sx={{ height: 73 }}>
//                 <TableCell colSpan={6} />
//               </TableRow>
//             ))}
//         </TableBody>
//       </Table>

//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           py: 2,
//           borderTop: "1px solid #e5e7eb",
//           backgroundColor: "#fff",
//         }}
//       >
//         <Pagination
//           count={totalPages}
//           page={page}
//           onChange={(e, value) => setPage(value)}
//           color="primary"
//           shape="rounded"
//         />
//       </Box>
//     </TableContainer>
//   );
// }
