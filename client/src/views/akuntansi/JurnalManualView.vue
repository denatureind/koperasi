<template>
  <div class="p-1">
    <div class="card bg-base-100 shadow-sm border border-base-200">
      <div class="card-body">
        <h1 class="text-2xl font-bold text-gray-800">
          Buat Entri Jurnal Umum Manual
        </h1>
        <p class="text-gray-500 mt-1 mb-6">
          Gunakan form ini untuk mencatat transaksi di luar simpan pinjam,
          seperti beban atau pendapatan lain-lain.
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"
                ><span class="label-text">Tanggal Transaksi</span></label
              >
              <input
                type="date"
                v-model="formData.tgl_transaksi"
                class="input input-bordered"
                required
              />
            </div>
            <div class="form-control">
              <label class="label"
                ><span class="label-text"
                  >Keterangan / Nama Transaksi</span
                ></label
              >
              <input
                type="text"
                v-model="formData.keterangan"
                placeholder="Contoh: Pembayaran Biaya Listrik"
                class="input input-bordered"
                required
              />
            </div>
          </div>

          <div class="border-t border-base-200 pt-4">
            <h3 class="font-semibold mb-2">Rincian Jurnal (Debit & Kredit)</h3>
            <div
              v-for="(entri, index) in formData.entri"
              :key="index"
              class="grid grid-cols-12 gap-2 items-center mb-2"
            >
              <div class="col-span-5">
                <select
                  v-model="entri.akun_id"
                  class="select select-bordered w-full"
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
              <div class="col-span-3">
                <input
                  type="number"
                  v-model="entri.debit"
                  placeholder="Debit"
                  class="input input-bordered w-full text-right"
                />
              </div>
              <div class="col-span-3">
                <input
                  type="number"
                  v-model="entri.kredit"
                  placeholder="Kredit"
                  class="input input-bordered w-full text-right"
                />
              </div>
              <div class="col-span-1">
                <button
                  type="button"
                  @click="hapusBaris(index)"
                  class="btn btn-ghost btn-sm text-error"
                  :disabled="formData.entri.length <= 2"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
            <button
              type="button"
              @click="tambahBaris"
              class="btn btn-outline btn-sm mt-2"
            >
              <i class="fas fa-plus mr-2"></i> Tambah Baris
            </button>
          </div>

          <div
            class="border-t border-base-200 pt-4 mt-6 flex justify-between items-center"
          >
            <div class="font-bold text-lg">
              <span>Total Debit: {{ formatUang(totalDebit) }}</span> |
              <span>Total Kredit: {{ formatUang(totalKredit) }}</span>
              <span v-if="!isSeimbang" class="badge badge-error ml-2"
                >Tidak Seimbang!</span
              >
            </div>
            <div class="flex gap-2">
              <router-link to="/pembukuan/jurnal-umum" class="btn"
                >Batal</router-link
              >
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!isSeimbang || isLoading"
              >
                <span
                  v-if="isLoading"
                  class="loading loading-spinner loading-sm"
                ></span>
                Simpan Jurnal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import AkunService from "@/services/akun.service.js";
import JurnalService from "@/services/jurnal.service.js";

const router = useRouter();
const toast = useToast();
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
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    angka || 0
  );
</script>
