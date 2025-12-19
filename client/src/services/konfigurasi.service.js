import api from "./api";

const API_URL = "/konfigurasi";

const KonfigurasiService = {
  // SHU Configuration
  getSHU() {
    return api.get(`${API_URL}/shu`);
  },
  updateSHU(data) {
    return api.put(`${API_URL}/shu`, data);
  },

  // Poin Sukarela Configuration
  getPoinSukarela() {
    return api.get(`${API_URL}/poin-sukarela`);
  },
  updatePoinSukarela(data) {
    return api.put(`${API_URL}/poin-sukarela`, data);
  },

  // All Configurations
  getAll() {
    return api.get(`${API_URL}/all`);
  },

  // Single Configuration by code
  updateByKode(kode, data) {
    return api.put(`${API_URL}/${kode}`, data);
  },
};

export default KonfigurasiService;
