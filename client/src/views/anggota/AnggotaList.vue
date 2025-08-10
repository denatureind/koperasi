<template>
  <div class="anggota-list">
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
            <router-link :to="`/data-master/anggota/edit/${item.id}`">
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
import AnggotaService from "@/services/anggota.service.js";
import { useToast } from "vue-toastification";

const anggota = ref([]);
const toast = useToast();

const fetchAnggota = async () => {
  try {
    const response = await AnggotaService.getAll();
    anggota.value = response.data;
  } catch (error) {
    console.error("Error saat mengambil data anggota:", error);
    toast.error("Gagal memuat data anggota.");
  }
};

const deleteAnggota = async (id) => {
  if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
    try {
      await AnggotaService.delete(id);
      toast.success("Anggota berhasil dihapus.");
      fetchAnggota(); // Muat ulang daftar anggota
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal menghapus anggota.");
      console.error("Error saat menghapus anggota:", error);
    }
  }
};

onMounted(() => {
  fetchAnggota();
});
</script>

<style scoped>
.anggota-list {
  padding: 20px;
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
