import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export default function CustomSnackbar({
  message = "server error",
  open,
  setOpen,
  severity = "error", // to toggel color if api respons is kind of error
}) {
  //console.log(message, open);
const getBackgroundColor = () => {
  switch (severity) {
    case "success":
      return "#4caf50"; 
    case "error":
      return "#d82c66"; 
    default:
      return "grey";
  }
};
  
  const handleClose = (event, reason) => {
    console.log("handleCLose");

    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        message={message}
        action={action}
         slotProps={{
          content: {
            sx: {
              backgroundColor: getBackgroundColor(),
              color: 'white'
            }
          }
        }}
      />
    </div>
  );
}
