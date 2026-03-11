import React, { useState } from "react";
import AddMerchantForm from "./AddMerchantForm";
import CollapsibleTable from "./Collapsibletable";
import { Box, Container, Button, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";
import ClearIcon from "@mui/icons-material/Clear";

export default function MerchantDashboard() {
  const [formDialog, setFormDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpen = () => setFormDialog(true);
  const handleClose = () => setFormDialog(false);

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Container maxWidth={false} sx={{ px: 3, py: 2 }}>
        <Box
          sx={{
            width: "100%",
            bgcolor: "#1e5a6e",
            borderRadius: 2,
            boxShadow: 2,
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-evenly",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="contained"
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "white",
              color: "#1e5a6e",
              "&:hover": { bgcolor: "#f0f0f0" },
              textTransform: "none",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Add Merchant
          </Button>

          <TextField
            placeholder="Search Merchant by Name, ID or Enviornment"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              flex: 1,
              maxWidth: 500,
              "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } },
            }}
            InputProps={{
              endAdornment: searchQuery ? (
                <IconButton size="small" onClick={() => setSearchQuery("")}>
                  <ClearIcon sx={{ fontSize: 16, color: "#666" }} />
                </IconButton>
              ) : (
                <SearchIcon sx={{ color: "#666" }} />
              ),
            }}
          />

          <IconButton
            onClick={() => {
              setSearchQuery("");
              setRefreshKey((k) => k + 1);
            }}
            sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f0f0f0" } }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Container>

      <AddMerchantForm open={formDialog} onClose={handleClose} />
      <CollapsibleTable searchQuery={searchQuery} refreshKey={refreshKey} />
    </Box>
  );
}

// import React, { useState } from "react";
// import AddMerchantForm from "./AddMerchantForm";
// import CollapsibleTable from "./Collapsibletable";
// import { Box, Container, Button, TextField, IconButton } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";
// import ClearIcon from "@mui/icons-material/Clear"; // ✅ add this

// export default function MerchantDashboard() {
//   const [formDialog, setFormDialog] = useState(false);
//   const [searchQuery, setSearchQuery] = useState(""); // ✅ add this
//   const [refreshKey, setRefreshKey] = useState(0); // ✅ for refresh button

//   const handleOpen = () => setFormDialog(true);
//   const handleClose = () => setFormDialog(false);

//   return (
//     <Box sx={{ minHeight: "100vh" }}>
//       <Container maxWidth={false} sx={{ px: 3, py: 2 }}>
//         <Box
//           sx={{
//             width: "100%",
//             bgcolor: "#1e5a6e",
//             borderRadius: 2,
//             boxShadow: 2,
//             p: 2,
//             mb: 3,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-evenly",
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleOpen}
//             startIcon={<AddIcon />}
//             sx={{
//               bgcolor: "white",
//               color: "#1e5a6e",
//               "&:hover": { bgcolor: "#f0f0f0" },
//               textTransform: "none",
//               fontWeight: 600,
//               whiteSpace: "nowrap",
//             }}
//           >
//             Add Merchant
//           </Button>

//           {/* ✅ Wired search input */}
//           <TextField
//             placeholder="Search Merchant"
//             size="small"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             sx={{
//               bgcolor: "white",
//               borderRadius: 1,
//               flex: 1,
//               maxWidth: 500,
//               "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } },
//             }}
//             InputProps={{
//               endAdornment: searchQuery ? (
//                 <IconButton size="small" onClick={() => setSearchQuery("")}>
//                   <ClearIcon sx={{ fontSize: 16, color: "#666" }} />
//                 </IconButton>
//               ) : (
//                 <SearchIcon sx={{ color: "#666" }} />
//               ),
//             }}
//           />

//           {/* ✅ Refresh resets search + re-fetches */}
//           <IconButton
//             onClick={() => {
//               setSearchQuery("");
//               setRefreshKey((k) => k + 1);
//             }}
//             sx={{ bgcolor: "white", "&:hover": { bgcolor: "#f0f0f0" } }}
//           >
//             <RefreshIcon />
//           </IconButton>
//         </Box>
//       </Container>

//       <AddMerchantForm open={formDialog} onClose={handleClose} />
//       {/* ✅ Pass searchQuery and refreshKey as props */}
//       <CollapsibleTable searchQuery={searchQuery} refreshKey={refreshKey} />
//     </Box>
//   );
// }
//--------------------------------------------------------------------------------------
// import React, { useState } from "react";
// import AddMerchantForm from "./AddMerchantForm";
// import CollapsibleTable from "./Collapsibletable";

// import { Box, Container, Button, TextField, IconButton } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import SearchIcon from "@mui/icons-material/Search";
// import RefreshIcon from "@mui/icons-material/Refresh";

// export default function MerchantDashboard() {
//   const [formDialog, setFormDialog] = useState(false);

//   const handleOpen = () => setFormDialog(true);
//   const handleClose = () => setFormDialog(false);

//   return (
//     <Box
//       sx={{
//         // bgcolor: "#f5f5f5",
//         minHeight: "100vh",
//         //ml: "200px", // Offset for sidebar
//       }}
//     >
//       <Container maxWidth={false} sx={{ px: 3, py: 2 }}>
//         <Box
//           sx={{
//             width: "100%",
//             bgcolor: "#1e5a6e",
//             borderRadius: 2,
//             boxShadow: 2,
//             p: 2,
//             mb: 3,
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-evenly",
//             gap: 2,
//             flexWrap: "wrap",
//           }}
//         >
//           <Button
//             variant="contained"
//             onClick={handleOpen}
//             startIcon={<AddIcon />}
//             sx={{
//               bgcolor: "white",
//               color: "#1e5a6e",
//               "&:hover": { bgcolor: "#f0f0f0" },
//               textTransform: "none",
//               fontWeight: 600,
//               whiteSpace: "nowrap",
//             }}
//           >
//             Add Merchant
//           </Button>

//           <TextField
//             placeholder="Search Merchant"
//             size="small"
//             sx={{
//               bgcolor: "white",
//               borderRadius: 1,
//               flex: 1,
//               maxWidth: 500,
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": { border: "none" },
//               },
//             }}
//             InputProps={{
//               endAdornment: <SearchIcon sx={{ color: "#666" }} />,
//             }}
//           />

//           <IconButton
//             sx={{
//               bgcolor: "white",
//               "&:hover": { bgcolor: "#f0f0f0" },
//             }}
//           >
//             <RefreshIcon />
//           </IconButton>
//         </Box>
//       </Container>

//       <AddMerchantForm open={formDialog} onClose={handleClose} />
//       <CollapsibleTable />
//     </Box>
//   );
// }
