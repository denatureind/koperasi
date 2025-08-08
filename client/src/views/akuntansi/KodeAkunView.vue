<template>
  <div class="akun-list">
    <h1>Daftar Kode Akun (Chart of Accounts)</h1>
    <table>
      <thead>
        <tr>
          <th>Kode</th>
          <th>Nama Akun</th>
          <th>Posisi Saldo</th>
          <th>Header</th>
          <th>Kelompok</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="akun in listAkun" :key="akun.id">
          <td>{{ akun.kode }}</td>
          <td>{{ akun.nama_akun }}</td>
          <td>{{ akun.posisi_saldo }}</td>
          <td>{{ akun.header_akun }}</td>
          <td>{{ akun.kelompok_akun }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AkunService from "@/services/akun.service.js";

const listAkun = ref([]);

const fetchAkun = async () => {
  try {
    const response = await AkunService.getAll();
    listAkun.value = response.data;
  } catch (error) {
    console.error("Error mengambil data akun:", error);
  }
};

onMounted(fetchAkun);
</script>

<style scoped>
.akun-list {
  padding: 20px;
  max-width: 1000px;
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
  text-align: left;
}
th {
  background-color: #f2f2f2;
}
</style>
