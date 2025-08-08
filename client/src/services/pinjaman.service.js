import axios from "axios";

const API_URL = "http://localhost:5000/api/pinjaman";

export default {
  // Mengambil SEMUA pinjaman
  getAll() {
    return axios.get(API_URL);
  },

  // FUNGSI YANG HILANG SEBELUMNYA
  getAllTransaksi() {
    return axios.get(`${API_URL}/transaksi`);
  },

  // Membuat pinjaman baru
  create(data) {
    return axios.post(API_URL, data);
  },

  // Mengambil pinjaman milik satu anggota
  getByAnggotaId(anggotaId) {
    return axios.get(`${API_URL}/anggota/${anggotaId}`);
  },

  // Mengambil detail satu pinjaman
  getById(id) {
    return axios.get(`${API_URL}/${id}`);
  },

  // Membayar angsuran
  bayarAngsuran(jadwalId, data) {
    return axios.post(`${API_URL}/bayar/${jadwalId}`, data);
  },
};
