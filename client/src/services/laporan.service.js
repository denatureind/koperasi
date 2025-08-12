import axios from "axios";

const API_URL = "http://localhost:5000/api/laporan";

export default {
  getPeriodeList() {
    // <-- FUNGSI BARU
    return axios.get(`${API_URL}/periode`);
  },
  getJurnalUmum(periodeId) {
    // <-- Ubah untuk menerima periodeId
    return axios.get(`${API_URL}/jurnal-umum?periode_id=${periodeId}`);
  },
  getNeraca(periodeId) {
    // <-- Ubah untuk menerima periodeId
    return axios.get(`${API_URL}/neraca?periode_id=${periodeId}`);
  },
  getLabaRugi(periodeId) {
    // <-- Ubah untuk menerima periodeId
    return axios.get(`${API_URL}/laba-rugi?periode_id=${periodeId}`);
  },
  hitungSHU(periodeId) {
    // <-- Ubah untuk menerima periodeId
    return axios.get(`${API_URL}/hitung-shu?periode_id=${periodeId}`);
  },
};
