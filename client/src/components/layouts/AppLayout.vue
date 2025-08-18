<template>
  <div class="flex flex-col min-h-screen bg-gray-50 font-sans">
    <!-- Enhanced Horizontal Navigation -->
    <header
      class="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center space-x-3">
            <div
              class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-calculator text-xl text-white"></i>
            </div>
            <div>
              <div class="font-bold text-xl tracking-wide">
                Bina<span class="text-indigo-600 font-extrabold">Makmur</span>
              </div>
              <div class="text-xs text-gray-500">Koperasi SMAN 1 Majenang</div>
            </div>
          </div>

          <!-- Main Navigation -->
          <nav class="hidden md:flex space-x-1 h-full">
            <router-link to="/" class="nav-item" active-class="nav-item-active">
              <i class="fas fa-home mr-2"></i>
              Dashboard
            </router-link>

            <div class="group relative">
              <button class="nav-item">
                <i class="fas fa-database mr-2"></i>
                Data Management
                <i class="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              <div class="dropdown-menu">
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
                <i class="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              <div class="dropdown-menu">
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
              </div>
            </div>

            <div class="group relative">
              <button class="nav-item">
                <i class="fas fa-file-invoice-dollar mr-2"></i>
                Accounting & Reports
                <i class="fas fa-chevron-down ml-2 text-xs"></i>
              </button>
              <div class="dropdown-menu">
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
            <!-- Period Selector -->

            <!-- User Info -->
            <div class="hidden md:flex items-center text-sm text-gray-700">
              <i class="fas fa-user-circle mr-2 text-indigo-500"></i>
              <span class="font-medium truncate max-w-xs">{{
                authStore.user?.nama_lengkap || "Administrator"
              }}</span>
            </div>

            <!-- Logout Button -->
            <button
              @click="handleLogout"
              class="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-rose-50 to-rose-100 text-rose-600 rounded-xl border border-rose-200 hover:shadow-md transition-all duration-300 hover:scale-[1.03] group"
            >
              <i
                class="fas fa-sign-out-alt transition-transform group-hover:scale-125"
              ></i>
              <span class="font-medium hidden md:inline">Logout</span>
            </button>

            <!-- Mobile Menu Button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden text-gray-500 hover:text-gray-700"
            >
              <i class="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        v-show="mobileMenuOpen"
        class="md:hidden bg-white border-t border-gray-200"
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
    <main class="flex-1 py-6">
      <div class="max-w-7xl mx-auto px-6 w-full">
        <!-- Page Title -->
        <div class="mb-6">
          <h1 class="text-2xl md:text-3xl font-bold text-gray-800">
            {{ currentPageTitle }}
          </h1>
          <div class="w-16 h-1 bg-indigo-600 rounded-full mt-2"></div>
        </div>
        <div v-if="isLaporanActive" class="form-control w-48">
          <select
            v-model="periodeTerpilih"
            @change="updatePeriode"
            class="select select-bordered select-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 transition-all"
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
        </div>

        <!-- Sub Navigation -->
        <div class="sub-nav-container mb-6">
          <nav v-if="isDataMasterActive" class="sub-nav">
            <router-link to="/data-master/anggota">Anggota</router-link>
          </nav>

          <nav v-if="isSimpananActive" class="sub-nav">
            <router-link to="/simpanan/rekening">Data Rekening</router-link>
            <router-link to="/simpanan/transaksi">Data Transaksi</router-link>
            <router-link to="/simpanan/konfigurasi">Konfigurasi</router-link>
            <router-link to="/simpanan/impor-saldo">Impor Saldo</router-link>
          </nav>

          <nav v-if="isPinjamanActive" class="sub-nav">
            <router-link to="/pinjaman/data">Data Pinjaman</router-link>
            <router-link to="/pinjaman/transaksi">Data Transaksi</router-link>
            <router-link to="/pinjaman/konfigurasi">Konfigurasi</router-link>
          </nav>

          <nav v-if="isPembukuanActive" class="sub-nav">
            <router-link to="/pembukuan/kode-akun">Kode Akun</router-link>
            <router-link to="/pembukuan/jurnal-umum">Jurnal Umum</router-link>
            <router-link to="/pembukuan/buku-besar">Buku Besar</router-link>
            <router-link to="/pembukuan/periode">Manajemen Periode</router-link>
            <router-link to="/pembukuan/konfigurasi-shu"
              >Konfigurasi SHU</router-link
            >
            <router-link to="/pembukuan/input-shu">
              Input SHU Pemerataan
            </router-link>
          </nav>

          <nav v-if="isLaporanActive" class="sub-nav">
            <router-link to="/laporan/neraca">Laporan Neraca</router-link>
            <router-link to="/laporan/laba-rugi">Laporan Laba Rugi</router-link>
            <router-link to="/laporan/shu">Perhitungan SHU</router-link>
            <router-link to="/toko"
              ><i class="fas fa-store"></i> Toko</router-link
            >
          </nav>
        </div>

        <!-- Content Area -->
        <div class="content-container">
          <router-view class="fade-in" />
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 py-6">
      <div class="max-w-7xl mx-auto px-6 text-center">
        <p class="font-medium text-gray-700">
          {{ new Date().getFullYear() }} © Koperasi Bina Makmur - SMAN 1
          Majenang
        </p>
        <p class="mt-1 text-gray-600">
          Developed with <i class="fas fa-heart text-rose-500"></i> by EmbuN
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
  if (mobileSubmenuOpen.value === menu) {
    mobileSubmenuOpen.value = null;
  } else {
    mobileSubmenuOpen.value = menu;
  }
};

onMounted(async () => {
  await laporanStore.fetchPeriodeList();
  if (laporanStore.periodeList.length > 0) {
    periodeTerpilih.value = laporanStore.periodeList[0].id;
    laporanStore.setPeriodeAktif(periodeTerpilih.value);
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
/* Navigation Styles */
.nav-item {
  @apply flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-lg transition-all duration-300 h-full;
}

.nav-item-active {
  @apply text-indigo-600 bg-indigo-50;
}

.dropdown-menu {
  @apply absolute left-0 top-full mt-1 bg-white shadow-xl rounded-lg py-2 min-w-[240px] opacity-0 invisible transition-all duration-300 transform -translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 z-30;
}

.dropdown-item {
  @apply block px-6 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors;
}

.dropdown-item-active {
  @apply bg-indigo-50 text-indigo-700 font-medium;
}

/* Mobile Navigation */
.mobile-nav-item {
  @apply flex items-center px-4 py-3 text-gray-700 rounded-lg font-medium cursor-pointer;
}

.mobile-nav-item-active {
  @apply bg-indigo-50 text-indigo-600;
}

.mobile-subnav-item {
  @apply block px-4 py-2.5 text-gray-600 hover:bg-gray-50 rounded-lg;
}

.mobile-subnav-item-active {
  @apply bg-gray-50 text-indigo-600 font-medium;
}

/* Sub Navigation */
.sub-nav-container {
  @apply mb-6 bg-white rounded-xl shadow-sm p-1 border border-gray-200 max-w-7xl transition-all duration-300;
}

.sub-nav {
  @apply flex flex-wrap gap-1 rounded-lg overflow-hidden bg-gray-100;
}

.sub-nav a {
  @apply px-4 py-2.5 text-sm text-gray-700 font-medium transition-all duration-300 relative bg-white;
}

.sub-nav a:hover {
  @apply text-indigo-600 bg-indigo-50;
}

.sub-nav a.router-link-exact-active,
.sub-nav a.router-link-active {
  @apply text-indigo-600 bg-indigo-50 font-semibold;
}

.sub-nav a.router-link-exact-active:after,
.sub-nav a.router-link-active:after {
  content: "";
  @apply absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-full;
  animation: slideIn 0.3s ease-out;
}

/* Content Container */
.content-container {
  @apply bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all duration-300;
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
    @apply overflow-x-auto flex-nowrap;
  }

  .sub-nav a {
    @apply whitespace-nowrap;
  }
}
</style>
