import axios from "axios";
const API_URL = "/api/jurnal"; // Pastikan path ini sesuai dengan settingan Anda

export default {
  // Fungsi manual yang lama
  createManual(data) {
    return axios.post(`${API_URL}/manual`, data);
  },

  // Fungsi baru untuk hapus
  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
};
