<template>
  <div class="edit-anggota">
    <h2>Edit Anggota</h2>
    <p>Formulir edit anggota untuk ID: {{ $route.params.id }}</p>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
console.log("Komponen EditAnggota sedang dimuat!"); // Tambahkan ini

onMounted(() => {
  console.log("Mengambil data anggota dengan ID:", route.params.id);
});
</script>

<style scoped>
/* Tambahkan style jika diperlukan */
.edit-anggota {
  padding: 20px;
}
</style>
