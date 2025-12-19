import http from "../http-common";

const API_URL = "/periode";

const PeriodeService = {
  // Ambil semua data periode
  getAll() {
    return http.get(API_URL);
  },

  // Ambil detail periode per ID
  getPeriodeById(id) {
    return http.get(`${API_URL}/${id}`);
  },

  // Tambah periode baru
  create(data) {
    return http.post(API_URL, data);
  },

  // Tutup buku periode
  tutupBuku(id) {
    return http.post(`${API_URL}/${id}/tutup-buku`);
  },

  // Posting / distribusi SHU
  postingDistribusiSHU(periode_id) {
    return http.post(`${API_URL}/distribusi-shu`, { periode_id });
  },
};

export default PeriodeService;
