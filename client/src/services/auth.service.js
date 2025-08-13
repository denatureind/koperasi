import axios from "axios";

const API_URL = "/api/auth";

const AuthService = {
  login(user) {
    return axios.post(`${API_URL}/login`, {
      username: user.username,
      password: user.password,
    });
  },

  register(user) {
    return axios.post(`${API_URL}/register`, user);
  },
};

export default AuthService;
