import axios from "axios";

const API_URL = "/api/anggota";

const AnggotaService = {
  getAll() {
    return axios.get(API_URL);
  },
  getById(id) {
    return axios.get(`${API_URL}/${id}`);
  },
  create(data) {
    return axios.post(API_URL, data);
  },
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  },
  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  },

  // PERBAIKAN FINAL: Arahkan ke endpoint '/api/anggota/create' yang benar
  createLogin(data) {
    return axios.post(`${API_URL}/create`, data);
  },

  // --- FUNGSI BARU ---
  resetPassword(data) {
    return axios.put(`${API_URL}/reset-password`, data);
  },
};

export default AnggotaService;
