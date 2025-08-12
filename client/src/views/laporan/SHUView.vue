<template>
  <div class="p-1">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">
          Perhitungan Sisa Hasil Usaha (SHU)
        </h1>
        <p class="text-gray-500 mt-1">
          Kalkulator untuk menghitung dan mengalokasikan SHU periode berjalan.
        </p>
      </div>
      <button @click="fetchSHU" :disabled="isLoading" class="btn btn-primary">
        <span
          v-if="isLoading"
          class="loading loading-spinner loading-sm"
        ></span>
        <i v-else class="fas fa-calculator mr-2"></i>
        {{ isLoading ? "Menghitung..." : "Mulai Hitung SHU" }}
      </button>
    </div>

    <div v-if="shuData" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body">
            <p class="text-base-content/70">Dana untuk Anggota</p>
            <span class="text-2xl font-bold text-primary">{{
              formatUang(shuData.danaUntukAnggotaViaSimpanan)
            }}</span>
          </div>
        </div>
        <div class="card bg-base-100 border border-base-200 shadow-sm">
          <div class="card-body">
            <p class="text-base-content/70">Total Poin Simpanan</p>
            <span class="text-2xl font-bold">{{
              shuData.totalPoinSimpananKeseluruhan.toFixed(2)
            }}</span>
          </div>
        </div>
        <div class="card bg-primary text-primary-content shadow-lg">
          <div class="card-body">
            <p>Nilai per Poin (Indeks)</p>
            <span class="text-2xl font-bold">{{
              formatUang(shuData.indeksPoin)
            }}</span>
          </div>
        </div>
      </div>

      <div
        class="card bg-base-100 border border-base-200 overflow-hidden shadow-sm"
      >
        <h3 class="text-lg font-semibold p-4 border-b">
          Rincian SHU per Anggota
        </h3>
        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th class="bg-base-200">Nama Anggota</th>
                <th class="bg-base-200 text-right">Total Poin</th>
                <th class="bg-base-200 text-right">SHU Simpanan</th>
                <th class="bg-base-200 text-right">SHU Pinjaman</th>
                <th class="bg-base-200 text-right">Total SHU Diterima</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in shuData.rincianAnggota" :key="item.anggota_id">
                <td class="font-medium">{{ item.nama }}</td>
                <td class="text-right">{{ item.totalPoin.toFixed(2) }}</td>
                <td class="text-right">
                  {{ formatUang(item.shuDariSimpanan) }}
                </td>
                <td class="text-right">
                  {{ formatUang(item.shuDariPinjaman) }}
                </td>
                <td class="text-right font-bold text-success">
                  {{ formatUang(item.shuTotalDiterima) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="!shuData && !isLoading" class="text-center py-16">
      <div
        class="card bg-base-100 shadow-sm border border-base-200 max-w-md mx-auto"
      >
        <div class="card-body">
          <i class="fas fa-play-circle text-5xl text-base-content/20 mb-4"></i>
          <h3 class="text-xl font-semibold mb-2">Siap Menghitung SHU</h3>
          <p class="text-base-content/70">
            Klik tombol "Mulai Hitung SHU" di kanan atas untuk memulai proses
            kalkulasi untuk periode yang aktif.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const shuData = ref(null);
const isLoading = ref(false);
const laporanStore = useLaporanStore();
const toast = useToast();

const fetchSHU = async () => {
  if (!laporanStore.periodeAktifId) {
    toast.error("Silakan pilih periode laporan terlebih dahulu.");
    return;
  }
  isLoading.value = true;
  shuData.value = null;
  try {
    const response = await LaporanService.hitungSHU(
      laporanStore.periodeAktifId
    );
    shuData.value = response.data;
    toast.success("Perhitungan SHU berhasil diselesaikan.");
  } catch (error) {
    console.error("Error menghitung SHU:", error);
    toast.error("Gagal menghitung SHU.");
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );
</script>
