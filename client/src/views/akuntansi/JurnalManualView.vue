<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <i class="fas fa-file-invoice text-indigo-600"></i>
          Buat Entri Jurnal Umum Manual
        </h1>
        <p class="text-gray-500 mt-1">
          Gunakan form ini untuk mencatat transaksi di luar simpan pinjam,
          seperti beban atau pendapatan lain-lain.
        </p>
      </div>

      <div class="flex items-center gap-3">
        <div
          class="bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100"
        >
          <span class="text-sm text-indigo-700 font-medium">
            Periode: {{ currentPeriodName }}
          </span>
        </div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Transaksi
          </label>
          <input
            type="date"
            v-model="formData.tgl_transaksi"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Keterangan / Nama Transaksi
          </label>
          <input
            type="text"
            v-model="formData.keterangan"
            placeholder="Contoh: Pembayaran Biaya Listrik"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            required
          />
        </div>
      </div>

      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div class="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-800">
            Rincian Jurnal (Debit & Kredit)
          </h3>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="(entri, index) in formData.entri"
            :key="index"
            class="px-6 py-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors"
          >
            <div class="col-span-12 md:col-span-5">
              <select
                v-model="entri.akun_id"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              >
                <option disabled value="">Pilih Akun</option>
                <option
                  v-for="akun in listAkun"
                  :key="akun.id"
                  :value="akun.id"
                >
                  {{ akun.kode }} - {{ akun.nama_akun }}
                </option>
              </select>
            </div>

            <div class="col-span-6 md:col-span-3">
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >Rp</span
                >
                <input
                  type="number"
                  v-model="entri.debit"
                  placeholder="Debit"
                  class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-right"
                />
              </div>
            </div>

            <div class="col-span-6 md:col-span-3">
              <div class="relative">
                <span
                  class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >Rp</span
                >
                <input
                  type="number"
                  v-model="entri.kredit"
                  placeholder="Kredit"
                  class="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors text-right"
                />
              </div>
            </div>

            <div class="col-span-12 md:col-span-1 flex justify-center">
              <button
                type="button"
                @click="hapusBaris(index)"
                class="text-red-500 hover:text-red-700 transition-colors"
                :disabled="formData.entri.length <= 2"
                :class="{
                  'opacity-50 cursor-not-allowed': formData.entri.length <= 2,
                }"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="px-6 py-3 border-t border-gray-200">
          <button
            type="button"
            @click="tambahBaris"
            class="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <i class="fas fa-plus-circle"></i>
            <span>Tambah Baris</span>
          </button>
        </div>
      </div>

      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4"
        >
          <div>
            <div class="flex items-center gap-4">
              <div class="font-medium">
                <span class="text-green-600"
                  >Total Debit: {{ formatUang(totalDebit) }}</span
                >
              </div>
              <div class="font-medium">
                <span class="text-amber-600"
                  >Total Kredit: {{ formatUang(totalKredit) }}</span
                >
              </div>
              <div v-if="!isSeimbang" class="bg-red-50 px-3 py-1 rounded-full">
                <span class="text-red-600 text-sm font-medium"
                  >Tidak Seimbang!</span
                >
              </div>
            </div>
            <p v-if="!isSeimbang" class="text-red-500 text-sm mt-1">
              Total debit dan kredit harus sama
            </p>
          </div>

          <div class="flex gap-3">
            <router-link
              to="/pembukuan/jurnal-umum"
              class="px-5 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </router-link>
            <button
              type="submit"
              class="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="!isSeimbang || isLoading"
            >
              <div class="flex items-center gap-2">
                <span
                  v-if="isLoading"
                  class="loading loading-spinner loading-sm"
                ></span>
                <span>Simpan Jurnal</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { useLaporanStore } from "@/stores/laporan.store.js";
import AkunService from "@/services/akun.service.js";
import JurnalService from "@/services/jurnal.service.js";

const router = useRouter();
const toast = useToast();
const laporanStore = useLaporanStore();
const listAkun = ref([]);
const isLoading = ref(false);

const formData = ref({
  tgl_transaksi: new Date().toISOString().split("T")[0],
  keterangan: "",
  entri: [
    { akun_id: "", debit: 0, kredit: 0 },
    { akun_id: "", debit: 0, kredit: 0 },
  ],
});

const totalDebit = computed(() =>
  formData.value.entri.reduce(
    (sum, item) => sum + (parseFloat(item.debit) || 0),
    0
  )
);
const totalKredit = computed(() =>
  formData.value.entri.reduce(
    (sum, item) => sum + (parseFloat(item.kredit) || 0),
    0
  )
);
const isSeimbang = computed(
  () => totalDebit.value === totalKredit.value && totalDebit.value > 0
);

const tambahBaris = () => {
  formData.value.entri.push({ akun_id: "", debit: 0, kredit: 0 });
};
const hapusBaris = (index) => {
  if (formData.value.entri.length > 2) {
    formData.value.entri.splice(index, 1);
  }
};

const currentPeriodName = computed(() => {
  if (!laporanStore.periodeAktifId || !laporanStore.periodeList.length)
    return "Belum dipilih";

  const period = laporanStore.periodeList.find(
    (p) => p.id === laporanStore.periodeAktifId
  );

  return period ? period.nama_periode : "Belum dipilih";
});

const handleSubmit = async () => {
  if (!isSeimbang.value) {
    toast.error(
      "Jurnal tidak seimbang. Total Debit harus sama dengan Total Kredit."
    );
    return;
  }
  isLoading.value = true;
  try {
    await JurnalService.createManual(formData.value);
    toast.success("Transaksi jurnal berhasil disimpan.");
    router.push("/pembukuan/jurnal-umum");
  } catch (error) {
    toast.error(error.response?.data?.message || "Gagal menyimpan jurnal.");
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const response = await AkunService.getAll();
    listAkun.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat daftar akun.");
  }
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka || 0);
</script>

<style scoped>
.loading {
  border: 2px solid #e5e7eb;
  border-top: 2px solid #4f46e5;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
