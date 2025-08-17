<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-16"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"
      ></div>
      <p class="text-gray-600 font-medium">Memuat data anggota...</p>
    </div>

    <div v-else-if="anggota">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            <span class="text-indigo-600">{{ anggota.nama }}</span>
          </h1>
          <div class="flex flex-wrap gap-2 mt-2">
            <span
              class="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-medium"
              >{{ anggota.kode_anggota }}</span
            >
            <span
              class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
              >{{ anggota.jenis_kelamin }}</span
            >
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                anggota.status === 'aktif'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-rose-100 text-rose-800',
              ]"
              >{{ anggota.status }}</span
            >
          </div>
        </div>
        <div class="flex flex-wrap gap-3">
          <button
            @click="openAuthModal('create')"
            class="btn btn-outline btn-primary"
          >
            <i class="fas fa-key"></i>
            <span>Buat Akun Login</span>
          </button>
          <button
            @click="openAuthModal('reset')"
            class="btn btn-outline btn-secondary"
          >
            <i class="fas fa-sync-alt"></i>
            <span>Reset Password</span>
          </button>
          <router-link
            :to="`/data-master/anggota/edit/${memberId}`"
            class="btn btn-primary"
          >
            <i class="fas fa-edit"></i>
            <span>Edit Anggota</span>
          </router-link>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          class="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 shadow-sm"
        >
          <h3 class="text-lg font-semibold text-green-700 mb-3">
            Statistik Keuangan
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <i class="fas fa-piggy-bank text-green-500 w-6"></i
              ><span class="text-gray-600 ml-2"
                >Total Simpanan: {{ formatUang(totalSimpanan) }}</span
              >
            </div>
            <div class="flex items-center">
              <i class="fas fa-hand-holding-usd text-green-500 w-6"></i
              ><span class="text-gray-600 ml-2"
                >Total Pinjaman: {{ formatUang(totalPinjaman) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10">
        <div
          class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
        >
          <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i class="fas fa-piggy-bank text-indigo-500"></i> Rekening Simpanan
          </h2>
          <button
            @click="showForm = !showForm"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-sm',
              showForm
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gradient-to-r from-green-600 to-green-700 text-white',
            ]"
          >
            <i :class="showForm ? 'fas fa-times' : 'fas fa-plus'"></i
            ><span>{{ showForm ? "Tutup Form" : "Tambah Rekening" }}</span>
          </button>
        </div>

        <div
          v-if="showForm"
          class="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Form Rekening Baru
          </h3>
          <form @submit.prevent="handleBuatRekening">
            <div class="mb-4">
              <label
                class="block text-gray-700 font-medium mb-2"
                for="jenis_simpanan"
                >Jenis Simpanan</label
              >
              <select
                id="jenis_simpanan"
                v-model="rekeningBaru.jenis_simpanan"
                required
                class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200"
              >
                <option disabled value="">Pilih Jenis Simpanan</option>
                <option
                  v-for="jenis in listJenisSimpanan"
                  :key="jenis.id"
                  :value="jenis.nama_jenis"
                >
                  {{ jenis.nama_jenis }}
                </option>
              </select>
            </div>
            <div class="flex justify-end gap-3">
              <button
                type="button"
                @click="showForm = false"
                class="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                class="px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 text-white"
              >
                Simpan Rekening
              </button>
            </div>
          </form>
        </div>
        <div
          v-if="rekeningSimpanan.length > 0"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Jenis Simpanan
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  No. Rekening
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                >
                  Saldo
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="rekening in rekeningSimpanan"
                :key="rekening.id"
                class="hover:bg-gray-50"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                >
                  {{ rekening.jenis_simpanan }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ rekening.no_rekening }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatUang(rekening.saldo) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                >
                  <router-link
                    :to="`/simpanan/rekening/${rekening.id}`"
                    class="text-indigo-600 hover:text-indigo-800"
                    >Lihat</router-link
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          v-else
          class="bg-white rounded-xl border border-gray-200 p-8 text-center"
        >
          <p>Belum ada rekening simpanan</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <h2 class="text-xl font-bold text-gray-800">Anggota tidak ditemukan</h2>
      <p class="mt-2 text-gray-600">
        Silakan periksa kembali tautan yang Anda tuju.
      </p>
    </div>

    <dialog ref="authModalRef" id="auth_modal" class="modal">
      <div class="modal-box">
        <h3 class="font-bold text-lg text-gray-800">
          {{ modalMode === "create" ? "Buat Akun Login" : "Reset Password" }}
          untuk {{ anggota?.nama }}
        </h3>
        <form @submit.prevent="handleAuthSubmit" class="py-4 space-y-4">
          <div class="form-control" v-if="modalMode === 'create'">
            <label class="label"
              ><span class="label-text">Username</span></label
            >
            <input
              type="text"
              v-model="authForm.username"
              class="input input-bordered w-full"
              required
            />
          </div>
          <div class="form-control">
            <label class="label"
              ><span class="label-text">Password Baru</span></label
            >
            <input
              type="password"
              v-model="authForm.password"
              class="input input-bordered w-full"
              placeholder="Masukkan password baru"
              required
            />
          </div>
          <div class="modal-action mt-6">
            <button type="button" class="btn" @click="closeAuthModal">
              Batal
            </button>
            <button type="submit" class="btn btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import AnggotaService from "@/services/anggota.service.js";
import SimpananService from "@/services/simpanan.service.js";
import PinjamanService from "@/services/pinjaman.service.js";
import JenisSimpananService from "@/services/jenisSimpanan.service.js";

const route = useRoute();
const toast = useToast();
const memberId = route.params.id;

const anggota = ref(null);
const rekeningSimpanan = ref([]);
const rekeningPinjaman = ref([]);
const listJenisSimpanan = ref([]);
const showForm = ref(false);
const isLoading = ref(true);
const rekeningBaru = ref({ jenis_simpanan: "" });

const authModalRef = ref(null);
const modalMode = ref("create");

const totalSimpanan = computed(() =>
  rekeningSimpanan.value.reduce((sum, item) => sum + parseFloat(item.saldo), 0)
);
const totalPinjaman = computed(() =>
  rekeningPinjaman.value.reduce(
    (sum, item) => sum + parseFloat(item.jumlah_pinjaman),
    0
  )
);

const authForm = ref({
  anggota_id: parseInt(memberId),
  username: "",
  password: "",
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

const fetchAllData = async () => {
  isLoading.value = true;
  try {
    const [anggotaRes, simpananRes, pinjamanRes, jenisSimpananRes] =
      await Promise.all([
        AnggotaService.getById(memberId),
        SimpananService.getRekeningByAnggotaId(memberId),
        PinjamanService.getByAnggotaId(memberId),
        JenisSimpananService.getAll(),
      ]);
    anggota.value = anggotaRes.data;
    rekeningSimpanan.value = simpananRes.data;
    rekeningPinjaman.value = pinjamanRes.data;
    listJenisSimpanan.value = jenisSimpananRes.data;
  } catch (error) {
    toast.error("Gagal memuat data detail anggota.");
  } finally {
    isLoading.value = false;
  }
};

const handleBuatRekening = async () => {
  if (!rekeningBaru.value.jenis_simpanan) {
    toast.error("Silakan pilih jenis simpanan.");
    return;
  }
  try {
    const payload = {
      anggota_id: parseInt(memberId),
      jenis_simpanan: rekeningBaru.value.jenis_simpanan,
    };
    await SimpananService.createRekening(payload);
    toast.success("Rekening baru berhasil dibuat!");
    await fetchAllData();
    showForm.value = false;
    rekeningBaru.value.jenis_simpanan = "";
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Gagal membuat rekening baru."
    );
  }
};

const openAuthModal = (mode) => {
  modalMode.value = mode;
  authForm.value.password = "";
  if (mode === "create") {
    authForm.value.username = anggota.value.kode_anggota.toLowerCase();
  }
  if (authModalRef.value) {
    authModalRef.value.showModal();
  }
};

const closeAuthModal = () => {
  if (authModalRef.value) {
    authModalRef.value.close();
  }
};

const handleAuthSubmit = async () => {
  try {
    if (modalMode.value === "create") {
      await AnggotaService.createLogin(authForm.value);
      toast.success(`Akun login untuk ${anggota.value.nama} berhasil dibuat.`);
    } else {
      await AnggotaService.resetPassword({
        anggota_id: authForm.value.anggota_id,
        password: authForm.value.password,
      });
      toast.success(`Password untuk ${anggota.value.nama} berhasil direset.`);
    }
    closeAuthModal();
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal memproses permintaan.");
  }
};

onMounted(fetchAllData);
</script>
