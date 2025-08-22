import api from "./api";

class KasBankService {
  async getAll() {
    return api.get("/kas-bank");
  }

  async create(data) {
    return api.post("/kas-bank", data);
  }

  async update(id, data) {
    return api.put(`/kas-bank/${id}`, data);
  }

  async delete(id) {
    return api.delete(`/kas-bank/${id}`);
  }
}

export default new KasBankService();
