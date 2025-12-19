import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

export const createJurnalManual = async (req, res) => {
  const { tgl_transaksi, keterangan, entri } = req.body;

  // 1. Validasi Input Dasar
  if (!tgl_transaksi || !keterangan || !entri || entri.length < 2) {
    return res.status(400).json({ message: 'Data tidak lengkap. Minimal harus ada satu debit dan satu kredit.' });
  }

  // 2. Validasi Keseimbangan (Debit = Kredit)
  let totalDebit = 0;
  let totalKredit = 0;
  entri.forEach(item => {
    totalDebit += parseFloat(item.debit) || 0;
    totalKredit += parseFloat(item.kredit) || 0;
  });

  if (Math.abs(totalDebit - totalKredit) > 1) { // Toleransi selisih koma kecil
    return res.status(400).json({ message: `Jurnal tidak seimbang. Total Debit: ${totalDebit}, Total Kredit: ${totalKredit}` });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // --- PERBAIKAN LOGIC PENENTUAN PERIODE ---
    
    // Cari periode yang tanggalnya COCOK dengan tanggal transaksi
    const periodeRes = await client.query(
      "SELECT id FROM periode_akuntansi WHERE $1 >= tgl_mulai AND $1 <= tgl_selesai LIMIT 1",
      [tgl_transaksi]
    );

    let periodeId;
    
    if (periodeRes.rows.length > 0) {
      // Jika ketemu periode yang tanggalnya pas, pakai itu
      periodeId = periodeRes.rows[0].id;
    } else {
      // Fallback: Jika tanggalnya diluar semua periode, baru pakai periode aktif (darurat)
      // atau bisa juga throw error jika ingin ketat
      console.log('Tidak ditemukan periode yang cocok tanggal, menggunakan periode aktif.');
      periodeId = await getPeriodeAktifId(client);
    }
    
    // -----------------------------------------

    const query = `
      INSERT INTO jurnal_umum (tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    for (const item of entri) {
      await client.query(query, [
        tgl_transaksi,
        keterangan,
        item.akun_id,
        parseFloat(item.debit) || 0,
        parseFloat(item.kredit) || 0,
        periodeId // Menggunakan ID yang sudah dicocokkan tanggalnya
      ]);
    }

    await client.query('COMMIT');
    res.status(201).json({ message: 'Transaksi jurnal berhasil dibuat.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat membuat jurnal manual:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  } finally {
    client.release();
  }
};

// ... kode yang sudah ada ...

// --- FITUR BARU: HAPUS JURNAL ---
export const deleteJurnal = async (req, res) => {
  const { id } = req.params;
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 1. Cek dulu datanya ada atau tidak
    const cek = await client.query('SELECT * FROM jurnal_umum WHERE id = $1', [id]);
    if (cek.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Data jurnal tidak ditemukan' });
    }

    // 2. Hapus data
    await client.query('DELETE FROM jurnal_umum WHERE id = $1', [id]);

    await client.query('COMMIT');
    res.status(200).json({ message: 'Data jurnal berhasil dihapus' });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error hapus jurnal:', error);
    res.status(500).json({ message: 'Gagal menghapus data' });
  } finally {
    client.release();
  }
};