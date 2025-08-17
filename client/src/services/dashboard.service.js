import axios from "axios";

const API_URL = "/api/dashboard"; // Menggunakan path relatif

export default {
  getSummary() {
    return axios.get(`${API_URL}/summary`);
  },
};
