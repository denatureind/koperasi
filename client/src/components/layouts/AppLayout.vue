<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans">
    <!-- Modern Glass Header -->
    <header
      class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <!-- Enhanced Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-calculator text-xl text-white"></i>
            </div>
            <div>
              <div class="font-bold text-xl tracking-wide text-gray-800">
                Bina<span class="text-indigo-600 font-extrabold">Makmur</span>
              </div>
              <div class="text-xs text-gray-500 font-medium tracking-wide">
                Koperasi SMAN 1 Majenang
              </div>
            </div>
          </div>

          <!-- Modern Navigation -->
          <nav class="hidden md:flex space-x-1 h-full">
            <router-link to="/" class="nav-item" active-class="nav-item-active">
              <i class="fas fa-home mr-2"></i>
              Dashboard
            </router-link>

            <div class="group relative">
              <button class="nav-item">
                <i class="fas fa-database mr-2"></i>
                Data Management
                <i
                  class="fas fa-chevron-down ml-2 text-xs transition-transform group-hover:rotate-180"
                ></i>
              </button>
              <div
                class="dropdown-menu shadow-xl rounded-xl border border-gray-100"
              >
                <router-link
                  to="/data-master"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Data Master
                </router-link>
              </div>
            </div>

            <div class="group relative">
              <button class="nav-item">
                <i class="fas fa-coins mr-2"></i>
                Financial Operations
                <i
                  class="fas fa-chevron-down ml-2 text-xs transition-transform group-hover:rotate-180"
                ></i>
              </button>
              <div
                class="dropdown-menu shadow-xl rounded-xl border border-gray-100"
              >
                <router-link
                  to="/simpanan"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Simpanan
                </router-link>
                <router-link
                  to="/pinjaman"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Pinjaman
                </router-link>
                <router-link
                  to="/kas-bank/akun"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Kas & Bank
                </router-link>
              </div>
            </div>

            <div class="group relative">
              <button class="nav-item">
                <i class="fas fa-file-invoice-dollar mr-2"></i>
                Accounting & Reports
                <i
                  class="fas fa-chevron-down ml-2 text-xs transition-transform group-hover:rotate-180"
                ></i>
              </button>
              <div
                class="dropdown-menu shadow-xl rounded-xl border border-gray-100"
              >
                <router-link
                  to="/pembukuan"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Pembukuan
                </router-link>
                <router-link
                  to="/laporan"
                  class="dropdown-item"
                  active-class="dropdown-item-active"
                >
                  Laporan
                </router-link>
              </div>
            </div>
          </nav>

          <!-- User Controls -->
          <div class="flex items-center space-x-4">
            <!-- User Info -->
            <div class="hidden md:flex items-center text-sm text-gray-700">
              <div
                class="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center mr-2"
              >
                <i class="fas fa-user text-indigo-600 text-sm"></i>
              </div>
              <span class="font-medium truncate max-w-xs">
                {{ authStore.user?.nama_lengkap || "Administrator" }}
              </span>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 rounded-xl border border-rose-200 hover:shadow-md transition-all duration-300 group shadow-sm"
            >
              <i
                class="fas fa-sign-out-alt transition-transform group-hover:scale-110"
              ></i>
              <span class="font-medium hidden md:inline">Logout</span>
            </button>

            <!-- Modern Mobile Menu Button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Mobile Navigation -->
      <div
        v-show="mobileMenuOpen"
        class="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100"
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <router-link
            to="/"
            class="mobile-nav-item"
            active-class="mobile-nav-item-active"
            @click="mobileMenuOpen = false"
          >
            <i class="fas fa-home mr-3"></i>
            Dashboard
          </router-link>

          <div
            class="mobile-nav-item"
            @click="toggleMobileSubmenu('dataManagement')"
          >
            <i class="fas fa-database mr-3"></i>
            Data Management
            <i
              class="fas fa-chevron-down ml-2 text-xs transition-transform"
              :class="{ 'rotate-180': mobileSubmenuOpen === 'dataManagement' }"
            ></i>
          </div>
          <div
            v-show="mobileSubmenuOpen === 'dataManagement'"
            class="ml-8 space-y-1 mt-1"
          >
            <router-link
              to="/data-master"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Data Master
            </router-link>
          </div>

          <div
            class="mobile-nav-item"
            @click="toggleMobileSubmenu('financialOperations')"
          >
            <i class="fas fa-coins mr-3"></i>
            Financial Operations
            <i
              class="fas fa-chevron-down ml-2 text-xs transition-transform"
              :class="{
                'rotate-180': mobileSubmenuOpen === 'financialOperations',
              }"
            ></i>
          </div>
          <div
            v-show="mobileSubmenuOpen === 'financialOperations'"
            class="ml-8 space-y-1 mt-1"
          >
            <router-link
              to="/simpanan"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Simpanan
            </router-link>
            <router-link
              to="/pinjaman"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Pinjaman
            </router-link>
            <router-link
              to="/kas-bank/akun"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Kas & Bank
            </router-link>
          </div>

          <div
            class="mobile-nav-item"
            @click="toggleMobileSubmenu('accountingReports')"
          >
            <i class="fas fa-file-invoice-dollar mr-3"></i>
            Accounting & Reports
            <i
              class="fas fa-chevron-down ml-2 text-xs transition-transform"
              :class="{
                'rotate-180': mobileSubmenuOpen === 'accountingReports',
              }"
            ></i>
          </div>
          <div
            v-show="mobileSubmenuOpen === 'accountingReports'"
            class="ml-8 space-y-1 mt-1"
          >
            <router-link
              to="/pembukuan"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Pembukuan
            </router-link>
            <router-link
              to="/laporan"
              class="mobile-subnav-item"
              active-class="mobile-subnav-item-active"
              @click="mobileMenuOpen = false"
            >
              Laporan
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 py-8">
      <div class="max-w-7xl mx-auto px-6 w-full">
        <!-- Enhanced Page Title -->
        <div class="mb-8">
          <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
                  {{ currentPageTitle }}
                </h1>
                <div
                  class="w-8 h-1.5 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full"
                ></div>
              </div>
              <div class="mt-2 text-gray-500 text-sm">
                {{ getPageSubtitle(currentPageTitle) }}
              </div>
            </div>
            <div
              v-if="isLaporanActive && laporanStore.periodeList"
              class="form-control"
            >
              <div class="relative">
                <select
                  v-model="periodeTerpilih"
                  @change="updatePeriode"
                  class="pl-4 pr-10 py-2.5 text-sm bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all appearance-none shadow-sm"
                >
                  <option disabled :value="null">Pilih Periode Laporan</option>
                  <option
                    v-for="p in laporanStore.periodeList"
                    :key="p.id"
                    :value="p.id"
                  >
                    {{ p.nama_periode }}
                  </option>
                </select>
                <div
                  class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500"
                >
                  <i class="fas fa-chevron-down text-xs"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modern Sub Navigation -->
        <div
          class="sub-nav-container mb-8 bg-white rounded-xl p-1 shadow-sm border border-gray-100"
        >
          <nav v-if="isDataMasterActive" class="sub-nav">
            <router-link to="/data-master/anggota" class="sub-nav-item">
              <i class="fas fa-users mr-2 text-sm"></i>
              Anggota
            </router-link>
          </nav>

          <nav v-if="isSimpananActive" class="sub-nav">
            <router-link to="/simpanan/rekening" class="sub-nav-item">
              <i class="fas fa-piggy-bank mr-2 text-sm"></i>
              Data Rekening
            </router-link>
            <router-link to="/simpanan/transaksi" class="sub-nav-item">
              <i class="fas fa-exchange-alt mr-2 text-sm"></i>
              Data Transaksi
            </router-link>
            <router-link to="/simpanan/konfigurasi" class="sub-nav-item">
              <i class="fas fa-cog mr-2 text-sm"></i>
              Konfigurasi
            </router-link>
            <router-link to="/simpanan/impor-saldo" class="sub-nav-item">
              <i class="fas fa-file-import mr-2 text-sm"></i>
              Impor Saldo
            </router-link>
          </nav>

          <nav v-if="isPinjamanActive" class="sub-nav">
            <router-link to="/pinjaman/data" class="sub-nav-item">
              <i class="fas fa-hand-holding-usd mr-2 text-sm"></i>
              Data Pinjaman
            </router-link>
            <router-link to="/pinjaman/transaksi" class="sub-nav-item">
              <i class="fas fa-receipt mr-2 text-sm"></i>
              Data Transaksi
            </router-link>
            <router-link to="/pinjaman/konfigurasi" class="sub-nav-item">
              <i class="fas fa-cog mr-2 text-sm"></i>
              Konfigurasi
            </router-link>
          </nav>

          <nav v-if="isPembukuanActive" class="sub-nav">
            <router-link to="/pembukuan/kode-akun" class="sub-nav-item">
              <i class="fas fa-list-ol mr-2 text-sm"></i>
              Kode Akun
            </router-link>
            <router-link to="/pembukuan/jurnal-umum" class="sub-nav-item">
              <i class="fas fa-book mr-2 text-sm"></i>
              Jurnal Umum
            </router-link>
            <router-link to="/pembukuan/buku-besar" class="sub-nav-item">
              <i class="fas fa-book-open mr-2 text-sm"></i>
              Buku Besar
            </router-link>
            <router-link to="/pembukuan/periode" class="sub-nav-item">
              <i class="fas fa-calendar-alt mr-2 text-sm"></i>
              Manajemen Periode
            </router-link>
            <router-link to="/pembukuan/konfigurasi-shu" class="sub-nav-item">
              <i class="fas fa-percentage mr-2 text-sm"></i>
              Konfigurasi SHU
            </router-link>
            <router-link to="/pembukuan/konfigurasi-poin" class="sub-nav-item">
              <i class="fas fa-calculator mr-2 text-sm"></i>
              Aturan Poin SHU
            </router-link>
            <router-link to="/pembukuan/input-shu" class="sub-nav-item">
              <i class="fas fa-tasks mr-2 text-sm"></i>
              Input SHU Pemerataan
            </router-link>
          </nav>

          <nav v-if="isLaporanActive" class="sub-nav">
            <router-link to="/laporan/neraca" class="sub-nav-item">
              <i class="fas fa-balance-scale mr-2 text-sm"></i>
              Laporan Neraca
            </router-link>
            <router-link to="/laporan/laba-rugi" class="sub-nav-item">
              <i class="fas fa-chart-line mr-2 text-sm"></i>
              Laporan Laba Rugi
            </router-link>
            <router-link to="/laporan/shu" class="sub-nav-item">
              <i class="fas fa-calculator mr-2 text-sm"></i>
              Perhitungan SHU
            </router-link>
            <router-link to="/toko" class="sub-nav-item">
              <i class="fas fa-store mr-2 text-sm"></i>
              Toko
            </router-link>
          </nav>
        </div>

        <!-- Content Area -->
        <div
          class="content-container bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <router-view class="fade-in p-6" />
        </div>
      </div>
    </main>

    <!-- Modern Footer -->
    <footer class="bg-white border-t border-gray-100 py-6">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="font-medium text-gray-700">
          {{ new Date().getFullYear() }} Â© Koperasi Bina Makmur - SMAN 1
          Majenang
        </p>
        <p class="mt-1 text-gray-600 flex items-center justify-center">
          Developed with <i class="fas fa-heart text-rose-500 mx-1"></i> by
          EmbuN
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { useLaporanStore } from "@/stores/laporan.store.js";

// Inisialisasi store
const authStore = useAuthStore();
const laporanStore = useLaporanStore();
const router = useRouter();
const route = useRoute();

const pageTitles = {
  "/": "Dashboard",
  "/data-master": "Data Master",
  "/simpanan": "Manajemen Simpanan",
  "/pinjaman": "Manajemen Pinjaman",
  "/pembukuan": "Pembukuan",
  "/laporan": "Laporan Keuangan",
  "/kas-bank": "Kas & Bank",
};

// Fungsi untuk mendapatkan subtitle berdasarkan halaman
const getPageSubtitle = (title) => {
  const subtitles = {
    Dashboard: "Ringkasan aktivitas koperasi",
    "Data Master": "Kelola data anggota dan produk",
    "Manajemen Simpanan": "Kelola simpanan anggota",
    "Manajemen Pinjaman": "Kelola peminjaman anggota",
    Pembukuan: "Sistem akuntansi koperasi",
    "Laporan Keuangan": "Analisis kinerja keuangan",
    "Kas & Bank": "Manajemen kas dan rekening bank",
  };
  return subtitles[title] || "Manajemen Koperasi Sekolah";
};

const currentPageTitle = ref("Dashboard");
const periodeTerpilih = ref(null);
const mobileMenuOpen = ref(false);
const mobileSubmenuOpen = ref(null);

watch(
  () => route.path,
  (newPath) => {
    const matchingRoute = Object.keys(pageTitles)
      .filter((key) => newPath.startsWith(key))
      .sort((a, b) => b.length - a.length)[0];

    currentPageTitle.value = pageTitles[matchingRoute] || "Dashboard";
    mobileMenuOpen.value = false;
    mobileSubmenuOpen.value = null;
  },
  { immediate: true }
);

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

const updatePeriode = () => {
  laporanStore.setPeriodeAktif(periodeTerpilih.value);
};

const toggleMobileSubmenu = (menu) => {
  mobileSubmenuOpen.value = mobileSubmenuOpen.value === menu ? null : menu;
};

onMounted(async () => {
  try {
    await laporanStore.fetchPeriodeList();
    if (laporanStore.periodeList?.length > 0) {
      periodeTerpilih.value = laporanStore.periodeList[0].id;
      laporanStore.setPeriodeAktif(periodeTerpilih.value);
    }
  } catch (error) {
    console.error("Error fetching period list:", error);
  }
});

const isDataMasterActive = computed(() =>
  route.path.startsWith("/data-master")
);
const isSimpananActive = computed(() => route.path.startsWith("/simpanan"));
const isPinjamanActive = computed(() => route.path.startsWith("/pinjaman"));
const isPembukuanActive = computed(() => route.path.startsWith("/pembukuan"));
const isLaporanActive = computed(
  () => route.path.startsWith("/laporan") || route.path.startsWith("/toko")
);
</script>

<style scoped>
/* Modern Navigation Styles */
.nav-item {
  @apply flex items-center px-4 py-2.5 text-sm font-medium text-gray-600 hover:text-indigo-600 rounded-lg transition-all duration-300 h-full relative;
}

.nav-item-active {
  @apply text-indigo-600 font-semibold;
}

.nav-item-active::after {
  content: "";
  @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-indigo-600 rounded-full;
}

.dropdown-menu {
  @apply absolute left-0 top-full mt-1 bg-white shadow-lg rounded-xl py-2 min-w-[240px] opacity-0 invisible transition-all duration-300 transform -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-30 border border-gray-100;
}

.dropdown-item {
  @apply block px-6 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition-colors;
}

.dropdown-item-active {
  @apply bg-indigo-50 text-indigo-700 font-medium;
}

/* Mobile Navigation */
.mobile-nav-item {
  @apply flex items-center px-4 py-3 text-gray-700 rounded-lg font-medium cursor-pointer transition-colors;
}

.mobile-nav-item-active {
  @apply bg-indigo-50 text-indigo-600;
}

.mobile-subnav-item {
  @apply block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors;
}

.mobile-subnav-item-active {
  @apply bg-gray-50 text-indigo-600 font-medium;
}

/* Modern Sub Navigation */
.sub-nav-container {
  @apply mb-6;
}

.sub-nav {
  @apply flex flex-wrap gap-2 rounded-xl overflow-x-auto;
}

.sub-nav-item {
  @apply px-4 py-3 text-sm text-gray-600 font-medium transition-all duration-300 relative flex items-center bg-white border border-gray-200 rounded-lg hover:border-indigo-300;
}

.sub-nav-item:hover {
  @apply text-indigo-600;
}

.sub-nav-item.router-link-exact-active,
.sub-nav-item.router-link-active {
  @apply text-indigo-600 bg-indigo-50 border-indigo-200 font-semibold;
}

.sub-nav-item.router-link-exact-active:after,
.sub-nav-item.router-link-active:after {
  content: "";
  @apply absolute bottom-0 left-1/2 transform -translate-x-1/2 w-5 h-1 bg-indigo-600 rounded-full;
}

/* Content Container */
.content-container {
  @apply transition-all duration-300;
}

/* Animations */
@keyframes slideIn {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

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

/* Responsive adjustments */
@media (max-width: 768px) {
  .sub-nav {
    @apply overflow-x-auto flex-nowrap pb-1 -mx-1 px-1;
  }

  .sub-nav-item {
    @apply whitespace-nowrap;
  }
}
</style>
