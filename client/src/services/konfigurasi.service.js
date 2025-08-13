import axios from "axios";
const API_URL = "/api/konfigurasi";

const KonfigurasiService = {
  getSHU() {
    return axios.get(`${API_URL}/shu`);
  },
  updateSHU(data) {
    return axios.put(`${API_URL}/shu`, data);
  },
};
export default KonfigurasiService;
