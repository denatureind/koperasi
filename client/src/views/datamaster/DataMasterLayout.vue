<template>
  <div class="data-master-container">
    <h1>Manajemen Data Master</h1>
    <nav class="sub-nav">
      <router-link to="/data-master/anggota">Anggota</router-link>
      <router-link to="/data-master/pengurus">Pengurus</router-link>
      <router-link to="/data-master/aset">Aset</router-link>
    </nav>
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
// Tidak perlu script khusus untuk layout ini
</script>

<style scoped>
.data-master-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
.sub-nav {
  background-color: #f8f9fa;
  padding: 10px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  margin-bottom: 20px;
}
.sub-nav a {
  margin-right: 20px;
  text-decoration: none;
  color: #007bff;
  font-weight: bold;
  padding: 5px 10px;
}
.sub-nav a.router-link-exact-active {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
}
.content {
  border: 1px solid #eee;
  padding: 20px;
  border-radius: 8px;
}
</style>
