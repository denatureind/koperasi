import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

// FUNGSI UNTUK HALAMAN DATA SIMPANAN (RINGKASAN + FILTER)
export const getSimpananSummary = async (req, res) => {
  try {
    const summaryQuery = `
      SELECT 
        jenis_simpanan, 
        SUM(saldo) as total_saldo, 
        COUNT(id) as jumlah_rekening 
      FROM rekening_simpanan 
      GROUP BY jenis_simpanan;
    `;
    const summaryResult = await db.query(summaryQuery);

    const detailQuery = `
      SELECT r.id, r.no_rekening, r.jenis_simpanan, r.saldo, a.id as anggota_id, a.nama as nama_anggota 
      FROM rekening_simpanan r
      JOIN anggota a ON r.anggota_id = a.id
      ORDER BY a.nama ASC, r.jenis_simpanan ASC;
    `;
    const detailResult = await db.query(detailQuery);

    res.status(200).json({
      summaries: summaryResult.rows,
      detail_rekening: detailResult.rows
    });
  } catch (error) {
    console.error('Error mengambil ringkasan simpanan:', error);
    res.status(500).json({ message: 'Gagal mengambil data simpanan' });
  }
};

// FUNGSI UNTUK HALAMAN DATA TRANSAKSI
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

// FUNGSI LAINNYA YANG DIBUTUHKAN
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

// Ganti fungsi createSetoran yang lama
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

// Ganti fungsi createPenarikan yang lama
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