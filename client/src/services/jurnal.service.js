import axios from "axios";
const API_URL = "/api/jurnal";

export default {
  createManual(data) {
    return axios.post(`${API_URL}/manual`, data);
  },
};
