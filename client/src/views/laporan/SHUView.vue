<template>
  <div class="shu-container">
    <h2>Perhitungan Sisa Hasil Usaha (SHU)</h2>
    <button @click="fetchSHU" :disabled="isLoading">
      {{ isLoading ? "Menghitung..." : "Hitung SHU untuk Periode Ini" }}
    </button>

    <div v-if="shuData" class="hasil-shu">
      <h4>Hasil Perhitungan SHU</h4>

      <div class="summary-grid">
        <div class="card">
          <p><strong>Dana untuk Anggota</strong></p>
          <span>{{ formatUang(shuData.danaUntukAnggota) }}</span>
        </div>
        <div class="card">
          <p><strong>Total Poin Simpanan</strong></p>
          <span>{{ shuData.totalPoinSimpananKeseluruhan.toFixed(2) }}</span>
        </div>
        <div class="card total">
          <p><strong>Nilai per Poin (Indeks)</strong></p>
          <span>{{ formatUang(shuData.indeksPoin) }}</span>
        </div>
      </div>

      <h4 class="mt-20">Rincian SHU per Anggota</h4>
      <table>
        <thead>
          <tr>
            <th>Nama Anggota</th>
            <th class="text-right">Total Poin Simpanan</th>
            <th class="text-right">SHU Diterima</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in shuData.rincianAnggota" :key="item.anggota_id">
            <td>{{ item.nama }}</td>
            <td class="text-right">{{ item.totalPoin.toFixed(2) }}</td>
            <td class="text-right">{{ formatUang(item.shuDiterima) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-if="!shuData && !isLoading">
      Klik tombol di atas untuk memulai perhitungan.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import LaporanService from "@/services/laporan.service.js";

const shuData = ref(null);
const isLoading = ref(false);

const fetchSHU = async () => {
  isLoading.value = true;
  shuData.value = null;
  try {
    const response = await LaporanService.hitungSHU();
    shuData.value = response.data;
  } catch (error) {
    console.error("Error menghitung SHU:", error);
    alert("Gagal menghitung SHU.");
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );
</script>

<style scoped>
.shu-container {
  padding: 20px;
}
.hasil-shu {
  margin-top: 20px;
}
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}
.mt-20 {
  margin-top: 20px;
}
.card {
  background: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}
.card.total {
  background: #e9f5e9;
  border-color: #a8d5a8;
}
.card p,
.card span {
  font-size: 1.1em;
}
.card span {
  font-weight: bold;
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
.text-right {
  text-align: right;
}
</style>
