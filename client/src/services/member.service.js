import axios from "axios";
import { useMemberAuthStore } from "@/stores/memberAuth.store.js";

const API_URL = "/api/member";

const MemberService = {
  async getDashboardSummary() {
    const memberAuthStore = useMemberAuthStore();
    return axios.get(`${API_URL}/dashboard`, {
      headers: memberAuthStore.authHeader,
    });
  },

  async getSimpananDetail() {
    const memberAuthStore = useMemberAuthStore();
    return axios.get(`${API_URL}/simpanan`, {
      headers: memberAuthStore.authHeader,
    });
  },

  // --- FUNGSI BARU --- Mengambil transaksi untuk satu rekening simpanan
  async getSimpananTransactions(rekeningId) {
    const memberAuthStore = useMemberAuthStore();
    return axios.get(`${API_URL}/simpanan/${rekeningId}`, {
      headers: memberAuthStore.authHeader,
    });
  },

  // --- FUNGSI BARU UNTUK PINJAMAN --- Mengambil daftar pinjaman anggota
  async getPinjamanList() {
    const memberAuthStore = useMemberAuthStore();
    return axios.get(`${API_URL}/pinjaman`, {
      headers: memberAuthStore.authHeader,
    });
  },

  // --- FUNGSI BARU UNTUK PINJAMAN --- Mengambil detail pinjaman dan jadwal angsuran untuk satu pinjaman
  async getPinjamanDetail(pinjamanId) {
    const memberAuthStore = useMemberAuthStore();
    return axios.get(`${API_URL}/pinjaman/${pinjamanId}`, {
      headers: memberAuthStore.authHeader,
    });
  },
};

export default MemberService;
