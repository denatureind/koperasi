import api from "./api";

const SimpananService = {
  getSimpananSummary(params) {
    return api.get("/simpanan/rekening", { params });
  },

  getAllTransaksi() {
    return api.get("/simpanan/transaksi");
  },

  getRekeningByAnggotaId(anggotaId) {
    return api.get(`/simpanan/rekening/anggota/${anggotaId}`);
  },

  getRekeningById(id) {
    return api.get(`/simpanan/rekening/${id}`);
  },

  getMutasiByRekeningId(rekeningId) {
    return api.get(`/simpanan/rekening/${rekeningId}/mutasi`);
  },

  createRekening(data) {
    return api.post("/simpanan/rekening", data);
  },

  createSetoran(rekeningId, data) {
    return api.post(`/simpanan/rekening/${rekeningId}/setor`, data);
  },

  createPenarikan(rekeningId, data) {
    return api.post(`/simpanan/rekening/${rekeningId}/tarik`, data);
  },

  exportToExcel(params) {
    return api.get("/simpanan/export/excel", {
      params,
      responseType: "blob",
    });
  },
};

export default SimpananService;
