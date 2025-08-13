import axios from "axios";
const API_URL = "/api/jenis-simpanan";
export default {
  getAll() {
    return axios.get(API_URL);
  },
  create(data) {
    return axios.post(API_URL, data);
  },
};
