import axios from "axios";
import axiosInstance from "../api/axiosInstance";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";

export const addMerchant = (merchantDetails) => {
  console.log("Adding merchant:", merchantDetails);
  return axios.post(`${BASE_URL}${ENDPOINTS.ADD_MERCHANT}`, merchantDetails, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });
};

export const getAllMerchants = (limit = 5, skip = 0) => {
  console.log("get AllMerchant API CALL -->");
  return axios.get(
    `${BASE_URL}${ENDPOINTS.GET_MERCHANTS}?limit=${limit}&skip=${skip}`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    },
  );
};

export const fetchMerchants = async () => {
  const response = await getAllMerchants();
  console.log(
    "response.data.data in fetchMerchent Function--->",
    response.data,
  );
  return response.data; // return only actual data
};

export const updateMerchant = (merchantId, merchantData) => {
  return axiosInstance.put(
    `${BASE_URL}${ENDPOINTS.UPDATE_MERCHANT}/${merchantId}`,
    merchantData,
  );
};

export const deleteMerchant = async (merchantId) => {
  const response = await axiosInstance.delete(
    `${ENDPOINTS.DELETE_MERCHANT}/${merchantId}`,
  );

  return response.data;
};

// export const getSubscriptionPlan = async (merchantId) => {
//   // const response =await axiosInstance.get(`${}`)
// };
