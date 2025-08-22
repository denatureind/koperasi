import api from "./api";

const AkunService = {
  getAll() {
    return api.get("/akun");
  },

  getAkunKewajiban() {
    return api.get("/akun/kewajiban");
  },

  getAkunUntukKasBank() {
    return api.get("/akun/untuk-kas-bank");
  },
};

export default AkunService;
