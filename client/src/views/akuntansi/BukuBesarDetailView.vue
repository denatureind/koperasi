<template>
  <div class="fade-in">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center min-h-[50vh]">
      <div class="text-center">
        <i
          class="fas fa-circle-notch fa-spin text-5xl text-indigo-600 mb-4"
        ></i>
        <p class="text-lg text-gray-600">Memuat detail buku besar...</p>
      </div>
    </div>

    <!-- Content Section -->
    <div v-else-if="data" class="space-y-8">
      <!-- Header Section -->
      <div
        class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6"
      >
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
            Detail Buku Besar:
            <span class="text-indigo-600">{{ data.akun.nama_akun }}</span>
          </h1>
          <div class="flex items-center gap-4 mt-2">
            <div class="flex items-center text-gray-600">
              <i class="fas fa-hashtag mr-2 text-indigo-500"></i>
              <span>Kode Akun: {{ data.akun.kode }}</span>
            </div>
            <div class="flex items-center text-gray-600">
              <i class="fas fa-calendar-alt mr-2 text-indigo-500"></i>
              <span>{{ laporanStore.periodeAktif?.nama_periode }}</span>
            </div>
          </div>
          <div class="w-16 h-1 bg-indigo-600 rounded-full mt-4"></div>
        </div>
        <div>
          <router-link
            to="/pembukuan/buku-besar"
            class="btn bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 flex items-center"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            Kembali ke Buku Besar
          </router-link>
        </div>
      </div>

      <!-- Account Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div
          class="bg-gradient-to-r from-indigo-50 to-indigo-100 border border-indigo-100 rounded-xl p-5 shadow-sm"
        >
          <div class="text-indigo-600 font-medium mb-2">Saldo Awal</div>
          <div class="text-xl font-bold text-gray-800">
            {{ formatUang(data.saldo_awal) }}
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-100 rounded-xl p-5 shadow-sm"
        >
          <div class="text-blue-600 font-medium mb-2">Total Debit</div>
          <div class="text-xl font-bold text-gray-800">
            {{ formatUang(data.total_debit) }}
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-rose-50 to-rose-100 border border-rose-100 rounded-xl p-5 shadow-sm"
        >
          <div class="text-rose-600 font-medium mb-2">Total Kredit</div>
          <div class="text-xl font-bold text-gray-800">
            {{ formatUang(data.total_kredit) }}
          </div>
        </div>
        <div
          class="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-100 rounded-xl p-5 shadow-sm"
        >
          <div class="text-emerald-600 font-medium mb-2">Saldo Akhir</div>
          <div class="text-xl font-bold text-gray-800">
            {{ formatUang(data.saldo_akhir) }}
          </div>
        </div>
      </div>

      <!-- Transaction Table -->
      <div
        class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div class="overflow-x-auto">
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
                  Keterangan
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Debit
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kredit
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Saldo Berjalan
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Empty State -->
              <tr v-if="data.transaksi.length === 0">
                <td colspan="5" class="px-6 py-12 text-center">
                  <div class="mx-auto max-w-md">
                    <div
                      class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <i class="fas fa-file-invoice text-xl text-gray-400"></i>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900 mb-1">
                      Tidak ada transaksi
                    </h3>
                    <p class="text-gray-500">
                      Tidak ditemukan transaksi untuk akun ini pada periode
                      terpilih
                    </p>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-for="(trx, index) in data.transaksi"
                :key="index"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-gray-900 font-medium">
                    {{
                      new Date(trx.tgl_transaksi).toLocaleDateString("id-ID", {
                        weekday: "short",
                      })
                    }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{
                      new Date(trx.tgl_transaksi).toLocaleDateString("id-ID")
                    }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-gray-900 font-medium">
                    {{ trx.keterangan }}
                  </div>
                  <div v-if="trx.referensi" class="text-xs text-gray-500 mt-1">
                    Ref: {{ trx.referensi }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span v-if="trx.debit > 0" class="text-blue-600 font-medium">
                    {{ formatUang(trx.debit) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span v-if="trx.kredit > 0" class="text-rose-600 font-medium">
                    {{ formatUang(trx.kredit) }}
                  </span>
                  <span v-else class="text-gray-400">-</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <span
                    :class="{
                      'text-emerald-600 font-bold':
                        hitungSaldoBerjalan(index) >= 0,
                      'text-rose-600 font-bold': hitungSaldoBerjalan(index) < 0,
                    }"
                  >
                    {{ formatUang(hitungSaldoBerjalan(index)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";
import { useToast } from "vue-toastification";

const data = ref(null);
const isLoading = ref(true);
const route = useRoute();
const laporanStore = useLaporanStore();
const toast = useToast();
const akunId = route.params.id;

const fetchData = async () => {
  isLoading.value = true;
  try {
    const response = await LaporanService.getBukuBesarDetail(
      akunId,
      laporanStore.periodeAktifId
    );
    data.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat detail buku besar.");
  } finally {
    isLoading.value = false;
  }
};

const hitungSaldoBerjalan = (index) => {
  if (!data.value) return 0;

  let saldo = data.value.saldo_awal;
  for (let i = 0; i <= index; i++) {
    const trx = data.value.transaksi[i];
    if (data.value.akun.posisi_saldo === "debit") {
      saldo += parseFloat(trx.debit) - parseFloat(trx.kredit);
    } else {
      saldo += parseFloat(trx.kredit) - parseFloat(trx.debit);
    }
  }
  return saldo;
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(angka || 0);

onMounted(fetchData);
</script>

<style scoped>
/* Animasi untuk fade-in */
.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Efek hover pada tombol */
.btn {
  transition: all 0.3s ease;
}

/* Garis pemisah tabel yang lebih halus */
table tbody tr:not(:last-child) {
  border-bottom: 1px solid #f0f0f0;
}
</style>
