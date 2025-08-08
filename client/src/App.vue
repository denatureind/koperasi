<template>
  <div id="app">
    <header v-if="authStore.isLoggedIn">
      <div class="app-brand">
        <div class="logo">
          <i class="fas fa-calculator"></i>
        </div>
        <div class="brand-text">Bina<span>Makmur</span></div>
      </div>

      <nav>
        <div class="nav-container">
          <div class="nav-links">
            <router-link to="/data-master/anggota">
              <i class="fas fa-database"></i> Data Master
            </router-link>
            <router-link to="/simpanan">
              <i class="fas fa-piggy-bank"></i> Simpanan
            </router-link>
            <router-link to="/pinjaman/data">
              <i class="fas fa-hand-holding-usd"></i> Pinjaman
            </router-link>

            <router-link to="/pembukuan/kode-akun">
              <i class="fas fa-calculator"></i> Pembukuan
            </router-link>
            <router-link to="/laporan/neraca">
              <i class="fas fa-chart-bar"></i> Laporan
            </router-link>
          </div>
          <button class="logout-btn" @click="handleLogout">
            <i class="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>
    </header>

    <div v-else class="login-container">
      <router-link to="/login" class="login-btn">
        <i class="fas fa-sign-in-alt"></i> Login
      </router-link>
    </div>

    <router-view />

    <footer v-if="authStore.isLoggedIn">
      <p>
        &copy; 2025 FinancePro - Sistem Manajemen Keuangan. Hak Cipta
        Dilindungi.
      </p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store.js";
import { onMounted } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};

// Load FontAwesome
onMounted(() => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
  link.integrity =
    "sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#app {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e7f1 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
}

header {
  background: white;
  padding: 0 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 10;
}

.app-brand {
  display: flex;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #eef1f7;
}

.logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
}

.logo i {
  color: white;
  font-size: 24px;
}

.brand-text {
  font-size: 24px;
  font-weight: 700;
  color: #2c3e50;
  letter-spacing: -0.5px;
}

.brand-text span {
  color: #4361ee;
  font-weight: 800;
}

nav {
  padding: 0;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.nav-links a {
  text-decoration: none;
  color: #5a6a85;
  font-weight: 600;
  font-size: 15px;
  padding: 20px 18px;
  position: relative;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.nav-links a i {
  margin-right: 8px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.nav-links a:hover {
  color: #4361ee;
}

.nav-links a:hover::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #4361ee;
  border-radius: 3px 3px 0 0;
}

.nav-links a.router-link-exact-active {
  color: #4361ee;
}

.nav-links a.router-link-exact-active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #4361ee;
  border-radius: 3px 3px 0 0;
}

.logout-btn {
  background: transparent;
  border: none;
  color: #5a6a85;
  font-weight: 600;
  font-size: 15px;
  padding: 20px 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  color: #e74c3c;
}

.logout-btn i {
  margin-right: 8px;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.login-container {
  padding: 20px;
  text-align: center;
  margin-top: 100px;
}

.login-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
  color: white;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(67, 97, 238, 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(67, 97, 238, 0.4);
}

.login-btn i {
  margin-right: 10px;
  font-size: 18px;
}

.content {
  padding: 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f9fafc;
  flex: 1;
}

.page-title {
  font-size: 32px;
  color: #2c3e50;
  margin-bottom: 20px;
  font-weight: 700;
  text-align: center;
}

.page-description {
  color: #5a6a85;
  max-width: 600px;
  text-align: center;
  line-height: 1.6;
  margin-bottom: 40px;
}

.dashboard-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.03);
  width: 100%;
  max-width: 600px;
  text-align: center;
}

.dashboard-card h3 {
  color: #4361ee;
  margin-bottom: 20px;
}

.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
}

.feature {
  background: white;
  border-radius: 12px;
  padding: 25px;
  width: 180px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature i {
  font-size: 32px;
  color: #4361ee;
  margin-bottom: 15px;
}

.feature h4 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.feature p {
  color: #7b8793;
  font-size: 14px;
  line-height: 1.5;
}

footer {
  text-align: center;
  padding: 25px;
  color: #7b8793;
  font-size: 14px;
  border-top: 1px solid #eef1f7;
  background: white;
}

/* Responsiveness */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 15px 0;
  }

  .nav-links {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-links a {
    padding: 15px 12px;
    font-size: 14px;
  }

  .content {
    padding: 30px 20px;
  }

  .features {
    flex-direction: column;
    align-items: center;
  }
}
</style>
