import http from "../http-common"; // <-- PENTING: Pakai konfigurasi pusat kita

// Cukup "/laporan" saja, karena "/api" sudah ada di http-common.js
const API_URL = "/laporan";

export default {
  getPeriodeList() {
    return http.get(`${API_URL}/periode`);
  },

  // Update fungsi ini
  getJurnalUmum(
    periodeId,
    page = 1,
    limit = 10,
    startDate = "",
    endDate = "",
    search = ""
  ) {
    let url = `${API_URL}/jurnal-umum?periode_id=${periodeId}&page=${page}&limit=${limit}`;

    if (startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }

    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    return http.get(url);
  },

  getNeraca(periodeId) {
    return http.get(`${API_URL}/neraca?periode_id=${periodeId}`);
  },

  getLabaRugi(periodeId) {
    return http.get(`${API_URL}/laba-rugi?periode_id=${periodeId}`);
  },

  getBukuBesarSummary(periodeId) {
    return http.get(`${API_URL}/buku-besar?periode_id=${periodeId}`);
  },

  getBukuBesarDetail(akunId, periodeId) {
    return http.get(
      `${API_URL}/buku-besar/detail?akun_id=${akunId}&periode_id=${periodeId}`
    );
  },

  // Tambahkan ini
  getHasilSHUTersimpan(periodeId) {
    return http.get(`${API_URL}/shu/hasil-tersimpan?periode_id=${periodeId}`);
  },

  // --- FUNGSI EKSPOR (Blob) ---
  exportNeraca(periodeId) {
    return http.get(`${API_URL}/neraca/export?periode_id=${periodeId}`, {
      responseType: "blob",
    });
  },

  exportLabaRugi(periodeId) {
    return http.get(`${API_URL}/laba-rugi/export?periode_id=${periodeId}`, {
      responseType: "blob",
    });
  },

  exportSHU(periodeId, jasaBelanja) {
    return http.get(
      `${API_URL}/shu/export?periode_id=${periodeId}&jasa_belanja_dikembalikan=${jasaBelanja}`,
      {
        responseType: "blob",
      }
    );
  },

  // --- FUNGSI SHU BARU (Simpan & Hitung) ---

  // 1. Simpan Jasa Belanja ke Database
  simpanJasaBelanja(data) {
    return http.post(`${API_URL}/shu/simpan-jasa`, data);
  },

  // 2. Hitung SHU (Satu fungsi saja, yang duplikat sudah dihapus)
  hitungSHU(periodeId, jasaBelanja) {
    return http.get(
      `${API_URL}/hitung-shu?periode_id=${periodeId}&jasa_belanja_dikembalikan=${jasaBelanja}`
    );
  },
};
