<template>
  <div>
    <h2>Semua Transaksi Pembayaran Pinjaman</h2>
    <table>
      <thead>
        <tr>
          <th>Tanggal Bayar (Jatuh Tempo)</th>
          <th>No. Pinjaman</th>
          <th>Nama Anggota</th>
          <th>Pokok Dibayar</th>
          <th>Jasa Dibayar</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trx in transaksiList" :key="trx.id">
          <td>
            {{ new Date(trx.tgl_jatuh_tempo).toLocaleDateString("id-ID") }}
          </td>
          <td>{{ trx.no_pinjaman }}</td>
          <td>{{ trx.nama_anggota }}</td>
          <td class="text-right">{{ formatUang(trx.pokok_dibayar) }}</td>
          <td class="text-right">{{ formatUang(trx.jasa_dibayar) }}</td>
          <td class="text-right">
            {{
              formatUang(
                parseFloat(trx.pokok_dibayar) + parseFloat(trx.jasa_dibayar)
              )
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import PinjamanService from "@/services/pinjaman.service.js";

const transaksiList = ref([]);

const fetchAllTransaksi = async () => {
  try {
    const response = await PinjamanService.getAllTransaksi();
    transaksiList.value = response.data;
  } catch (error) {
    console.error("Error fetching all transaksi pinjaman:", error);
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
