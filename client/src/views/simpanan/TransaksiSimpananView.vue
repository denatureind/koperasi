<template>
  <div>
    <h2>Semua Transaksi Simpanan</h2>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>No. Rekening</th>
          <th>Nama Anggota</th>
          <th>Jenis Transaksi</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trx in transaksiList" :key="trx.id">
          <td>{{ new Date(trx.tgl_transaksi).toLocaleString("id-ID") }}</td>
          <td>{{ trx.no_rekening }}</td>
          <td>{{ trx.nama_anggota }}</td>
          <td>{{ trx.jenis_transaksi }}</td>
          <td class="text-right">{{ formatUang(trx.jumlah) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpananService from "@/services/simpanan.service.js";

const transaksiList = ref([]);

const fetchAllTransaksi = async () => {
  try {
    const response = await SimpananService.getAllTransaksi();
    transaksiList.value = response.data;
  } catch (error) {
    console.error("Error fetching all transaksi:", error);
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka
  );

onMounted(fetchAllTransaksi);
</script>
<style scoped>
/* Style standar untuk tabel */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
.text-right {
  text-align: right;
}
</style>
