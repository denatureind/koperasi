<template>
  <div>
    <h2>Semua Rekening Pinjaman</h2>
    <table>
      <thead>
        <tr>
          <th>No. Pinjaman</th>
          <th>Nama Anggota</th>
          <th>Jumlah Pinjaman</th>
          <th>Tenor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pinjaman in pinjamanList" :key="pinjaman.id">
          <td>
            <router-link :to="`/pinjaman/${pinjaman.id}`">{{
              pinjaman.no_pinjaman
            }}</router-link>
          </td>
          <td>
            <router-link :to="`/anggota/${pinjaman.anggota_id}`">{{
              pinjaman.nama_anggota
            }}</router-link>
          </td>
          <td>{{ formatUang(pinjaman.jumlah_pinjaman) }}</td>
          <td>{{ pinjaman.tenor }} bulan</td>
          <td>{{ pinjaman.status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PinjamanService from "@/services/pinjaman.service.js";

const pinjamanList = ref([]);

const fetchAllPinjaman = async () => {
  try {
    const response = await PinjamanService.getAll();
    pinjamanList.value = response.data;
  } catch (error) {
    console.error("Error fetching all pinjaman:", error);
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka
  );

onMounted(fetchAllPinjaman);
</script>
<style scoped>
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
</style>
