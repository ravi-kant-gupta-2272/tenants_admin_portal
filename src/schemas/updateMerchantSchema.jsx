import * as Yup from "yup";

export const updateMerchantSchema = Yup.object({
  // Basic Info
  name: Yup.string().trim().required("Merchant Account Name is required"),

  merchantId: Yup.string().trim().required("Merchant ID is required"),

  environment: Yup.string()
    .oneOf(["SANDBOX", "PRODUCTION"], "Invalid environment")
    .required("Environment is required"),

  // API Credentials
  clientId: Yup.string().trim().required("Client ID is required"),

  clientVersion: Yup.number()
    .typeError("Client Version must be a number")
    .integer("Client Version must be an integer")
    .min(1, "Client Version must be at least 1")
    .required("Client Version is required"),

  clientSecret: Yup.string()
    .min(6, "Client Secret must be at least 6 characters")
    .required("Client Secret is required"),

  // Webhook
  callbackUrl: Yup.string()
    .url("Enter a valid URL (must include https://)")
    .matches(/^https:\/\/.+/, "Callback URL must start with https://")
    .required("Callback URL is required"),

  webhookUsername: Yup.string().trim().required("Webhook Username is required"),

  webhookPassword: Yup.string()
    .min(6, "Webhook Password must be at least 6 characters")
    .required("Webhook Password is required"),
});
