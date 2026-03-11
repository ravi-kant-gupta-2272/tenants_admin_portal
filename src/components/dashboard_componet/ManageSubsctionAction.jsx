import Box from "@mui/material/Box";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useNavigate } from "react-router-dom";
const ManageSubsctionAction = ({ merchantData }) => {
  const navigate = useNavigate();
  const handleClick = async () => {


    console.log("Merchant--->", merchantData);

    navigate(`/home/subscription/${merchantData.id}`, {
      state: {
        merchantData: merchantData,
      },
    });
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
