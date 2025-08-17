import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

// Fungsi untuk menyimpan data belanja bulanan
export const simpanBelanjaBulanan = async (req, res) => {
  const { bulan, tahun, dataBelanja } = req.body;
  if (!bulan || !tahun || !dataBelanja) {
    return res.status(400).json({ message: 'Data tidak lengkap.' });
  }
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);
    const query = `
      INSERT INTO belanja_anggota (anggota_id, periode_id, bulan, tahun, total_belanja)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (anggota_id, periode_id, bulan, tahun) 
      DO UPDATE SET total_belanja = EXCLUDED.total_belanja;
    `;
    for (const item of dataBelanja) {
      if (item.anggota_id && item.total_belanja >= 0) {
        await client.query(query, [item.anggota_id, periodeId, bulan, tahun, item.total_belanja]);
      }
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'Data belanja berhasil disimpan.' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat menyimpan data belanja:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  } finally {
    client.release();
  }
};

// Fungsi untuk mengambil data belanja untuk bulan tertentu
export const getBelanjaBulanan = async (req, res) => {
    const { bulan, tahun } = req.query;
    if (!bulan || !tahun) {
        return res.status(400).json({ message: 'Bulan dan Tahun wajib diisi.' });
    }
    try {
        const query = `
            SELECT a.id as anggota_id, a.kode_anggota, a.nama, COALESCE(b.total_belanja, 0) as total_belanja
            FROM anggota a
            LEFT JOIN belanja_anggota b ON a.id = b.anggota_id AND b.bulan = $1 AND b.tahun = $2
            WHERE a.status = 'aktif'
            ORDER BY a.nama ASC;
        `;
        const result = await db.query(query, [bulan, tahun]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error mengambil data belanja:', error);
        res.status(500).json({ message: 'Gagal mengambil data belanja.' });
    }
};