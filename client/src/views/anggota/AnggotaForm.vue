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
        />
      </div>
      <button type="submit">Simpan Perubahan</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";

const formData = ref({
  nama: "",
  tgl_masuk: "",
  status: "aktif", // Default status
});

const router = useRouter();
const route = useRoute(); // Untuk mengakses parameter URL
const memberId = route.params.id;

// Mengecek apakah kita dalam mode 'edit'
const isEditMode = computed(() => !!memberId);

// Fungsi yang dijalankan saat form disubmit
const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      // Jika mode edit, kirim PUT request
      const dataToUpdate = {
        nama: formData.value.nama,
        status: formData.value.status,
      };
      await axios.put(
        `http://localhost:5000/api/anggota/${memberId}`,
        dataToUpdate
      );
      alert("Data anggota berhasil diperbarui!");
    } else {
      // Jika mode tambah, kirim POST request
      await axios.post("http://localhost:5000/api/anggota", formData.value);
      alert("Anggota baru berhasil ditambahkan!");
    }
    router.push("/data-master/anggota");
  } catch (error) {
    console.error("Error saat menyimpan data:", error);
    alert("Gagal menyimpan data.");
  }
};

// Jika dalam mode edit, ambil data anggota saat komponen dimuat
onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/anggota/${memberId}`
      );
      // Format tanggal agar sesuai dengan input type="date"
      response.data.tgl_masuk = response.data.tgl_masuk.split("T")[0];
      formData.value = response.data;
    } catch (error) {
      console.error("Gagal mengambil data anggota untuk diedit:", error);
    }
  }
});
</script>

<style scoped>
/* Style sama seperti sebelumnya, tidak perlu diubah */
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
