import React, { useState } from "react";
import AddMerchantForm from "./AddMerchantForm";
import CollapsibleTable from "./Collapsibletable";

import { Box, Container, Button, TextField, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import RefreshIcon from "@mui/icons-material/Refresh";

export default function MerchantDashboard() {
  const [formDialog, setFormDialog] = useState(false);

  const handleOpen = () => setFormDialog(true);
  const handleClose = () => setFormDialog(false);

  return (
    <Box
      sx={{
        // bgcolor: "#f5f5f5",
        minHeight: "100vh",
        ml: "200px", // Offset for sidebar
      }}
    >
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
            placeholder="Search Merchant"
            size="small"
            sx={{
              bgcolor: "white",
              borderRadius: 1,
              flex: 1,
              maxWidth: 500,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { border: "none" },
              },
            }}
            InputProps={{
              endAdornment: <SearchIcon sx={{ color: "#666" }} />,
            }}
          />

          <IconButton
            sx={{
              bgcolor: "white",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Box>
      </Container>

      <AddMerchantForm open={formDialog} onClose={handleClose} />
      <CollapsibleTable />
    </Box>
  );
}
