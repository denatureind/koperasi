<template>
  <div class="laporan-container">
    <h2>Laporan Laba Rugi (Perhitungan Hasil Usaha)</h2>
    <div v-if="laporanData" class="laporan-content">
      <h4>Pendapatan</h4>
      <table>
        <tr
          v-for="(item, index) in laporanData.pendapatan"
          :key="'pendapatan-' + index"
        >
          <td>{{ item.nama_akun }}</td>
          <td class="text-right">{{ formatUang(item.total) }}</td>
        </tr>
        <tfoot>
          <tr>
            <th>Total Pendapatan</th>
            <th class="text-right">
              {{ formatUang(laporanData.totalPendapatan) }}
            </th>
          </tr>
        </tfoot>
      </table>

      <h4 class="mt-20">Beban</h4>
      <table>
        <tr v-for="(item, index) in laporanData.beban" :key="'beban-' + index">
          <td>{{ item.nama_akun }}</td>
          <td class="text-right">{{ formatUang(item.total) }}</td>
        </tr>
        <tfoot>
          <tr>
            <th>Total Beban</th>
            <th class="text-right">{{ formatUang(laporanData.totalBeban) }}</th>
          </tr>
        </tfoot>
      </table>

      <table class="total-laba-rugi mt-20">
        <tr>
          <th>Sisa Hasil Usaha (Laba / Rugi)</th>
          <th class="text-right">{{ formatUang(laporanData.labaRugi) }}</th>
        </tr>
      </table>

      <table class="total-laba-rugi mt-20">
        <tbody>
          <tr>
            <th>Sisa Hasil Usaha (Laba / Rugi)</th>
            <th class="text-right">{{ formatUang(laporanData.labaRugi) }}</th>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>Memuat data laporan...</p>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";

const laporanData = ref(null);
const isLoading = ref(true);
const laporanStore = useLaporanStore();

const fetchLabaRugi = async (periodeId) => {
  if (!periodeId) return;
  isLoading.value = true;
  try {
    const response = await LaporanService.getLabaRugi(periodeId);
    laporanData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data laba rugi:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

watch(
  () => laporanStore.periodeAktifId,
  (newId) => {
    fetchLabaRugi(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
.laporan-container {
  padding: 20px;
}
.laporan-content {
  max-width: 600px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
th,
td {
  padding: 8px;
  border-bottom: 1px solid #ddd;
}
th {
  background-color: #f2f2f2;
  text-align: left;
}
tfoot th {
  background-color: #e9e9e9;
  font-weight: bold;
  border-top: 2px solid #ccc;
}
.text-right {
  text-align: right;
}
.mt-20 {
  margin-top: 20px;
}
.total-laba-rugi th {
  background-color: #42b983;
  color: white;
}
</style>
