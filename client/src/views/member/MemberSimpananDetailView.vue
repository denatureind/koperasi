<template>
  <div class="px-4 py-6">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Memuat detail rekening...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="data" class="space-y-6">
      <!-- Header with Back Button -->
      <div class="flex items-center justify-between mb-6">
        <button
          @click="$router.back()"
          class="btn btn-sm bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-600 border border-indigo-200 hover:from-blue-100 hover:to-indigo-100 flex items-center shadow-sm"
        >
          <i class="fas fa-arrow-left mr-2"></i> Kembali
        </button>

        <div class="text-right">
          <h1 class="text-xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p class="text-sm text-gray-500">Detail rekening simpanan</p>
        </div>
      </div>

      <!-- Account Summary Card -->
      <div
        class="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-md border border-blue-100 overflow-hidden"
      >
        <div class="p-5">
          <div class="flex items-center mb-4">
            <div
              :class="getSimpananIcon(data.rekening.jenis_simpanan).bg"
              class="w-12 h-12 rounded-lg flex items-center justify-center mr-4"
            >
              <i
                :class="getSimpananIcon(data.rekening.jenis_simpanan).icon"
                class="text-xl"
              ></i>
            </div>
            <div>
              <h2 class="text-lg font-bold text-gray-800">
                {{ data.rekening.jenis_simpanan }}
              </h2>
              <p class="text-xs text-gray-500">ID Rek: {{ route.params.id }}</p>
            </div>
          </div>

          <div class="ml-1">
            <p class="text-xs text-gray-500">Saldo saat ini</p>
            <p class="text-2xl font-bold text-indigo-600">
              {{ formatUang(data.rekening.saldo) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Transaction History -->
      <div class="space-y-4">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center">
          <i class="fas fa-history mr-2 text-indigo-500"></i> Riwayat Transaksi
        </h3>

        <div
          v-if="data.transactions.length === 0"
          class="text-center py-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
        >
          <div
            class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4"
          >
            <i class="fas fa-file-invoice text-blue-500 text-xl"></i>
          </div>
          <p class="text-gray-600">
            Belum ada riwayat transaksi untuk rekening ini.
          </p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(trx, index) in data.transactions"
            :key="index"
            class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
          >
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div>
                  <div class="flex items-center mb-1">
                    <div
                      :class="
                        trx.jenis_transaksi === 'Setor'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-rose-100 text-rose-600'
                      "
                      class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
                    >
                      <i
                        :class="
                          trx.jenis_transaksi === 'Setor'
                            ? 'fas fa-arrow-down'
                            : 'fas fa-arrow-up'
                        "
                        class="text-sm"
                      ></i>
                    </div>
                    <h4 class="font-medium text-gray-800">
                      {{ trx.keterangan }}
                    </h4>
                  </div>
                  <p class="text-xs text-gray-500 ml-11">
                    <i class="far fa-calendar mr-1"></i>
                    {{ formatDate(trx.tgl_transaksi) }}
                  </p>
                </div>

                <span
                  class="font-bold"
                  :class="
                    trx.jenis_transaksi === 'Setor'
                      ? 'text-green-600'
                      : 'text-rose-600'
                  "
                >
                  {{ trx.jenis_transaksi === "Setor" ? "+" : "-" }}
                  {{ formatUang(trx.jumlah) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else
      class="text-center py-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
    >
      <div
        class="w-20 h-20 mx-auto bg-rose-100 rounded-full flex items-center justify-center mb-4"
      >
        <i class="fas fa-exclamation-circle text-rose-500 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">
        Gagal Memuat Data Rekening
      </h3>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        Rekening tidak ditemukan atau terjadi kesalahan. Silakan coba kembali.
      </p>
      <button
        @click="$router.back()"
        class="btn btn-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 mt-4 hover:from-blue-600 hover:to-indigo-700"
      >
        <i class="fas fa-arrow-left mr-2"></i> Kembali
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import MemberService from "@/services/member.service.js";

const data = ref(null);
const isLoading = ref(true);
const route = useRoute();
const toast = useToast();

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(parseFloat(angka) || 0);

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleString("id-ID", options);
};

// Get appropriate icon and color for each simpanan type
const getSimpananIcon = (jenis) => {
  const types = {
    "Simpanan Pokok": {
      bg: "bg-blue-100",
      icon: "fas fa-key text-blue-600",
    },
    "Simpanan Wajib": {
      bg: "bg-purple-100",
      icon: "fas fa-check-circle text-purple-600",
    },
    "Simpanan Sukarela": {
      bg: "bg-green-100",
      icon: "fas fa-heart text-green-600",
    },
    "Simpanan Lebaran": {
      bg: "bg-amber-100",
      icon: "fas fa-gift text-amber-600",
    },
  };

  return (
    types[jenis] || {
      bg: "bg-gray-100",
      icon: "fas fa-wallet text-gray-600",
    }
  );
};

onMounted(async () => {
  const rekeningId = route.params.id;
  try {
    const response = await MemberService.getSimpananTransactions(rekeningId);
    data.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat detail transaksi.");
    console.error(error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.animate-spin {
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

.btn {
  transition: all 0.3s ease;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
