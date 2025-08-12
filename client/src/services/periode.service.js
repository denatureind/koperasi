import axios from "axios";

const API_URL = "http://localhost:5000/api/periode";

const PeriodeService = {
  // Mengambil semua periode akuntansi yang ada
  getAll() {
    return axios.get(API_URL); // Kita perlu buat endpoint ini di backend
  },
  // Menjalankan proses tutup buku
  tutupBuku() {
    return axios.post(`${API_URL}/tutup-buku`);
  },
};

export default PeriodeService;
