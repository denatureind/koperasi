<template>
  <div class="jurnal-list">
    <h1>Jurnal Umum</h1>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Keterangan</th>
          <th>Kode Akun</th>
          <th>Nama Akun</th>
          <th>Debit</th>
          <th>Kredit</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jurnal in listJurnal" :key="jurnal.id">
          <td>{{ new Date(jurnal.tgl_transaksi).toLocaleString("id-ID") }}</td>
          <td>{{ jurnal.keterangan }}</td>
          <td>{{ jurnal.kode_akun }}</td>
          <td>{{ jurnal.nama_akun }}</td>
          <td class="text-right">{{ formatUang(jurnal.debit) }}</td>
          <td class="text-right">{{ formatUang(jurnal.kredit) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import LaporanService from "@/services/laporan.service.js";

const listJurnal = ref([]);

const fetchJurnal = async () => {
  try {
    const response = await LaporanService.getJurnalUmum();
    listJurnal.value = response.data;
  } catch (error) {
    console.error("Error mengambil data jurnal:", error);
  }
};

// Fungsi utilitas untuk format uang
const formatUang = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);
};

onMounted(fetchJurnal);
</script>

<style scoped>
.jurnal-list {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
th {
  background-color: #f2f2f2;
}
.text-right {
  text-align: right;
}
</style>
