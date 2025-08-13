import axios from "axios";

// Definisikan base URL untuk semua endpoint anggota
const API_URL = "/api/anggota";

// Buat sebuah objek untuk menampung semua fungsi API
const AnggotaService = {
  // Fungsi untuk mengambil semua anggota (GET /)
  getAll() {
    return axios.get(API_URL);
  },

  // Fungsi untuk mengambil satu anggota (GET /:id)
  getById(id) {
    return axios.get(`${API_URL}/${id}`);
  },

  // Fungsi untuk membuat anggota baru (POST /)
  create(data) {
    return axios.post(API_URL, data);
  },

  // Fungsi untuk mengupdate anggota (PUT /:id)
  update(id, data) {
    return axios.put(`${API_URL}/${id}`, data);
  },

  // Fungsi untuk menghapus anggota (DELETE /:id)
  delete(id) {
    return axios.delete(`${API_URL}/${id}`);
  },
};

// Ekspor objek agar bisa digunakan di file lain
export default AnggotaService;
