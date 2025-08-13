import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

export const createJurnalManual = async (req, res) => {
  const { tgl_transaksi, keterangan, entri } = req.body;

  // Validasi dasar
  if (!tgl_transaksi || !keterangan || !entri || entri.length < 2) {
    return res.status(400).json({ message: 'Data tidak lengkap. Minimal harus ada satu debit dan satu kredit.' });
  }

  // Validasi keseimbangan (debit harus sama dengan kredit)
  let totalDebit = 0;
  let totalKredit = 0;
  entri.forEach(item => {
    totalDebit += parseFloat(item.debit) || 0;
    totalKredit += parseFloat(item.kredit) || 0;
  });

  if (totalDebit !== totalKredit) {
    return res.status(400).json({ message: `Jurnal tidak seimbang. Total Debit: ${totalDebit}, Total Kredit: ${totalKredit}` });
  }

  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);

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
        periodeId
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