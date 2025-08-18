    import db from '../config/db.js';

    /**
     * Mengambil daftar semua anggota aktif beserta data SHU pemerataan
     * yang sudah ada untuk periode tertentu.
     * Jika belum ada data, jumlah akan menjadi 0.
     */
    export const getPemerataanByPeriode = async (req, res) => {
        const { periode_id } = req.query;
        if (!periode_id) {
            return res.status(400).json({ message: 'ID Periode dibutuhkan' });
        }

        try {
            const query = `
                SELECT
                    a.id AS anggota_id,
                    a.nama,
                    a.kode_anggota,
                    COALESCE(sp.jumlah, 0) AS jumlah,
                    sp.keterangan
                FROM
                    anggota a
                LEFT JOIN
                    shu_pemerataan sp ON a.id = sp.anggota_id AND sp.periode_id = $1
                WHERE
                    a.status = 'aktif'
                ORDER BY
                    a.nama ASC;
            `;
            const result = await db.query(query, [periode_id]);
            res.status(200).json(result.rows);
        } catch (error) {
            console.error('Error saat mengambil data SHU pemerataan:', error);
            res.status(500).json({ message: 'Gagal mengambil data SHU pemerataan' });
        }
    };

    /**
     * Menyimpan atau memperbarui data SHU pemerataan untuk satu periode.
     * Menggunakan metode "upsert" (UPDATE atau INSERT).
     */
    export const savePemerataan = async (req, res) => {
        const { periode_id, data } = req.body;

        if (!periode_id || !Array.isArray(data)) {
            return res.status(400).json({ message: 'Data tidak valid' });
        }

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const query = `
                INSERT INTO shu_pemerataan (anggota_id, periode_id, jumlah, keterangan)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (anggota_id, periode_id)
                DO UPDATE SET
                    jumlah = EXCLUDED.jumlah,
                    keterangan = EXCLUDED.keterangan;
            `;

            for (const item of data) {
                await client.query(query, [item.anggota_id, periode_id, item.jumlah, item.keterangan]);
            }

            await client.query('COMMIT');
            res.status(200).json({ message: 'Data SHU Pemerataan berhasil disimpan' });
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error saat menyimpan data SHU pemerataan:', error);
            res.status(500).json({ message: 'Gagal menyimpan data SHU pemerataan' });
        } finally {
            client.release();
        }
    };
    