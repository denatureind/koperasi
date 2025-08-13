<template>
  <div>
    <div v-if="isLoading" class="text-center py-12">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    <div v-else-if="neracaData" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title justify-center text-xl font-bold">AKTIVA</h2>
          <div class="overflow-x-auto">
            <table class="table">
              <tbody>
                <tr class="bg-base-200">
                  <th colspan="3">Aset Lancar</th>
                </tr>
                <tr v-for="akun in neracaData.aset" :key="akun.kode">
                  <td>{{ akun.kode }}</td>
                  <td>{{ akun.nama_akun }}</td>
                  <td class="text-right">{{ formatUang(akun.saldo) }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-base-200">
                  <th colspan="2">Total Aktiva</th>
                  <th class="text-right">
                    {{ formatUang(neracaData.totalAset) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      <div class="card bg-base-100 border border-base-200 shadow-sm">
        <div class="card-body">
          <h2 class="card-title justify-center text-xl font-bold">PASIVA</h2>
          <div class="overflow-x-auto">
            <table class="table">
              <tbody>
                <tr class="bg-base-200">
                  <th colspan="3">Kewajiban</th>
                </tr>
                <tr v-for="akun in neracaData.kewajiban" :key="akun.kode">
                  <td>{{ akun.kode }}</td>
                  <td>{{ akun.nama_akun }}</td>
                  <td class="text-right">{{ formatUang(akun.saldo) }}</td>
                </tr>
                <tr class="font-semibold">
                  <td colspan="2">Jumlah Kewajiban</td>
                  <td class="text-right">
                    {{ formatUang(neracaData.totalKewajiban) }}
                  </td>
                </tr>
              </tbody>
              <tbody>
                <tr class="bg-base-200">
                  <th colspan="3">Modal</th>
                </tr>
                <tr v-for="akun in neracaData.modal" :key="akun.kode">
                  <td>{{ akun.kode }}</td>
                  <td>{{ akun.nama_akun }}</td>
                  <td class="text-right">{{ formatUang(akun.saldo) }}</td>
                </tr>
                <tr class="font-semibold">
                  <td colspan="2">Jumlah Modal</td>
                  <td class="text-right">
                    {{ formatUang(neracaData.totalModal) }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr class="bg-base-200">
                  <th colspan="2">Total Kewajiban & Modal</th>
                  <th class="text-right">
                    {{ formatUang(neracaData.totalKewajibanDanModal) }}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useLaporanStore } from "@/stores/laporan.store.js";
import LaporanService from "@/services/laporan.service.js";

const neracaData = ref(null);
const isLoading = ref(true);
const laporanStore = useLaporanStore();

const fetchNeraca = async (periodeId) => {
  if (!periodeId) {
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  try {
    const response = await LaporanService.getNeraca(periodeId);
    neracaData.value = response.data;
  } catch (error) {
    console.error("Error mengambil data neraca:", error);
  } finally {
    isLoading.value = false;
  }
};

const formatUang = (angka) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );

watch(
  () => laporanStore.periodeAktifId,
  (newId) => {
    fetchNeraca(newId);
  },
  { immediate: true }
);
</script>

<style scoped>
/* Animations */
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

.fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
