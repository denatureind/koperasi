<template>
  <div>
    <h2>Konfigurasi Persentase SHU</h2>
    <p>
      Ubah nilai persentase di bawah ini untuk periode perhitungan berikutnya.
    </p>
    <form @submit.prevent="handleSave" v-if="configs.length > 0">
      <div v-for="config in configs" :key="config.id" class="form-group">
        <label :for="config.kunci_konfigurasi">{{
          config.nama_konfigurasi
        }}</label>
        <input
          type="number"
          step="0.01"
          v-model="config.nilai"
          :id="config.kunci_konfigurasi"
        />
        <small>{{ config.deskripsi }}</small>
      </div>
      <button type="submit">Simpan Perubahan</button>
    </form>
    <p v-else>Memuat konfigurasi...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import KonfigurasiService from "@/services/konfigurasi.service.js";
import { useToast } from "vue-toastification";

const configs = ref([]);
const toast = useToast();

const fetchConfigs = async () => {
  try {
    const response = await KonfigurasiService.getSHU();
    configs.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data konfigurasi.");
  }
};

const handleSave = async () => {
  console.log("Tombol Simpan diklik! Mengirim data:", configs.value);

  try {
    await KonfigurasiService.updateSHU(configs.value);
    toast.success("Konfigurasi berhasil disimpan!");
  } catch (error) {
    toast.error("Gagal menyimpan perubahan.");
  }
};

onMounted(fetchConfigs);
</script>
<style scoped>
.form-group {
  margin-bottom: 20px;
}
label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}
input {
  padding: 8px;
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
small {
  display: block;
  color: #666;
  margin-top: 5px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
