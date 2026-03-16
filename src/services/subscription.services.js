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

// Add new Subscription
export const addSubscriptionPlan = (planDetails) => {
  console.log("addPlan () accessToken is", localStorage.getItem("accessToken"));
  console.log("Adding merplanchant:", planDetails);
  return axiosInstance.post(
    `${BASE_URL}${ENDPOINTS.CREATE_SUBSCRIPTION_PLAN}`,
    planDetails,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    },
  );
};

// Update Subscription
// In subscription.services.js — add this:

export const updateSubscriptionPlan = (planDetails) => {
  console.log(
    "updateSubscriptionPlan () accessToken is",
    localStorage.getItem("accessToken"),
  );
  console.log("Updating plan:", planDetails);
  return axiosInstance.put(
    `${BASE_URL}${ENDPOINTS.UPDATE_SUBSCRIPTION_PLAN}`,
    planDetails,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    },
  );
};

// Delete Subscription Plane

export const deleteSubscriptionPlan = (subscriptionId) => {
  console.log(
    "deleteSubscriptionPlan () accessToken is",
    localStorage.getItem("accessToken"),
  );
  console.log("Deleting plan id:", subscriptionId);
  return axiosInstance.delete(
    `${BASE_URL}${ENDPOINTS.DELETE_SUBSCRIPTION_PLAN}/${subscriptionId}`,
    {
      headers: {
        authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
    },
  );
};
