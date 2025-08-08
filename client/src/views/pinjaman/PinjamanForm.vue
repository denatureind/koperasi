<template>
  <div class="form-container">
    <h1>Form Pengajuan Pinjaman Baru</h1>
    <p v-if="anggota">
      Untuk Anggota: <strong>{{ anggota.nama }}</strong>
    </p>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="jumlah_pinjaman">Jumlah Pinjaman (Rp)</label>
        <input
          type="number"
          id="jumlah_pinjaman"
          v-model="formData.jumlah_pinjaman"
          required
        />
      </div>
      <div class="form-group">
        <label for="tenor">Tenor (Bulan)</label>
        <input type="number" id="tenor" v-model="formData.tenor" required />
      </div>
      <div class="form-group">
        <label for="tingkat_jasa_persen">Jasa per Bulan (%)</label>
        <input
          type="number"
          step="0.1"
          id="tingkat_jasa_persen"
          v-model="formData.tingkat_jasa_persen"
          required
        />
      </div>
      <div class="form-group">
        <label for="tgl_pencairan">Tanggal Pencairan</label>
        <input
          type="date"
          id="tgl_pencairan"
          v-model="formData.tgl_pencairan"
          required
        />
      </div>
      <button type="submit">Ajukan Pinjaman</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import AnggotaService from "@/services/anggota.service.js";
import PinjamanService from "@/services/pinjaman.service.js";

const router = useRouter();
const route = useRoute();
const anggotaId = route.params.anggotaId;

const anggota = ref(null);
const formData = ref({
  anggota_id: parseInt(anggotaId),
  jumlah_pinjaman: 0,
  tenor: 12,
  tingkat_jasa_persen: 1,
  tgl_pencairan: new Date().toISOString().split("T")[0], // Default ke hari ini
});

const handleSubmit = async () => {
  try {
    await PinjamanService.create(formData.value);
    alert("Pinjaman baru berhasil dibuat!");
    router.push(`/anggota/${anggotaId}`); // Kembali ke halaman detail anggota
  } catch (error) {
    console.error("Error saat membuat pinjaman:", error);
    alert("Gagal membuat pinjaman baru.");
  }
};

// Ambil data nama anggota untuk ditampilkan di judul
onMounted(async () => {
  try {
    const response = await AnggotaService.getById(anggotaId);
    anggota.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil data anggota:", error);
  }
});
</script>

<style scoped>
/* Anda bisa salin style dari AnggotaForm.vue dan sesuaikan */
.form-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 30px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}
h1 {
  text-align: center;
  margin-bottom: 10px;
}
p {
  text-align: center;
  margin-bottom: 30px;
  color: #5a6a85;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 8px;
}
button {
  width: 100%;
  padding: 15px;
  background: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}
</style>
