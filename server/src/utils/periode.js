import db from '../config/db.js';

export const getPeriodeAktifId = async (client = db) => {
  const result = await client.query("SELECT id FROM periode_akuntansi WHERE status = 'open' LIMIT 1;");
  if (result.rows.length === 0) {
    throw new Error("Tidak ada periode akuntansi yang aktif.");
  }
  return result.rows[0].id;
};