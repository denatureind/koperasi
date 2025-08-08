<template>
  <div class="module-container">
    <div class="module-header">
      <h1 class="module-title">
        <i class="fas fa-chart-line"></i> Laporan Keuangan
      </h1>
      <p class="module-subtitle">
        Akses berbagai laporan keuangan penting untuk analisis dan evaluasi
        performa organisasi
      </p>
    </div>

    <div class="main-content">
      <aside class="sidebar">
        <nav class="sub-nav">
          <router-link to="/laporan/neraca" class="nav-item">
            <i class="fas fa-balance-scale"></i> Neraca
          </router-link>
          <router-link to="/laporan/laba-rugi" class="nav-item">
            <i class="fas fa-chart-pie"></i> Laba Rugi
          </router-link>
          <router-link to="/laporan/shu" class="nav-item">
            <i class="fas fa-calculator"></i> Perhitungan SHU
          </router-link>
        </nav>
      </aside>
      <main class="content-view">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.module-container {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
}

.module-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eef1f7;
}

.module-title {
  font-size: 28px;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.module-title i {
  color: #4361ee;
  font-size: 32px;
}

.module-subtitle {
  color: #5a6a85;
  font-size: 16px;
  max-width: 700px;
  line-height: 1.6;
}

.sub-nav {
  display: flex;
  background: linear-gradient(to right, #f8fafd, #f0f5ff);
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(67, 97, 238, 0.08);
  border: 1px solid #e4e9f9;
}

.sub-nav .nav-item {
  margin-right: 15px;
  text-decoration: none;
  color: #5a6a85;
  font-weight: 600;
  padding: 12px 25px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
  position: relative;
  background: transparent;
}

.sub-nav .nav-item:hover {
  background: rgba(67, 97, 238, 0.05);
  color: #4361ee;
}

.sub-nav .nav-item.router-link-exact-active {
  background: #4361ee;
  color: white;
  box-shadow: 0 4px 10px rgba(67, 97, 238, 0.25);
}

.sub-nav .nav-item.router-link-exact-active i {
  color: white;
}

.sub-nav .nav-item i {
  font-size: 18px;
  transition: color 0.3s ease;
}

.content {
  background: #f9fafc;
  padding: 30px;
  border-radius: 16px;
  border: 1px solid #eef1f7;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.02);
}

/* Responsiveness */
@media (max-width: 768px) {
  .module-container {
    padding: 20px 15px;
  }

  .sub-nav {
    flex-direction: column;
    gap: 8px;
  }

  .sub-nav .nav-item {
    margin-right: 0;
    justify-content: center;
  }

  .content {
    padding: 20px 15px;
  }
}
</style>
