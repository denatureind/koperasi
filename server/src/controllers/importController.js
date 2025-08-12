import db from '../config/db.js';
import csv from 'csv-parser';
import fs from 'fs';
import { getPeriodeAktifId } from '../utils/periode.js';

// Fungsi untuk membuat kode anggota unik (diperlukan untuk impor anggota)
const generateKodeAnggota = async (client) => {
  const prefix = 'BM';
  const lastAnggotaQuery = `SELECT kode_anggota FROM anggota WHERE kode_anggota LIKE $1 ORDER BY kode_anggota DESC LIMIT 1;`;
  const lastAnggotaResult = await client.query(lastAnggotaQuery, [`${prefix}-%`]);
  let nextNumber = 1;
  if (lastAnggotaResult.rows.length > 0) {
    const lastKode = lastAnggotaResult.rows[0].kode_anggota;
    const lastNumber = parseInt(lastKode.split('-')[1], 10);
    nextNumber = lastNumber + 1;
  }
  return `${prefix}-${String(nextNumber).padStart(3, '0')}`;
};

export const importAnggota = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tidak ada file yang diunggah.');
  }

  const results = [];
  const filePath = req.file.path;
  const client = await db.connect();

  fs.createReadStream(filePath)
    .pipe(csv({ headers: ['nama', 'jenis_kelamin'], skipLines: 1 }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await client.query('BEGIN');
        for (const row of results) {
          if (row.nama && row.jenis_kelamin) {
            const kodeAnggota = await generateKodeAnggota(client);
            await client.query(
              'INSERT INTO anggota (kode_anggota, nama, jenis_kelamin, status) VALUES ($1, $2, $3, $4)',
              [kodeAnggota, row.nama, row.jenis_kelamin, 'aktif']
            );
          }
        }
        await client.query('COMMIT');
        res.status(200).json({ message: `${results.length} anggota berhasil diimpor.` });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saat impor anggota:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat impor data ke database.' });
      } finally {
        client.release();
        fs.unlinkSync(filePath);
      }
    });
};

// --- FUNGSI BARU UNTUK IMPOR SALDO SIMPANAN ---
export const importSaldoSimpanan = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tidak ada file yang diunggah.');
  }

  const results = [];
  const filePath = req.file.path;
  const client = await db.connect();

  fs.createReadStream(filePath)
    .pipe(csv({ headers: ['kode_anggota', 'jenis_simpanan', 'saldo_akhir'], skipLines: 1 }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await client.query('BEGIN');
        const periodeId = await getPeriodeAktifId(client);

        for (const row of results) {
          if (row.kode_anggota && row.jenis_simpanan && row.saldo_akhir) {
            const saldo = parseFloat(row.saldo_akhir);
            if (saldo > 0) {
              // 1. Cari ID anggota berdasarkan kodenya
              const anggotaResult = await client.query('SELECT id FROM anggota WHERE kode_anggota = $1', [row.kode_anggota]);
              if (anggotaResult.rows.length === 0) continue; // Lewati jika anggota tidak ditemukan
              const anggotaId = anggotaResult.rows[0].id;

              // 2. Buat rekening baru
              const noRekening = `${row.jenis_simpanan.substring(0, 2).toUpperCase()}-${String(anggotaId).padStart(4, '0')}-${Date.now().toString().slice(-4)}`;
              const rekResult = await client.query(
                'INSERT INTO rekening_simpanan (anggota_id, jenis_simpanan, no_rekening, saldo) VALUES ($1, $2, $3, $4) RETURNING id',
                [anggotaId, row.jenis_simpanan, noRekening, saldo]
              );
              const rekeningId = rekResult.rows[0].id;

              // 3. Buat satu transaksi "Setoran Saldo Awal"
              const keterangan = "Setoran Saldo Awal Hasil Impor";
              await client.query('INSERT INTO transaksi_simpanan (rekening_id, jenis_transaksi, jumlah) VALUES ($1, $2, $3)', [rekeningId, 'Setor', saldo]);

              // 4. Buat Jurnal Umum untuk saldo awal ini
              const jenisSimpananResult = await client.query('SELECT akun_id FROM jenis_simpanan WHERE nama_jenis = $1', [row.jenis_simpanan]);
              if (jenisSimpananResult.rows.length > 0) {
                const akunSimpananId = jenisSimpananResult.rows[0].akun_id;
                const AKUN_KAS_ID = 11;
                const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5);`;
                await client.query(jurnalQuery, [keterangan, AKUN_KAS_ID, saldo, 0, periodeId]);
                await client.query(jurnalQuery, [keterangan, akunSimpananId, 0, saldo, periodeId]);
              }
            }
          }
        }
        await client.query('COMMIT');
        res.status(200).json({ message: `${results.length} baris saldo simpanan berhasil diimpor.` });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saat impor saldo simpanan:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat impor data.' });
      } finally {
        client.release();
        fs.unlinkSync(filePath);
      }
    });
};

// Tambahkan fungsi baru ini di importController.js
export const importPinjamanAktif = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('Tidak ada file yang diunggah.');
  }

  const results = [];
  const filePath = req.file.path;
  const client = await db.connect();

  fs.createReadStream(filePath)
    .pipe(csv({ 
      headers: ['kode_anggota', 'jumlah_pinjaman_awal', 'sisa_pokok_sekarang', 'tenor_total', 'tingkat_jasa_persen', 'tgl_pencairan_awal', 'angsuran_ke_selanjutnya'], 
      skipLines: 1 
    }))
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        await client.query('BEGIN');
        const periodeId = await getPeriodeAktifId(client);

        for (const row of results) {
          // 1. Cari Anggota
          const anggotaResult = await client.query('SELECT id FROM anggota WHERE kode_anggota = $1', [row.kode_anggota]);
          if (anggotaResult.rows.length === 0) continue;
          const anggotaId = anggotaResult.rows[0].id;

          const jumlahPinjaman = parseFloat(row.jumlah_pinjaman_awal);
          const tenor = parseInt(row.tenor_total);
          const jasaPersen = parseFloat(row.tingkat_jasa_persen);
          const sisaPokok = parseFloat(row.sisa_pokok_sekarang);

          // 2. Buat Rekening Pinjaman baru
          const noPinjaman = `PIN-${String(anggotaId).padStart(4, '0')}-${Date.now().toString().slice(-6)}`;
          const pinjamanQuery = `
            INSERT INTO rekening_pinjaman(anggota_id, no_pinjaman, jumlah_pinjaman, sisa_pokok, tenor, tingkat_jasa_persen, tgl_pencairan, status)
            VALUES($1, $2, $3, $4, $5, $6, $7, 'aktif') RETURNING id;
          `;
          const pinjamanResult = await client.query(pinjamanQuery, [anggotaId, noPinjaman, jumlahPinjaman, sisaPokok, tenor, jasaPersen, row.tgl_pencairan_awal]);
          const rekeningPinjamanId = pinjamanResult.rows[0].id;

          // 3. Buat ulang sisa jadwal angsuran
          const angsuranPokokPerBulan = jumlahPinjaman / tenor;
          const jasaPerBulan = jumlahPinjaman * (jasaPersen / 100);
          const angsuranKeSelanjutnya = parseInt(row.angsuran_ke_selanjutnya);

          const angsuranQuery = `INSERT INTO jadwal_angsuran(rekening_pinjaman_id, angsuran_ke, tgl_jatuh_tempo, jumlah_angsuran_pokok, jumlah_angsuran_jasa) VALUES($1, $2, $3, $4, $5);`;
          let tglPencairan = new Date(row.tgl_pencairan_awal);

          for (let i = angsuranKeSelanjutnya; i <= tenor; i++) {
            // Hitung tanggal jatuh tempo yang benar untuk sisa angsuran
            let tglJatuhTempo = new Date(tglPencairan);
            tglJatuhTempo.setMonth(tglPencairan.getMonth() + i);
            await client.query(angsuranQuery, [rekeningPinjamanId, i, tglJatuhTempo, angsuranPokokPerBulan, jasaPerBulan]);
          }

          // 4. Buat Jurnal Umum Saldo Awal Piutang untuk pinjaman ini
          const keterangan = `Saldo Awal Piutang ${noPinjaman}`;
          const AKUN_PIUTANG_PINJAMAN_ID = 13; // Sesuai kode_akun kita
          // Untuk menyeimbangkan, kita bisa masukan ke akun Modal Migrasi (perlu dibuat di kode_akun)
          // Untuk sementara, kita hanya catat sisi piutangnya
          const jurnalQuery = `INSERT INTO jurnal_umum(keterangan, akun_id, debit, kredit, periode_id) VALUES ($1, $2, $3, $4, $5);`;
          await client.query(jurnalQuery, [keterangan, AKUN_PIUTANG_PINJAMAN_ID, sisaPokok, 0, periodeId]);
        }

        await client.query('COMMIT');
        res.status(200).json({ message: `${results.length} data pinjaman aktif berhasil diimpor.` });
      } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error saat impor pinjaman aktif:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat impor data.' });
      } finally {
        client.release();
        fs.unlinkSync(filePath);
      }
    });
};