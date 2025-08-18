import axios from "axios";

const API_URL = "/api/laporan";

export default {
  getPeriodeList() {
    return axios.get(`${API_URL}/periode`);
  },
  getJurnalUmum(periodeId) {
    return axios.get(`${API_URL}/jurnal-umum?periode_id=${periodeId}`);
  },
  getNeraca(periodeId) {
    return axios.get(`${API_URL}/neraca?periode_id=${periodeId}`);
  },
  getLabaRugi(periodeId) {
    return axios.get(`${API_URL}/laba-rugi?periode_id=${periodeId}`);
  },
  hitungSHU(periodeId, jasaBelanja) {
    return axios.get(
      `${API_URL}/hitung-shu?periode_id=${periodeId}&jasa_belanja_dikembalikan=${jasaBelanja}`
    );
  },
  getBukuBesarSummary(periodeId) {
    return axios.get(`${API_URL}/buku-besar?periode_id=${periodeId}`);
  },
  getBukuBesarDetail(akunId, periodeId) {
    return axios.get(
      `${API_URL}/buku-besar/detail?akun_id=${akunId}&periode_id=${periodeId}`
    );
  },

  // --- FUNGSI BARU UNTUK EKSPOR ---
  exportNeraca(periodeId) {
    return axios.get(`${API_URL}/neraca/export?periode_id=${periodeId}`, {
      responseType: "blob", // Ini penting untuk memberitahu axios agar menangani respon sebagai file
    });
  },

  // --- FUNGSI BARU ---
  exportLabaRugi(periodeId) {
    return axios.get(`${API_URL}/laba-rugi/export?periode_id=${periodeId}`, {
      responseType: "blob", // Penting untuk unduhan file
    });
  },

  // --- FUNGSI BARU ---
  exportSHU(periodeId, jasaBelanja) {
    return axios.get(
      `${API_URL}/shu/export?periode_id=${periodeId}&jasa_belanja_dikembalikan=${jasaBelanja}`,
      {
        responseType: "blob", // Penting untuk unduhan file
      }
    );
  },
};
