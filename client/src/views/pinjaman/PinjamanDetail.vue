<template>
  <div class="detail-container" v-if="pinjaman">
    <h1>Detail Pinjaman: {{ pinjaman.no_pinjaman }}</h1>
    <hr />

    <h2>Jadwal Angsuran</h2>
    <table>
      <thead>
        <tr>
          <th>Ke-</th>
          <th>Jatuh Tempo</th>
          <th>Pokok</th>
          <th>Jasa</th>
          <th>Pokok Dibayar</th>
          <th>Jasa Dibayar</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="jadwal in pinjaman.jadwal_angsuran" :key="jadwal.id">
          <td>{{ jadwal.angsuran_ke }}</td>
          <td>
            {{ new Date(jadwal.tgl_jatuh_tempo).toLocaleDateString("id-ID") }}
          </td>
          <td>{{ formatUang(jadwal.jumlah_angsuran_pokok) }}</td>
          <td>{{ formatUang(jadwal.jumlah_angsuran_jasa) }}</td>
          <td>{{ formatUang(jadwal.pokok_dibayar) }}</td>
          <td>{{ formatUang(jadwal.jasa_dibayar) }}</td>
          <td>{{ jadwal.status_pembayaran }}</td>
          <td>
            <button
              @click="bukaFormBayar(jadwal)"
              :disabled="jadwal.status_pembayaran === 'lunas'"
              class="bayar-btn"
            >
              Bayar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="jadwalUntukDibayar" class="modal-overlay">
      <div class="modal-content">
        <h3>Pembayaran Angsuran Ke-{{ jadwalUntukDibayar.angsuran_ke }}</h3>
        <form @submit.prevent="handleFormBayar">
          <div class="form-group">
            <label>Bayar Pokok</label>
            <input type="number" v-model="formBayar.bayar_pokok" />
          </div>
          <div class="form-group">
            <label>Bayar Jasa</label>
            <input type="number" v-model="formBayar.bayar_jasa" />
          </div>
          <button type="submit">Konfirmasi Pembayaran</button>
          <button type="button" @click="jadwalUntukDibayar = null">
            Batal
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const pinjamanId = route.params.id;
const pinjaman = ref(null);

// --- STATE BARU UNTUK FORM PEMBAYARAN ---
const jadwalUntukDibayar = ref(null); // Menyimpan data jadwal yg akan dibayar
const formBayar = ref({
  bayar_pokok: 0,
  bayar_jasa: 0,
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka
  );

const fetchPinjamanDetail = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/pinjaman/${pinjamanId}`
    );
    pinjaman.value = response.data;
  } catch (error) {
    console.error("Gagal memuat detail pinjaman:", error);
  }
};

// --- FUNGSI BARU UNTUK MEMBUKA FORM ---
const bukaFormBayar = (jadwal) => {
  jadwalUntukDibayar.value = jadwal;
  // Isi form dengan sisa tagihan
  formBayar.value.bayar_pokok =
    parseFloat(jadwal.jumlah_angsuran_pokok) - parseFloat(jadwal.pokok_dibayar);
  formBayar.value.bayar_jasa =
    parseFloat(jadwal.jumlah_angsuran_jasa) - parseFloat(jadwal.jasa_dibayar);
};

// --- FUNGSI BARU UNTUK SUBMIT FORM BAYAR ---
const handleFormBayar = async () => {
  if (!jadwalUntukDibayar.value) return;

  const jadwalId = jadwalUntukDibayar.value.id;
  try {
    await axios.post(
      `http://localhost:5000/api/pinjaman/bayar/${jadwalId}`,
      formBayar.value
    );
    alert("Pembayaran berhasil!");
    jadwalUntukDibayar.value = null; // Tutup modal
    fetchPinjamanDetail(); // Refresh data
  } catch (error) {
    alert(error.response?.data?.message || "Gagal melakukan pembayaran.");
    console.error("Error saat bayar angsuran:", error);
  }
};

onMounted(fetchPinjamanDetail);
</script>

<style scoped>
/* ... style lama ... */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.modal-content button {
  margin-top: 10px;
  margin-right: 10px;
}
</style>
