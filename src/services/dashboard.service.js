import { BASE_URL, ENDPOINTS } from "../api/apiConfig";
import axiosInstance from "../api/axiosInstance";

// In subscription.services.js or a new dashboard.services.js
// export const getAllMerchants = () => {
//   return axiosInstance.get(`${BASE_URL}${ENDPOINTS.GET_MERCHANTS}`, {
//     headers: { authorization: `Bearer ${localStorage.getItem("accessToken")}` },
//   });
// };

export const getAllPlansForDashboard = (merchantId) => {
  return axiosInstance.get(
    `${BASE_URL}${ENDPOINTS.GET_SUBSCRIPTION_PLAN}/${merchantId}`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    },
  );
};
