import http from "../http-common"; // Mengambil settingan dari Langkah 2

class TokoService {
  getBelanjaBulanan(bulan, tahun) {
    // Tidak ada lagi hardcode URL di sini
    return http.get(`/toko/belanja?bulan=${bulan}&tahun=${tahun}`);
  }

  simpanBelanjaBulanan(data) {
    return http.post(`/toko/belanja`, data);
  }
}

export default new TokoService();
