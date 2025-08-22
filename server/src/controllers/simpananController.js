import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';
import ExcelJS from 'exceljs';

// FUNGSI BARU DENGAN PAGINATION, SEARCH, DAN FILTER
export const getSimpananSummary = async (req, res) => {
  const client = await db.connect();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const filter = req.query.filter || 'Semua';
    const offset = (page - 1) * limit;

    const summaryQuery = `
      SELECT 
        jenis_simpanan, 
        SUM(saldo) as total_saldo, 
        COUNT(id) as jumlah_rekening 
      FROM rekening_simpanan 
      GROUP BY jenis_simpanan;
    `;

    let detailQuery = `
      SELECT r.id, r.no_rekening, r.jenis_simpanan, r.saldo, a.id as anggota_id, a.nama as nama_anggota 
      FROM rekening_simpanan r
      JOIN anggota a ON r.anggota_id = a.id
    `;
    let countQuery = `
      SELECT COUNT(*) 
      FROM rekening_simpanan r 
      JOIN anggota a ON r.anggota_id = a.id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (filter !== 'Semua') {
      conditions.push(`r.jenis_simpanan = $${paramCount}`);
      values.push(filter);
      paramCount++;
    }

    if (search) {
      conditions.push(`(a.nama ILIKE $${paramCount} OR r.no_rekening ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      detailQuery += whereClause;
      countQuery += whereClause;
    }

    detailQuery += ` ORDER BY a.nama ASC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    const detailValues = [...values, limit, offset];
    
    const summaryResult = await client.query(summaryQuery);
    const detailResult = await client.query(detailQuery, detailValues);
    const countResult = await client.query(countQuery, values);

    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      summaries: summaryResult.rows,
      pagination: {
        data: detailResult.rows,
        totalItems,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    console.error('Error mengambil ringkasan simpanan:', error);
    res.status(500).json({ message: 'Gagal mengambil data simpanan' });
  } finally {
    client.release();
  }
};

// FUNGSI EKSPOR KE EXCEL
export const exportSimpananToExcel = async (req, res) => {
  const client = await db.connect();
  try {
    const search = req.query.search || '';
    const filter = req.query.filter || 'Semua';

    let query = `
      SELECT r.no_rekening, r.jenis_simpanan, r.saldo, a.nama as nama_anggota 
      FROM rekening_simpanan r
      JOIN anggota a ON r.anggota_id = a.id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (filter !== 'Semua') {
      conditions.push(`r.jenis_simpanan = $${paramCount}`);
      values.push(filter);
      paramCount++;
    }

    if (search) {
      conditions.push(`(a.nama ILIKE $${paramCount} OR r.no_rekening ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY a.nama ASC';
    
    const result = await client.query(query, values);
    
    // Buat workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daftar Simpanan');
    
    // Judul Laporan
    worksheet.mergeCells('A1:D1');
    worksheet.getCell('A1').value = 'LAPORAN REKENING SIMPANAN';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };
    
    // Header Tabel
    const headers = ['No. Rekening', 'Nama Anggota', 'Jenis Simpanan', 'Saldo'];
    worksheet.addRow(headers);
    
    // Style untuk Header
    const headerRow = worksheet.getRow(3);
    headerRow.font = { bold: true, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E40AF' }
    };
    headerRow.alignment = { horizontal: 'center' };
    
    // Isi Data
    result.rows.forEach((row) => {
      worksheet.addRow([
        row.no_rekening,
        row.nama_anggota,
        row.jenis_simpanan,
        parseFloat(row.saldo)
      ]);
    });
    
    // Format Kolom Saldo
    const saldoColumn = worksheet.getColumn('D');
    saldoColumn.numFmt = '"Rp"#,##0.00;[Red]"Rp"-#,##0.00';
    
    // Atur Lebar Kolom
    worksheet.columns = [
      { width: 20 }, // No. Rekening
      { width: 30 }, // Nama Anggota
      { width: 20 }, // Jenis Simpanan
      { width: 15 }  // Saldo
    ];
    
    // Border untuk Seluruh Tabel
    const lastRow = worksheet.rowCount;
    for (let i = 3; i <= lastRow; i++) {
      const row = worksheet.getRow(i);
      row.eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    }
    
    // Set Header Response
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=daftar_simpanan.xlsx'
    );
    
    // Kirim File Excel
    await workbook.xlsx.write(res);
    res.end();
    
  } catch (error) {
    console.error('Error ekspor data simpanan:', error);
    res.status(500).json({ message: 'Gagal mengekspor data' });
  } finally {
    client.release();
  }
};

// --- FUNGSI-FUNGSI LAINNYA (TIDAK BERUBAH) ---

export const getAllTransaksi = async (req, res) => {
  try {
    const query = `
      SELECT 
        t.id, t.tgl_transaksi, t.jenis_transaksi, t.jumlah,
        r.no_rekening, a.nama as nama_anggota
      FROM transaksi_simpanan t
      JOIN rekening_simpanan r ON t.rekening_id = r.id
      JOIN anggota a ON r.anggota_id = a.id
      ORDER BY t.tgl_transaksi DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error mengambil semua transaksi simpanan:', error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

export const getRekeningById = async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT r.*, a.nama as nama_anggota 
      FROM rekening_simpanan r 
      JOIN anggota a ON r.anggota_id = a.id 
      WHERE r.id = $1;
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rekening tidak ditemukan' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil data rekening.' });
  }
};

export const getRekeningByAnggotaId = async (req, res) => {
  const { anggotaId } = req.params;
  try {
    const query = 'SELECT * FROM rekening_simpanan WHERE anggota_id = $1 ORDER BY jenis_simpanan ASC;';
    const result = await db.query(query, [anggotaId]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: 'Error mengambil data rekening.' });
  }
};

export const getMutasiByRekeningId = async (req, res) => {
    const { rekeningId } = req.params;
    try {
      const query = 'SELECT * FROM transaksi_simpanan WHERE rekening_id = $1 ORDER BY tgl_transaksi DESC;';
      const result = await db.query(query, [rekeningId]);
      res.status(200).json(result.rows);
    } catch (error) {
      res.status(500).json({ message: 'Error mengambil data mutasi.' });
    }
};

export const createRekening = async (req, res) => {
    const { anggota_id, jenis_simpanan } = req.body;
    const jenisResult = await db.query('SELECT * FROM jenis_simpanan WHERE nama_jenis = $1', [jenis_simpanan]);
    if (jenisResult.rows.length === 0) {
        return res.status(400).json({ message: 'Jenis simpanan tidak valid.' });
    }
    const no_rekening = `${jenis_simpanan.substring(0,2).toUpperCase()}-${String(anggota_id).padStart(4,'0')}-${Date.now().toString().slice(-4)}`;
    try {
      const query = `INSERT INTO rekening_simpanan(anggota_id, jenis_simpanan, no_rekening, saldo) VALUES($1, $2, $3, 0) RETURNING *;`;
      const newRekening = await db.query(query, [anggota_id, jenis_simpanan, no_rekening]);
      res.status(201).json(newRekening.rows[0]);
    } catch (error) {
      res.status(500).json({ message: 'Error membuat rekening baru.' });
    }
};

export const createSetoran = async (req, res) => {
  const { rekeningId } = req.params;
  const { jumlah, tgl_transaksi } = req.body;
  const AKUN_KAS_ID = 11;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);
    const rekInfoQuery = `SELECT r.no_rekening, r.jenis_simpanan, a.nama, js.akun_id FROM rekening_simpanan r JOIN anggota a ON r.anggota_id = a.id JOIN jenis_simpanan js ON r.jenis_simpanan = js.nama_jenis WHERE r.id = $1`;
    const rekInfo = await client.query(rekInfoQuery, [rekeningId]);
    const { no_rekening, jenis_simpanan, nama, akun_id } = rekInfo.rows[0];
    const keterangan = `Setoran ${jenis_simpanan} ${no_rekening} a.n. ${nama}`;
    await client.query(`INSERT INTO transaksi_simpanan(rekening_id, jenis_transaksi, jumlah, tgl_transaksi) VALUES($1, 'Setor', $2, $3);`, [rekeningId, jumlah, tgl_transaksi]);
    await client.query('UPDATE rekening_simpanan SET saldo = saldo + $1 WHERE id = $2;', [jumlah, rekeningId]);
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id, tgl_transaksi) VALUES ($1, $2, $3, $4, $5, $6);`;
    await client.query(jurnalQuery, [keterangan, AKUN_KAS_ID, jumlah, 0, periodeId, tgl_transaksi]);
    await client.query(jurnalQuery, [keterangan, akun_id, 0, jumlah, periodeId, tgl_transaksi]);
    await client.query('COMMIT');
    res.status(200).json({ message: 'Setoran berhasil' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Transaksi setoran gagal' });
  } finally {
    client.release();
  }
};

export const createPenarikan = async (req, res) => {
  const { rekeningId } = req.params;
  const { jumlah, tgl_transaksi } = req.body;
  const AKUN_KAS_ID = 11;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const periodeId = await getPeriodeAktifId(client);
    const rekInfoQuery = `SELECT r.no_rekening, r.jenis_simpanan, a.nama, r.saldo, js.akun_id FROM rekening_simpanan r JOIN anggota a ON r.anggota_id = a.id JOIN jenis_simpanan js ON r.jenis_simpanan = js.nama_jenis WHERE r.id = $1 FOR UPDATE`;
    const rekInfo = await client.query(rekInfoQuery, [rekeningId]);
    if (rekInfo.rows.length === 0) throw new Error('Rekening tidak ditemukan');
    const { no_rekening, jenis_simpanan, nama, saldo, akun_id } = rekInfo.rows[0];
    if (parseFloat(saldo) < jumlah) {
      await client.query('ROLLBACK');
      client.release();
      return res.status(400).json({ message: 'Saldo tidak mencukupi' });
    }
    const keterangan = `Penarikan ${jenis_simpanan} ${no_rekening} a.n. ${nama}`;
    await client.query('UPDATE rekening_simpanan SET saldo = saldo - $1 WHERE id = $2;', [jumlah, rekeningId]);
    await client.query(`INSERT INTO transaksi_simpanan(rekening_id, jenis_transaksi, jumlah, tgl_transaksi) VALUES($1, 'Tarik', $2, $3);`, [rekeningId, jumlah, tgl_transaksi]);
    const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id, tgl_transaksi) VALUES ($1, $2, $3, $4, $5, $6);`;
    await client.query(jurnalQuery, [keterangan, akun_id, jumlah, 0, periodeId, tgl_transaksi]);
    await client.query(jurnalQuery, [keterangan, AKUN_KAS_ID, 0, jumlah, periodeId, tgl_transaksi]);
    await client.query('COMMIT');
    res.status(200).json({ message: 'Penarikan berhasil' });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ message: 'Transaksi penarikan gagal' });
  } finally {
    client.release();
  }
};
