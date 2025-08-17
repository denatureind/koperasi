<template>
  <div class="px-4 py-6">
    <!-- Header Section -->
    <div class="mb-8 text-center">
      <div
        class="w-16 h-16 mx-auto bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
      >
        <i class="fas fa-hand-holding-usd text-white text-2xl"></i>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mt-4">
        Riwayat Pinjaman Saya
      </h1>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        Pilih pinjaman untuk melihat detail jadwal angsuran dan pembayaran
      </p>
    </div>

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex flex-col items-center justify-center py-12"
    >
      <div
        class="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
      ></div>
      <p class="mt-4 text-gray-600">Memuat data pinjaman...</p>
    </div>

    <!-- Pinjaman List -->
    <div v-else-if="pinjamanList && pinjamanList.length > 0" class="space-y-5">
      <div
        v-for="pinjaman in pinjamanList"
        :key="pinjaman.id"
        class="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center mb-3">
                <div
                  :class="
                    pinjaman.status === 'aktif'
                      ? 'bg-indigo-100'
                      : 'bg-gray-100'
                  "
                  class="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                >
                  <i
                    :class="
                      pinjaman.status === 'aktif'
                        ? 'fas fa-running text-indigo-600'
                        : 'fas fa-check-circle text-gray-600'
                    "
                    class="text-lg"
                  ></i>
                </div>
                <div>
                  <h2 class="text-lg font-bold text-gray-800">
                    {{ pinjaman.kode_pinjaman }}
                  </h2>
                  <div class="flex items-center mt-1">
                    <span
                      :class="
                        pinjaman.status === 'aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      "
                      class="text-xs px-2 py-1 rounded-full"
                    >
                      {{ pinjaman.status }}
                    </span>
                    <span class="text-xs text-gray-500 ml-2">
                      <i class="fas fa-calendar-alt mr-1"></i>
                      {{ formatDate(pinjaman.tgl_pencairan) }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="ml-1 grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p class="text-xs text-gray-500">Total Pinjaman</p>
                  <p class="font-medium text-gray-800">
                    {{ formatUang(pinjaman.jumlah_pinjaman) }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Sisa Pokok</p>
                  <p class="font-bold text-rose-600">
                    {{ formatUang(pinjaman.sisa_pokok) }}
                  </p>
                </div>
              </div>
            </div>

            <router-link
              :to="`/member/pinjaman/${pinjaman.id}`"
              class="btn btn-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 hover:from-indigo-600 hover:to-purple-700 flex items-center shadow-md"
            >
              Detail <i class="fas fa-arrow-right ml-2 text-xs"></i>
            </router-link>
          </div>
        </div>

        <div class="bg-indigo-50 px-5 py-3 border-t border-indigo-100">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Jumlah Angsuran</span>
            <span class="font-medium">{{ pinjaman.jumlah_angsuran }} kali</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else
      class="text-center py-10 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100"
    >
      <div
        class="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4"
      >
        <i class="fas fa-file-invoice-dollar text-indigo-500 text-2xl"></i>
      </div>
      <h3 class="text-lg font-semibold text-gray-800">
        Belum Ada Riwayat Pinjaman
      </h3>
      <p class="text-gray-500 mt-2 max-w-md mx-auto">
        Saat ini Anda belum memiliki riwayat pinjaman aktif. Silakan ajukan
        pinjaman baru jika diperlukan.
      </p>
      <button
        class="btn btn-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 mt-4 hover:from-indigo-600 hover:to-purple-700"
      >
        <i class="fas fa-plus-circle mr-2"></i> Ajukan Pinjaman
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import MemberService from "@/services/member.service.js";

const pinjamanList = ref(null);
const isLoading = ref(true);
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
  return new Date(dateString).toLocaleDateString("id-ID", options);
};

onMounted(async () => {
  try {
    const response = await MemberService.getPinjamanList();
    pinjamanList.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat daftar pinjaman.");
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
  transform: translateY(0);
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
}

.card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-3px);
}
</style>
