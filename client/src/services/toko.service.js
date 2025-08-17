import axios from "axios";
const API_URL = "http://localhost:5000/api/toko";

export default {
  getBelanjaBulanan(bulan, tahun) {
    return axios.get(`${API_URL}/belanja?bulan=${bulan}&tahun=${tahun}`);
  },
  simpanBelanjaBulanan(data) {
    return axios.post(`${API_URL}/belanja`, data);
  },
};
