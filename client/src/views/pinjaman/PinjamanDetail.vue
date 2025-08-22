<template>
  <div v-if="isLoading" class="text-center py-16">
    <div class="flex justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
      ></div>
    </div>
    <p class="mt-4 text-gray-600">Memuat detail pinjaman...</p>
  </div>
  <div
    v-else-if="pinjaman"
    class="space-y-6 p-4 md:p-6 bg-gray-50 min-h-screen"
  >
    <!-- Breadcrumb dan Judul -->
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Detail Pinjaman</h1>
        <div class="text-sm breadcrumbs">
          <ul class="flex space-x-2 text-gray-600">
            <li>
              <router-link
                to="/pinjaman"
                class="text-blue-500 hover:text-blue-700"
                >Manajemen Pinjaman</router-link
              >
            </li>
            <li class="text-gray-400">/</li>
            <li class="font-medium">{{ pinjaman.no_pinjaman }}</li>
          </ul>
        </div>
      </div>
      <button
        v-if="pinjaman.status === 'aktif'"
        @click="openPelunasanModal"
        class="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md flex items-center"
      >
        <i class="fas fa-money-bill-wave mr-2"></i>
        Lakukan Pelunasan Dipercepat
      </button>
    </div>

    <!-- Grid Informasi Pinjaman -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Kartu Data Tagihan -->
      <div
        class="lg:col-span-2 card bg-white shadow-sm rounded-xl border border-gray-200"
      >
        <div class="card-body p-6">
          <h2 class="card-title text-lg font-semibold text-gray-800 mb-4">
            Data Tagihan
          </h2>
          <div class="space-y-4">
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="text-gray-600">Peminjam</span>
              <span class="font-semibold text-gray-800"
                >{{ pinjaman.nama_anggota }} [{{ pinjaman.kode_anggota }}]</span
              >
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="text-gray-600">No. Kredit</span>
              <span class="font-semibold text-gray-800">{{
                pinjaman.no_pinjaman
              }}</span>
            </div>
            <div
              class="flex justify-between items-center py-2 border-b border-gray-100"
            >
              <span class="text-gray-600">Tenor</span>
              <span class="font-semibold text-gray-800"
                >{{ pinjaman.tenor }} Bulan</span
              >
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-gray-600">Status</span>
              <span
                class="badge bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                {{ pinjaman.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Kartu Plafon -->
      <div
        class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl rounded-xl"
      >
        <div class="card-body p-6">
          <div class="space-y-5">
            <div>
              <div class="text-sm opacity-90">Plafon</div>
              <div class="text-2xl font-bold mt-1">
                {{ formatUang(pinjaman.jumlah_pinjaman) }}
              </div>
            </div>
            <div>
              <div class="text-sm opacity-90">Jasa Terhitung</div>
              <div class="text-xl font-semibold mt-1">
                {{ formatUang(pinjaman.jasa_terhitung) }}
              </div>
            </div>
            <div>
              <div class="text-sm opacity-90">Sisa Pokok</div>
              <div class="text-xl font-semibold mt-1">
                {{ formatUang(pinjaman.sisa_pokok) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabel Angsuran -->
    <div class="card bg-white shadow-sm rounded-xl border border-gray-200">
      <div class="card-body p-6">
        <h2 class="card-title text-lg font-semibold text-gray-800 mb-4">
          List Angsuran Pinjaman
        </h2>
        <div class="overflow-x-auto mt-4">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Ke-
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jatuh Tempo
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pokok
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jasa
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Pokok Dibayar
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jasa Dibayar
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="jadwal in pinjaman.jadwal_angsuran"
                :key="jadwal.id"
                class="hover:bg-blue-50"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {{ jadwal.angsuran_ke }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{
                    new Date(jadwal.tgl_jatuh_tempo).toLocaleDateString("id-ID")
                  }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right"
                >
                  {{ formatUang(jadwal.jumlah_angsuran_pokok) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right"
                >
                  {{ formatUang(jadwal.jumlah_angsuran_jasa) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right"
                >
                  {{ formatUang(jadwal.pokok_dibayar) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-right"
                >
                  {{ formatUang(jadwal.jasa_dibayar) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    :class="{
                      'bg-green-100 text-green-800':
                        jadwal.status_pembayaran === 'lunas',
                      'bg-yellow-100 text-yellow-800':
                        jadwal.status_pembayaran === 'sebagian_bayar',
                      'bg-gray-100 text-gray-800':
                        jadwal.status_pembayaran === 'belum_bayar',
                    }"
                  >
                    <svg
                      v-if="jadwal.status_pembayaran === 'lunas'"
                      class="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    {{ jadwal.status_pembayaran }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center text-sm">
                  <button
                    @click="bukaFormBayar(jadwal)"
                    class="btn bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors shadow-sm"
                    :disabled="jadwal.status_pembayaran === 'lunas'"
                    :class="{
                      'opacity-50 cursor-not-allowed':
                        jadwal.status_pembayaran === 'lunas',
                    }"
                  >
                    Bayar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal Pembayaran -->
    <div
      v-if="jadwalUntukDibayar"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div class="p-6">
          <h3 class="font-bold text-xl text-gray-800 mb-4">
            Pembayaran Angsuran Ke-{{ jadwalUntukDibayar.angsuran_ke }}
          </h3>
          <form @submit.prevent="handleFormBayar" class="space-y-5">
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-700 font-medium"
                  >Tanggal Bayar</span
                >
              </label>
              <input
                type="date"
                v-model="formBayar.tgl_bayar"
                class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 shadow-sm"
                required
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-700 font-medium"
                  >Bayar Pokok</span
                >
              </label>
              <input
                type="number"
                step="any"
                v-model="formBayar.bayar_pokok"
                class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 shadow-sm"
              />
            </div>
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-700 font-medium"
                  >Bayar Jasa</span
                >
              </label>
              <input
                type="number"
                step="any"
                v-model="formBayar.bayar_jasa"
                class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 shadow-sm"
              />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="jadwalUntukDibayar = null"
                class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                Konfirmasi Pembayaran
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal Pelunasan Dipercepat -->
    <div
      v-if="isPelunasanModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div class="p-6">
          <h3 class="font-bold text-xl text-gray-800 mb-4">
            Pelunasan Dipercepat
          </h3>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between">
              <span class="text-gray-700">Sisa Pokok Pinjaman:</span>
              <span class="font-semibold">{{
                formatUang(pelunasanData.sisa_pokok)
              }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-700">Jasa Bulan Berjalan:</span>
              <span class="font-semibold">{{
                formatUang(pelunasanData.jasa_berjalan)
              }}</span>
            </div>
            <div class="flex justify-between border-t border-gray-200 pt-2">
              <span class="text-gray-700 font-bold"
                >Total yang Harus Dibayar:</span
              >
              <span class="font-bold text-green-600">{{
                formatUang(pelunasanData.total)
              }}</span>
            </div>
          </div>
          <form @submit.prevent="handleConfirmPelunasan" class="space-y-5">
            <div class="form-control">
              <label class="label">
                <span class="label-text text-gray-700 font-medium"
                  >Tanggal Bayar</span
                >
              </label>
              <input
                type="date"
                v-model="pelunasanData.tgl_bayar"
                class="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg p-3 shadow-sm"
                required
              />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="isPelunasanModalOpen = false"
                class="btn bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
              >
                Konfirmasi Pelunasan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-16">
    <h2 class="text-xl font-bold text-gray-800">Pinjaman tidak ditemukan</h2>
    <p class="mt-2 text-gray-600">
      Silakan periksa kembali tautan yang Anda tuju.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import PinjamanService from "@/services/pinjaman.service.js";
import { useToast } from "vue-toastification";

const route = useRoute();
const toast = useToast(); // Inisialisasi toast
const pinjamanId = route.params.id;

const pinjaman = ref(null);
const isLoading = ref(true);
const jadwalUntukDibayar = ref(null);
const formBayar = ref({
  tgl_bayar: new Date().toISOString().split("T")[0],
  bayar_pokok: 0,
  bayar_jasa: 0,
});

const isPelunasanModalOpen = ref(false);
const pelunasanData = ref({
  sisa_pokok: 0,
  jasa_berjalan: 0,
  total: 0,
  tgl_bayar: new Date().toISOString().split("T")[0],
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

const fetchPinjamanDetail = async () => {
  isLoading.value = true;
  try {
    // Diperbaiki: Gunakan PinjamanService
    const response = await PinjamanService.getById(pinjamanId);
    pinjaman.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat detail pinjaman.");
    console.error("Gagal memuat detail pinjaman:", error);
  } finally {
    isLoading.value = false;
  }
};

const bukaFormBayar = (jadwal) => {
  jadwalUntukDibayar.value = jadwal;
  formBayar.value.bayar_pokok =
    parseFloat(jadwal.jumlah_angsuran_pokok) - parseFloat(jadwal.pokok_dibayar);
  formBayar.value.bayar_jasa =
    parseFloat(jadwal.jumlah_angsuran_jasa) - parseFloat(jadwal.jasa_dibayar);
};

const handleFormBayar = async () => {
  if (!jadwalUntukDibayar.value) return;
  const jadwalId = jadwalUntukDibayar.value.id;
  try {
    // Diperbaiki: Gunakan PinjamanService
    await PinjamanService.bayarAngsuran(jadwalId, formBayar.value);
    toast.success("Pembayaran berhasil!");
    jadwalUntukDibayar.value = null;
    fetchPinjamanDetail();
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal melakukan pembayaran.");
    console.error("Error saat bayar angsuran:", error);
  }
};

const openPelunasanModal = () => {
  const angsuranBelumBayar = pinjaman.value.jadwal_angsuran.find(
    (j) => j.status_pembayaran === "belum_bayar"
  );

  pelunasanData.value.sisa_pokok = parseFloat(pinjaman.value.sisa_pokok);
  pelunasanData.value.jasa_berjalan = angsuranBelumBayar
    ? parseFloat(angsuranBelumBayar.jumlah_angsuran_jasa)
    : 0;
  pelunasanData.value.total =
    pelunasanData.value.sisa_pokok + pelunasanData.value.jasa_berjalan;

  isPelunasanModalOpen.value = true;
};

const handleConfirmPelunasan = async () => {
  try {
    await PinjamanService.lunasi(pinjamanId, {
      tgl_bayar: pelunasanData.value.tgl_bayar,
    });
    toast.success("Pelunasan berhasil!");
    isPelunasanModalOpen.value = false;
    fetchPinjamanDetail();
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal melakukan pelunasan.");
    console.error("Error saat melunasi pinjaman:", error);
  }
};

onMounted(fetchPinjamanDetail);
</script>

<style scoped>
.breadcrumbs ul {
  display: flex;
  padding: 0;
  list-style: none;
  margin-top: 8px;
}

.breadcrumbs li:not(:last-child)::after {
  content: "/";
  margin: 0 8px;
  color: #9ca3af;
}

.card {
  transition: all 0.3s ease;
}

.btn {
  transition: background-color 0.2s, transform 0.2s;
}

.btn:active {
  transform: scale(0.98);
}
</style>
