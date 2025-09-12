// client/src/router/index.js
// :contentReference[oaicite:0]{index=0}
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useMemberAuthStore } from "@/stores/memberAuth.store.js";

// Import Layouts
import AppLayout from "@/components/layouts/AppLayout.vue";
import MemberLayout from "@/components/layouts/MemberLayout.vue";

// Import Halaman Baru
import SHUPemerataanView from "@/views/laporan/SHUPemerataanView.vue";

const routes = [
  // --- RUTE PUBLIK (Boleh diakses siapa saja) ---
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/LoginView.vue"),
  },

  // --- RUTE ADMIN (Dilindungi, butuh login admin) ---
  {
    path: "/",
    component: AppLayout,
    meta: { requiresAuth: "admin" }, // Penanda rute admin
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/HomeView.vue"),
      },
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
        path: "pembukuan/buku-besar",
        name: "buku-besar",
        component: () => import("@/views/akuntansi/BukuBesarView.vue"),
      },
      {
        path: "pembukuan/buku-besar/:id",
        name: "buku-besar-detail",
        component: () => import("@/views/akuntansi/BukuBesarDetailView.vue"),
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
      {
        path: "pembukuan/konfigurasi-poin",
        name: "konfigurasi-poin",
        component: () => import("@/views/pembukuan/KonfigurasiPoinView.vue"),
      },

      // --- PERBAIKAN & PENEMPATAN RUTE BARU YANG BENAR ---
      {
        path: "pembukuan/input-shu",
        name: "InputSHU",
        component: SHUPemerataanView, // Menggunakan komponen yang sudah kita buat
        meta: { title: "Input SHU Pemerataan" },
      },
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
      {
        path: "toko",
        redirect: "/toko/input-belanja",
      },
      {
        path: "toko/input-belanja",
        name: "input-belanja",
        component: () => import("@/views/toko/InputBelanjaView.vue"),
      },
    ],
  },

  // --- RUTE KAS & BANK (grup sendiri) ---
  {
    path: "/kas-bank",
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "akun",
        name: "KasBankList",
        component: () => import("@/views/kasbank/KasBankListView.vue"),
      },
    ],
  },

  // --- RUTE ANGGOTA (Dilindungi, butuh login anggota) ---
  {
    path: "/member",
    component: MemberLayout,
    meta: { requiresAuth: "member" },
    children: [
      {
        path: "dashboard",
        name: "member-dashboard",
        component: () => import("@/views/member/MemberDashboardView.vue"),
      },
      {
        path: "simpanan",
        name: "member-simpanan-list",
        component: () => import("@/views/member/MemberSimpananView.vue"),
      },
      {
        path: "simpanan/:id",
        name: "member-simpanan-detail",
        component: () => import("@/views/member/MemberSimpananDetailView.vue"),
      },
      {
        path: "pinjaman",
        name: "member-pinjaman-list",
        component: () => import("@/views/member/MemberPinjamanView.vue"),
      },
      {
        path: "pinjaman/:id",
        name: "member-pinjaman-detail",
        component: () => import("@/views/member/MemberPinjamanDetailView.vue"),
      },
      {
        path: "shu",
        name: "member-shu",
        component: () => import("@/views/member/MemberSHUView.vue"),
      },
    ],
  },

  // --- RUTE 404 (Selalu di paling akhir) ---
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

// Route guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const memberAuthStore = useMemberAuthStore();

  if (to.meta.requiresAuth === "admin" && !authStore.isLoggedIn) {
    return next("/login");
  }

  if (to.meta.requiresAuth === "member" && !memberAuthStore.isLoggedIn) {
    return next("/login");
  }

  next();
});

export default router;
