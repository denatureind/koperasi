import axios from "axios";
const API_URL = "http://localhost:5000/api/konfigurasi";

const KonfigurasiService = {
  getSHU() {
    return axios.get(`${API_URL}/shu`);
  },
  updateSHU(data) {
    return axios.put(`${API_URL}/shu`, data);
  },
};
export default KonfigurasiService;
