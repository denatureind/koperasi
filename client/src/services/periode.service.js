import http from "../http-common"; // Gunakan settingan pusat agar tidak error CORS

const API_URL = "/periode"; // Cukup /periode karena /api sudah ada di http-common

const PeriodeService = {
  // Fungsi Lama (Tetap Ada)
  getAll() {
    return http.get(API_URL);
  },

  // --- FUNGSI BARU (YANG HILANG TADI) ---
  getPeriodeById(id) {
    return http.get(`${API_URL}/${id}`);
  },
  // --------------------------------------

  // Fungsi Lama (Tetap Ada)
  tutupBuku() {
    return http.post(`${API_URL}/tutup-buku`);
  },
};

export default PeriodeService;
