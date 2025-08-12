import { defineStore } from "pinia";
import LaporanService from "@/services/laporan.service.js";

export const useLaporanStore = defineStore("laporan", {
  state: () => ({
    periodeList: [],
    periodeAktifId: null,
  }),
  actions: {
    async fetchPeriodeList() {
      try {
        const response = await LaporanService.getPeriodeList();
        this.periodeList = response.data;
        // Secara default, pilih periode pertama (terbaru)
        if (this.periodeList.length > 0 && !this.periodeAktifId) {
          this.periodeAktifId = this.periodeList[0].id;
        }
      } catch (error) {
        console.error("Gagal mengambil daftar periode:", error);
      }
    },
    setPeriodeAktif(id) {
      this.periodeAktifId = id;
    },
  },
});
