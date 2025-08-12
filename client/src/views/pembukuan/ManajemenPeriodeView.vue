<template>
  <div class="p-1">
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-gray-800">
          Manajemen Periode Akuntansi
        </h1>
        <p class="text-gray-500 mt-1 mb-6">
          Kelola periode pembukuan dan jalankan proses tutup buku tahunan.
        </p>

        <div class="overflow-x-auto">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th class="bg-base-200">Nama Periode</th>
                <th class="bg-base-200">Tanggal Mulai</th>
                <th class="bg-base-200">Tanggal Selesai</th>
                <th class="bg-base-200">Status</th>
                <th class="bg-base-200 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="periode in periodeList" :key="periode.id">
                <td class="font-medium">{{ periode.nama_periode }}</td>
                <td>
                  {{ new Date(periode.tgl_mulai).toLocaleDateString("id-ID") }}
                </td>
                <td>
                  {{
                    new Date(periode.tgl_selesai).toLocaleDateString("id-ID")
                  }}
                </td>
                <td>
                  <span
                    :class="[
                      'badge',
                      periode.status === 'open'
                        ? 'badge-success'
                        : 'badge-ghost',
                    ]"
                  >
                    {{ periode.status }}
                  </span>
                </td>
                <td class="text-right">
                  <button
                    v-if="periode.status === 'open'"
                    @click="handleTutupBuku(periode)"
                    class="btn btn-error btn-sm"
                    :disabled="isLoading"
                  >
                    <span
                      v-if="isLoading"
                      class="loading loading-spinner loading-xs"
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
