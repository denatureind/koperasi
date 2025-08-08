<template>
  <div>
    <h2>Semua Rekening Simpanan</h2>
    <table>
      <thead>
        <tr>
          <th>No. Rekening</th>
          <th>Nama Anggota</th>
          <th>Jenis Simpanan</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rek in rekeningList" :key="rek.id">
          <td>
            <router-link :to="`/rekening/${rek.id}`">{{
              rek.no_rekening
            }}</router-link>
          </td>
          <td>
            <router-link :to="`/anggota/${rek.anggota_id}`">{{
              rek.nama_anggota
            }}</router-link>
          </td>
          <td>{{ rek.jenis_simpanan }}</td>
          <td class="text-right">{{ formatUang(rek.saldo) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpananService from "@/services/simpanan.service.js";

const rekeningList = ref([]);

const fetchAllRekening = async () => {
  try {
    const response = await SimpananService.getAllRekening();
    rekeningList.value = response.data;
  } catch (error) {
    console.error("Error fetching all rekening:", error);
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka
  );

onMounted(fetchAllRekening);
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
