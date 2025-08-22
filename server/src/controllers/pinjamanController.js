import db from '../config/db.js';
import { getPeriodeAktifId } from '../utils/periode.js';

/**
 * Konstanta ID akun yang sering dipakai (COA)
 */
const AKUN_KAS_ID = 11;
const AKUN_PIUTANG_PINJAMAN_ID = 13;
const AKUN_PENDAPATAN_JASA_ID = 41;

/* ===========================
 * FUNGSI UTIL
 * =========================== */

/**
 * Coerce nilai ke number yang aman.
 * @param {any} v
 * @param {number} fallback
 * @returns {number}
 */
function toNumber(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/* ===========================
 * FUNGSI GET
 * =========================== */

/**
 * Mengambil semua data pinjaman dengan total pembayaran pokok dan jasa.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllPinjaman = async (req, res) => {
  const client = await db.connect();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const offset = (page - 1) * limit;

    let dataQuery = `
      SELECT
        p.id,
        p.no_pinjaman,
        p.jumlah_pinjaman,
        p.tenor,
        p.status,
        p.sisa_pokok,
        a.id AS anggota_id,
        a.nama AS nama_anggota,
        (
          SELECT COALESCE(SUM(pokok_dibayar), 0)
          FROM jadwal_angsuran
          WHERE rekening_pinjaman_id = p.id
        ) AS total_bayar_pokok,
        (
          SELECT COALESCE(SUM(jasa_dibayar), 0)
          FROM jadwal_angsuran
          WHERE rekening_pinjaman_id = p.id
        ) AS total_bayar_jasa
      FROM rekening_pinjaman p
      JOIN anggota a ON p.anggota_id = a.id
    `;
    
    let countQuery = `
      SELECT COUNT(*)
      FROM rekening_pinjaman p
      JOIN anggota a ON p.anggota_id = a.id
    `;
    
    const conditions = [];
    const values = [];
    let paramCount = 1;

    if (search) {
      conditions.push(`(a.nama ILIKE $${paramCount} OR p.no_pinjaman ILIKE $${paramCount})`);
      values.push(`%${search}%`);
      paramCount++;
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ');
      dataQuery += whereClause;
      countQuery += whereClause;
    }

    dataQuery += ` ORDER BY p.tgl_pencairan DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    const dataValues = [...values, limit, offset];
    
    const dataResult = await client.query(dataQuery, dataValues);
    const countResult = await client.query(countQuery, values);

    const totalItems = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      data: dataResult.rows,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error mengambil semua pinjaman:', error);
    res.status(500).json({ message: 'Gagal mengambil data pinjaman' });
  } finally {
    client.release();
  }
};

/**
 * Mengambil daftar pinjaman berdasarkan ID anggota.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getPinjamanByAnggotaId = async (req, res) => {
  const { anggotaId } = req.params;
  try {
    const query = `
      SELECT *
      FROM rekening_pinjaman
      WHERE anggota_id = $1
      ORDER BY tgl_pencairan DESC;
    `;
    const result = await db.query(query, [anggotaId]);
    res.status(200).json(result.rows);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error mengambil data pinjaman:', error);
    res.status(500).json({ message: 'Error mengambil data pinjaman.' });
  }
};

/**
 * Mengambil detail pinjaman berdasarkan ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getDetailPinjamanById = async (req, res) => {
  const { id } = req.params;

  try {
    // 1) Ambil data induk pinjaman + anggota
    const pinjamanQuery = `
      SELECT
        p.*,
        a.nama AS nama_anggota,
        a.kode_anggota
      FROM rekening_pinjaman p
      JOIN anggota a ON p.anggota_id = a.id
      WHERE p.id = $1;
    `;
    const pinjamanResult = await db.query(pinjamanQuery, [id]);

    if (pinjamanResult.rows.length === 0) {
      return res.status(404).json({ message: 'Pinjaman tidak ditemukan' });
    }

    const pinjaman = pinjamanResult.rows[0];

    // 2) Ambil jadwal angsuran
    const jadwalQuery = `
      SELECT *
      FROM jadwal_angsuran
      WHERE rekening_pinjaman_id = $1
      ORDER BY angsuran_ke ASC;
    `;
    const jadwalResult = await db.query(jadwalQuery, [id]);
    const jadwal_angsuran = jadwalResult.rows;

    // 3) Perhitungan tambahan
    const jumlah = toNumber(pinjaman.jumlah_pinjaman);
    const tenor = toNumber(pinjaman.tenor);
    const jasaPersen = toNumber(pinjaman.tingkat_jasa_persen);

    const jasa_per_bulan = jumlah * (jasaPersen / 100);
    const jasa_terhitung = jasa_per_bulan * tenor;
    const total_utang_berjalan = jumlah + jasa_terhitung;

    const detailPinjamanLengkap = {
      ...pinjaman,
      jadwal_angsuran,
      jasa_terhitung,
      total_utang_berjalan,
    };

    return res.status(200).json(detailPinjamanLengkap);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error mengambil detail pinjaman:', error);
    return res.status(500).json({ message: 'Error mengambil detail pinjaman.' });
  }
};

/**
 * Mengambil semua transaksi pinjaman yang sudah dibayar/sebagian.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getAllTransaksi = async (req, res) => {
  try {
    const query = `
      SELECT
        j.id,
        j.pokok_dibayar,
        j.jasa_dibayar,
        j.tgl_pembayaran,
        p.no_pinjaman,
        a.nama AS nama_anggota
      FROM jadwal_angsuran j
      JOIN rekening_pinjaman p ON j.rekening_pinjaman_id = p.id
      JOIN anggota a ON p.anggota_id = a.id
      WHERE j.status_pembayaran != 'belum_bayar'
      ORDER BY j.id DESC;
    `;
    const result = await db.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error mengambil semua transaksi pinjaman:', error);
    res.status(500).json({ message: 'Gagal mengambil data transaksi' });
  }
};

/* ===========================
 * CREATE & UPDATE
 * =========================== */

/**
 * Membuat pinjaman baru, jadwal angsuran, dan jurnal terkait.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPinjaman = async (req, res) => {
  const {
    anggota_id,
    jumlah_pinjaman,
    tenor,
    tingkat_jasa_persen,
    tgl_pencairan,
    jenis_pinjaman_id
  } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const periodeId = await getPeriodeAktifId(client);

    // Normalisasi nilai
    const jumlah = toNumber(jumlah_pinjaman);
    const n_tenor = Math.max(1, toNumber(tenor, 1)); // minimal 1
    const jasa_persen = toNumber(tingkat_jasa_persen);

    // Pembulatan baru
    const jasa_per_bulan = Math.round(jumlah * (jasa_persen / 100));
    const angsuran_pokok_per_bulan = Math.round(jumlah / n_tenor);

    let total_pokok_terjadwal = 0;

    const angsuranInsert = `
      INSERT INTO jadwal_angsuran (
        rekening_pinjaman_id,
        angsuran_ke,
        tgl_jatuh_tempo,
        jumlah_angsuran_pokok,
        jumlah_angsuran_jasa
      )
      VALUES ($1, $2, $3, $4, $5);
    `;

    // Simpan pinjaman dulu (dapatkan ID)
    const no_pinjaman = `PIN-${String(anggota_id).padStart(4, '0')}-${String(Date.now()).slice(-6)}`;
    const pinjamanInsert = `
      INSERT INTO rekening_pinjaman (
        anggota_id,
        no_pinjaman,
        jumlah_pinjaman,
        tenor,
        tingkat_jasa_persen,
        tgl_pencairan,
        sisa_pokok,
        jenis_pinjaman_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id;
    `;
    const pinjamanRes = await client.query(pinjamanInsert, [
      anggota_id,
      no_pinjaman,
      jumlah,
      n_tenor,
      jasa_persen,
      tgl_pencairan,
      jumlah,
      jenis_pinjaman_id
    ]);
    const rekeningPinjamanId = pinjamanRes.rows[0].id;

    // Tanggal jatuh tempo dimulai dari tgl_pencairan
    let tanggalJatuhTempo = new Date(tgl_pencairan);

    // Buat jadwal untuk n-1 angsuran
    for (let i = 1; i < n_tenor; i += 1) {
      tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + 1);
      await client.query(angsuranInsert, [
        rekeningPinjamanId,
        i,
        tanggalJatuhTempo,
        angsuran_pokok_per_bulan,
        jasa_per_bulan,
      ]);
      total_pokok_terjadwal += angsuran_pokok_per_bulan;
    }

    // Angsuran terakhir menutup sisa pembulatan
    const angsuran_pokok_terakhir = jumlah - total_pokok_terjadwal;
    tanggalJatuhTempo.setMonth(tanggalJatuhTempo.getMonth() + 1);
    await client.query(angsuranInsert, [
      rekeningPinjamanId,
      n_tenor,
      tanggalJatuhTempo,
      angsuran_pokok_terakhir,
      jasa_per_bulan,
    ]);

    // Jurnal pencairan
    const keterangan = `Pencairan pinjaman ${no_pinjaman}`;
    const jurnalInsert = `
      INSERT INTO jurnal_umum (
        keterangan,
        akun_id,
        debit,
        kredit,
        periode_id,
        tgl_transaksi
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    await client.query(jurnalInsert, [
      keterangan,
      AKUN_PIUTANG_PINJAMAN_ID,
      jumlah,
      0,
      periodeId,
      tgl_pencairan,
    ]);
    await client.query(jurnalInsert, [
      keterangan,
      AKUN_KAS_ID,
      0,
      jumlah,
      periodeId,
      tgl_pencairan,
    ]);

    await client.query('COMMIT');
    return res.status(201).json({ message: 'Pinjaman berhasil dibuat', id: rekeningPinjamanId });
  } catch (error) {
    await client.query('ROLLBACK');
    // eslint-disable-next-line no-console
    console.error('Error saat membuat pinjaman:', error);
    return res.status(500).json({ message: 'Gagal membuat pinjaman' });
  } finally {
    client.release();
  }
};

/**
 * Memproses pembayaran angsuran & menjurnalnya.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const createPembayaranAngsuran = async (req, res) => {
  const { jadwalId } = req.params;
  const { bayar_pokok, bayar_jasa, tgl_bayar } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const periodeId = await getPeriodeAktifId(client);

    // Lock baris jadwal angsuran
    const jadwalQuery = `
      SELECT j.*, p.no_pinjaman
      FROM jadwal_angsuran j
      JOIN rekening_pinjaman p ON j.rekening_pinjaman_id = p.id
      WHERE j.id = $1
      FOR UPDATE;
    `;
    const jadwalRes = await client.query(jadwalQuery, [jadwalId]);

    if (jadwalRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Jadwal angsuran tidak ditemukan.' });
    }

    const jadwal = jadwalRes.rows[0];

    const bayarPokok = toNumber(bayar_pokok);
    const bayarJasa = toNumber(bayar_jasa);

    const totalPokokTerbayar = toNumber(jadwal.pokok_dibayar) + bayarPokok;
    const totalJasaTerbayar = toNumber(jadwal.jasa_dibayar) + bayarJasa;

    let statusBaru = 'sebagian_bayar';
    if (
      totalPokokTerbayar >= toNumber(jadwal.jumlah_angsuran_pokok) &&
      totalJasaTerbayar >= toNumber(jadwal.jumlah_angsuran_jasa)
    ) {
      statusBaru = 'lunas';
    }

    // Update jadwal angsuran
    await client.query(
      `
        UPDATE jadwal_angsuran
        SET pokok_dibayar = $1,
            jasa_dibayar = $2,
            status_pembayaran = $3,
            tgl_pembayaran = $4
        WHERE id = $5;
      `,
      [totalPokokTerbayar, totalJasaTerbayar, statusBaru, tgl_bayar, jadwalId],
    );

    // Kurangi sisa pokok pada rekening pinjaman (hanya jika ada bayar pokok)
    if (bayarPokok > 0) {
      await client.query(
        'UPDATE rekening_pinjaman SET sisa_pokok = sisa_pokok - $1 WHERE id = $2;',
        [bayarPokok, jadwal.rekening_pinjaman_id],
      );
    }

    // Jurnal pembayaran
    const keterangan = `Pembayaran angsuran ke-${jadwal.angsuran_ke} pinjaman ${jadwal.no_pinjaman}`;
    const totalBayar = bayarPokok + bayarJasa;

    const jurnalInsert = `
      INSERT INTO jurnal_umum (
        keterangan,
        akun_id,
        debit,
        kredit,
        periode_id,
        tgl_transaksi
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;

    if (totalBayar > 0) {
      await client.query(jurnalInsert, [keterangan, AKUN_KAS_ID, totalBayar, 0, periodeId, tgl_bayar]);
    }
    if (bayarPokok > 0) {
      await client.query(jurnalInsert, [keterangan, AKUN_PIUTANG_PINJAMAN_ID, 0, bayarPokok, periodeId, tgl_bayar]);
    }
    if (bayarJasa > 0) {
      await client.query(jurnalInsert, [keterangan, AKUN_PENDAPATAN_JASA_ID, 0, bayarJasa, periodeId, tgl_bayar]);
    }

    // Cek apakah semua angsuran sudah lunas atau dibatalkan
    const cekAngsuranQuery = `
      SELECT COUNT(*) 
      FROM jadwal_angsuran 
      WHERE rekening_pinjaman_id = $1 
      AND status_pembayaran NOT IN ('lunas', 'dibatalkan')
    `;
    const cekResult = await client.query(cekAngsuranQuery, [jadwal.rekening_pinjaman_id]);
    const jumlahAngsuranBelumLunas = parseInt(cekResult.rows[0].count);

    // Jika tidak ada angsuran yang belum lunas/dibatalkan, update status pinjaman menjadi lunas
    if (jumlahAngsuranBelumLunas === 0) {
      await client.query(
        'UPDATE rekening_pinjaman SET status = $1 WHERE id = $2',
        ['lunas', jadwal.rekening_pinjaman_id]
      );
    }

    await client.query('COMMIT');
    return res
      .status(200)
      .json({ message: `Pembayaran angsuran ke-${jadwal.angsuran_ke} berhasil diproses.` });
  } catch (error) {
    await client.query('ROLLBACK');
    // eslint-disable-next-line no-console
    console.error('Error saat bayar angsuran:', error);
    return res.status(500).json({ message: error.message || 'Gagal memproses pembayaran.' });
  } finally {
    client.release();
  }
};

/**
 * Melakukan pelunasan dipercepat pada pinjaman
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const lunasiPinjaman = async (req, res) => {
  const { id } = req.params;
  const { tgl_bayar } = req.body;
  
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    
    const periodeId = await getPeriodeAktifId(client);

    // Ambil data pinjaman
    const pinjamanQuery = `
      SELECT * FROM rekening_pinjaman WHERE id = $1 FOR UPDATE;
    `;
    const pinjamanResult = await client.query(pinjamanQuery, [id]);
    
    if (pinjamanResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Pinjaman tidak ditemukan' });
    }
    
    const pinjaman = pinjamanResult.rows[0];
    const sisa_pokok = toNumber(pinjaman.sisa_pokok);
    
    // Ambil semua jadwal angsuran
    const jadwalQuery = `
      SELECT * FROM jadwal_angsuran 
      WHERE rekening_pinjaman_id = $1 
      ORDER BY angsuran_ke ASC;
    `;
    const jadwalResult = await client.query(jadwalQuery, [id]);
    const jadwal_angsuran = jadwalResult.rows;
    
    // Cari angsuran pertama yang belum bayar untuk mendapatkan jasa bulan berjalan
    let jasa_bulan_berjalan = 0;
    const angsuran_berjalan = jadwal_angsuran.find(
      j => j.status_pembayaran === 'belum_bayar'
    );
    
    if (angsuran_berjalan) {
      jasa_bulan_berjalan = toNumber(angsuran_berjalan.jumlah_angsuran_jasa);
    }
    
    const total_pembayaran = sisa_pokok + jasa_bulan_berjalan;
    
    // Update rekening pinjaman
    await client.query(
      `UPDATE rekening_pinjaman 
       SET sisa_pokok = 0, status = 'lunas' 
       WHERE id = $1`,
      [id]
    );
    
    // Update jadwal angsuran
    if (angsuran_berjalan) {
      // Update angsuran berjalan
      await client.query(
        `UPDATE jadwal_angsuran 
         SET pokok_dibayar = $1, 
             jasa_dibayar = $2, 
             status_pembayaran = 'lunas', 
             tgl_pembayaran = $3 
         WHERE id = $4`,
        [sisa_pokok, jasa_bulan_berjalan, tgl_bayar, angsuran_berjalan.id]
      );
      
      // Batalkan angsuran yang belum dibayar lainnya
      await client.query(
        `UPDATE jadwal_angsuran 
         SET status_pembayaran = 'dibatalkan' 
         WHERE rekening_pinjaman_id = $1 
         AND status_pembayaran = 'belum_bayar' 
         AND id != $2`,
        [id, angsuran_berjalan.id]
      );
    }
    
    // Buat jurnal
    const keterangan = `Pelunasan dipercepat pinjaman ${pinjaman.no_pinjaman}`;
    const jurnalInsert = `
      INSERT INTO jurnal_umum (
        keterangan,
        akun_id,
        debit,
        kredit,
        periode_id,
        tgl_transaksi
      )
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    
    // Debit Kas
    await client.query(jurnalInsert, [
      keterangan,
      AKUN_KAS_ID,
      total_pembayaran,
      0,
      periodeId,
      tgl_bayar,
    ]);
    
    // Kredit Piutang Pinjaman
    await client.query(jurnalInsert, [
      keterangan,
      AKUN_PIUTANG_PINJAMAN_ID,
      0,
      sisa_pokok,
      periodeId,
      tgl_bayar,
    ]);
    
    // Kredit Pendapatan Jasa
    if (jasa_bulan_berjalan > 0) {
      await client.query(jurnalInsert, [
        keterangan,
        AKUN_PENDAPATAN_JASA_ID,
        0,
        jasa_bulan_berjalan,
        periodeId,
        tgl_bayar,
      ]);
    }
    
    await client.query('COMMIT');
    return res.status(200).json({ 
      message: 'Pinjaman berhasil dilunasi', 
      total_pembayaran 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    // eslint-disable-next-line no-console
    console.error('Error saat melunasi pinjaman:', error);
    return res.status(500).json({ message: 'Gagal melunasi pinjaman' });
  } finally {
    client.release();
  }
};
