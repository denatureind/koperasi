<template>
  <div
    class="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[calc(100vh-12rem)]"
  >
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-tachometer-alt text-indigo-600"></i>
        Dashboard Koperasi
      </h1>
      <p class="text-gray-500 mt-1">
        Ringkasan kinerja dan aktivitas terkini koperasi Anda
      </p>
    </div>

    <!-- Statistik Utama -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div
        class="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-indigo-100 p-3 rounded-xl">
            <i class="fas fa-users text-indigo-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Anggota Aktif</div>
            <div class="text-2xl font-bold text-gray-800">1,245</div>
          </div>
        </div>
        <div class="flex items-center text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>+5.2% dari bulan lalu</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-green-100 p-3 rounded-xl">
            <i class="fas fa-piggy-bank text-green-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Total Simpanan</div>
            <div class="text-2xl font-bold text-gray-800">Rp 2.8 M</div>
          </div>
        </div>
        <div class="flex items-center text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>+12.7% dari bulan lalu</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-amber-100 p-3 rounded-xl">
            <i class="fas fa-hand-holding-usd text-amber-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">Pinjaman Aktif</div>
            <div class="text-2xl font-bold text-gray-800">Rp 1.2 M</div>
          </div>
        </div>
        <div class="flex items-center text-sm text-rose-600">
          <i class="fas fa-arrow-down mr-1"></i>
          <span>-3.4% dari bulan lalu</span>
        </div>
      </div>

      <div
        class="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 shadow-sm"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="bg-blue-100 p-3 rounded-xl">
            <i class="fas fa-chart-line text-blue-600 text-xl"></i>
          </div>
          <div class="text-right">
            <div class="text-sm text-gray-500">SHU Tahun Ini</div>
            <div class="text-2xl font-bold text-gray-800">Rp 380 Jt</div>
          </div>
        </div>
        <div class="flex items-center text-sm text-green-600">
          <i class="fas fa-arrow-up mr-1"></i>
          <span>+8.3% dari tahun lalu</span>
        </div>
      </div>
    </div>

    <!-- Grafik dan Aktivitas -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <!-- Grafik Simpanan -->
      <div
        class="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6"
      >
        <div class="flex justify-between items-center mb-6">
          <h2
            class="text-lg font-semibold text-gray-800 flex items-center gap-2"
          >
            <i class="fas fa-chart-bar text-indigo-500"></i>
            Tren Simpanan & Pinjaman
          </h2>
          <div class="flex gap-2">
            <button
              class="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-sm"
            >
              Bulanan
            </button>
            <button
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm"
            >
              Tahunan
            </button>
          </div>
        </div>
        <div class="relative h-64">
          <!-- Placeholder for chart -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <i class="fas fa-chart-pie text-4xl text-gray-200 mb-3"></i>
              <p class="text-gray-400">
                Visualisasi grafik akan ditampilkan di sini
              </p>
            </div>
          </div>
          <!-- Mock chart bars -->
          <div
            class="absolute bottom-0 left-0 right-0 h-3/4 flex items-end justify-around px-4"
          >
            <div
              v-for="i in 6"
              :key="i"
              class="w-8 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-md"
              :style="`height: ${30 + i * 10}%`"
            ></div>
            <div
              v-for="i in 6"
              :key="i + 6"
              class="w-8 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-md"
              :style="`height: ${20 + i * 8}%`"
            ></div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-4">
          <div class="flex items-center">
            <div class="w-3 h-3 bg-indigo-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Simpanan</span>
          </div>
          <div class="flex items-center">
            <div class="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
            <span class="text-sm text-gray-600">Pinjaman</span>
          </div>
        </div>
      </div>

      <!-- Aktivitas Terbaru -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-200"
        >
          <h2
            class="text-lg font-semibold text-indigo-700 flex items-center gap-2"
          >
            <i class="fas fa-bell"></i>
            Aktivitas Terbaru
          </h2>
        </div>
        <div class="divide-y divide-gray-100 max-h-[350px] overflow-y-auto">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex">
              <div :class="`p-2 rounded-full ${activity.bgColor}`">
                <i
                  :class="`${activity.icon} ${activity.textColor} text-lg`"
                ></i>
              </div>
              <div class="ml-3 flex-1">
                <p class="font-medium text-gray-800">{{ activity.title }}</p>
                <p class="text-sm text-gray-600">{{ activity.description }}</p>
                <div class="flex justify-between mt-1">
                  <span class="text-xs text-gray-500">{{ activity.time }}</span>
                  <span
                    class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700"
                  >
                    {{ activity.status }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Anggota & Pinjaman Terbaru -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Anggota Baru -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-6 py-4 border-b border-gray-200"
        >
          <h2
            class="text-lg font-semibold text-indigo-700 flex items-center gap-2"
          >
            <i class="fas fa-user-plus"></i>
            Anggota Baru
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="member in newMembers"
            :key="member.id"
            class="p-4 flex items-center hover:bg-gray-50 transition-colors"
          >
            <div class="relative">
              <div
                class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center"
              >
                <i class="fas fa-user text-indigo-600"></i>
              </div>
              <span
                class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              ></span>
            </div>
            <div class="ml-3 flex-1">
              <p class="font-medium text-gray-800">{{ member.name }}</p>
              <p class="text-sm text-gray-600">
                Bergabung {{ member.joinDate }}
              </p>
            </div>
            <span
              class="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-800"
            >
              {{ member.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pinjaman Terbaru -->
      <div
        class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div
          class="bg-gradient-to-r from-amber-50 to-amber-100 px-6 py-4 border-b border-gray-200"
        >
          <h2
            class="text-lg font-semibold text-amber-700 flex items-center gap-2"
          >
            <i class="fas fa-file-invoice-dollar"></i>
            Pinjaman Terbaru
          </h2>
        </div>
        <div class="divide-y divide-gray-100">
          <div
            v-for="loan in newLoans"
            :key="loan.id"
            class="p-4 hover:bg-gray-50 transition-colors"
          >
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-800">{{ loan.name }}</p>
                <p class="text-sm text-gray-600">
                  No. Pinjaman: {{ loan.number }}
                </p>
              </div>
              <span class="text-sm font-semibold text-gray-800">{{
                loan.amount
              }}</span>
            </div>
            <div class="flex justify-between mt-2">
              <div class="text-sm text-gray-600 flex items-center">
                <i class="fas fa-clock mr-1"></i>
                <span>{{ loan.tenor }} bulan</span>
              </div>
              <span
                :class="`text-xs px-2 py-1 rounded-full ${loan.statusColor}`"
              >
                {{ loan.status }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HalamanDashboard",
  data() {
    return {
      activities: [
        {
          id: 1,
          icon: "fas fa-hand-holding-usd",
          title: "Pencairan Pinjaman Baru",
          description: "Budi Santoso mencairkan pinjaman sebesar Rp 15.000.000",
          time: "10 menit lalu",
          status: "Berhasil",
          bgColor: "bg-amber-100",
          textColor: "text-amber-600",
        },
        {
          id: 2,
          icon: "fas fa-piggy-bank",
          title: "Setoran Simpanan",
          description: "Siti Rahayu menyetor simpanan wajib Rp 100.000",
          time: "1 jam lalu",
          status: "Berhasil",
          bgColor: "bg-green-100",
          textColor: "text-green-600",
        },
        {
          id: 3,
          icon: "fas fa-user-plus",
          title: "Anggota Baru",
          description: "Rina Wijaya bergabung sebagai anggota baru",
          time: "3 jam lalu",
          status: "Aktif",
          bgColor: "bg-indigo-100",
          textColor: "text-indigo-600",
        },
        {
          id: 4,
          icon: "fas fa-file-invoice",
          title: "Pembayaran Angsuran",
          description: "Agus Supriyadi membayar angsuran ke-5",
          time: "5 jam lalu",
          status: "Lunas",
          bgColor: "bg-blue-100",
          textColor: "text-blue-600",
        },
        {
          id: 5,
          icon: "fas fa-cogs",
          title: "Pembaruan Sistem",
          description: "Versi terbaru aplikasi koperasi telah diinstal",
          time: "1 hari lalu",
          status: "Selesai",
          bgColor: "bg-purple-100",
          textColor: "text-purple-600",
        },
      ],
      newMembers: [
        {
          id: 1,
          name: "Rina Wijaya",
          joinDate: "hari ini",
          status: "Baru",
        },
        {
          id: 2,
          name: "Dewi Kurnia",
          joinDate: "kemarin",
          status: "Aktif",
        },
        {
          id: 3,
          name: "Fajar Setiawan",
          joinDate: "2 hari lalu",
          status: "Aktif",
        },
        {
          id: 4,
          name: "Budi Santoso",
          joinDate: "3 hari lalu",
          status: "Aktif",
        },
      ],
      newLoans: [
        {
          id: 1,
          name: "Budi Santoso",
          number: "PJN-2023-00125",
          amount: "Rp 15.000.000",
          tenor: 12,
          status: "Disetujui",
          statusColor: "bg-green-100 text-green-800",
        },
        {
          id: 2,
          name: "Siti Rahayu",
          number: "PJN-2023-00126",
          amount: "Rp 8.500.000",
          tenor: 10,
          status: "Diproses",
          statusColor: "bg-amber-100 text-amber-800",
        },
        {
          id: 3,
          name: "Agus Supriyadi",
          number: "PJN-2023-00127",
          amount: "Rp 12.000.000",
          tenor: 18,
          status: "Disetujui",
          statusColor: "bg-green-100 text-green-800",
        },
        {
          id: 4,
          name: "Dewi Kurnia",
          number: "PJN-2023-00128",
          amount: "Rp 7.000.000",
          tenor: 8,
          status: "Ditolak",
          statusColor: "bg-rose-100 text-rose-800",
        },
      ],
    };
  },
};
</script>

<style scoped>
/* Animations */
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

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}
</style>
