import axios from "axios";

const API_URL = "/api/akun";

const AkunService = {
  getAll() {
    return axios.get(API_URL);
  },
  getAkunKewajiban() {
    // Fungsi baru untuk mengambil akun kewajiban
    return axios.get(`${API_URL}/kewajiban`);
  },
};

export default AkunService;
