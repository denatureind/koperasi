import db from '../config/db.js';

// Mengambil semua konfigurasi SHU
export const getKonfigurasiSHU = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM konfigurasi_shu ORDER BY id ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil konfigurasi SHU' });
  }
};

// Mengupdate semua konfigurasi SHU
export const updateKonfigurasiSHU = async (req, res) => {
  const configs = req.body; // Menerima array of objects
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // Looping untuk update setiap baris konfigurasi
    for (const config of configs) {
      await client.query(
        'UPDATE konfigurasi_shu SET nilai = $1 WHERE id = $2;',
        [config.nilai, config.id]
      );
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'Konfigurasi SHU berhasil diperbarui.' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Gagal memperbarui konfigurasi SHU' });
  } finally {
    client.release();
  }
};