import axios from "axios";
import { BASE_URL,ENDPOINTS } from "../api/apiConfig";
export const sendResetPasswordEmail = (email) => {
    console.log(axios.post(`${BASE_URL}${ENDPOINTS.RESETLINK}`, { email }))
  return axios.post(`${BASE_URL}${ENDPOINTS.RESETLINK}`, { email });
};