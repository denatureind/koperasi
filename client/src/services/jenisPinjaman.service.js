import axios from "axios";
const API_URL = "http://localhost:5000/api/jenis-pinjaman";

export default {
  getAll() {
    return axios.get(API_URL);
  },
  create(data) {
    return axios.post(API_URL, data);
  },
};
