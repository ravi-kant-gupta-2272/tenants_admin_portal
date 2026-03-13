export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const ENDPOINTS = {
  LOGIN: "/user/login",
  REGISTER: "/user/register",
  RESET: "/user/reset",
  RESETLINK: "/user/reset-link",
  ADD_MERCHANT: "/merchant/create",
  GET_MERCHANTS: "/merchant/get",
  UPDATE_MERCHANT: "/merchant/update",
  DELETE_MERCHANT: "/merchant/delete",
  REGISTER_LINK: "/user/register-link",
  CREATE_SUBSCRIPTION_PLAN: "/subscriptions/create",
  UPDATE_SUBSCRIPTION_PLAN: "/subscriptions/update",
  GET_SUBSCRIPTION_PLAN: "/subscriptions/get",
  DELETE_SUBSCRIPTION_PLAN: "/subscriptions/delete",
  VALIDATE_TOKEN_STATUS: "/user/token-status",
};
