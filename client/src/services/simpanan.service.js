import axios from "axios";

const API_URL = "http://localhost:5000/api/simpanan";

export default {
  // INI FUNGSI YANG HILANG
  getSimpananSummary() {
    return axios.get(`${API_URL}/rekening`);
  },

  getAllTransaksi() {
    return axios.get(`${API_URL}/transaksi`);
  },

  getRekeningByAnggotaId(anggotaId) {
    return axios.get(`${API_URL}/rekening/anggota/${anggotaId}`);
  },

  getRekeningById(id) {
    return axios.get(`${API_URL}/rekening/${id}`);
  },

  getMutasiByRekeningId(rekeningId) {
    return axios.get(`${API_URL}/rekening/${rekeningId}/mutasi`);
  },

  createRekening(data) {
    return axios.post(`${API_URL}/rekening`, data);
  },

  createSetoran(rekeningId, data) {
    return axios.post(`${API_URL}/rekening/${rekeningId}/setor`, data);
  },

  createPenarikan(rekeningId, data) {
    return axios.post(`${API_URL}/rekening/${rekeningId}/tarik`, data);
  },
};
