<template>
  <div class="laporan-container">
    <h1>Laporan Neraca</h1>
    <p>Posisi Keuangan per {{ new Date().toLocaleDateString("id-ID") }}</p>

    <div v-if="neracaData" class="neraca-grid">
      <div class="neraca-sisi">
        <h3>ASET</h3>
        <table>
          <tr v-for="(item, index) in neracaData.aset" :key="'aset-' + index">
            <td>{{ item.nama_akun }}</td>
            <td class="text-right">{{ formatUang(item.saldo) }}</td>
          </tr>
          <tfoot>
            <tr>
              <th>Total Aset</th>
              <th class="text-right">{{ formatUang(neracaData.totalAset) }}</th>
            </tr>
          </tfoot>
        </table>
      </div>

      <div class="neraca-sisi">
        <h3>KEWAJIBAN</h3>
        <table>
          <tr
            v-for="(item, index) in neracaData.kewajiban"
            :key="'kewajiban-' + index"
          >
            <td>{{ item.nama_akun }}</td>
            <td class="text-right">{{ formatUang(item.saldo) }}</td>
          </tr>
        </table>

        <h3 class="mt-20">MODAL</h3>
        <table>
          <tr v-for="(item, index) in neracaData.modal" :key="'modal-' + index">
            <td>{{ item.nama_akun }}</td>
            <td class="text-right">{{ formatUang(item.saldo) }}</td>
          </tr>
          <tr
            v-for="(item, index) in neracaData.pendapatan"
            :key="'pendapatan-' + index"
          >
            <td>{{ item.nama_akun }}</td>
            <td class="text-right">{{ formatUang(item.saldo) }}</td>
          </tr>
          <tfoot>
            <tr>
              <th>Total Kewajiban & Modal</th>
              <th class="text-right">
                {{ formatUang(neracaData.totalKewajibanDanModal) }}
              </th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
    <div v-else>
      <p>Memuat data laporan...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LaporanService from "@/services/laporan.service.js";

const neracaData = ref(null);

const fetchNeraca = async () => {
  try {
    const response = await LaporanService.getNeraca();
    neracaData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data neraca:", error);
  }
};

const formatUang = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka || 0);
};

onMounted(fetchNeraca);
</script>

<style scoped>
.laporan-container {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}
.neraca-grid {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 20px;
}
.neraca-sisi {
  width: 48%;
}
table {
  width: 100%;
  border-collapse: collapse;
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
}
.text-right {
  text-align: right;
}
.mt-20 {
  margin-top: 20px;
}
</style>
