<template>
  <div class="p-6 space-y-6">
    <!-- Card Container -->
    <div
      class="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
    >
      <div class="p-6">
        <h1 class="text-3xl font-semibold text-gray-900">
          Manajemen Periode Akuntansi
        </h1>
        <p class="text-gray-600 mt-2 mb-6">
          Kelola periode pembukuan dan jalankan proses tutup buku tahunan.
        </p>

        <!-- Table Container -->
        <div class="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
          <table class="min-w-full table-auto">
            <thead>
              <tr class="text-left bg-gray-100 text-gray-600">
                <th class="px-4 py-3 text-sm font-medium">Nama Periode</th>
                <th class="px-4 py-3 text-sm font-medium">Tanggal Mulai</th>
                <th class="px-4 py-3 text-sm font-medium">Tanggal Selesai</th>
                <th class="px-4 py-3 text-sm font-medium">Status</th>
                <th class="px-4 py-3 text-sm font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="periode in periodeList"
                :key="periode.id"
                class="border-t border-gray-200 hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-sm font-medium text-gray-800">
                  {{ periode.nama_periode }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ new Date(periode.tgl_mulai).toLocaleDateString("id-ID") }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{
                    new Date(periode.tgl_selesai).toLocaleDateString("id-ID")
                  }}
                </td>
                <td class="px-4 py-3">
                  <span
                    :class="[
                      'inline-block py-1 px-3 text-xs font-semibold rounded-full',
                      periode.status === 'open'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600',
                    ]"
                  >
                    {{ periode.status }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm text-right">
                  <button
                    v-if="periode.status === 'open'"
                    @click="handleTutupBuku(periode)"
                    class="btn btn-sm bg-red-600 hover:bg-red-700 text-white rounded-md px-4 py-2 flex items-center"
                    :disabled="isLoading"
                  >
                    <span
                      v-if="isLoading"
                      class="loading loading-spinner loading-xs mr-2"
                    ></span>
                    Tutup Buku
                  </button>
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
import { useToast } from "vue-toastification";
import PeriodeService from "@/services/periode.service.js";

const periodeList = ref([]);
const isLoading = ref(false);
const toast = useToast();

const fetchPeriode = async () => {
  try {
    const response = await PeriodeService.getAll();
    periodeList.value = response.data;
  } catch (error) {
    toast.error("Gagal memuat daftar periode.");
  }
};

const handleTutupBuku = async (periode) => {
  if (
    confirm(
      `Anda yakin ingin menutup periode "${periode.nama_periode}"? Proses ini tidak bisa dibatalkan dan akan memakan waktu beberapa saat.`
    )
  ) {
    isLoading.value = true;
    try {
      const response = await PeriodeService.tutupBuku();
      toast.success(response.data.message, { timeout: 5000 });
      await fetchPeriode(); // Refresh daftar periode
    } catch (error) {
      toast.error(error.response?.data?.message || "Proses tutup buku gagal.");
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(fetchPeriode);
</script>
