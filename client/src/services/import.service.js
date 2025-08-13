import axios from "axios";

const API_URL = "/api/import";

const ImportService = {
  importAnggota(file) {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_URL}/anggota`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  importSaldoSimpanan(file) {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_URL}/saldo-simpanan`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  importPinjamanAktif(file) {
    const formData = new FormData();
    formData.append("file", file);

    return axios.post(`${API_URL}/pinjaman-aktif`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export default ImportService;
