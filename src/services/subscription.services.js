import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

export const getAllSubscriptionPlan = (merchantId) => {
  console.log("getAllSubscriptionPlan CALL -->");
  return axiosInstance.get(
    `${BASE_URL}${ENDPOINTS.GET_SUBSCRIPTION_PLAN}/${merchantId}`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    },
  );
};
