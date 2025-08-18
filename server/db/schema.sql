-- Menghapus tipe dan tabel jika sudah ada agar skrip bisa dijalankan ulang tanpa error
DROP TABLE IF EXISTS loans;
DROP TABLE IF EXISTS savings;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS saving_type;
DROP TYPE IF EXISTS loan_status;

-- === MEMBUAT TIPE ENUM UNTUK KATEGORI ===
-- ENUM memastikan data yang masuk hanya salah satu dari pilihan yang ada
CREATE TYPE saving_type AS ENUM ('pokok', 'wajib', 'sukarela');
CREATE TYPE loan_status AS ENUM ('pending', 'approved', 'rejected', 'paid');


-- === MEMBUAT TABEL PENGGUNA (ANGGOTA) ===
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- ID unik yang otomatis bertambah
    username VARCHAR(50) UNIQUE NOT NULL, -- Username untuk login, tidak boleh sama
    password_hash TEXT NOT NULL, -- Tempat menyimpan password yang sudah di-hash
    full_name VARCHAR(100) NOT NULL, -- Nama lengkap anggota
    role VARCHAR(20) NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member')), -- Peran pengguna, defaultnya 'member'
    join_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Tanggal bergabung, otomatis diisi
);


-- === MEMBUAT TABEL SIMPANAN ===
CREATE TABLE savings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Terhubung ke tabel users. Jika user dihapus, data simpanannya juga terhapus.
    type saving_type NOT NULL, -- Jenis simpanan: 'pokok', 'wajib', atau 'sukarela'
    amount NUMERIC(12, 2) NOT NULL, -- Jumlah uang yang disimpan
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- === MEMBUAT TABEL PINJAMAN ===
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Terhubung ke tabel users
    amount NUMERIC(12, 2) NOT NULL, -- Jumlah uang yang dipinjam
    interest_rate NUMERIC(4, 2) NOT NULL, -- Suku bunga (misal: 1.50 untuk 1.5%)
    status loan_status NOT NULL DEFAULT 'pending', -- Status pinjaman: 'pending', 'approved', 'rejected', 'paid'
    request_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Tanggal pengajuan
    approval_date TIMESTAMP WITH TIME ZONE -- Tanggal disetujui (bisa NULL)
);

-- Tabel untuk menyimpan SHU Pemerataan
CREATE TABLE shu_pemerataan (
    id SERIAL PRIMARY KEY,
    anggota_id INTEGER NOT NULL REFERENCES anggota(id) ON DELETE CASCADE,
    periode_id INTEGER NOT NULL REFERENCES periode_akuntansi(id) ON DELETE CASCADE,
    jumlah DECIMAL(15, 2) NOT NULL DEFAULT 0,
    -- Pastikan tidak ada duplikasi data per anggota per periode
    UNIQUE(anggota_id, periode_id)
);

-- Menambahkan indeks untuk pencarian yang lebih cepat
CREATE INDEX idx_shu_pemerataan_periode_anggota ON shu_pemerataan (periode_id, anggota_id);