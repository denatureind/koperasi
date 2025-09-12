--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: anggota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anggota (
    id integer NOT NULL,
    kode_anggota character varying(20) NOT NULL,
    nama character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'aktif'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    jenis_kelamin character varying(20)
);


ALTER TABLE public.anggota OWNER TO postgres;

--
-- Name: anggota_auth; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.anggota_auth (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.anggota_auth OWNER TO postgres;

--
-- Name: anggota_auth_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anggota_auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anggota_auth_id_seq OWNER TO postgres;

--
-- Name: anggota_auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anggota_auth_id_seq OWNED BY public.anggota_auth.id;


--
-- Name: anggota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.anggota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.anggota_id_seq OWNER TO postgres;

--
-- Name: anggota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.anggota_id_seq OWNED BY public.anggota.id;


--
-- Name: belanja_anggota; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.belanja_anggota (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    periode_id integer NOT NULL,
    bulan integer NOT NULL,
    tahun integer NOT NULL,
    total_belanja numeric(15,2) DEFAULT 0.00 NOT NULL
);


ALTER TABLE public.belanja_anggota OWNER TO postgres;

--
-- Name: belanja_anggota_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.belanja_anggota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.belanja_anggota_id_seq OWNER TO postgres;

--
-- Name: belanja_anggota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.belanja_anggota_id_seq OWNED BY public.belanja_anggota.id;


--
-- Name: jadwal_angsuran; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jadwal_angsuran (
    id integer NOT NULL,
    rekening_pinjaman_id integer NOT NULL,
    angsuran_ke integer NOT NULL,
    tgl_jatuh_tempo date NOT NULL,
    jumlah_angsuran_pokok numeric(15,2) NOT NULL,
    jumlah_angsuran_jasa numeric(15,2) NOT NULL,
    status_pembayaran character varying(20) DEFAULT 'belum_bayar'::character varying NOT NULL,
    pokok_dibayar numeric(15,2) DEFAULT 0.00 NOT NULL,
    jasa_dibayar numeric(15,2) DEFAULT 0.00 NOT NULL,
    tgl_pembayaran date
);


ALTER TABLE public.jadwal_angsuran OWNER TO postgres;

--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jadwal_angsuran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jadwal_angsuran_id_seq OWNER TO postgres;

--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jadwal_angsuran_id_seq OWNED BY public.jadwal_angsuran.id;


--
-- Name: jenis_pinjaman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jenis_pinjaman (
    id integer NOT NULL,
    nama_jenis character varying(100) NOT NULL,
    tingkat_jasa_persen numeric(5,2) DEFAULT 1.00 NOT NULL,
    deskripsi text
);


ALTER TABLE public.jenis_pinjaman OWNER TO postgres;

--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jenis_pinjaman_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jenis_pinjaman_id_seq OWNER TO postgres;

--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jenis_pinjaman_id_seq OWNED BY public.jenis_pinjaman.id;


--
-- Name: jenis_simpanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jenis_simpanan (
    id integer NOT NULL,
    nama_jenis character varying(100) NOT NULL,
    akun_id integer NOT NULL,
    deskripsi text
);


ALTER TABLE public.jenis_simpanan OWNER TO postgres;

--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jenis_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jenis_simpanan_id_seq OWNER TO postgres;

--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jenis_simpanan_id_seq OWNED BY public.jenis_simpanan.id;


--
-- Name: jurnal_umum; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jurnal_umum (
    id integer NOT NULL,
    tgl_transaksi timestamp with time zone DEFAULT now() NOT NULL,
    keterangan text,
    akun_id integer NOT NULL,
    debit numeric(15,2) DEFAULT 0.00 NOT NULL,
    kredit numeric(15,2) DEFAULT 0.00 NOT NULL,
    periode_id integer
);


ALTER TABLE public.jurnal_umum OWNER TO postgres;

--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jurnal_umum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jurnal_umum_id_seq OWNER TO postgres;

--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jurnal_umum_id_seq OWNED BY public.jurnal_umum.id;


--
-- Name: kas_bank; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kas_bank (
    id integer NOT NULL,
    nama_akun character varying(100) NOT NULL,
    nomor_rekening character varying(50),
    nama_bank character varying(50),
    saldo_awal numeric(15,2) DEFAULT 0 NOT NULL,
    saldo_sekarang numeric(15,2) DEFAULT 0 NOT NULL,
    kode_akun_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.kas_bank OWNER TO postgres;

--
-- Name: kas_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kas_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kas_bank_id_seq OWNER TO postgres;

--
-- Name: kas_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kas_bank_id_seq OWNED BY public.kas_bank.id;


--
-- Name: kode_akun; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.kode_akun (
    id integer NOT NULL,
    kode character varying(20) NOT NULL,
    nama_akun character varying(100) NOT NULL,
    posisi_saldo character varying(10) NOT NULL,
    header_akun character varying(50),
    kelompok_akun character varying(50)
);


ALTER TABLE public.kode_akun OWNER TO postgres;

--
-- Name: kode_akun_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.kode_akun_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.kode_akun_id_seq OWNER TO postgres;

--
-- Name: kode_akun_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.kode_akun_id_seq OWNED BY public.kode_akun.id;


--
-- Name: konfigurasi_poin_sukarela; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.konfigurasi_poin_sukarela (
    id integer NOT NULL,
    batas_saldo numeric(15,2) NOT NULL,
    harga_saham numeric(15,2) NOT NULL
);


ALTER TABLE public.konfigurasi_poin_sukarela OWNER TO postgres;

--
-- Name: konfigurasi_poin_sukarela_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.konfigurasi_poin_sukarela_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.konfigurasi_poin_sukarela_id_seq OWNER TO postgres;

--
-- Name: konfigurasi_poin_sukarela_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.konfigurasi_poin_sukarela_id_seq OWNED BY public.konfigurasi_poin_sukarela.id;


--
-- Name: konfigurasi_shu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.konfigurasi_shu (
    id integer NOT NULL,
    nama_konfigurasi character varying(100) NOT NULL,
    kunci_konfigurasi character varying(50) NOT NULL,
    nilai numeric(15,2) NOT NULL,
    deskripsi text
);


ALTER TABLE public.konfigurasi_shu OWNER TO postgres;

--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.konfigurasi_shu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.konfigurasi_shu_id_seq OWNER TO postgres;

--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.konfigurasi_shu_id_seq OWNED BY public.konfigurasi_shu.id;


--
-- Name: pengurus; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pengurus (
    id integer NOT NULL,
    nama_lengkap character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'pengurus'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.pengurus OWNER TO postgres;

--
-- Name: pengurus_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pengurus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pengurus_id_seq OWNER TO postgres;

--
-- Name: pengurus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pengurus_id_seq OWNED BY public.pengurus.id;


--
-- Name: periode_akuntansi; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.periode_akuntansi (
    id integer NOT NULL,
    nama_periode character varying(100) NOT NULL,
    tgl_mulai date NOT NULL,
    tgl_selesai date NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL
);


ALTER TABLE public.periode_akuntansi OWNER TO postgres;

--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.periode_akuntansi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.periode_akuntansi_id_seq OWNER TO postgres;

--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.periode_akuntansi_id_seq OWNED BY public.periode_akuntansi.id;


--
-- Name: rekening_pinjaman; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rekening_pinjaman (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    no_pinjaman character varying(20) NOT NULL,
    jumlah_pinjaman numeric(15,2) NOT NULL,
    tenor integer NOT NULL,
    tingkat_jasa_persen numeric(5,2) NOT NULL,
    status character varying(20) DEFAULT 'aktif'::character varying NOT NULL,
    tgl_pencairan date NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    sisa_pokok numeric(15,2),
    jenis_pinjaman_id integer
);


ALTER TABLE public.rekening_pinjaman OWNER TO postgres;

--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rekening_pinjaman_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rekening_pinjaman_id_seq OWNER TO postgres;

--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rekening_pinjaman_id_seq OWNED BY public.rekening_pinjaman.id;


--
-- Name: rekening_simpanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rekening_simpanan (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    jenis_simpanan character varying(50) NOT NULL,
    no_rekening character varying(20) NOT NULL,
    saldo numeric(15,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.rekening_simpanan OWNER TO postgres;

--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rekening_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rekening_simpanan_id_seq OWNER TO postgres;

--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rekening_simpanan_id_seq OWNED BY public.rekening_simpanan.id;


--
-- Name: shu_pemerataan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shu_pemerataan (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    periode_id integer NOT NULL,
    jumlah numeric(15,2) DEFAULT 0 NOT NULL,
    keterangan character varying(255)
);


ALTER TABLE public.shu_pemerataan OWNER TO postgres;

--
-- Name: TABLE shu_pemerataan; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.shu_pemerataan IS 'Menyimpan data SHU pemerataan/tambahan yang diinput manual per anggota per periode.';


--
-- Name: COLUMN shu_pemerataan.anggota_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shu_pemerataan.anggota_id IS 'ID anggota yang menerima dana.';


--
-- Name: COLUMN shu_pemerataan.periode_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shu_pemerataan.periode_id IS 'ID periode SHU terkait.';


--
-- Name: COLUMN shu_pemerataan.jumlah; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shu_pemerataan.jumlah IS 'Jumlah nominal dana yang diberikan.';


--
-- Name: COLUMN shu_pemerataan.keterangan; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.shu_pemerataan.keterangan IS 'Catatan opsional dari admin (misal: "Bonus Kinerja").';


--
-- Name: shu_pemerataan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shu_pemerataan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shu_pemerataan_id_seq OWNER TO postgres;

--
-- Name: shu_pemerataan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shu_pemerataan_id_seq OWNED BY public.shu_pemerataan.id;


--
-- Name: transaksi_simpanan; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaksi_simpanan (
    id integer NOT NULL,
    rekening_id integer NOT NULL,
    tgl_transaksi timestamp without time zone DEFAULT now() NOT NULL,
    jenis_transaksi character varying(10) NOT NULL,
    jumlah numeric(15,2) NOT NULL
);


ALTER TABLE public.transaksi_simpanan OWNER TO postgres;

--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaksi_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transaksi_simpanan_id_seq OWNER TO postgres;

--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transaksi_simpanan_id_seq OWNED BY public.transaksi_simpanan.id;


--
-- Name: anggota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota ALTER COLUMN id SET DEFAULT nextval('public.anggota_id_seq'::regclass);


--
-- Name: anggota_auth id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota_auth ALTER COLUMN id SET DEFAULT nextval('public.anggota_auth_id_seq'::regclass);


--
-- Name: belanja_anggota id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belanja_anggota ALTER COLUMN id SET DEFAULT nextval('public.belanja_anggota_id_seq'::regclass);


--
-- Name: jadwal_angsuran id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_angsuran ALTER COLUMN id SET DEFAULT nextval('public.jadwal_angsuran_id_seq'::regclass);


--
-- Name: jenis_pinjaman id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_pinjaman ALTER COLUMN id SET DEFAULT nextval('public.jenis_pinjaman_id_seq'::regclass);


--
-- Name: jenis_simpanan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_simpanan ALTER COLUMN id SET DEFAULT nextval('public.jenis_simpanan_id_seq'::regclass);


--
-- Name: jurnal_umum id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurnal_umum ALTER COLUMN id SET DEFAULT nextval('public.jurnal_umum_id_seq'::regclass);


--
-- Name: kas_bank id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kas_bank ALTER COLUMN id SET DEFAULT nextval('public.kas_bank_id_seq'::regclass);


--
-- Name: kode_akun id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kode_akun ALTER COLUMN id SET DEFAULT nextval('public.kode_akun_id_seq'::regclass);


--
-- Name: konfigurasi_poin_sukarela id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konfigurasi_poin_sukarela ALTER COLUMN id SET DEFAULT nextval('public.konfigurasi_poin_sukarela_id_seq'::regclass);


--
-- Name: konfigurasi_shu id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konfigurasi_shu ALTER COLUMN id SET DEFAULT nextval('public.konfigurasi_shu_id_seq'::regclass);


--
-- Name: pengurus id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengurus ALTER COLUMN id SET DEFAULT nextval('public.pengurus_id_seq'::regclass);


--
-- Name: periode_akuntansi id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periode_akuntansi ALTER COLUMN id SET DEFAULT nextval('public.periode_akuntansi_id_seq'::regclass);


--
-- Name: rekening_pinjaman id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman ALTER COLUMN id SET DEFAULT nextval('public.rekening_pinjaman_id_seq'::regclass);


--
-- Name: rekening_simpanan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_simpanan ALTER COLUMN id SET DEFAULT nextval('public.rekening_simpanan_id_seq'::regclass);


--
-- Name: shu_pemerataan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shu_pemerataan ALTER COLUMN id SET DEFAULT nextval('public.shu_pemerataan_id_seq'::regclass);


--
-- Name: transaksi_simpanan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan ALTER COLUMN id SET DEFAULT nextval('public.transaksi_simpanan_id_seq'::regclass);


--
-- Name: anggota_auth anggota_auth_anggota_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_anggota_id_key UNIQUE (anggota_id);


--
-- Name: anggota_auth anggota_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_pkey PRIMARY KEY (id);


--
-- Name: anggota_auth anggota_auth_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_username_key UNIQUE (username);


--
-- Name: anggota anggota_kode_anggota_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota
    ADD CONSTRAINT anggota_kode_anggota_key UNIQUE (kode_anggota);


--
-- Name: anggota anggota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota
    ADD CONSTRAINT anggota_pkey PRIMARY KEY (id);


--
-- Name: belanja_anggota belanja_anggota_anggota_id_periode_id_bulan_tahun_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_anggota_id_periode_id_bulan_tahun_key UNIQUE (anggota_id, periode_id, bulan, tahun);


--
-- Name: belanja_anggota belanja_anggota_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_pkey PRIMARY KEY (id);


--
-- Name: jadwal_angsuran jadwal_angsuran_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_angsuran
    ADD CONSTRAINT jadwal_angsuran_pkey PRIMARY KEY (id);


--
-- Name: jenis_pinjaman jenis_pinjaman_nama_jenis_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_pinjaman
    ADD CONSTRAINT jenis_pinjaman_nama_jenis_key UNIQUE (nama_jenis);


--
-- Name: jenis_pinjaman jenis_pinjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_pinjaman
    ADD CONSTRAINT jenis_pinjaman_pkey PRIMARY KEY (id);


--
-- Name: jenis_simpanan jenis_simpanan_nama_jenis_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_nama_jenis_key UNIQUE (nama_jenis);


--
-- Name: jenis_simpanan jenis_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_pkey PRIMARY KEY (id);


--
-- Name: jurnal_umum jurnal_umum_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT jurnal_umum_pkey PRIMARY KEY (id);


--
-- Name: kas_bank kas_bank_nama_akun_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_nama_akun_key UNIQUE (nama_akun);


--
-- Name: kas_bank kas_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_pkey PRIMARY KEY (id);


--
-- Name: kode_akun kode_akun_kode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kode_akun
    ADD CONSTRAINT kode_akun_kode_key UNIQUE (kode);


--
-- Name: kode_akun kode_akun_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kode_akun
    ADD CONSTRAINT kode_akun_pkey PRIMARY KEY (id);


--
-- Name: konfigurasi_poin_sukarela konfigurasi_poin_sukarela_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konfigurasi_poin_sukarela
    ADD CONSTRAINT konfigurasi_poin_sukarela_pkey PRIMARY KEY (id);


--
-- Name: konfigurasi_shu konfigurasi_shu_kunci_konfigurasi_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konfigurasi_shu
    ADD CONSTRAINT konfigurasi_shu_kunci_konfigurasi_key UNIQUE (kunci_konfigurasi);


--
-- Name: konfigurasi_shu konfigurasi_shu_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.konfigurasi_shu
    ADD CONSTRAINT konfigurasi_shu_pkey PRIMARY KEY (id);


--
-- Name: pengurus pengurus_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengurus
    ADD CONSTRAINT pengurus_pkey PRIMARY KEY (id);


--
-- Name: pengurus pengurus_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pengurus
    ADD CONSTRAINT pengurus_username_key UNIQUE (username);


--
-- Name: periode_akuntansi periode_akuntansi_nama_periode_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periode_akuntansi
    ADD CONSTRAINT periode_akuntansi_nama_periode_key UNIQUE (nama_periode);


--
-- Name: periode_akuntansi periode_akuntansi_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.periode_akuntansi
    ADD CONSTRAINT periode_akuntansi_pkey PRIMARY KEY (id);


--
-- Name: rekening_pinjaman rekening_pinjaman_no_pinjaman_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_no_pinjaman_key UNIQUE (no_pinjaman);


--
-- Name: rekening_pinjaman rekening_pinjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_pkey PRIMARY KEY (id);


--
-- Name: rekening_simpanan rekening_simpanan_no_rekening_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_no_rekening_key UNIQUE (no_rekening);


--
-- Name: rekening_simpanan rekening_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_pkey PRIMARY KEY (id);


--
-- Name: shu_pemerataan shu_pemerataan_anggota_id_periode_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_anggota_id_periode_id_key UNIQUE (anggota_id, periode_id);


--
-- Name: shu_pemerataan shu_pemerataan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_pkey PRIMARY KEY (id);


--
-- Name: transaksi_simpanan transaksi_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_pkey PRIMARY KEY (id);


--
-- Name: anggota_auth anggota_auth_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id) ON DELETE CASCADE;


--
-- Name: belanja_anggota belanja_anggota_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: belanja_anggota belanja_anggota_periode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_periode_id_fkey FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id);


--
-- Name: jurnal_umum fk_periode; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT fk_periode FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id);


--
-- Name: jadwal_angsuran jadwal_angsuran_rekening_pinjaman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jadwal_angsuran
    ADD CONSTRAINT jadwal_angsuran_rekening_pinjaman_id_fkey FOREIGN KEY (rekening_pinjaman_id) REFERENCES public.rekening_pinjaman(id) ON DELETE CASCADE;


--
-- Name: jenis_simpanan jenis_simpanan_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_akun_id_fkey FOREIGN KEY (akun_id) REFERENCES public.kode_akun(id);


--
-- Name: jurnal_umum jurnal_umum_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT jurnal_umum_akun_id_fkey FOREIGN KEY (akun_id) REFERENCES public.kode_akun(id);


--
-- Name: kas_bank kas_bank_kode_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_kode_akun_id_fkey FOREIGN KEY (kode_akun_id) REFERENCES public.kode_akun(id);


--
-- Name: rekening_pinjaman rekening_pinjaman_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: rekening_pinjaman rekening_pinjaman_jenis_pinjaman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_jenis_pinjaman_id_fkey FOREIGN KEY (jenis_pinjaman_id) REFERENCES public.jenis_pinjaman(id);


--
-- Name: rekening_simpanan rekening_simpanan_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: shu_pemerataan shu_pemerataan_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id) ON DELETE CASCADE;


--
-- Name: shu_pemerataan shu_pemerataan_periode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_periode_id_fkey FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id) ON DELETE CASCADE;


--
-- Name: transaksi_simpanan transaksi_simpanan_rekening_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_rekening_id_fkey FOREIGN KEY (rekening_id) REFERENCES public.rekening_simpanan(id);


--
-- PostgreSQL database dump complete
--

