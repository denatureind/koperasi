import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";

// Layouts
import DataMasterLayout from "@/views/datamaster/DataMasterLayout.vue";
import SimpananLayout from "@/views/simpanan/SimpananLayout.vue";
import PinjamanLayout from "@/views/pinjaman/PinjamanLayout.vue";
import PembukuanLayout from "@/views/akuntansi/PembukuanLayout.vue";
import LaporanLayout from "@/views/laporan/LaporanLayout.vue";

const routes = [
  { path: "/", name: "home", component: () => import("@/views/HomeView.vue") },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },

  {
    path: "/data-master",
    component: DataMasterLayout,
    children: [
      { path: "", redirect: { name: "anggota-list" } },
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
      // --- URUTAN PENTING: 'edit' sebelum ':id' ---
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
    ],
  },
  {
    path: "/simpanan",
    component: SimpananLayout,
    children: [
      { path: "", redirect: { name: "data-simpanan" } },
      {
        path: "rekening",
        name: "data-simpanan",
        component: () => import("@/views/simpanan/DataSimpananView.vue"),
      },
      {
        path: "transaksi",
        name: "transaksi-simpanan",
        component: () => import("@/views/simpanan/TransaksiSimpananView.vue"),
      },
    ],
  },
  {
    path: "/pinjaman",
    component: PinjamanLayout,
    children: [
      { path: "", redirect: { name: "data-pinjaman" } },
      {
        path: "data",
        name: "data-pinjaman",
        component: () => import("@/views/pinjaman/DataPinjamanView.vue"),
      },
      {
        path: "transaksi",
        name: "transaksi-pinjaman",
        component: () => import("@/views/pinjaman/TransaksiPinjamanView.vue"),
      },
    ],
  },
  {
    path: "/pembukuan",
    component: PembukuanLayout,
    children: [
      { path: "", redirect: { name: "kode-akun" } },
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
        component: () => import("@/views/pembukuan/KonfigurasiSHUView.vue"),
      },
    ],
  },
  {
    path: "/laporan",
    component: LaporanLayout,
    children: [
      { path: "", redirect: { name: "laporan-neraca" } },
      {
        path: "neraca",
        name: "laporan-neraca",
        component: () => import("@/views/laporan/NeracaView.vue"),
      },
      {
        path: "laba-rugi",
        name: "laporan-laba-rugi",
        component: () => import("@/views/laporan/LabaRugiView.vue"),
      },
      {
        path: "shu",
        name: "laporan-shu",
        component: () => import("@/views/laporan/SHUView.vue"),
      },
    ],
  },
  // Rute-rute detail yang tidak memiliki layout induk (jika ada)
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
