<template>
  <div class="detail-container" v-if="anggota">
    <h1>Detail Anggota: {{ anggota.nama }}</h1>
    <div class="info-card">
      <p><strong>Kode Anggota:</strong> {{ anggota.kode_anggota }}</p>
      <p><strong>Status:</strong> {{ anggota.status }}</p>
      <p>
        <strong>Tanggal Bergabung:</strong>
        {{ new Date(anggota.tgl_masuk).toLocaleDateString("id-ID") }}
      </p>
    </div>

    <hr />

    <h2>Rekening Simpanan</h2>
    <button @click="showForm = !showForm" class="tambah-btn">
      {{ showForm ? "Tutup Form" : "Tambah Rekening Baru" }}
    </button>

    <div v-if="showForm" class="form-card">
      <h3>Form Rekening Baru</h3>
      <form @submit.prevent="handleBuatRekening">
        <div class="form-group">
          <label for="jenis_simpanan">Jenis Simpanan</label>
          <select id="jenis_simpanan" v-model="rekeningBaru.jenis_simpanan">
            <option value="Sukarela">Sukarela</option>
            <option value="Wajib">Wajib</option>
            <option value="Pokok">Pokok</option>
          </select>
        </div>
        <button type="submit">Simpan Rekening</button>
      </form>
    </div>

    <table v-if="rekeningSimpanan.length > 0">
      <thead>
        <tr>
          <th>No. Rekening</th>
          <th>Jenis Simpanan</th>
          <th>Saldo</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rek in rekeningSimpanan" :key="rek.id">
          <td>
            <router-link :to="`/rekening/${rek.id}`">{{
              rek.no_rekening
            }}</router-link>
          </td>
          <td>{{ rek.jenis_simpanan }}</td>
          <td>Rp {{ new Intl.NumberFormat("id-ID").format(rek.saldo) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Anggota ini belum memiliki rekening simpanan.</p>

    <hr />

    <h2>Rekening Pinjaman</h2>
    <router-link :to="`/anggota/${memberId}/pinjaman/tambah`">
      <button class="tambah-btn">Ajukan Pinjaman Baru</button>
    </router-link>
    <table v-if="rekeningPinjaman.length > 0">
      <thead>
        <tr>
          <th>No. Pinjaman</th>
          <th>Jumlah Pinjaman</th>
          <th>Tenor</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pinjaman in rekeningPinjaman" :key="pinjaman.id">
          <td>
            <router-link :to="`/pinjaman/${pinjaman.id}`">{{
              pinjaman.no_pinjaman
            }}</router-link>
          </td>
          <td>
            Rp
            {{
              new Intl.NumberFormat("id-ID").format(pinjaman.jumlah_pinjaman)
            }}
          </td>
          <td>{{ pinjaman.tenor }} bulan</td>
          <td>{{ pinjaman.status }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Anggota ini tidak memiliki pinjaman aktif.</p>
  </div>
  <div v-else>
    <p>Memuat data...</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
const memberId = route.params.id;

const anggota = ref(null);
const rekeningSimpanan = ref([]);
const rekeningPinjaman = ref([]);
const showForm = ref(false);
const rekeningBaru = ref({
  jenis_simpanan: "Sukarela",
});

// Hanya satu fungsi untuk mengambil semua data saat halaman dimuat
const fetchAllData = async () => {
  try {
    const [anggotaRes, simpananRes, pinjamanRes] = await Promise.all([
      axios.get(`http://localhost:5000/api/anggota/${memberId}`),
      axios.get(
        `http://localhost:5000/api/simpanan/rekening/anggota/${memberId}`
      ),
      axios.get(`http://localhost:5000/api/pinjaman/anggota/${memberId}`),
    ]);
    anggota.value = anggotaRes.data;
    rekeningSimpanan.value = simpananRes.data;
    rekeningPinjaman.value = pinjamanRes.data;
  } catch (error) {
    console.error("Gagal memuat data detail:", error);
  }
};

// Fungsi ini spesifik untuk merefresh list simpanan setelah membuat baru
const fetchRekeningSimpanan = async () => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/simpanan/rekening/anggota/${memberId}`
    );
    rekeningSimpanan.value = response.data;
  } catch (error) {
    console.error("Error mengambil rekening simpanan:", error);
  }
};

const handleBuatRekening = async () => {
  try {
    const payload = {
      anggota_id: parseInt(memberId),
      jenis_simpanan: rekeningBaru.value.jenis_simpanan,
    };
    await axios.post("http://localhost:5000/api/simpanan/rekening", payload);
    alert("Rekening baru berhasil dibuat!");
    fetchRekeningSimpanan(); // Refresh daftar rekening
    showForm.value = false;
    rekeningBaru.value.jenis_simpanan = "Sukarela";
  } catch (error) {
    console.error("Gagal membuat rekening:", error);
    alert("Gagal membuat rekening baru.");
  }
};

onMounted(fetchAllData);
</script>

<style scoped>
/* Style Anda sudah benar, tidak perlu diubah */
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
.tambah-btn {
  margin-bottom: 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 15px;
}
.form-card {
  background-color: #f9f9f9;
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.form-group {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
}
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
