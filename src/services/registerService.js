import axios from "axios";
import { BASE_URL, ENDPOINTS } from "../api/apiConfig";
export const sendRegistrationEmail = (email) => {
  return axios.post(`${BASE_URL}${ENDPOINTS.REGISTER_LINK}`, { email });
};
