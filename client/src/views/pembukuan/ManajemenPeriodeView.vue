<template>
  <div class="p-6 space-y-6">
    <div
      class="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200"
    >
      <div>
        <h1 class="text-3xl font-semibold text-gray-900">Manajemen Periode</h1>
        <p class="text-gray-600 mt-1">
          Kelola tahun buku dan proses tutup buku.
        </p>
      </div>
      <button
        @click="showModal = true"
        class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
      >
        <span>+</span> Tambah Periode
      </button>
    </div>

    <div
      class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      <div class="overflow-x-auto">
        <table class="min-w-full table-auto">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Periode
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mulai
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Selesai
              </th>
              <th
                class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="periodeList.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                Belum ada data periode. Silakan tambah baru.
              </td>
            </tr>
            <tr
              v-for="periode in periodeList"
              :key="periode.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
              >
                {{ periode.nama_periode }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(periode.tgl_mulai) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ formatDate(periode.tgl_selesai) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    periode.status === 'open'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800',
                  ]"
                >
                  {{ periode.status === "open" ? "Aktif" : "Tutup Buku" }}
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              >
                <button
                  v-if="periode.status === 'open'"
                  @click="handleTutupBuku(periode)"
                  class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                  :disabled="isLoading"
                >
                  <span v-if="isLoading && processingId === periode.id"
                    >Proses...</span
                  >
                  <span v-else>Tutup Buku</span>
                </button>
                <span v-else class="text-gray-400 italic text-xs">Selesai</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="closeModal"
        ></div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
              id="modal-title"
            >
              Tambah Periode Baru
            </h3>
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >Nama Periode</label
                >
                <input
                  v-model="form.nama_periode"
                  type="text"
                  placeholder="Contoh: Periode 2025"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tanggal Mulai</label
                  >
                  <input
                    v-model="form.tgl_mulai"
                    type="date"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >Tanggal Selesai</label
                  >
                  <input
                    v-model="form.tgl_selesai"
                    type="date"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              @click="submitPeriode"
              :disabled="isSubmitting"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
            >
              {{ isSubmitting ? "Menyimpan..." : "Simpan" }}
            </button>
            <button
              @click="closeModal"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import { useToast } from "vue-toastification";
import PeriodeService from "@/services/periode.service.js";

const periodeList = ref([]);
const isLoading = ref(false);
const isSubmitting = ref(false);
const processingId = ref(null); // Untuk loading spesifik per baris
const showModal = ref(false);
const toast = useToast();

// Form State
const form = reactive({
  nama_periode: "",
  tgl_mulai: "",
  tgl_selesai: "",
});

// Helper Format Tanggal
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const fetchPeriode = async () => {
  try {
    const response = await PeriodeService.getAll();
    periodeList.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat daftar periode.");
  }
};

const closeModal = () => {
  showModal.value = false;
  // Reset form
  form.nama_periode = "";
  form.tgl_mulai = "";
  form.tgl_selesai = "";
};

const submitPeriode = async () => {
  if (!form.nama_periode || !form.tgl_mulai || !form.tgl_selesai) {
    toast.warning("Mohon lengkapi semua data!");
    return;
  }

  isSubmitting.value = true;
  try {
    await PeriodeService.create(form);
    toast.success("Periode berhasil dibuat!");
    closeModal();
    fetchPeriode(); // Refresh tabel
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal membuat periode.");
  } finally {
    isSubmitting.value = false;
  }
};

const handleTutupBuku = async (periode) => {
  if (
    confirm(
      `Anda yakin ingin menutup periode "${periode.nama_periode}"? \n\nPERINGATAN: \n1. Sistem akan membuat jurnal penutup otomatis.\n2. Periode baru akan dibuat otomatis.\n3. Aksi ini tidak dapat dibatalkan.`
    )
  ) {
    isLoading.value = true;
    processingId.value = periode.id;

    try {
      // KIRIM ID KE SERVICE
      const response = await PeriodeService.tutupBuku(periode.id);

      toast.success(response.data.message, { timeout: 5000 });
      await fetchPeriode();
    } catch (error) {
      toast.error(error.response?.data?.message || "Proses tutup buku gagal.");
    } finally {
      isLoading.value = false;
      processingId.value = null;
    }
  }
};

onMounted(fetchPeriode);
</script>
