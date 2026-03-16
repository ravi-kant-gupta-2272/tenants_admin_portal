import * as Yup from "yup";
export const SentEmailForResetPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Enter your email"),
});

export default SentEmailForResetPasswordSchema