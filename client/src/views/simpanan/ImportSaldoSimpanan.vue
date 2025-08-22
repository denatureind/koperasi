<template>
  <div class="p-6 space-y-6">
    <!-- Card Container -->
    <div class="bg-white shadow-lg rounded-lg border border-gray-200">
      <div class="p-6">
        <h1 class="text-3xl font-semibold text-gray-900">
          Impor Saldo Awal Simpanan
        </h1>
        <p class="text-gray-600 mt-2 mb-6">
          Unggah file CSV berisi saldo akhir simpanan anggota dari sistem lama.
        </p>

        <!-- Step 1: Upload File (v-if="step === 'upload'") -->
        <div v-if="step === 'upload'">
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm mb-6">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">
              Langkah 1: Unduh dan Isi Format
            </h3>
            <p class="text-sm text-gray-600 mb-3">
              Unduh format, lalu isi dengan kode anggota, jenis simpanan, dan
              saldo akhir per tutup buku.
            </p>
            <button
              @click="downloadFormat"
              class="btn btn-outline btn-primary hover:bg-primary-600 hover:text-white text-gray-800 btn-sm"
            >
              <i class="fas fa-download mr-2"></i> Unduh Format CSV
            </button>
          </div>

          <!-- Step 2: Upload File -->
          <div class="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 class="font-semibold text-lg text-gray-800 mb-2">
              Langkah 2: Unggah File
            </h3>
            <div class="form-control w-full max-w-md mb-4">
              <label class="label text-gray-800">
                <span class="label-text">Pilih file CSV</span>
              </label>
              <input
                type="file"
                @change="handleFileChange"
                accept=".csv"
                class="file-input file-input-bordered w-full"
              />
            </div>

            <button
              @click="handleAnalyze"
              :disabled="!selectedFile || isLoading"
              class="btn btn-primary w-full hover:bg-primary-600 hover:text-white flex justify-center items-center mt-4"
            >
              <span
                v-if="isLoading"
                class="loading loading-spinner loading-sm mr-2"
              ></span>
              <i v-else class="fas fa-upload mr-2"></i>
              {{ isLoading ? "Memproses..." : "Analisis File" }}
            </button>
          </div>
        </div>

        <!-- Step 2: Preview Results (v-else-if="step === 'preview'") -->
        <div v-else-if="step === 'preview'">
          <h3 class="font-semibold text-lg text-gray-800 mb-4">
            Pratinjau Hasil Impor
          </h3>

          <!-- Preview Table -->
          <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Kode Anggota</th>
                  <th>Jenis Simpanan</th>
                  <th>Saldo Akhir</th>
                  <th>Status</th>
                  <th>Keterangan</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(row, index) in previewData"
                  :key="index"
                  :class="{
                    'bg-green-100': row.status === 'BARU',
                    'bg-yellow-100': row.status === 'UPDATE',
                    'bg-red-100': row.status === 'ERROR',
                  }"
                >
                  <td>{{ row.kode_anggota }}</td>
                  <td>{{ row.jenis_simpanan }}</td>
                  <td>{{ row.saldo_akhir }}</td>
                  <td>
                    <span
                      :class="{
                        'badge badge-success': row.status === 'BARU',
                        'badge badge-warning': row.status === 'UPDATE',
                        'badge badge-error': row.status === 'ERROR',
                      }"
                    >
                      {{ row.status }}
                    </span>
                  </td>
                  <td>{{ row.keterangan }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-4 mt-6">
            <button @click="cancelPreview" class="btn btn-outline btn-error">
              Batal
            </button>
            <button
              @click="executeImport"
              :disabled="isLoading"
              class="btn btn-primary"
            >
              <span
                v-if="isLoading"
                class="loading loading-spinner loading-sm mr-2"
              ></span>
              Konfirmasi & Proses Impor
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import ImportService from "@/services/import.service.js";

const selectedFile = ref(null);
const isLoading = ref(false);
const step = ref("upload");
const previewData = ref([]);
const toast = useToast();
const router = useRouter();

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleAnalyze = async () => {
  if (!selectedFile.value) {
    toast.error("Silakan pilih file untuk diunggah.");
    return;
  }
  isLoading.value = true;
  try {
    const response = await ImportService.analyzeSaldoSimpanan(
      selectedFile.value
    );
    previewData.value = response.data;
    step.value = "preview";
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal menganalisis file.");
  } finally {
    isLoading.value = false;
  }
};

const executeImport = async () => {
  isLoading.value = true;
  try {
    const response = await ImportService.importSaldoSimpanan(
      selectedFile.value
    );
    toast.success(response.data.message);
    router.push("/simpanan/rekening");
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal melakukan impor.");
  } finally {
    isLoading.value = false;
  }
};

const cancelPreview = () => {
  step.value = "upload";
  previewData.value = [];
  selectedFile.value = null;
};

const downloadFormat = () => {
  const header = "kode_anggota,jenis_simpanan,saldo_akhir\n";
  const example =
    "BM-001,Wajib,5000000\nBM-001,Sukarela,1200000\nBM-002,Wajib,4500000\n";
  const csvContent = "data:text/csv;charset=utf-8," + header + example;
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "format_import_saldo_simpanan.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
</script>
