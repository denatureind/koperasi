import api from "./api";

const API_URL = "/konfigurasi";

const KonfigurasiService = {
  getSHU() {
    return api.get(`${API_URL}/shu`);
  },
  updateSHU(data) {
    return api.put(`${API_URL}/shu`, data);
  },
  getPoinSukarela() {
    return api.get(`${API_URL}/poin-sukarela`);
  },
  updatePoinSukarela(data) {
    return api.put(`${API_URL}/poin-sukarela`, data);
  },
};
export default KonfigurasiService;
