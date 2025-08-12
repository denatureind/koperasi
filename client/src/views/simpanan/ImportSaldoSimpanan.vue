<template>
  <div class="p-1">
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-gray-800">
          Impor Saldo Awal Simpanan
        </h1>
        <p class="text-gray-500 mt-1 mb-6">
          Unggah file CSV berisi saldo akhir simpanan anggota dari sistem lama.
        </p>

        <div class="mb-6">
          <h3 class="font-semibold text-lg mb-2">
            Langkah 1: Unduh dan Isi Format
          </h3>
          <p class="text-sm mb-3">
            Unduh format, lalu isi dengan kode anggota, jenis simpanan, dan
            saldo akhir per tutup buku.
          </p>
          <button
            @click="downloadFormat"
            class="btn btn-outline btn-primary btn-sm"
          >
            <i class="fas fa-download mr-2"></i> Unduh Format CSV
          </button>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">Langkah 2: Unggah File</h3>
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Pilih file CSV</span>
            </label>
            <input
              type="file"
              @change="handleFileChange"
              accept=".csv"
              class="file-input file-input-bordered w-full max-w-xs"
            />
          </div>
          <button
            @click="handleImport"
            :disabled="!selectedFile || isLoading"
            class="btn btn-primary mt-4"
          >
            <span
              v-if="isLoading"
              class="loading loading-spinner loading-sm"
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
