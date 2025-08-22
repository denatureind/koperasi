<template>
  <div class="max-w-7xl mx-auto">
    <!-- Header Section -->
    <div class="mb-8">
      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              class="w-6 h-6 text-indigo-600 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9"
              />
            </svg>
            Daftar Akun Kas & Bank
          </h1>
          <p class="text-gray-500 mt-2 text-sm">
            Kelola semua akun kas dan rekening bank yang digunakan oleh koperasi
          </p>
        </div>
        <button
          @click="openModal"
          class="btn-primary flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Tambah Akun Baru</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-16">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"
      ></div>
      <p class="mt-4 text-gray-600 text-sm">Memuat data akun...</p>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="akunList.length === 0"
      class="text-center py-16 bg-white rounded-xl border border-gray-200"
    >
      <svg
        class="w-16 h-16 text-gray-300 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">
        Belum ada akun kas & bank
      </h3>
      <p class="mt-2 text-gray-500 text-sm">
        Mulai dengan menambahkan akun kas atau bank pertama Anda
      </p>
      <button
        @click="openModal"
        class="btn-primary mt-6 flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-colors duration-200 mx-auto"
      >
        <svg
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>Tambah Akun Pertama</span>
      </button>
    </div>

    <!-- Data Table -->
    <div
      v-else
      class="bg-white rounded-xl border border-gray-200 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Akun
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nomor Rekening
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Nama Bank
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Saldo Sekarang
              </th>
              <th
                class="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Aksi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="akun in akunList"
              :key="akun.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div
                    class="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3"
                  >
                    <svg
                      class="w-4 h-4 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-4 0H9m4 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v12m4 0V9"
                      />
                    </svg>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ akun.nama_akun }}
                    </div>
                    <div class="text-sm text-gray-500">
                      Akun {{ akun.nama_bank ? "Bank" : "Kas" }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ akun.nomor_rekening || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ akun.nama_bank || "-" }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <span class="font-semibold text-gray-900">
                  {{ formatUang(akun.saldo_sekarang) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <div class="flex items-center justify-end space-x-3">
                  <button
                    class="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    class="text-rose-600 hover:text-rose-900 transition-colors duration-200"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modalOpen" class="fixed inset-0 z-50 overflow-y-auto">
      <div
        class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            class="absolute inset-0 bg-gray-500 bg-opacity-75"
            @click="closeModal"
          ></div>
        </div>

        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >

        <div
          class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          <div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Tambah Akun Baru
              </h3>
              <div class="mt-6 space-y-4">
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 text-left mb-2"
                  >
                    Nama Akun
                  </label>
                  <input
                    v-model="formData.nama_akun"
                    type="text"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Contoh: Kas Utama, BCA Koperasi, dll"
                  />
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 text-left mb-2"
                  >
                    Kode Akun Terkait (COA)
                  </label>
                  <select
                    v-model="formData.kode_akun_id"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option disabled :value="null">Pilih Kode Akun</option>
                    <option
                      v-for="akun in akunUntukForm"
                      :key="akun.id"
                      :value="akun.id"
                    >
                      {{ akun.nama_akun }}
                    </option>
                  </select>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 text-left mb-2"
                    >
                      Nomor Rekening (Opsional)
                    </label>
                    <input
                      v-model="formData.nomor_rekening"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: 1234567890"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-sm font-medium text-gray-700 text-left mb-2"
                    >
                      Nama Bank (Opsional)
                    </label>
                    <input
                      v-model="formData.nama_bank"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Contoh: BCA, BNI, Mandiri, dll"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 text-left mb-2"
                  >
                    Saldo Awal
                  </label>
                  <input
                    v-model.number="formData.saldo_awal"
                    type="number"
                    step="1"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="mt-8 sm:mt-10 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
          >
            <button
              type="button"
              @click="closeModal"
              class="w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-1 sm:text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              @click="handleFormSubmit"
              class="mt-3 sm:mt-0 w-full inline-flex justify-center rounded-md border border-transparent px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import KasBankService from "@/services/kasBank.service.js";
import AkunService from "@/services/akun.service.js";
import { useToast } from "vue-toastification";

const toast = useToast();
const modalOpen = ref(false);

const akunList = ref([]);
const isLoading = ref(true);
const akunUntukForm = ref([]);
const formData = ref({
  nama_akun: "",
  nomor_rekening: "",
  nama_bank: "",
  saldo_awal: 0,
  kode_akun_id: null,
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);

const fetchAkun = async () => {
  try {
    isLoading.value = true;
    const response = await KasBankService.getAll();
    akunList.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat daftar akun.");
    console.error("Error fetching accounts:", error);
  } finally {
    isLoading.value = false;
  }
};

const fetchKodeAkun = async () => {
  try {
    const response = await AkunService.getAkunUntukKasBank();
    akunUntukForm.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat data kode akun untuk form.");
    console.error("Error fetching kode akun:", error);
  }
};

const openModal = () => {
  formData.value = {
    nama_akun: "",
    nomor_rekening: "",
    nama_bank: "",
    saldo_awal: 0,
    kode_akun_id: null,
  };
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
};

const handleFormSubmit = async () => {
  try {
    await KasBankService.create(formData.value);
    toast.success("Akun baru berhasil ditambahkan!");
    closeModal();
    fetchAkun();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Gagal menambahkan akun baru."
    );
    console.error("Error creating account:", error);
  }
};

onMounted(() => {
  fetchAkun();
  fetchKodeAkun();
});
</script>

<style scoped>
.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 1px 3px 0 rgba(99, 102, 241, 0.3),
    0 1px 2px 0 rgba(99, 102, 241, 0.2);
}

.btn-primary:hover {
  background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3),
    0 2px 4px -1px rgba(99, 102, 241, 0.2);
}
</style>
