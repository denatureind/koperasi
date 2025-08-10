<template>
  <div class="anggota-form">
    <h1>{{ isEditMode ? "Edit Anggota" : "Tambah Anggota Baru" }}</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="nama">Nama Lengkap</label>
        <input type="text" id="nama" v-model="formData.nama" required />
      </div>
      <div class="form-group" v-if="isEditMode">
        <label for="status">Status</label>
        <select id="status" v-model="formData.status">
          <option value="aktif">Aktif</option>
          <option value="non-aktif">Non-Aktif</option>
        </select>
      </div>
      <div class="form-group">
        <label for="tgl_masuk">Tanggal Masuk</label>
        <input
          type="date"
          id="tgl_masuk"
          v-model="formData.tgl_masuk"
          :disabled="isEditMode"
          required
        />
      </div>
      <button type="submit">
        {{ isEditMode ? "Simpan Perubahan" : "Simpan Anggota" }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router"; // 'useRouter' sekarang akan digunakan
import AnggotaService from "@/services/anggota.service.js";
import { useToast } from "vue-toastification";

const formData = ref({
  nama: "",
  tgl_masuk: "",
  status: "aktif",
});

const router = useRouter(); // Ini yang akan digunakan
const route = useRoute();
const toast = useToast();

// --- DEBUG #1: Cek apakah ID dari URL terbaca ---
const memberId = route.params.id;
console.log("ID Anggota dari URL:", memberId);
// ---------------------------------------------

const isEditMode = computed(() => !!memberId);
console.log("Apakah ini mode Edit?", isEditMode.value);

// --- FUNGSI HANDLE SUBMIT YANG LENGKAP ---
const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      const dataToUpdate = {
        nama: formData.value.nama,
        status: formData.value.status,
      };
      await AnggotaService.update(memberId, dataToUpdate);
      toast.success("Data anggota berhasil diperbarui!");
    } else {
      await AnggotaService.create(formData.value);
      toast.success("Anggota baru berhasil ditambahkan!");
    }
    router.push("/data-master/anggota"); // 'router' digunakan di sini
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    toast.error("Gagal menyimpan data.");
  }
};
// ---------------------------------------

onMounted(async () => {
  if (isEditMode.value) {
    console.log("Mode Edit terdeteksi, mencoba mengambil data...");
    try {
      const response = await AnggotaService.getById(memberId);

      // --- DEBUG #2: Cek data yang diterima dari API ---
      console.log("Data diterima dari API:", response.data);
      // -----------------------------------------------

      response.data.tgl_masuk = response.data.tgl_masuk.split("T")[0];
      formData.value = response.data;
    } catch (error) {
      console.error("Gagal mengambil data anggota untuk diedit:", error);
      toast.error("Gagal memuat data untuk diedit.");
    }
  }
});
</script>

<style scoped>
/* Style standar untuk form */
.anggota-form {
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
input,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
button {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #369b6e;
}
input:disabled {
  background-color: #f2f2f2;
}
</style>
