import api from "./api"; // Menggunakan standar koneksi proyek kita

const API_URL = "/pinjaman"; // Hapus "/api" dari sini

export default {
  // Mengambil SEMUA pinjaman dengan pagination dan search
  getAll(params) {
    return api.get(API_URL, { params });
  },

  getAllTransaksi() {
    return api.get(`${API_URL}/transaksi`);
  },

  create(data) {
    return api.post(API_URL, data);
  },

  getByAnggotaId(anggotaId) {
    return api.get(`${API_URL}/anggota/${anggotaId}`);
  },

  getById(id) {
    return api.get(`${API_URL}/${id}`);
  },

  bayarAngsuran(jadwalId, data) {
    return api.post(`${API_URL}/bayar/${jadwalId}`, data);
  },

  lunasi(id, data) {
    return api.post(`${API_URL}/${id}/lunasi`, data);
  },
};
