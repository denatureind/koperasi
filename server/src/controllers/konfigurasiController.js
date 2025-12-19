import db from '../config/db.js';

// Mengambil semua konfigurasi SHU
export const getKonfigurasiSHU = async (req, res) => {
  try {
    // PERBAIKAN: Menggunakan kolom 'key' bukan 'kode_konfigurasi'
    const result = await db.query(
      `SELECT * FROM konfigurasi_shu 
       WHERE key LIKE 'shu_%'
       ORDER BY id ASC;`
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getKonfigurasiSHU:', error);
    res.status(500).json({ message: 'Gagal mengambil konfigurasi SHU' });
  }
};

// Mengupdate semua konfigurasi SHU
export const updateKonfigurasiSHU = async (req, res) => {
  const configs = req.body; // Array of objects
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Validasi format data
    if (!Array.isArray(configs)) {
      throw new Error('Data harus berupa array');
    }
    
    // Update setiap baris konfigurasi
    for (const config of configs) {
      // Pastikan ada id dan nilai
      if (!config.id || config.nilai === undefined) {
        throw new Error('Format data tidak valid: id dan nilai diperlukan');
      }
      
      await client.query(
        'UPDATE konfigurasi_shu SET nilai = $1 WHERE id = $2;',
        [config.nilai, config.id]
      );
    }
    
    await client.query('COMMIT');
    res.status(200).json({ 
      message: 'Konfigurasi SHU berhasil diperbarui.',
      data: configs 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updateKonfigurasiSHU:', error);
    res.status(500).json({ 
      message: 'Gagal memperbarui konfigurasi SHU',
      error: error.message 
    });
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
    console.error('Error getPoinSukarela:', error);
    res.status(500).json({ message: 'Gagal mengambil aturan poin sukarela' });
  }
};

// Mengupdate aturan poin sukarela
export const updatePoinSukarela = async (req, res) => {
  const data = req.body;
  const client = await db.connect();
  
  try {
    // Validasi format data
    if (!Array.isArray(data)) {
      throw new Error('Data harus berupa array');
    }
    
    await client.query('BEGIN');
    
    // Hapus semua data lama
    await client.query('DELETE FROM konfigurasi_poin_sukarela;');
    
    // Insert data baru
    for (const item of data) {
      if (!item.batas_saldo || !item.harga_saham) {
        throw new Error('Format data tidak valid: batas_saldo dan harga_saham diperlukan');
      }
      
      await client.query(
        'INSERT INTO konfigurasi_poin_sukarela (batas_saldo, harga_saham) VALUES ($1, $2);',
        [item.batas_saldo, item.harga_saham]
      );
    }
    
    await client.query('COMMIT');
    res.status(200).json({ 
      message: 'Aturan poin sukarela berhasil diperbarui.',
      data: data 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updatePoinSukarela:', error);
    res.status(500).json({ 
      message: 'Gagal memperbarui aturan poin sukarela',
      error: error.message 
    });
  } finally {
    client.release();
  }
};

// Mengambil semua konfigurasi untuk frontend
export const getAllKonfigurasi = async (req, res) => {
  try {
    // PERBAIKAN: Menggunakan kolom 'key' untuk sorting
    const result = await db.query('SELECT * FROM konfigurasi_shu ORDER BY key ASC;');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getAllKonfigurasi:', error);
    res.status(500).json({ message: 'Gagal mengambil semua konfigurasi' });
  }
};

// Update konfigurasi berdasarkan kode (sekarang key)
export const updateKonfigurasiByKode = async (req, res) => {
  const { kode } = req.params; // Kita tetap sebut 'kode' di URL parameter
  const { nilai } = req.body;
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // PERBAIKAN: WHERE key = $2
    const result = await client.query(
      'UPDATE konfigurasi_shu SET nilai = $1 WHERE key = $2 RETURNING *;',
      [nilai, kode]
    );
    
    if (result.rows.length === 0) {
      throw new Error(`Konfigurasi dengan kode ${kode} tidak ditemukan`);
    }
    
    await client.query('COMMIT');
    res.status(200).json({ 
      message: 'Konfigurasi berhasil diperbarui.',
      data: result.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updateKonfigurasiByKode:', error);
    res.status(500).json({ 
      message: 'Gagal memperbarui konfigurasi',
      error: error.message 
    });
  } finally {
    client.release();
  }
};