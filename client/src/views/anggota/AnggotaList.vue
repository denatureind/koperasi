<template>
  <div class="anggota-list">
    <h1>Daftar Anggota Koperasi</h1>
    <router-link to="/data-master/anggota/tambah">
      <button class="tambah-btn">Tambah Anggota Baru</button>
    </router-link>

    <table>
      <thead>
        <tr>
          <th>Kode Anggota</th>
          <th>Nama</th>
          <th>Tanggal Masuk</th>
          <th>Status</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in anggota" :key="item.id">
          <td>{{ item.kode_anggota }}</td>
          <td>
            <router-link :to="`/data-master/anggota/${item.id}`">{{
              item.nama
            }}</router-link>
          </td>
          <td>{{ new Date(item.tgl_masuk).toLocaleDateString("id-ID") }}</td>
          <td>{{ item.status }}</td>
          <td>
            <router-link :to="`/anggota/edit/${item.id}`">
              <button class="edit-btn">Edit</button>
            </router-link>
            <button @click="deleteAnggota(item.id)" class="hapus-btn">
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const anggota = ref([]);

const fetchAnggota = async () => {
  try {
    const response = await axios.get("http://localhost:5000/api/anggota");
    anggota.value = response.data;
  } catch (error) {
    console.error("Error saat mengambil data anggota:", error);
  }
};

// --- FUNGSI BARU UNTUK MENGHAPUS ANGGOTA ---
const deleteAnggota = async (id) => {
  // Konfirmasi sebelum menghapus
  if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
    try {
      await axios.delete(`http://localhost:5000/api/anggota/${id}`);
      alert("Anggota berhasil dihapus.");
      // Muat ulang daftar anggota setelah berhasil menghapus
      fetchAnggota();
    } catch (error) {
      console.error("Error saat menghapus anggota:", error);
      alert("Gagal menghapus anggota.");
    }
  }
};

onMounted(() => {
  fetchAnggota();
});
</script>

<style scoped>
/* ... style lama ... */
.tambah-btn,
.edit-btn,
.hapus-btn {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-right: 5px;
}
.edit-btn {
  background-color: #ffc107;
}
.hapus-btn {
  background-color: #dc3545;
}
.tambah-btn {
  margin-bottom: 20px;
  padding: 10px 15px;
  background-color: #007bff;
  font-size: 16px;
}
</style>
