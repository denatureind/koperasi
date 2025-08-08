import axios from "axios";

const API_URL = "http://localhost:5000/api/akun";

const AkunService = {
  getAll() {
    return axios.get(API_URL);
  },
};

export default AkunService;
