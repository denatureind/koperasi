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

// Mengambil aturan poin sukarela
export const getPoinSukarela = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM konfigurasi_poin_sukarela ORDER BY batas_saldo ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil aturan poin sukarela' });
  }
};

// Mengupdate aturan poin sukarela
export const updatePoinSukarela = async (req, res) => {
  const data = req.body; // Menerima array of objects dengan batas_saldo dan harga_saham
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    // Hapus semua data lama
    await client.query('DELETE FROM konfigurasi_poin_sukarela;');
    // Insert data baru
    for (const item of data) {
      await client.query(
        'INSERT INTO konfigurasi_poin_sukarela (batas_saldo, harga_saham) VALUES ($1, $2);',
        [item.batas_saldo, item.harga_saham]
      );
    }
    await client.query('COMMIT');
    res.status(200).json({ message: 'Aturan poin sukarela berhasil diperbarui.' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Gagal memperbarui aturan poin sukarela' });
  } finally {
    client.release();
  }
};
