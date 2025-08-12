<template>
  <div class="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-gray-200"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-800 flex items-center">
          <i class="fas fa-piggy-bank text-indigo-600 mr-3"></i>
          Detail Rekening:
          <span class="font-mono ml-2 text-indigo-700">{{
            rekening?.no_rekening || "..."
          }}</span>
        </h1>
        <p class="text-gray-500 mt-1">
          Kelola rekening simpanan anggota koperasi
        </p>
      </div>
      <div class="bg-indigo-50 px-4 py-2 rounded-lg">
        <span class="text-sm text-indigo-700 font-medium">Saldo:</span>
        <span v-if="rekening" class="text-xl font-bold text-indigo-800 ml-2">
          {{ formatUang(rekening.saldo) }}
        </span>
        <span v-else class="text-lg text-gray-500 animate-pulse"
          >Memuat...</span
        >
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        class="bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 p-6 shadow-sm"
      >
        <h2
          class="text-lg font-semibold text-indigo-800 mb-4 flex items-center"
        >
          <i class="fas fa-info-circle mr-2"></i>
          Informasi Rekening
        </h2>

        <div class="space-y-3" v-if="rekening">
          <div class="flex">
            <span class="w-40 text-gray-600">Jenis Simpanan:</span>
            <span class="font-medium">{{ rekening.jenis_simpanan }}</span>
          </div>
          <div class="flex">
            <span class="w-40 text-gray-600">Tanggal Buka:</span>
            <span>{{
              new Date(rekening.tgl_buka).toLocaleDateString("id-ID")
            }}</span>
          </div>
          <div class="flex">
            <span class="w-40 text-gray-600">Pemilik:</span>
            <span>{{ rekening.nama_anggota }}</span>
          </div>
          <div class="flex">
            <span class="w-40 text-gray-600">Status:</span>
            <span
              class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >Aktif</span
            >
          </div>
        </div>
        <div v-else class="py-8 flex justify-center">
          <i class="fas fa-spinner fa-spin text-indigo-500 text-xl"></i>
        </div>
      </div>

      <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i class="fas fa-exchange-alt mr-2 text-indigo-600"></i>
          Transaksi Baru
        </h2>

        <form @submit.prevent="handleTransaksi" class="space-y-4">
          <div>
            <label
              for="tgl_transaksi"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Tanggal Transaksi</label
            >
            <input
              type="date"
              id="tgl_transaksi"
              v-model="formTransaksi.tgl_transaksi"
              required
              class="py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Jenis Transaksi</label
            >
            <div class="flex space-x-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Setor"
                  v-model="formTransaksi.jenis"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span class="ml-2 flex items-center">
                  <i class="fas fa-arrow-circle-down text-green-500 mr-1"></i>
                  Setor
                </span>
              </label>
              <label class="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="Tarik"
                  v-model="formTransaksi.jenis"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span class="ml-2 flex items-center">
                  <i class="fas fa-arrow-circle-up text-amber-500 mr-1"></i>
                  Tarik
                </span>
              </label>
            </div>
          </div>
          <div>
            <label
              for="jumlah"
              class="block text-sm font-medium text-gray-700 mb-2"
              >Jumlah (Rp)</label
            >
            <div class="relative">
              <div
                class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
              >
                <span class="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="number"
                id="jumlah"
                v-model="formTransaksi.jumlah"
                required
                min="1"
                class="pl-10 py-3 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
              />
            </div>
          </div>
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-4 rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
          >
            <i class="fas fa-paper-plane mr-2"></i>
            Proses Transaksi
          </button>
        </form>
      </div>
    </div>

    <div class="mt-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fas fa-history mr-2 text-indigo-600"></i>
          Riwayat Transaksi
        </h2>
        <div class="text-sm text-gray-500">
          Menampilkan {{ mutasi.length }} transaksi
        </div>
      </div>
      <div class="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tanggal
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jenis
              </th>
              <th
                scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Jumlah
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="trx in mutasi"
              :key="trx.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ new Date(trx.tgl_transaksi).toLocaleDateString("id-ID") }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ new Date(trx.tgl_transaksi).toLocaleTimeString("id-ID") }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="trx.jenis_transaksi === 'Setor'"
                  class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center w-min"
                >
                  <i class="fas fa-arrow-down mr-1"></i> Setor
                </span>
                <span
                  v-else
                  class="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 flex items-center w-min"
                >
                  <i class="fas fa-arrow-up mr-1"></i> Tarik
                </span>
              </td>
              <td
                class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                :class="
                  trx.jenis_transaksi === 'Setor'
                    ? 'text-green-600'
                    : 'text-amber-600'
                "
              >
                {{ trx.jenis_transaksi === "Setor" ? "+" : "-" }}
                {{ formatUang(trx.jumlah) }}
              </td>
            </tr>
            <tr v-if="mutasi.length === 0">
              <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center justify-center">
                  <i class="fas fa-inbox text-3xl text-gray-300 mb-2"></i>
                  <p>Belum ada riwayat transaksi</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import SimpananService from "@/services/simpanan.service.js";

const route = useRoute();
const toast = useToast();
const rekeningId = route.params.id;

const rekening = ref(null);
const mutasi = ref([]);
const formTransaksi = ref({
  jumlah: 0,
  jenis: "Setor",
  tgl_transaksi: new Date().toISOString().split("T")[0],
});

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

const fetchData = async () => {
  try {
    const [rekeningRes, mutasiRes] = await Promise.all([
      SimpananService.getRekeningById(rekeningId),
      SimpananService.getMutasiByRekeningId(rekeningId),
    ]);
    rekening.value = rekeningRes.data;
    mutasi.value = mutasiRes.data;
  } catch (error) {
    toast.error("Gagal memuat data rekening.");
  }
};

const handleTransaksi = async () => {
  if (formTransaksi.value.jumlah <= 0) {
    toast.error("Jumlah transaksi harus lebih dari nol.");
    return;
  }
  try {
    if (formTransaksi.value.jenis === "Setor") {
      await SimpananService.createSetoran(rekeningId, {
        jumlah: formTransaksi.value.jumlah,
        tgl_transaksi: formTransaksi.value.tgl_transaksi,
      });
    } else {
      await SimpananService.createPenarikan(rekeningId, {
        jumlah: formTransaksi.value.jumlah,
        tgl_transaksi: formTransaksi.value.tgl_transaksi,
      });
    }
    toast.success(`Transaksi ${formTransaksi.value.jenis} berhasil!`);
    formTransaksi.value.jumlah = 0;
    await fetchData();
  } catch (error) {
    toast.error(error.response?.data?.message || "Transaksi gagal.");
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Smooth transition for table rows */
tr {
  transition: background-color 0.2s ease;
}

/* Animation for new transactions */
@keyframes highlight {
  from {
    background-color: rgba(99, 102, 241, 0.2);
  }
  to {
    background-color: transparent;
  }
}

.highlight {
  animation: highlight 1.5s ease;
}
</style>
