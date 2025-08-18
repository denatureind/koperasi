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

        <!-- Step 1: Download Format -->
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
            @click="handleImport"
            :disabled="!selectedFile || isLoading"
            class="btn btn-primary w-full hover:bg-primary-600 hover:text-white flex justify-center items-center mt-4"
          >
            <span
              v-if="isLoading"
              class="loading loading-spinner loading-sm mr-2"
            ></span>
            <i v-else class="fas fa-upload mr-2"></i>
            {{ isLoading ? "Memproses..." : "Mulai Impor" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import ImportService from "@/services/import.service.js"; // Kita perlu buat service ini

const selectedFile = ref(null);
const isLoading = ref(false);
const toast = useToast();
const router = useRouter();

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const handleImport = async () => {
  if (!selectedFile.value) {
    toast.error("Silakan pilih file untuk diunggah.");
    return;
  }
  isLoading.value = true;
  try {
    const response = await ImportService.importSaldoSimpanan(
      selectedFile.value
    );
    toast.success(response.data.message);
    router.push("/simpanan/rekening"); // Arahkan ke daftar rekening setelah sukses
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal melakukan impor.");
  } finally {
    isLoading.value = false;
  }
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
