<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800">
        {{ isEditMode ? "Edit Anggota" : "Tambah Anggota Baru" }}
      </h1>
      <p class="text-gray-500 mt-2">
        {{
          isEditMode
            ? "Perbarui data anggota koperasi"
            : "Tambahkan anggota baru ke dalam sistem koperasi"
        }}
      </p>
    </div>

    <!-- Form Container -->
    <div
      class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm max-w-2xl mx-auto"
    >
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Nama Lengkap -->
        <div>
          <label class="block text-gray-700 font-medium mb-2" for="nama">
            Nama Lengkap <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
            >
              <i class="fas fa-user text-gray-400"></i>
            </div>
            <input
              type="text"
              id="nama"
              v-model="formData.nama"
              required
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
              placeholder="Masukkan nama lengkap"
            />
          </div>
        </div>

        <!-- Jenis Kelamin -->
        <div>
          <label
            class="block text-gray-700 font-medium mb-2"
            for="jenis_kelamin"
          >
            Jenis Kelamin <span class="text-rose-500">*</span>
          </label>
          <div class="relative">
            <div
              class="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none"
            >
              <i class="fas fa-venus-mars text-gray-400"></i>
            </div>
            <select
              id="jenis_kelamin"
              v-model="formData.jenis_kelamin"
              required
              class="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none"
            >
              <option disabled value="">Pilih Jenis Kelamin</option>
              <option>Laki-laki</option>
              <option>Perempuan</option>
            </select>
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
            >
              <i class="fas fa-chevron-down text-gray-400"></i>
            </div>
          </div>
        </div>

        <!-- Status (hanya untuk edit mode) -->
        <div v-if="isEditMode">
          <label class="block text-gray-700 font-medium mb-2" for="status">
            Status Keanggotaan
          </label>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <input
                type="radio"
                id="status-aktif"
                v-model="formData.status"
                value="aktif"
                class="hidden peer"
              />
              <label
                for="status-aktif"
                class="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-green-50 peer-checked:border-green-500 peer-checked:bg-green-50 transition-colors"
              >
                <div
                  class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-2"
                >
                  <i class="fas fa-check text-green-600"></i>
                </div>
                <span class="font-medium">Aktif</span>
              </label>
            </div>

            <div>
              <input
                type="radio"
                id="status-nonaktif"
                v-model="formData.status"
                value="non-aktif"
                class="hidden peer"
              />
              <label
                for="status-nonaktif"
                class="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-rose-50 peer-checked:border-rose-500 peer-checked:bg-rose-50 transition-colors"
              >
                <div
                  class="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-2"
                >
                  <i class="fas fa-times text-rose-600"></i>
                </div>
                <span class="font-medium">Non-Aktif</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div
          class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200"
        >
          <router-link
            to="/data-master/anggota"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Kembali</span>
          </router-link>

          <button
            type="submit"
            class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white transition-all shadow-sm hover:shadow-md"
          >
            <i class="fas fa-save"></i>
            <span>{{
              isEditMode ? "Simpan Perubahan" : "Simpan Anggota"
            }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AnggotaService from "@/services/anggota.service.js";
import { useToast } from "vue-toastification";

const formData = ref({
  nama: "",
  jenis_kelamin: "", // Menggunakan field baru
  status: "aktif",
});

const router = useRouter();
const route = useRoute();
const toast = useToast();
const memberId = route.params.id;

const isEditMode = computed(() => !!memberId);

const handleSubmit = async () => {
  try {
    if (isEditMode.value) {
      // Saat update, kita hanya mengirim nama dan status
      const dataToUpdate = {
        nama: formData.value.nama,
        status: formData.value.status,
        jenis_kelamin: formData.value.jenis_kelamin, // Tambahkan jika ingin bisa diubah
      };
      await AnggotaService.update(memberId, dataToUpdate);
      toast.success("Data anggota berhasil diperbarui!");
    } else {
      // Saat membuat baru
      await AnggotaService.create(formData.value);
      toast.success("Anggota baru berhasil ditambahkan!");
    }
    router.push("/data-master/anggota");
  } catch (error) {
    toast.error("Gagal menyimpan data.");
  }
};

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await AnggotaService.getById(memberId);
      // Kita tidak lagi memproses tgl_masuk
      formData.value = response.data;
    } catch (error) {
      toast.error("Gagal memuat data untuk diedit.");
    }
  }
});
</script>

<style scoped>
/* Animasi untuk form */
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

.form-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>
