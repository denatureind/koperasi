import axios from "axios";

const API_URL = "/api/shu-pemerataan";

// Kita bungkus semua fungsi di dalam satu objek 'default'
// Ini adalah cara yang sama dengan file service Anda yang lain.
export default {
  /**
   * Mengambil daftar anggota beserta data SHU pemerataan mereka untuk periode tertentu.
   * @param {number} periodeId - ID dari periode yang ingin diambil datanya.
   * @returns {Promise} - Promise yang berisi data dari server.
   */
  getPemerataanByPeriode(periodeId) {
    return axios.get(`${API_URL}?periode_id=${periodeId}`);
  },

  /**
   * Menyimpan data SHU pemerataan ke server.
   * @param {number} periodeId - ID dari periode tempat data akan disimpan.
   * @param {Array} data - Array objek yang berisi data pemerataan per anggota.
   * @returns {Promise} - Promise dari hasil operasi penyimpanan.
   */
  savePemerataan(periodeId, data) {
    return axios.post(API_URL, {
      periode_id: periodeId,
      data: data,
    });
  },
};
