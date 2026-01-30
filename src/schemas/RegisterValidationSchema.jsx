import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Please enter your name"),
  email: Yup.string()
    .email("Must be a valid email")
    .required("Enter your Email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please Enter your Password"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Please confirm your password"),
});
