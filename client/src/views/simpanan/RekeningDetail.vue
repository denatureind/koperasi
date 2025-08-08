<template>
  <div class="detail-container" v-if="rekening">
    <h1>Detail Rekening: {{ rekening.no_rekening }}</h1>
    <div class="info-card">
      <p><strong>Jenis Simpanan:</strong> {{ rekening.jenis_simpanan }}</p>
      <p>
        <strong>Saldo Saat Ini:</strong>
        <span class="saldo"
          >Rp {{ new Intl.NumberFormat("id-ID").format(rekening.saldo) }}</span
        >
      </p>
    </div>

    <div class="form-card">
      <h3>Buat Transaksi Baru</h3>
      <form @submit.prevent="handleTransaksi">
        <div class="form-group">
          <label>Jenis Transaksi:</label>
          <input
            type="radio"
            id="setor"
            value="Setor"
            v-model="formTransaksi.jenis"
          />
          <label for="setor">Setor</label>
          <input
            type="radio"
            id="tarik"
            value="Tarik"
            v-model="formTransaksi.jenis"
          />
          <label for="tarik">Tarik</label>
        </div>
        <div class="form-group">
          <label for="jumlah">Jumlah</label>
          <input
            type="number"
            id="jumlah"
            v-model="formTransaksi.jumlah"
            required
            min="1"
          />
        </div>
        <button type="submit">Proses Transaksi</button>
      </form>
    </div>

    <hr />

    <h2>Riwayat Transaksi (Mutasi)</h2>
    <table>
      <thead>
        <tr>
          <th>Tanggal</th>
          <th>Jenis</th>
          <th>Jumlah</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trx in mutasi" :key="trx.id">
          <td>{{ new Date(trx.tgl_transaksi).toLocaleString("id-ID") }}</td>
          <td>{{ trx.jenis_transaksi }}</td>
          <td>Rp {{ new Intl.NumberFormat("id-ID").format(trx.jumlah) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const rekeningId = route.params.id;

const rekening = ref(null);
const mutasi = ref([]);
const formTransaksi = ref({
  jumlah: 0,
  jenis: "Setor", // Default
});

const fetchData = async () => {
  try {
    // Ambil detail rekening dan mutasi secara bersamaan
    const [rekeningRes, mutasiRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/simpanan/rekening/${rekeningId}`),
      axios.get(
        `http://localhost:5000/api/simpanan/rekening/${rekeningId}/mutasi`
      ),
    ]);
    rekening.value = rekeningRes.data;
    mutasi.value = mutasiRes.data;
  } catch (error) {
    console.error("Gagal memuat data rekening:", error);
  }
};

const handleTransaksi = async () => {
  const jenis = formTransaksi.value.jenis.toLowerCase(); // 'setor' atau 'tarik'
  const url = `http://localhost:5000/api/simpanan/rekening/${rekeningId}/${jenis}`;

  try {
    await axios.post(url, { jumlah: formTransaksi.value.jumlah });
    alert(`Transaksi ${formTransaksi.value.jenis} berhasil!`);

    // Reset form dan refresh data
    formTransaksi.value.jumlah = 0;
    fetchData(); // Muat ulang semua data di halaman
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Transaksi gagal.";
    alert(errorMessage);
    console.error(`Error saat ${jenis}:`, error);
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Anda bisa salin style dari AnggotaDetailView dan sesuaikan jika perlu */
.detail-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
.info-card {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.saldo {
  font-weight: bold;
  font-size: 1.2em;
  color: #28a745;
}
.form-card {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
  margin-top: 20px;
}
hr {
  border: 0;
  border-top: 1px solid #eee;
  margin: 20px 0;
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
.form-group {
  margin-bottom: 15px;
}
label {
  margin-right: 15px;
}
input[type="radio"] {
  margin-right: 5px;
}
input[type="number"] {
  padding: 8px;
}
button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
