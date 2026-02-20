import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { getAllSubscriptionPlan } from "../../services/subscription.services";

import { useNavigate } from "react-router-dom";
const ManageSubsctionAction = ({ merchantData }) => {
  const navigate = useNavigate();
  const handleClick = async () => {
    // const response = await getAllSubscriptionPlan(merchantData.id);
    console.log(getAllSubscriptionPlan(merchantData.id));
    navigate("/subscriptions");
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <ArrowForwardIosIcon onClick={handleClick} />
      </Box>
    </>
  );
};

export default ManageSubsctionAction;
