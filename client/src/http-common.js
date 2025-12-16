import axios from "axios";

export default axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-type": "application/json",
  },
});
