import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

// Layouts (sebaiknya tetap diimpor secara statis jika sering digunakan)
import DataMasterLayout from "@/views/datamaster/DataMasterLayout.vue";
import SimpananLayout from "@/views/simpanan/SimpananLayout.vue";
import PinjamanLayout from "@/views/pinjaman/PinjamanLayout.vue";
import PembukuanLayout from "@/views/akuntansi/PembukuanLayout.vue";
import LaporanLayout from "@/views/laporan/LaporanLayout.vue";
import SHUView from "@/views/laporan/SHUView.vue"; // <-- IMPORT BARU
import KonfigurasiSHUView from "@/views/pembukuan/KonfigurasiSHUView.vue";

const routes = [
  // Rute utama tanpa layout
  { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },

  // Rute grup untuk Data Master
  {
    path: "/data-master",
    component: DataMasterLayout, // Layout diimpor secara statis
    children: [
      { path: "", redirect: "/data-master/anggota" },
      {
        path: "anggota",
        name: "anggota-list",
        component: () => import("@/views/anggota/AnggotaList.vue"),
      },
      {
        path: "anggota/tambah",
        name: "anggota-tambah",
        component: () => import("@/views/anggota/AnggotaForm.vue"),
      },
      {
        path: "anggota/edit/:id",
        name: "anggota-edit",
        component: () => import("@/views/anggota/AnggotaForm.vue"),
      },
      {
        path: "anggota/:id",
        name: "anggota-detail",
        component: () => import("@/views/anggota/AnggotaDetail.vue"),
      },
      {
        path: "anggota/:anggotaId/pinjaman/tambah",
        name: "pinjaman-tambah",
        component: () => import("@/views/pinjaman/PinjamanForm.vue"),
      },
    ],
  },

  // Rute grup untuk Simpanan
  {
    path: "/simpanan",
    component: SimpananLayout,
    children: [
      { path: "", redirect: "/simpanan/rekening" },
      {
        path: "rekening",
        name: "data-simpanan",
        component: () => import("@/views/simpanan/DataSimpananView.vue"),
      },
      {
        path: "rekening/:id",
        name: "rekening-detail",
        component: () => import("@/views/simpanan/RekeningDetail.vue"),
      },
      {
        path: "transaksi",
        name: "transaksi-simpanan",
        component: () => import("@/views/simpanan/TransaksiSimpananView.vue"),
      },
    ],
  },

  // Rute grup untuk Pinjaman
  {
    path: "/pinjaman",
    component: PinjamanLayout,
    children: [
      { path: "", redirect: "/pinjaman/data" },
      {
        path: "data",
        name: "data-pinjaman",
        component: () => import("@/views/pinjaman/DataPinjamanView.vue"),
      },
      {
        path: "data/:id",
        name: "pinjaman-detail",
        component: () => import("@/views/pinjaman/PinjamanDetail.vue"),
      },
      {
        path: "transaksi",
        name: "transaksi-pinjaman",
        component: () => import("@/views/pinjaman/TransaksiPinjamanView.vue"),
      },
    ],
  },

  // Rute grup untuk Pembukuan
  {
    path: "/pembukuan",
    component: PembukuanLayout,
    children: [
      { path: "", redirect: "/pembukuan/kode-akun" },
      {
        path: "kode-akun",
        name: "kode-akun",
        component: () => import("@/views/akuntansi/KodeAkunView.vue"),
      },
      {
        path: "jurnal-umum",
        name: "jurnal-umum",
        component: () => import("@/views/akuntansi/JurnalUmumView.vue"),
      },

      {
        path: "konfigurasi-shu",
        name: "konfigurasi-shu",
        component: KonfigurasiSHUView,
      },
    ],
  },

  // Rute grup untuk Laporan
  {
    path: "/laporan",
    component: LaporanLayout,
    children: [
      { path: "", redirect: "/laporan/neraca" },
      {
        path: "neraca",
        name: "laporan-neraca",
        component: () => import("@/views/laporan/NeracaView.vue"),
      },
      // --- ROUTE BARU ---
      {
        path: "laba-rugi",
        name: "laporan-laba-rugi",
        component: () => import("@/views/laporan/LabaRugiView.vue"),
      },

      { path: "shu", name: "laporan-shu", component: SHUView }, // <-- ROUTE BARU
    ],
  },

  // Rute-rute detail yang tidak masuk ke layout induk
  {
    path: "/rekening/:id",
    name: "rekening-detail",
    component: () => import("@/views/simpanan/RekeningDetail.vue"),
  },
  {
    path: "/pinjaman/:id",
    name: "pinjaman-detail",
    component: () => import("@/views/pinjaman/PinjamanDetail.vue"),
  },
  {
    path: "/anggota/:anggotaId/pinjaman/tambah",
    name: "pinjaman-tambah",
    component: () => import("@/views/pinjaman/PinjamanForm.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Route guard (tidak berubah)
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.name !== "login";

  if (requiresAuth && !authStore.isLoggedIn) {
    next({ name: "login" });
  } else if (to.name === "login" && authStore.isLoggedIn) {
    next({ name: "home" });
  } else {
    next();
  }
});

export default router;
