import Box from "@mui/material/Box";
import CollapsibleSubscriptionTable from "./CollapsibleSubscriptionTable";

export default function ManageSubscriptions() {
  return (
    <Box
      sx={{
        // width: "10
        display: "block",
        ml: "200px",
      }}
    >
      <CollapsibleSubscriptionTable />
    </Box>
  );
}
