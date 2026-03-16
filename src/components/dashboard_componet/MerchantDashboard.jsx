import React, { useState } from "react";
import AddMerchantForm from "./AddMerchantForm";

import CollapsibleTable from "./Collapsibletable";
import {
  Box,
  Container,
  Button,
  TextField,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
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
        {/* ── Toolbar ───────────────────────────────────── */}
        <Box
          sx={{
            width: "100%",
            bgcolor: "#fff",
            borderRadius: 3,
            border: "1px solid #e8edf2",
            boxShadow: "0 2px 12px rgba(39,88,111,0.08)",
            px: 2.5,
            py: 1.8,
            mb: 3,
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* ── Add Merchant Button ── */}
          <Button
            variant="contained"
            onClick={handleOpen}
            startIcon={<AddIcon />}
            sx={{
              bgcolor: "#27586f",
              color: "#fff",
              "&:hover": { bgcolor: "#1e4356", transform: "translateY(-1px)" },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(39,88,111,0.25)",
              transition: "all 0.2s",
            }}
          >
            Add Merchant
          </Button>

          {/* ── Vertical Divider ── */}
          <Box
            sx={{ width: "1px", height: 32, bgcolor: "#e8edf2", flexShrink: 0 }}
          />

          {/* ── Search Field ── */}
          <Box sx={{ flex: 1, position: "relative", maxWidth: 480 }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#27586f",
                fontSize: 18,
                zIndex: 1,
              }}
            />
            <TextField
              placeholder="Search by Name, ID or Environment..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  pl: 4.5,
                  borderRadius: 2.5,
                  bgcolor: "#f4f8fa",
                  fontSize: "0.875rem",
                  "& fieldset": { border: "1.5px solid #e0eaf0" },
                  "&:hover fieldset": { border: "1.5px solid #27586f" },
                  "&.Mui-focused fieldset": { border: "2px solid #27586f" },
                },
              }}
              InputProps={{
                endAdornment: searchQuery && (
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    sx={{ mr: -0.5 }}
                  >
                    <ClearIcon sx={{ fontSize: 15, color: "#90a4ae" }} />
                  </IconButton>
                ),
              }}
            />
          </Box>

          {/* ── Spacer ── */}
          <Box sx={{ flex: 1 }} />

          {/* ── Result Badge ── */}
          <Box
            sx={{
              px: 2,
              py: 0.8,
              bgcolor: "#f0f7fa",
              borderRadius: 2,
              border: "1px solid #cde4ee",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "#27586f",
              }}
            />
            <Typography
              variant="caption"
              fontWeight={700}
              color="#27586f"
              whiteSpace="nowrap"
            >
              {searchQuery ? "Searching..." : "All Merchants"}
            </Typography>
          </Box>

          {/* ── Refresh Button ── */}
          <Tooltip title="Refresh" arrow>
            <IconButton
              onClick={() => {
                setSearchQuery("");
                setRefreshKey((k) => k + 1);
              }}
              sx={{
                bgcolor: "#f0f7fa",
                border: "1px solid #cde4ee",
                borderRadius: 2,
                color: "#27586f",
                "&:hover": {
                  bgcolor: "#27586f",
                  color: "#fff",
                  transform: "rotate(180deg)",
                },
                transition: "all 0.3s",
              }}
            >
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Container>

      <AddMerchantForm open={formDialog} onClose={handleClose} />
      <CollapsibleTable
        searchQuery={searchQuery}
        refreshKey={refreshKey}
        key={searchQuery}
      />
    </Box>
  );
}
