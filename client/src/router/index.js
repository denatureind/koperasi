import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

// HANYA IMPORT LAYOUT UTAMA KITA
import AppLayout from "@/components/layouts/AppLayout.vue";

const routes = [
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
      },

      // --- GRUP DATA MASTER ---
      { path: "data-master", redirect: "/data-master/anggota" },
      {
        path: "data-master/anggota",
        name: "anggota-list",
        component: () => import("@/views/anggota/AnggotaList.vue"),
      },
      {
        path: "data-master/anggota/tambah",
        name: "anggota-tambah",
        component: () => import("@/views/anggota/AnggotaForm.vue"),
      },
      {
        path: "data-master/anggota/edit/:id",
        name: "anggota-edit",
        component: () => import("@/views/anggota/AnggotaForm.vue"),
      },
      {
        path: "data-master/anggota/:id",
        name: "anggota-detail",
        component: () => import("@/views/anggota/AnggotaDetail.vue"),
      },
      {
        path: "data-master/anggota/impor",
        name: "anggota-impor",
        component: () => import("@/views/anggota/ImportAnggotaView.vue"),
      },

      // --- GRUP SIMPANAN ---
      { path: "simpanan", redirect: "/simpanan/rekening" },
      {
        path: "simpanan/rekening",
        name: "data-simpanan",
        component: () => import("@/views/simpanan/DataSimpananView.vue"),
      },
      {
        path: "simpanan/rekening/:id",
        name: "rekening-detail",
        component: () => import("@/views/simpanan/RekeningDetail.vue"),
      },
      {
        path: "simpanan/transaksi",
        name: "transaksi-simpanan",
        component: () => import("@/views/simpanan/TransaksiSimpananView.vue"),
      },
      {
        path: "simpanan/konfigurasi",
        name: "konfigurasi-simpanan",
        component: () => import("@/views/simpanan/KonfigurasiSimpananView.vue"),
      },
      {
        path: "simpanan/impor-saldo",
        name: "simpanan-impor-saldo",
        component: () => import("@/views/simpanan/ImportSaldoSimpanan.vue"),
      },

      // --- GRUP PINJAMAN ---
      { path: "pinjaman", redirect: "/pinjaman/data" },
      {
        path: "pinjaman/data",
        name: "data-pinjaman",
        component: () => import("@/views/pinjaman/DataPinjamanView.vue"),
      },
      {
        path: "pinjaman/data/:id",
        name: "pinjaman-detail",
        component: () => import("@/views/pinjaman/PinjamanDetail.vue"),
      },
      {
        path: "pinjaman/transaksi",
        name: "transaksi-pinjaman",
        component: () => import("@/views/pinjaman/TransaksiPinjamanView.vue"),
      },
      {
        path: "pinjaman/konfigurasi",
        name: "konfigurasi-pinjaman",
        component: () => import("@/views/pinjaman/KonfigurasiPinjamanView.vue"),
      },
      {
        path: "pinjaman/ajukan/:anggotaId",
        name: "pinjaman-tambah",
        component: () => import("@/views/pinjaman/PinjamanForm.vue"),
      },
      {
        path: "pinjaman/impor",
        name: "pinjaman-impor",
        component: () => import("@/views/pinjaman/ImportPinjamanView.vue"),
      },

      // --- GRUP PEMBUKUAN ---
      { path: "pembukuan", redirect: "/pembukuan/kode-akun" },
      {
        path: "pembukuan/kode-akun",
        name: "kode-akun",
        component: () => import("@/views/akuntansi/KodeAkunView.vue"),
      },
      {
        path: "pembukuan/jurnal-umum",
        name: "jurnal-umum",
        component: () => import("@/views/akuntansi/JurnalUmumView.vue"),
      },
      {
        path: "pembukuan/jurnal/tambah",
        name: "jurnal-manual-tambah",
        component: () => import("@/views/akuntansi/JurnalManualView.vue"),
      },
      {
        path: "pembukuan/periode",
        name: "manajemen-periode",
        component: () => import("@/views/pembukuan/ManajemenPeriodeView.vue"),
      },
      {
        path: "pembukuan/konfigurasi-shu",
        name: "konfigurasi-shu",
        component: () => import("@/views/pembukuan/KonfigurasiSHUView.vue"),
      },

      // --- GRUP LAPORAN ---
      { path: "laporan", redirect: "/laporan/neraca" },
      {
        path: "laporan/neraca",
        name: "laporan-neraca",
        component: () => import("@/views/laporan/NeracaView.vue"),
      },
      {
        path: "laporan/laba-rugi",
        name: "laporan-laba-rugi",
        component: () => import("@/views/laporan/LabaRugiView.vue"),
      },
      {
        path: "laporan/shu",
        name: "laporan-shu",
        component: () => import("@/views/laporan/SHUView.vue"),
      },
    ],
  },
  // Rute "Catch-all" untuk halaman 404 (selalu di paling akhir)
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Route guard tidak berubah
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const isPublicPage = to.path === "/login";

  if (!isPublicPage && !authStore.isLoggedIn) {
    return next("/login");
  }

  next();
});

export default router;
