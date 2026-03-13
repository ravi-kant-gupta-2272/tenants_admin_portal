import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMerchant } from "../../services/merchant.service.js";
import UpdateMerchantForm from "./UpdateMerchantForm";
import * as Sentry from "@sentry/react";
const MerchantAction = ({ merchantData }) => {
  const queryClient = useQueryClient();
  const merchantId = merchantData.id;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [updateFormOpen, setUpdateFormOpen] = useState(false);

  // Delete mutation

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await deleteMerchant(id);

        return response.data;
      } catch (error) {
        Sentry.captureException(error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["merchants"]);
      setDeleteDialogOpen(false);
    },
    onError: (error) => {
      Sentry.captureException(error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete merchant";
      // console.error("Error deleting merchant:", errorMessage);
      setDeleteDialogOpen(false);

      alert(`Error: ${errorMessage}`);
    },
  });

  const handleUpdate = () => {
    setUpdateFormOpen(true);
  };

  const handleUpdateFormClose = () => {
    setUpdateFormOpen(false);
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(merchantId);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Tooltip title="Update">
          <IconButton color="primary" size="small" onClick={handleUpdate}>
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Delete">
          <IconButton
            color="error"
            size="small"
            onClick={handleDeleteClick}
            disabled={deleteMutation.isPending}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this merchant? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <UpdateMerchantForm
        open={updateFormOpen}
        onClose={handleUpdateFormClose}
        merchantData={merchantData}
      />
    </>
  );
};

export default MerchantAction;
