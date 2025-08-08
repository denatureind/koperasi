import axios from "axios";

const API_URL = "http://localhost:5000/api/laporan";

const LaporanService = {
  getJurnalUmum() {
    return axios.get(`${API_URL}/jurnal-umum`);
  },

  // FUNGSI BARU
  getNeraca() {
    return axios.get(`${API_URL}/neraca`);
  },

  getLabaRugi() {
    return axios.get(`${API_URL}/laba-rugi`);
  },

  hitungSHU() {
    return axios.get(`${API_URL}/hitung-shu`);
  },
};

export default LaporanService;
