import db from '../config/db.js';

// Fungsi untuk mengambil ringkasan data dashboard anggota
export const getMemberDashboard = async (req, res) => {
  const anggotaId = req.user.anggotaId; 

  if (!anggotaId) {
    return res.status(401).json({ message: 'Akses tidak sah.' });
  }

  try {
    // 1. Ambil Rincian Simpanan
    const simpananResult = await db.query(
      "SELECT jenis_simpanan, saldo FROM rekening_simpanan WHERE anggota_id = $1 ORDER BY jenis_simpanan",
      [anggotaId]
    );
    const totalSimpanan = simpananResult.rows.reduce((sum, item) => sum + parseFloat(item.saldo), 0);
    const rincianSimpanan = simpananResult.rows.map(item => ({
      jenis: item.jenis_simpanan,
      saldo: parseFloat(item.saldo)
    }));

    // 2. Ambil Informasi Pinjaman Aktif
    const pinjamanResult = await db.query(
      "SELECT id, sisa_pokok FROM rekening_pinjaman WHERE anggota_id = $1 AND status = 'aktif'",
      [anggotaId]
    );
    const totalPinjaman = pinjamanResult.rows.reduce((sum, item) => sum + parseFloat(item.sisa_pokok), 0);
    
    let angsuranBerikutnya = null;
    if (pinjamanResult.rows.length > 0) {
      const rekeningPinjamanIds = pinjamanResult.rows.map(p => p.id);
      const angsuranResult = await db.query(
        `SELECT tgl_jatuh_tempo, (pokok_dibayar + jasa_dibayar) as total_bayar 
         FROM jadwal_angsuran 
         WHERE rekening_pinjaman_id = ANY($1::int[]) AND tgl_pembayaran IS NULL 
         ORDER BY tgl_jatuh_tempo ASC LIMIT 1`,
        [rekeningPinjamanIds]
      );
      if (angsuranResult.rows.length > 0) {
        angsuranBerikutnya = {
          tanggal: angsuranResult.rows[0].tgl_jatuh_tempo,
          jumlah: parseFloat(angsuranResult.rows[0].total_bayar)
        };
      }
    }

    // 3. Ambil Informasi SHU (Sederhana: Tampilkan link/placeholder)
    const infoSHU = {
      pesan: "Lihat rincian perolehan SHU Anda dari periode-periode sebelumnya."
    };

    res.status(200).json({
      simpanan: {
        total: totalSimpanan,
        rincian: rincianSimpanan
      },
      pinjaman: {
        totalAktif: totalPinjaman,
        angsuranBerikutnya: angsuranBerikutnya
      },
      shu: infoSHU
    });
  } catch (error) {
    console.error("Error saat mengambil data dasbor anggota:", error);
    res.status(500).json({ message: "Gagal mengambil data dasbor." });
  }
};

// Fungsi untuk mengambil rincian simpanan
export const getMemberSimpananDetail = async (req, res) => {
  const anggotaId = req.user.anggotaId;

  try {
    const rekeningResult = await db.query(
      `SELECT id, jenis_simpanan, saldo FROM rekening_simpanan WHERE anggota_id = $1 ORDER BY jenis_simpanan`,
      [anggotaId]
    );
    const rekenings = rekeningResult.rows.map(r => ({ ...r, saldo: parseFloat(r.saldo) }));

    res.status(200).json({ rekenings: rekenings });

  } catch (error) {
    console.error("Error saat mengambil detail simpanan anggota:", error);
    res.status(500).json({ message: "Gagal mengambil data detail simpanan." });
  }
};

// Fungsi untuk mengambil transaksi simpanan
export const getMemberSimpananTransactions = async (req, res) => {
  const anggotaId = req.user.anggotaId;
  const rekeningId = req.params.id;

  try {
    const rekeningResult = await db.query(
      `SELECT id, jenis_simpanan, saldo FROM rekening_simpanan WHERE id = $1 AND anggota_id = $2`,
      [rekeningId, anggotaId]
    );

    if (rekeningResult.rows.length === 0) {
      return res.status(404).json({ message: "Rekening tidak ditemukan atau bukan milik Anda." });
    }
    const rekeningDetail = rekeningResult.rows[0];

    const trxResult = await db.query(
      `SELECT t.tgl_transaksi, t.jenis_transaksi, t.jumlah
       FROM transaksi_simpanan t
       WHERE t.rekening_id = $1
       ORDER BY t.tgl_transaksi DESC, t.id DESC`,
      [rekeningId]
    );
    
    const transactions = trxResult.rows.map(t => ({
        ...t,
        keterangan: t.jenis_transaksi === 'Setor' ? 'Setoran tunai' : 'Penarikan tunai'
    }));
    
    res.status(200).json({
      rekening: rekeningDetail,
      transactions: transactions
    });

  } catch (error) {
    console.error("Error saat mengambil transaksi simpanan anggota:", error);
    res.status(500).json({ message: "Gagal mengambil data transaksi." });
  }
};

// Fungsi baru: Mengambil daftar pinjaman anggota
export const getMemberPinjamanList = async (req, res) => {
  const anggotaId = req.user.anggotaId;
  try {
    // PERBAIKAN: Mengganti 'total_pinjaman' dengan 'jumlah_pinjaman'
    const result = await db.query(
      `SELECT id, no_pinjaman AS kode_pinjaman, tgl_pencairan, jumlah_pinjaman AS total_pinjaman, sisa_pokok, status 
       FROM rekening_pinjaman 
       WHERE anggota_id = $1 
       ORDER BY tgl_pencairan DESC`,
      [anggotaId]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error saat mengambil daftar pinjaman anggota:", error);
    res.status(500).json({ message: "Gagal mengambil daftar pinjaman." });
  }
};

// Fungsi baru: Mengambil detail pinjaman anggota
export const getMemberPinjamanDetail = async (req, res) => {
  const anggotaId = req.user.anggotaId;
  const pinjamanId = req.params.id;
  try {
    // PERBAIKAN: Mengganti 'total_pinjaman' dengan 'jumlah_pinjaman'
    const pinjamanResult = await db.query(
      `SELECT id, no_pinjaman AS kode_pinjaman, jumlah_pinjaman AS total_pinjaman, sisa_pokok, tgl_pencairan, status 
       FROM rekening_pinjaman 
       WHERE id = $1 AND anggota_id = $2`,
      [pinjamanId, anggotaId]
    );
    if (pinjamanResult.rows.length === 0) {
      return res.status(404).json({ message: "Pinjaman tidak ditemukan atau bukan milik Anda." });
    }
    
    // PERBAIKAN: Mengganti 'tgl_pencairan' & membuat kolom 'status' dengan CASE
    const angsuranResult = await db.query(
      `SELECT 
         angsuran_ke, 
         tgl_jatuh_tempo, 
         (pokok_dibayar + jasa_dibayar) as total_bayar, 
         tgl_pembayaran, 
         CASE
           WHEN tgl_pembayaran IS NOT NULL THEN 'lunas'
           WHEN tgl_jatuh_tempo < NOW() THEN 'menunggak'
           ELSE 'belum bayar'
         END AS status
       FROM jadwal_angsuran 
       WHERE rekening_pinjaman_id = $1 
       ORDER BY angsuran_ke ASC`,
      [pinjamanId]
    );

    res.status(200).json({
      pinjaman: pinjamanResult.rows[0],
      jadwal_angsuran: angsuranResult.rows
    });
  } catch (error) {
    console.error("Error saat mengambil detail pinjaman anggota:", error);
    res.status(500).json({ message: "Gagal mengambil detail pinjaman." });
  }
};
