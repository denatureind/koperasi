import db from '../config/db.js';
import ExcelJS from 'exceljs';

// FUNGSI BARU: Update data anggota
export const updateAnggota = async (req, res) => {
  const { id } = req.params;
  const { nama, status } = req.body;

  // Validasi sederhana
  if (!nama || !status) {
    return res.status(400).json({ message: 'Nama dan status wajib diisi' });
  }

  try {
    const query = `
      UPDATE anggota 
      SET nama = $1, status = $2 
      WHERE id = $3 
      RETURNING *;
    `;
    const values = [nama, status, id];
    const result = await db.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error saat mengupdate anggota dengan ID ${id}:`, error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// FUNGSI BARU: Hapus data anggota
export const deleteAnggota = async (req, res) => {
  const { id } = req.params;

  try {
    // --- BLOK PENGECEKAN BARU ---
    // Cek 1: Apakah anggota punya rekening simpanan?
    const cekSimpananQuery = 'SELECT COUNT(*) FROM rekening_simpanan WHERE anggota_id = $1;';
    const hasilCekSimpanan = await db.query(cekSimpananQuery, [id]);
    if (parseInt(hasilCekSimpanan.rows[0].count) > 0) {
      return res.status(400).json({ message: 'Gagal hapus: Anggota masih memiliki rekening simpanan.' });
    }

    // Cek 2: Apakah anggota punya pinjaman yang masih aktif?
    const cekPinjamanQuery = "SELECT COUNT(*) FROM rekening_pinjaman WHERE anggota_id = $1 AND status = 'aktif';";
    const hasilCekPinjaman = await db.query(cekPinjamanQuery, [id]);
    if (parseInt(hasilCekPinjaman.rows[0].count) > 0) {
      return res.status(400).json({ message: 'Gagal hapus: Anggota masih memiliki pinjaman aktif.' });
    }
    // --- AKHIR BLOK PENGECEKAN ---

    // Jika semua pengecekan lolos, baru lakukan penghapusan
    const deleteQuery = 'DELETE FROM anggota WHERE id = $1 RETURNING *;';
    const result = await db.query(deleteQuery, [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }

    res.status(200).json({ message: 'Anggota berhasil dihapus' });

  } catch (error) {
    console.error(`Error saat menghapus anggota dengan ID ${id}:`, error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// FUNGSI LAMA (DIMODIFIKASI UNTUK PAGINATION DAN SEARCH)
export const getAllAnggota = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let dataQuery = 'SELECT * FROM anggota';
    let countQuery = 'SELECT COUNT(*) FROM anggota';
    let values = [];

    if (search) {
      dataQuery += ' WHERE nama ILIKE $1';
      countQuery += ' WHERE nama ILIKE $1';
      values.push(`%${search}%`);
    }

    dataQuery += ' ORDER BY nama ASC LIMIT $' + (values.length + 1) + ' OFFSET $' + (values.length + 2);
    values.push(limit, offset);

    const dataResult = await db.query(dataQuery, values);

    const countResult = await db.query(countQuery, search ? [values[0]] : []);
    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: dataResult.rows,
      totalItems,
      totalPages,
      currentPage: page
    });
  } catch (error) {
    console.error('Error saat mengambil semua anggota:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

export const getAnggotaById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = 'SELECT * FROM anggota WHERE id = $1;';
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Anggota tidak ditemukan' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error saat mengambil anggota dengan ID ${id}:`, error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// FUNGSI LAMA: Membuat anggota baru (dengan perubahan)
export const createAnggota = async (req, res) => {
  const { nama, jenis_kelamin } = req.body; // <-- Diubah
  if (!nama || !jenis_kelamin) { // <-- Diubah
    return res.status(400).json({ message: 'Nama dan Jenis Kelamin wajib diisi' });
  }

  const prefix = 'BM';
  try {
    const lastAnggotaQuery = `
      SELECT kode_anggota FROM anggota 
      WHERE kode_anggota LIKE $1 
      ORDER BY kode_anggota DESC 
      LIMIT 1;
    `;
    const lastAnggotaResult = await db.query(lastAnggotaQuery, [`${prefix}-%`]);
    let nextNumber = 1;
    if (lastAnggotaResult.rows.length > 0) {
      const lastKode = lastAnggotaResult.rows[0].kode_anggota;
      const lastNumber = parseInt(lastKode.split('-')[1], 10);
      nextNumber = lastNumber + 1;
    }
    const nextKodeAnggota = `${prefix}-${String(nextNumber).padStart(3, '0')}`;
    const insertQuery = `
      INSERT INTO anggota (kode_anggota, nama, jenis_kelamin)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [nextKodeAnggota, nama, jenis_kelamin]; // <-- Diubah
    const result = await db.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saat membuat anggota:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};

// GANTI FUNGSI LAMA DENGAN VERSI BARU YANG LEBIH RAPI INI
export const exportAnggotaToExcel = async (req, res) => {
  try {
    const query = 'SELECT kode_anggota, nama, jenis_kelamin, status FROM anggota ORDER BY nama ASC;';
    const result = await db.query(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Anggota');

    // Menambahkan Judul Laporan
    worksheet.addRow(['Laporan Daftar Anggota Koperasi']).font = { bold: true, size: 16 };
    worksheet.mergeCells('A1:D1'); // Sesuaikan dengan jumlah kolom
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.addRow([]); // Baris kosong untuk spasi

    // Menambahkan Header Tabel
    const headerRow = worksheet.addRow(['Kode Anggota', 'Nama', 'Jenis Kelamin', 'Status']);
    
    // Memberi Style pada Header
    headerRow.font = { bold: true };
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDEBF7' } // Warna biru muda
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Menambahkan Baris Data
    result.rows.forEach(anggota => {
      worksheet.addRow(Object.values(anggota));
    });

    // Mengatur Lebar Kolom
    worksheet.getColumn('A').width = 15;
    worksheet.getColumn('B').width = 35;
    worksheet.getColumn('C').width = 20;
    worksheet.getColumn('D').width = 15;

    // Mengatur Header untuk Respons File Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="Daftar_Anggota.xlsx"');

    // Menulis file Excel ke respons dan mengakhiri
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error saat mengekspor data anggota ke Excel:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};