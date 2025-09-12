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
-- Name: anggota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anggota (
    id integer NOT NULL,
    kode_anggota character varying(20) NOT NULL,
    nama character varying(100) NOT NULL,
    status character varying(20) DEFAULT 'aktif'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    jenis_kelamin character varying(20)
);


--
-- Name: anggota_auth; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.anggota_auth (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: anggota_auth_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.anggota_auth_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: anggota_auth_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.anggota_auth_id_seq OWNED BY public.anggota_auth.id;


--
-- Name: anggota_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.anggota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: anggota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.anggota_id_seq OWNED BY public.anggota.id;


--
-- Name: belanja_anggota; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.belanja_anggota (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    periode_id integer NOT NULL,
    bulan integer NOT NULL,
    tahun integer NOT NULL,
    total_belanja numeric(15,2) DEFAULT 0.00 NOT NULL
);


--
-- Name: belanja_anggota_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.belanja_anggota_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: belanja_anggota_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.belanja_anggota_id_seq OWNED BY public.belanja_anggota.id;


--
-- Name: jadwal_angsuran; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jadwal_angsuran_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jadwal_angsuran_id_seq OWNED BY public.jadwal_angsuran.id;


--
-- Name: jenis_pinjaman; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jenis_pinjaman (
    id integer NOT NULL,
    nama_jenis character varying(100) NOT NULL,
    tingkat_jasa_persen numeric(5,2) DEFAULT 1.00 NOT NULL,
    deskripsi text
);


--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jenis_pinjaman_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jenis_pinjaman_id_seq OWNED BY public.jenis_pinjaman.id;


--
-- Name: jenis_simpanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.jenis_simpanan (
    id integer NOT NULL,
    nama_jenis character varying(100) NOT NULL,
    akun_id integer NOT NULL,
    deskripsi text
);


--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jenis_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jenis_simpanan_id_seq OWNED BY public.jenis_simpanan.id;


--
-- Name: jurnal_umum; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.jurnal_umum_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.jurnal_umum_id_seq OWNED BY public.jurnal_umum.id;


--
-- Name: kas_bank; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: kas_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kas_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kas_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kas_bank_id_seq OWNED BY public.kas_bank.id;


--
-- Name: kode_akun; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kode_akun (
    id integer NOT NULL,
    kode character varying(20) NOT NULL,
    nama_akun character varying(100) NOT NULL,
    posisi_saldo character varying(10) NOT NULL,
    header_akun character varying(50),
    kelompok_akun character varying(50)
);


--
-- Name: kode_akun_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.kode_akun_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: kode_akun_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.kode_akun_id_seq OWNED BY public.kode_akun.id;


--
-- Name: konfigurasi_poin_sukarela; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.konfigurasi_poin_sukarela (
    id integer NOT NULL,
    batas_saldo numeric(15,2) NOT NULL,
    harga_saham numeric(15,2) NOT NULL
);


--
-- Name: konfigurasi_poin_sukarela_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.konfigurasi_poin_sukarela_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: konfigurasi_poin_sukarela_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.konfigurasi_poin_sukarela_id_seq OWNED BY public.konfigurasi_poin_sukarela.id;


--
-- Name: konfigurasi_shu; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.konfigurasi_shu (
    id integer NOT NULL,
    nama_konfigurasi character varying(100) NOT NULL,
    kunci_konfigurasi character varying(50) NOT NULL,
    nilai numeric(15,2) NOT NULL,
    deskripsi text
);


--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.konfigurasi_shu_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.konfigurasi_shu_id_seq OWNED BY public.konfigurasi_shu.id;


--
-- Name: pengurus; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pengurus (
    id integer NOT NULL,
    nama_lengkap character varying(100) NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(20) DEFAULT 'pengurus'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: pengurus_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pengurus_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pengurus_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pengurus_id_seq OWNED BY public.pengurus.id;


--
-- Name: periode_akuntansi; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.periode_akuntansi (
    id integer NOT NULL,
    nama_periode character varying(100) NOT NULL,
    tgl_mulai date NOT NULL,
    tgl_selesai date NOT NULL,
    status character varying(20) DEFAULT 'open'::character varying NOT NULL
);


--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.periode_akuntansi_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.periode_akuntansi_id_seq OWNED BY public.periode_akuntansi.id;


--
-- Name: rekening_pinjaman; Type: TABLE; Schema: public; Owner: -
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


--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rekening_pinjaman_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rekening_pinjaman_id_seq OWNED BY public.rekening_pinjaman.id;


--
-- Name: rekening_simpanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rekening_simpanan (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    jenis_simpanan character varying(50) NOT NULL,
    no_rekening character varying(20) NOT NULL,
    saldo numeric(15,2) DEFAULT 0.00 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rekening_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rekening_simpanan_id_seq OWNED BY public.rekening_simpanan.id;


--
-- Name: shu_pemerataan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shu_pemerataan (
    id integer NOT NULL,
    anggota_id integer NOT NULL,
    periode_id integer NOT NULL,
    jumlah numeric(15,2) DEFAULT 0 NOT NULL,
    keterangan character varying(255)
);


--
-- Name: TABLE shu_pemerataan; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.shu_pemerataan IS 'Menyimpan data SHU pemerataan/tambahan yang diinput manual per anggota per periode.';


--
-- Name: COLUMN shu_pemerataan.anggota_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shu_pemerataan.anggota_id IS 'ID anggota yang menerima dana.';


--
-- Name: COLUMN shu_pemerataan.periode_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shu_pemerataan.periode_id IS 'ID periode SHU terkait.';


--
-- Name: COLUMN shu_pemerataan.jumlah; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shu_pemerataan.jumlah IS 'Jumlah nominal dana yang diberikan.';


--
-- Name: COLUMN shu_pemerataan.keterangan; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.shu_pemerataan.keterangan IS 'Catatan opsional dari admin (misal: "Bonus Kinerja").';


--
-- Name: shu_pemerataan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shu_pemerataan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shu_pemerataan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shu_pemerataan_id_seq OWNED BY public.shu_pemerataan.id;


--
-- Name: transaksi_simpanan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transaksi_simpanan (
    id integer NOT NULL,
    rekening_id integer NOT NULL,
    tgl_transaksi timestamp without time zone DEFAULT now() NOT NULL,
    jenis_transaksi character varying(10) NOT NULL,
    jumlah numeric(15,2) NOT NULL
);


--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transaksi_simpanan_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transaksi_simpanan_id_seq OWNED BY public.transaksi_simpanan.id;


--
-- Name: anggota id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota ALTER COLUMN id SET DEFAULT nextval('public.anggota_id_seq'::regclass);


--
-- Name: anggota_auth id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota_auth ALTER COLUMN id SET DEFAULT nextval('public.anggota_auth_id_seq'::regclass);


--
-- Name: belanja_anggota id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belanja_anggota ALTER COLUMN id SET DEFAULT nextval('public.belanja_anggota_id_seq'::regclass);


--
-- Name: jadwal_angsuran id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_angsuran ALTER COLUMN id SET DEFAULT nextval('public.jadwal_angsuran_id_seq'::regclass);


--
-- Name: jenis_pinjaman id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_pinjaman ALTER COLUMN id SET DEFAULT nextval('public.jenis_pinjaman_id_seq'::regclass);


--
-- Name: jenis_simpanan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_simpanan ALTER COLUMN id SET DEFAULT nextval('public.jenis_simpanan_id_seq'::regclass);


--
-- Name: jurnal_umum id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurnal_umum ALTER COLUMN id SET DEFAULT nextval('public.jurnal_umum_id_seq'::regclass);


--
-- Name: kas_bank id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kas_bank ALTER COLUMN id SET DEFAULT nextval('public.kas_bank_id_seq'::regclass);


--
-- Name: kode_akun id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kode_akun ALTER COLUMN id SET DEFAULT nextval('public.kode_akun_id_seq'::regclass);


--
-- Name: konfigurasi_poin_sukarela id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.konfigurasi_poin_sukarela ALTER COLUMN id SET DEFAULT nextval('public.konfigurasi_poin_sukarela_id_seq'::regclass);


--
-- Name: konfigurasi_shu id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.konfigurasi_shu ALTER COLUMN id SET DEFAULT nextval('public.konfigurasi_shu_id_seq'::regclass);


--
-- Name: pengurus id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pengurus ALTER COLUMN id SET DEFAULT nextval('public.pengurus_id_seq'::regclass);


--
-- Name: periode_akuntansi id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periode_akuntansi ALTER COLUMN id SET DEFAULT nextval('public.periode_akuntansi_id_seq'::regclass);


--
-- Name: rekening_pinjaman id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_pinjaman ALTER COLUMN id SET DEFAULT nextval('public.rekening_pinjaman_id_seq'::regclass);


--
-- Name: rekening_simpanan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_simpanan ALTER COLUMN id SET DEFAULT nextval('public.rekening_simpanan_id_seq'::regclass);


--
-- Name: shu_pemerataan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shu_pemerataan ALTER COLUMN id SET DEFAULT nextval('public.shu_pemerataan_id_seq'::regclass);


--
-- Name: transaksi_simpanan id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaksi_simpanan ALTER COLUMN id SET DEFAULT nextval('public.transaksi_simpanan_id_seq'::regclass);


--
-- Data for Name: anggota; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.anggota (id, kode_anggota, nama, status, created_at, jenis_kelamin) FROM stdin;
4	BM-003	Dewi Lestari	aktif	2025-08-06 23:47:53.831318	\N
7	BM-006	Eko Puji Susanto	aktif	2025-08-07 09:15:23.808879	\N
8	BM-007	Fafa	aktif	2025-08-08 13:50:38.654987	\N
14	BM-012	ASTAGA	aktif	2025-08-10 23:49:20.412631	Perempuan
5	BM-004	Andi Prasetyo	aktif	2025-08-07 00:42:34.180713	\N
11	BM-010	gani	non-aktif	2025-08-10 19:24:57.009636	Laki-laki
6	BM-005	Budi Santoso	aktif	2025-08-07 01:03:49.065248	\N
9	BM-008	Siti Rahmawati	aktif	2025-08-08 21:07:13.157323	\N
15	BM-013	Lulu Sofi K	aktif	2025-08-13 10:24:02.484058	Laki-laki
12	BM-011	Aku dan Bintang	aktif	2025-08-10 19:25:09.784904	Laki-laki
17	BM-015	Prabowo	aktif	2025-08-19 13:58:25.419625	Laki-laki
18	BM-016	Drs. Sudiono	aktif	2025-08-19 20:57:10.431423	Laki-laki
19	BM-017	Drs. Sugeng Sugiyono	aktif	2025-08-19 20:57:10.431423	Laki-laki
20	BM-018	Drs. H. Tahrir, M.Pd.I	aktif	2025-08-19 20:57:10.431423	Laki-laki
21	BM-019	Walisah,BA	aktif	2025-08-19 20:57:10.431423	Perempuan
22	BM-020	Sumanto,S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
23	BM-021	Ridwan,S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
24	BM-022	Turyatna,S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
25	BM-023	Drs. Eko Mujiyono	aktif	2025-08-19 20:57:10.431423	Laki-laki
26	BM-024	Sudiyono SN	aktif	2025-08-19 20:57:10.431423	Laki-laki
27	BM-025	Sutrisno,S.Pd,MM	aktif	2025-08-19 20:57:10.431423	Laki-laki
28	BM-026	Drs. H.Nursin Romli,M.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
29	BM-027	Tyastin Anggraeni,S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
30	BM-028	Sukardo	aktif	2025-08-19 20:57:10.431423	Laki-laki
31	BM-029	Kasim	aktif	2025-08-19 20:57:10.431423	Laki-laki
32	BM-030	Susri Alfuadi,S.Pd.MM	aktif	2025-08-19 20:57:10.431423	Laki-laki
33	BM-031	Widiyati	aktif	2025-08-19 20:57:10.431423	Perempuan
34	BM-032	Nursilowati	aktif	2025-08-19 20:57:10.431423	Perempuan
35	BM-033	Ahmad Saefi, S.Sos	aktif	2025-08-19 20:57:10.431423	Laki-laki
36	BM-034	Enok Cahyanti	aktif	2025-08-19 20:57:10.431423	Perempuan
37	BM-035	Sutiman	aktif	2025-08-19 20:57:10.431423	Laki-laki
38	BM-036	Sutarno	aktif	2025-08-19 20:57:10.431423	Laki-laki
39	BM-037	Aya Sofia F	aktif	2025-08-19 20:57:10.431423	Perempuan
40	BM-038	Kuwatno	aktif	2025-08-19 20:57:10.431423	Laki-laki
41	BM-039	Suwaryanti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
42	BM-040	R .Widyotomo,Sm. Th.	aktif	2025-08-19 20:57:10.431423	Laki-laki
43	BM-041	Sugiyah	aktif	2025-08-19 20:57:10.431423	Perempuan
44	BM-042	Ahmad, S.Kom	aktif	2025-08-19 20:57:10.431423	Laki-laki
45	BM-043	Sukaesih	aktif	2025-08-19 20:57:10.431423	Perempuan
46	BM-044	Eka Kurniawati, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
47	BM-045	Eni Nunggraeni,S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
48	BM-046	H.Muhamad Ahyani, S.Pd, M.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
49	BM-047	Wiwit Rastiyono, S.Sos	aktif	2025-08-19 20:57:10.431423	Laki-laki
50	BM-048	Drs. Slamet Riyanto	aktif	2025-08-19 20:57:10.431423	Laki-laki
51	BM-049	Dede Ruslan M, S.Pd.Fis	aktif	2025-08-19 20:57:10.431423	Laki-laki
52	BM-050	Drs. Djanu Imron	aktif	2025-08-19 20:57:10.431423	Laki-laki
53	BM-051	Dra. Liliani Bekti H.	aktif	2025-08-19 20:57:10.431423	Perempuan
54	BM-052	Sri Giyanti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
55	BM-053	Sri Hartati,S.Pd.M.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
56	BM-054	Acip Nasrip,S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
57	BM-055	Lulu Sofi Kurniawan	aktif	2025-08-19 20:57:10.431423	Laki-laki
58	BM-056	Soimin,S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
59	BM-057	Ani Hastuti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
60	BM-058	Alwan Bachtiar, A.Md	aktif	2025-08-19 20:57:10.431423	Laki-laki
61	BM-059	Imam Widiyanto, A.Md	aktif	2025-08-19 20:57:10.431423	Laki-laki
62	BM-060	Masrudin, S.Kom	aktif	2025-08-19 20:57:10.431423	Laki-laki
63	BM-061	Dra.Wiwi Widyaningsih	aktif	2025-08-19 20:57:10.431423	Perempuan
64	BM-062	Agustina Sinta Dewi,S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
65	BM-063	Drs. Kusworo	aktif	2025-08-19 20:57:10.431423	Laki-laki
66	BM-064	Taswa Suryatmana, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
67	BM-065	Faqih Mujtahid,S.Ag	aktif	2025-08-19 20:57:10.431423	Laki-laki
68	BM-066	Ika Rahayu,S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
69	BM-067	Drs Sukarjo,M.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
70	BM-068	Zulharmansah, M.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
71	BM-069	Munzaenah, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
72	BM-070	Drs. Wahyudi Sudigdo	aktif	2025-08-19 20:57:10.431423	Laki-laki
73	BM-071	Muhani, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
74	BM-072	Tarmono	aktif	2025-08-19 20:57:10.431423	Laki-laki
75	BM-073	Suyatno/yayat	aktif	2025-08-19 20:57:10.431423	Laki-laki
76	BM-074	Kun Dwi Putra GS, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
77	BM-075	Nurlaela, A.Md	aktif	2025-08-19 20:57:10.431423	Perempuan
78	BM-076	Setyawati,SE	aktif	2025-08-19 20:57:10.431423	Perempuan
79	BM-077	Rayi Wigati, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
80	BM-078	Eko Pangestu, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
81	BM-079	Zenitda Arif F, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
82	BM-080	Tuti Purwaningsih	aktif	2025-08-19 20:57:10.431423	Perempuan
83	BM-081	Tasripah	aktif	2025-08-19 20:57:10.431423	Perempuan
84	BM-082	Rahmat Soleh S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
85	BM-083	Endah Winarni, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
86	BM-084	Fuad Khadori, S.Pd.I	aktif	2025-08-19 20:57:10.431423	Laki-laki
87	BM-085	Pitoyo Arifin	aktif	2025-08-19 20:57:10.431423	Laki-laki
88	BM-086	Dwi Nur Handayani, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
89	BM-087	Susan Nita B, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
90	BM-088	Sri Mardianti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
91	BM-089	Ayu Ratna Wardani, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
92	BM-090	Charisa Swasti A, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
93	BM-091	Fitriyani, A.Md	aktif	2025-08-19 20:57:10.431423	Perempuan
94	BM-092	Akhirul Caesar	aktif	2025-08-19 20:57:10.431423	Laki-laki
95	BM-093	Euis W, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
96	BM-094	Apri Hidayat, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
97	BM-095	Bambang Hadi S	aktif	2025-08-19 20:57:10.431423	Laki-laki
98	BM-096	M.Gunanggoro	aktif	2025-08-19 20:57:10.431423	Laki-laki
99	BM-097	Rijalul K	aktif	2025-08-19 20:57:10.431423	Laki-laki
100	BM-098	Ria Ade S, SE	aktif	2025-08-19 20:57:10.431423	Perempuan
101	BM-099	Hari	aktif	2025-08-19 20:57:10.431423	Laki-laki
102	BM-100	Yuliadi	aktif	2025-08-19 20:57:10.431423	Laki-laki
103	BM-101	Waryanto	aktif	2025-08-19 20:57:10.431423	Laki-laki
104	BM-102	Hafidz Ma'ruf, S.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
105	BM-103	Endang Tri W, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
106	BM-104	Hafizd Akhsin	aktif	2025-08-19 20:57:10.431423	Laki-laki
107	BM-105	Dwi Santo Putra	aktif	2025-08-19 20:57:10.431423	Laki-laki
108	BM-106	Diatul Ngatiqoh, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
109	BM-107	Teti Sudiharti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
110	BM-108	Rian Budiarti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
111	BM-109	Suci Renita Sari, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
112	BM-110	Yulia Lestari, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
113	BM-111	Lutfi Wijayanti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
114	BM-112	Yustin, S.Kom	aktif	2025-08-19 20:57:10.431423	Perempuan
115	BM-113	Ririn Duriyah, S.Kom	aktif	2025-08-19 20:57:10.431423	Perempuan
116	BM-114	Novita Tri Astuti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
117	BM-115	Sugeng Riyadi	aktif	2025-08-19 20:57:10.431423	Perempuan
118	BM-116	Drs. Haryono, M.Pd	aktif	2025-08-19 20:57:10.431423	Laki-laki
119	BM-117	Arifah Rohmawati, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
120	BM-118	Haryani, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
121	BM-119	Ratnawati Kusumaningsih, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
122	BM-120	Sri Murni, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
123	BM-121	Amir Mansur	aktif	2025-08-19 20:57:10.431423	Laki-laki
124	BM-122	Hesti, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
125	BM-123	Kartika, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
126	BM-124	Triswanto, S.Pd	aktif	2025-08-19 20:57:10.431423	Perempuan
16	BM-014	ac	aktif	2025-08-15 10:54:00.013114	Laki-laki
\.


--
-- Data for Name: anggota_auth; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.anggota_auth (id, anggota_id, username, password, created_at) FROM stdin;
1	16	ac	$2b$10$vU/JXmnWjqvCAqtifuAeue8/iaSoJXDUGEKTIoyXhgYgzn8pOK9Oi	2025-08-15 22:05:43.012383+07
2	12	asa	$2b$10$qEQuc8h1NvDD3fCE2Cw8N.yODYQ1waqvQuUTLs4JingZ2KADsOC4C	2025-08-17 09:06:06.782454+07
\.


--
-- Data for Name: belanja_anggota; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.belanja_anggota (id, anggota_id, periode_id, bulan, tahun, total_belanja) FROM stdin;
1	12	1	2	2025	0.00
2	5	1	2	2025	395000.00
3	14	1	2	2025	500000.00
4	6	1	2	2025	600000.00
5	4	1	2	2025	75000.00
6	7	1	2	2025	90000000.00
7	8	1	2	2025	85000.00
8	15	1	2	2025	1520000.00
9	9	1	2	2025	960000.00
28	16	1	8	2025	16500000.00
19	12	1	8	2025	2000.00
20	5	1	8	2025	45000.00
21	14	1	8	2025	35000.00
22	6	1	8	2025	45000.00
23	4	1	8	2025	0.00
24	7	1	8	2025	0.00
25	8	1	8	2025	0.00
26	15	1	8	2025	0.00
27	9	1	8	2025	0.00
\.


--
-- Data for Name: jadwal_angsuran; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jadwal_angsuran (id, rekening_pinjaman_id, angsuran_ke, tgl_jatuh_tempo, jumlah_angsuran_pokok, jumlah_angsuran_jasa, status_pembayaran, pokok_dibayar, jasa_dibayar, tgl_pembayaran) FROM stdin;
81	9	3	2025-11-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
102	11	2	2025-10-08	50000.00	5000.00	lunas	50000.00	5000.00	\N
145	16	1	2025-09-16	90000000.00	4500000.00	lunas	90000000.00	4500000.00	2025-04-01
83	9	5	2026-01-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
84	9	6	2026-02-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
85	9	7	2026-03-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
86	9	8	2026-04-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
87	9	9	2026-05-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
88	9	10	2026-06-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
79	9	1	2025-09-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
94	10	6	2026-02-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
95	10	7	2026-03-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
96	10	8	2026-04-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
97	10	9	2026-05-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
98	10	10	2026-06-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
99	10	11	2026-07-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
100	10	12	2026-08-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
82	9	4	2025-12-07	40000.00	4000.00	lunas	40000.00	4000.00	2025-08-04
113	12	3	2025-09-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-13
114	12	4	2025-10-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-13
115	12	5	2025-11-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-13
103	11	3	2025-11-08	50000.00	5000.00	lunas	50000.00	5000.00	2025-08-13
121	13	1	2025-03-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
122	13	2	2025-04-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
123	13	3	2025-05-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
124	13	4	2025-06-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
125	13	5	2025-07-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
126	13	6	2025-08-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
127	13	7	2025-09-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-13
133	15	1	2025-09-13	104166.67	12500.00	lunas	104166.67	12500.00	2025-08-13
134	15	2	2025-10-13	104166.67	12500.00	lunas	104166.67	12500.00	2025-08-13
135	15	3	2025-11-13	104166.67	12500.00	lunas	104166.67	12500.00	2025-08-13
136	15	4	2025-12-13	104166.67	12500.00	lunas	104166.67	12500.00	2025-08-13
116	12	6	2025-12-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-15
117	12	7	2026-01-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-15
107	11	7	2026-03-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
108	11	8	2026-04-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
109	11	9	2026-05-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
110	11	10	2026-06-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
101	11	1	2025-09-08	50000.00	5000.00	lunas	50000.00	5000.00	\N
80	9	2	2025-10-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
89	10	1	2025-09-07	100000.00	12000.00	lunas	100000.00	12000.00	\N
90	10	2	2025-10-07	100000.00	12000.00	lunas	100000.00	12000.00	\N
119	12	9	2026-03-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
120	12	10	2026-04-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
111	12	1	2025-07-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	\N
112	12	2	2025-08-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	\N
146	16	2	2025-10-16	90000000.00	4500000.00	lunas	90000000.00	4500000.00	2025-05-07
147	16	3	2025-11-16	90000000.00	4500000.00	lunas	90000000.00	4500000.00	2025-06-07
148	16	4	2025-12-16	90000000.00	4500000.00	lunas	90000000.00	4500000.00	2025-07-07
149	16	5	2026-01-16	90000000.00	4500000.00	lunas	90000000.00	4500000.00	2025-08-07
153	17	4	2025-09-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
154	17	5	2025-10-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
155	17	6	2025-11-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
156	17	7	2025-12-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
157	17	8	2026-01-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
158	17	9	2026-02-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
159	17	10	2026-03-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
160	17	11	2026-04-06	2083333.00	250000.00	belum_bayar	0.00	0.00	\N
161	17	12	2026-05-06	2083337.00	250000.00	belum_bayar	0.00	0.00	\N
150	17	1	2025-06-06	2083333.00	250000.00	lunas	2083333.00	250000.00	2025-06-16
151	17	2	2025-07-06	2083333.00	250000.00	lunas	2083333.00	250000.00	2025-07-16
152	17	3	2025-08-06	2083333.00	250000.00	lunas	2083333.00	250000.00	2025-08-16
91	10	3	2025-11-07	100000.00	12000.00	lunas	100000.00	12000.00	2025-08-19
93	10	5	2026-01-07	100000.00	12000.00	lunas	100000.00	12000.00	2025-08-19
92	10	4	2025-12-07	100000.00	12000.00	lunas	100000.00	12000.00	2025-08-19
163	18	2	2025-10-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
164	18	3	2025-11-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
165	18	4	2025-12-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
166	18	5	2026-01-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
167	18	6	2026-02-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
168	18	7	2026-03-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
169	18	8	2026-04-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
170	18	9	2026-05-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
171	18	10	2026-06-19	4000000.00	400000.00	belum_bayar	0.00	0.00	\N
162	18	1	2025-09-19	4000000.00	400000.00	lunas	4000000.00	400000.00	2025-08-19
118	12	8	2026-02-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	2025-08-19
173	19	2	2025-10-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
174	19	3	2025-11-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
175	19	4	2025-12-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
104	11	4	2025-12-08	50000.00	5000.00	lunas	50000.00	5000.00	2025-08-21
105	11	5	2026-01-08	50000.00	5000.00	lunas	50000.00	5000.00	2025-08-21
106	11	6	2026-02-08	50000.00	5000.00	lunas	50000.00	5000.00	2025-08-21
137	15	5	2026-01-13	104166.67	12500.00	lunas	833333.32	12500.00	2025-08-22
128	13	8	2025-10-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-22
129	13	9	2025-11-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-22
130	13	10	2025-12-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-22
131	13	11	2026-01-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-22
132	13	12	2026-02-12	3750000.00	450000.00	lunas	3750000.00	450000.00	2025-08-22
176	19	5	2026-01-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
177	19	6	2026-02-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
178	19	7	2026-03-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
179	19	8	2026-04-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
180	19	9	2026-05-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
181	19	10	2026-06-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
182	19	11	2026-07-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
183	19	12	2026-08-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
184	19	13	2026-09-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
185	19	14	2026-10-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
186	19	15	2026-11-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
187	19	16	2026-12-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
188	19	17	2027-01-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
189	19	18	2027-02-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
190	19	19	2027-03-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
191	19	20	2027-04-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
192	19	21	2027-05-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
193	19	22	2027-06-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
194	19	23	2027-07-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
195	19	24	2027-08-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
196	19	25	2027-09-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
197	19	26	2027-10-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
198	19	27	2027-11-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
199	19	28	2027-12-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
200	19	29	2028-01-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
201	19	30	2028-02-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
202	19	31	2028-03-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
203	19	32	2028-04-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
204	19	33	2028-05-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
205	19	34	2028-06-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
206	19	35	2028-07-20	402778.00	101500.00	belum_bayar	0.00	0.00	\N
207	19	36	2028-08-20	402770.00	101500.00	belum_bayar	0.00	0.00	\N
208	20	1	2025-09-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
209	20	2	2025-10-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
210	20	3	2025-11-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
211	20	4	2025-12-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
212	20	5	2026-01-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
213	20	6	2026-02-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
214	20	7	2026-03-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
215	20	8	2026-04-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
216	20	9	2026-05-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
217	20	10	2026-06-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
218	20	11	2026-07-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
219	20	12	2026-08-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
220	20	13	2026-09-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
221	20	14	2026-10-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
222	20	15	2026-11-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
223	20	16	2026-12-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
224	20	17	2027-01-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
225	20	18	2027-02-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
226	20	19	2027-03-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
227	20	20	2027-04-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
228	20	21	2027-05-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
229	20	22	2027-06-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
230	20	23	2027-07-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
231	20	24	2027-08-20	187500.00	31500.00	belum_bayar	0.00	0.00	\N
232	21	1	2025-09-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
233	21	2	2025-10-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
234	21	3	2025-11-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
235	21	4	2025-12-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
236	21	5	2026-01-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
237	21	6	2026-02-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
238	21	7	2026-03-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
239	21	8	2026-04-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
240	21	9	2026-05-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
241	21	10	2026-06-20	7800000.00	546000.00	belum_bayar	0.00	0.00	\N
242	22	1	2025-09-20	4166667.00	175000.00	belum_bayar	0.00	0.00	\N
243	22	2	2025-10-20	4166667.00	175000.00	belum_bayar	0.00	0.00	\N
244	22	3	2025-11-20	4166667.00	175000.00	belum_bayar	0.00	0.00	\N
245	22	4	2025-12-20	4166667.00	175000.00	belum_bayar	0.00	0.00	\N
246	22	5	2026-01-20	4166667.00	175000.00	belum_bayar	0.00	0.00	\N
247	22	6	2026-02-20	4166665.00	175000.00	belum_bayar	0.00	0.00	\N
248	23	1	2025-09-20	666667.00	112000.00	lunas	666667.00	112000.00	2025-08-20
249	23	2	2025-10-20	666667.00	112000.00	lunas	666667.00	112000.00	2025-08-20
250	23	3	2025-11-20	666667.00	112000.00	lunas	14666666.00	112000.00	2025-08-22
273	24	2	2025-10-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
274	24	3	2025-11-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
275	24	4	2025-12-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
276	24	5	2026-01-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
277	24	6	2026-02-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
278	24	7	2026-03-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
279	24	8	2026-04-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
280	24	9	2026-05-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
281	24	10	2026-06-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
282	24	11	2026-07-20	1208333.00	101500.00	belum_bayar	0.00	0.00	\N
283	24	12	2026-08-20	1208337.00	101500.00	belum_bayar	0.00	0.00	\N
272	24	1	2025-09-20	1208333.00	101500.00	lunas	1208333.00	101500.00	2025-08-20
284	25	1	2025-09-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
285	25	2	2025-10-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
286	25	3	2025-11-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
287	25	4	2025-12-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
288	25	5	2026-01-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
289	25	6	2026-02-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
290	25	7	2026-03-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
291	25	8	2026-04-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
292	25	9	2026-05-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
293	25	10	2026-06-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
294	25	11	2026-07-20	1208333.00	145000.00	belum_bayar	0.00	0.00	\N
295	25	12	2026-08-20	1208337.00	145000.00	belum_bayar	0.00	0.00	\N
172	19	1	2025-09-20	402778.00	101500.00	lunas	402778.00	101500.00	2025-08-21
138	15	6	2026-02-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
139	15	7	2026-03-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
140	15	8	2026-04-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
141	15	9	2026-05-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
142	15	10	2026-06-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
143	15	11	2026-07-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
144	15	12	2026-08-13	104166.67	12500.00	dibatalkan	0.00	0.00	\N
251	23	4	2025-12-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
252	23	5	2026-01-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
253	23	6	2026-02-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
254	23	7	2026-03-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
255	23	8	2026-04-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
256	23	9	2026-05-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
257	23	10	2026-06-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
258	23	11	2026-07-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
259	23	12	2026-08-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
260	23	13	2026-09-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
261	23	14	2026-10-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
262	23	15	2026-11-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
263	23	16	2026-12-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
264	23	17	2027-01-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
265	23	18	2027-02-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
266	23	19	2027-03-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
267	23	20	2027-04-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
268	23	21	2027-05-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
269	23	22	2027-06-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
270	23	23	2027-07-20	666667.00	112000.00	dibatalkan	0.00	0.00	\N
271	23	24	2027-08-20	666659.00	112000.00	dibatalkan	0.00	0.00	\N
296	26	1	2025-09-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
297	26	2	2025-10-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
298	26	3	2025-11-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
299	26	4	2025-12-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
300	26	5	2026-01-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
301	26	6	2026-02-22	750000.00	31500.00	lunas	750000.00	31500.00	2025-08-22
302	27	1	2025-08-09	7700000.00	107800.00	lunas	7700000.00	107800.00	2025-08-22
303	27	2	2025-09-09	7700000.00	107800.00	lunas	7700000.00	107800.00	2025-08-22
\.


--
-- Data for Name: jenis_pinjaman; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jenis_pinjaman (id, nama_jenis, tingkat_jasa_persen, deskripsi) FROM stdin;
1	Pinjaman Reguler	0.70	Pinjaman umum untuk anggota
2	Pinjaman Sementara	1.00	Pinjaman jangka pendek dengan bunga sedikit lebih tinggi
3	BON Karyawan	0.00	Pinjaman khusus untuk karyawan internal
\.


--
-- Data for Name: jenis_simpanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jenis_simpanan (id, nama_jenis, akun_id, deskripsi) FROM stdin;
1	Pokok	22	\N
2	Wajib	23	\N
3	Sukarela	21	\N
4	Lebaran	24	\N
5	Qurban	25	\N
6	Lain-lain	26	\N
\.


--
-- Data for Name: jurnal_umum; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.jurnal_umum (id, tgl_transaksi, keterangan, akun_id, debit, kredit, periode_id) FROM stdin;
97	2025-08-10 23:49:48.391469+07	Setoran Pokok PO-0014 a.n. ASTAGA	11	250000.00	0.00	1
98	2025-08-10 23:49:48.391469+07	Setoran Pokok PO-0014 a.n. ASTAGA	22	0.00	250000.00	1
101	2025-08-11 09:36:26.686198+07	Penarikan Pokok PO-0005 a.n. Andi Prasetyo	22	3950000.00	0.00	1
102	2025-08-11 09:36:26.686198+07	Penarikan Pokok PO-0005 a.n. Andi Prasetyo	11	0.00	3950000.00	1
105	2025-08-11 09:59:51.840493+07	Penarikan Wajib WA-0006 a.n. Budi Santoso	23	200000000.00	0.00	1
106	2025-08-11 09:59:51.840493+07	Penarikan Wajib WA-0006 a.n. Budi Santoso	11	0.00	200000000.00	1
110	2025-08-11 22:50:46.204584+07	Setoran Lebaran LE-0005 a.n. Andi Prasetyo	11	650000.00	0.00	1
111	2025-08-11 22:50:46.204584+07	Setoran Lebaran LE-0005 a.n. Andi Prasetyo	24	0.00	650000.00	1
114	2025-01-12 00:00:00+07	Setoran Qurban QU-0005 a.n. Andi Prasetyo	11	1650000.00	0.00	1
115	2025-01-12 00:00:00+07	Setoran Qurban QU-0005 a.n. Andi Prasetyo	25	0.00	1650000.00	1
118	2025-08-12 00:00:00+07	bayar utang	51	1500000.00	1500000.00	1
119	2025-08-12 00:00:00+07	bayar utang	52	1500000.00	1500000.00	1
122	2025-08-12 00:00:00+07	gaji	51	25000000.00	0.00	1
123	2025-08-12 00:00:00+07	gaji	11	0.00	25000000.00	1
126	2025-08-13 11:20:45.137315+07	Pencairan pinjaman PIN-0012-845095	13	1250000.00	0.00	1
127	2025-08-13 11:20:45.137315+07	Pencairan pinjaman PIN-0012-845095	11	0.00	1250000.00	1
141	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-524778	11	55000.00	0.00	1
142	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-524778	13	0.00	50000.00	1
143	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-524778	41	0.00	5000.00	1
144	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
145	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
146	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0014-848280	41	0.00	450000.00	1
147	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
148	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
149	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0014-848280	41	0.00	450000.00	1
150	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
151	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
152	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0014-848280	41	0.00	450000.00	1
161	2025-08-13 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0014-848280	41	0.00	450000.00	1
162	2025-08-13 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
163	2025-08-13 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
164	2025-08-13 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0014-848280	41	0.00	450000.00	1
165	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0012-845095	11	116666.67	0.00	1
166	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0012-845095	13	0.00	104166.67	1
167	2025-08-13 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0012-845095	41	0.00	12500.00	1
168	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0012-845095	11	116666.67	0.00	1
169	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0012-845095	13	0.00	104166.67	1
170	2025-08-13 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0012-845095	41	0.00	12500.00	1
171	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0012-845095	11	116666.67	0.00	1
172	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0012-845095	13	0.00	104166.67	1
173	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0012-845095	41	0.00	12500.00	1
174	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0012-845095	11	116666.67	0.00	1
175	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0012-845095	13	0.00	104166.67	1
176	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0012-845095	41	0.00	12500.00	1
177	2025-08-13 00:00:00+07	modalku	31	0.00	150000000.00	1
178	2025-08-13 00:00:00+07	modalku	11	150000000.00	0.00	1
179	2025-08-15 00:00:00+07	biaya	51	0.00	40000000.00	1
180	2025-08-15 00:00:00+07	biaya	11	40000000.00	0.00	1
181	2025-08-15 00:00:00+07	Setoran Wajib WA-0015-9563 a.n. Lulu Sofi K	11	45000000.00	0.00	1
182	2025-08-15 00:00:00+07	Setoran Wajib WA-0015-9563 a.n. Lulu Sofi K	23	0.00	45000000.00	1
183	2025-08-15 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
184	2025-08-15 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
185	2025-08-15 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
186	2025-08-15 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
41	2025-08-07 22:47:02.887522+07	Setoran Wajib WA-0007 a.n. Eko Puji Susanto	11	500000.00	0.00	1
42	2025-08-07 22:47:02.887522+07	Setoran Wajib WA-0007 a.n. Eko Puji Susanto	23	0.00	500000.00	1
43	2025-08-07 22:47:49.839696+07	Setoran Sukarela SU-0004 a.n. Dewi Lestari	11	100000.00	0.00	1
44	2025-08-07 22:47:49.839696+07	Setoran Sukarela SU-0004 a.n. Dewi Lestari	21	0.00	100000.00	1
45	2025-08-07 22:48:07.314468+07	Pencairan pinjaman PIN-0007-687314	13	400000.00	0.00	1
46	2025-08-07 22:48:07.314468+07	Pencairan pinjaman PIN-0007-687314	11	0.00	400000.00	1
47	2025-08-07 22:48:43.879347+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-687314	11	44000.00	0.00	1
48	2025-08-07 22:48:43.879347+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-687314	13	0.00	40000.00	1
49	2025-08-07 22:48:43.879347+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-687314	41	0.00	4000.00	1
50	2025-08-07 22:56:36.451842+07	Setoran Wajib WA-0007 a.n. Eko Puji Susanto	11	120000.00	0.00	1
51	2025-08-07 22:56:36.451842+07	Setoran Wajib WA-0007 a.n. Eko Puji Susanto	23	0.00	120000.00	1
52	2025-08-07 22:57:32.231242+07	Setoran Pokok PO-0005 a.n. Andi Prasetyo	11	1500000.00	0.00	1
53	2025-08-07 22:57:32.231242+07	Setoran Pokok PO-0005 a.n. Andi Prasetyo	22	0.00	1500000.00	1
54	2025-08-07 22:58:30.633635+07	Pencairan pinjaman PIN-0005-310600	13	1200000.00	0.00	1
55	2025-08-07 22:58:30.633635+07	Pencairan pinjaman PIN-0005-310600	11	0.00	1200000.00	1
56	2025-08-08 13:44:45.033992+07	Setoran Wajib WA-0005 a.n. Andi Prasetyo	11	3000000.00	0.00	1
57	2025-08-08 13:44:45.033992+07	Setoran Wajib WA-0005 a.n. Andi Prasetyo	23	0.00	3000000.00	1
58	2025-08-08 13:45:24.779463+07	Pencairan pinjaman PIN-0007-524778	13	500000.00	0.00	1
59	2025-08-08 13:45:24.779463+07	Pencairan pinjaman PIN-0007-524778	11	0.00	500000.00	1
60	2025-08-08 13:47:06.860226+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-524778	11	55000.00	0.00	1
61	2025-08-08 13:47:06.860226+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-524778	13	0.00	50000.00	1
62	2025-08-08 13:47:06.860226+07	Pembayaran angsuran ke-1 pinjaman PIN-0007-524778	41	0.00	5000.00	1
63	2025-08-08 13:51:16.53424+07	Setoran Pokok PO-0008 a.n. Fafa	11	10000.00	0.00	1
64	2025-08-08 13:51:16.53424+07	Setoran Pokok PO-0008 a.n. Fafa	22	0.00	10000.00	1
65	2025-08-08 13:51:37.761513+07	Setoran Wajib WA-0008 a.n. Fafa	11	150000.00	0.00	1
66	2025-08-08 13:51:37.761513+07	Setoran Wajib WA-0008 a.n. Fafa	23	0.00	150000.00	1
67	2025-08-08 15:16:24.232723+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-687314	11	44000.00	0.00	1
68	2025-08-08 15:16:24.232723+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-687314	13	0.00	40000.00	1
69	2025-08-08 15:16:24.232723+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-687314	41	0.00	4000.00	1
70	2025-08-08 15:17:53.671669+07	Pembayaran angsuran ke-1 pinjaman PIN-0005-310600	11	112000.00	0.00	1
71	2025-08-08 15:17:53.671669+07	Pembayaran angsuran ke-1 pinjaman PIN-0005-310600	13	0.00	100000.00	1
72	2025-08-08 15:17:53.671669+07	Pembayaran angsuran ke-1 pinjaman PIN-0005-310600	41	0.00	12000.00	1
73	2025-08-08 15:18:05.792543+07	Pembayaran angsuran ke-2 pinjaman PIN-0005-310600	11	112000.00	0.00	1
74	2025-08-08 15:18:05.792543+07	Pembayaran angsuran ke-2 pinjaman PIN-0005-310600	13	0.00	100000.00	1
75	2025-08-08 15:18:05.792543+07	Pembayaran angsuran ke-2 pinjaman PIN-0005-310600	41	0.00	12000.00	1
76	2025-08-08 21:36:54.97776+07	Setoran Sukarela SU-0009 a.n. Siti Rahmawati	11	250000000.00	0.00	1
77	2025-08-08 21:36:54.97776+07	Setoran Sukarela SU-0009 a.n. Siti Rahmawati	21	0.00	250000000.00	1
78	2025-08-08 21:37:33.633405+07	Setoran Wajib WA-0006 a.n. Budi Santoso55	11	250000000.00	0.00	1
79	2025-08-08 21:37:33.633405+07	Setoran Wajib WA-0006 a.n. Budi Santoso55	23	0.00	250000000.00	1
80	2025-08-09 16:58:34.372212+07	Setoran Sukarela SU-0007 a.n. Eko Puji Susanto	11	2500000.00	0.00	1
81	2025-08-09 16:58:34.372212+07	Setoran Sukarela SU-0007 a.n. Eko Puji Susanto	21	0.00	2500000.00	1
82	2025-08-09 18:28:37.735877+07	Pencairan pinjaman PIN-0006-917682	13	200000000.00	0.00	1
83	2025-08-09 18:28:37.735877+07	Pencairan pinjaman PIN-0006-917682	11	0.00	200000000.00	1
84	2025-08-09 18:28:53.66415+07	Pembayaran angsuran ke-1 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
85	2025-08-09 18:28:53.66415+07	Pembayaran angsuran ke-1 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
86	2025-08-09 18:28:53.66415+07	Pembayaran angsuran ke-1 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
87	2025-08-09 18:28:58.058826+07	Pembayaran angsuran ke-2 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
88	2025-08-09 18:28:58.058826+07	Pembayaran angsuran ke-2 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
89	2025-08-09 18:28:58.058826+07	Pembayaran angsuran ke-2 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
90	2025-08-10 19:45:01.03506+07	Setoran Pokok PO-0012 a.n. Lulu Sofi K	11	25000000.00	0.00	1
91	2025-08-10 19:45:01.03506+07	Setoran Pokok PO-0012 a.n. Lulu Sofi K	22	0.00	25000000.00	1
92	2025-08-10 19:49:32.661997+07	Setoran Wajib WA-0012 a.n. Lulu Sofi K	11	150000.00	0.00	1
93	2025-08-10 19:49:32.661997+07	Setoran Wajib WA-0012 a.n. Lulu Sofi K	23	0.00	150000.00	1
94	2025-08-10 19:52:56.292578+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-687314	11	44000.00	0.00	1
95	2025-08-10 19:52:56.292578+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-687314	13	0.00	40000.00	1
96	2025-08-10 19:52:56.292578+07	Pembayaran angsuran ke-3 pinjaman PIN-0007-687314	41	0.00	4000.00	1
99	2025-08-11 09:34:21.329938+07	Setoran Pokok PO-0005 a.n. Andi Prasetyo	11	2500000.00	0.00	1
100	2025-08-11 09:34:21.329938+07	Setoran Pokok PO-0005 a.n. Andi Prasetyo	22	0.00	2500000.00	1
103	2025-08-11 09:42:33.989591+07	Setoran Lebaran LE-0005 a.n. Andi Prasetyo	11	150000.00	0.00	1
104	2025-08-11 09:42:33.989591+07	Setoran Lebaran LE-0005 a.n. Andi Prasetyo	24	0.00	150000.00	1
107	2025-08-11 13:39:21.234411+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-524778	11	55000.00	0.00	\N
108	2025-08-11 13:39:21.234411+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-524778	13	0.00	50000.00	\N
109	2025-08-11 13:39:21.234411+07	Pembayaran angsuran ke-2 pinjaman PIN-0007-524778	41	0.00	5000.00	\N
112	2025-08-12 00:00:00+07	Penarikan Lebaran LE-0005 a.n. Andi Prasetyo	24	750000.00	0.00	1
113	2025-08-12 00:00:00+07	Penarikan Lebaran LE-0005 a.n. Andi Prasetyo	11	0.00	750000.00	1
116	2025-08-12 09:30:48.327176+07	Pencairan pinjaman PIN-0014-848280	13	45000000.00	0.00	1
117	2025-08-12 09:30:48.327176+07	Pencairan pinjaman PIN-0014-848280	11	0.00	45000000.00	1
120	2025-08-12 00:00:00+07	Gaji Pegawai	51	20000000.00	0.00	1
121	2025-08-12 00:00:00+07	Gaji Pegawai	11	0.00	20000000.00	1
124	2025-08-12 00:00:00+07	saef	51	1500000.00	0.00	1
125	2025-08-12 00:00:00+07	saef	11	0.00	1500000.00	1
129	2025-08-04 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-687314	11	44000.00	0.00	1
130	2025-08-04 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-687314	13	0.00	40000.00	1
131	2025-08-04 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-687314	41	0.00	4000.00	1
132	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
133	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
134	2025-08-13 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
135	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
136	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
137	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
138	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
139	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
140	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
153	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
154	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
155	2025-08-13 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0014-848280	41	0.00	450000.00	1
156	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
157	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
158	2025-08-13 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0014-848280	41	0.00	450000.00	1
159	2025-08-13 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
160	2025-08-13 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
187	2025-08-15 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
188	2025-08-15 00:00:00+07	Pembayaran angsuran ke-7 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
189	2025-08-15 00:00:00+07	Setoran Wajib WA-0016-9808 a.n. ac	11	110000000.00	0.00	1
190	2025-08-15 00:00:00+07	Setoran Wajib WA-0016-9808 a.n. ac	23	0.00	110000000.00	1
191	2025-08-15 00:00:00+07	Setoran Wajib WA-0016-9808 a.n. ac	11	94225000.00	0.00	1
192	2025-08-15 00:00:00+07	Setoran Wajib WA-0016-9808 a.n. ac	23	0.00	94225000.00	1
193	2025-01-15 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	11	2800000.00	0.00	1
194	2025-01-15 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	21	0.00	2800000.00	1
195	2025-01-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	21	95000.00	0.00	1
196	2025-01-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	11	0.00	95000.00	1
197	2025-02-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	21	200000.00	0.00	1
198	2025-02-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	11	0.00	200000.00	1
199	2025-03-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	21	200000.00	0.00	1
200	2025-03-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	11	0.00	200000.00	1
201	2025-04-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	21	200000.00	0.00	1
202	2025-04-16 00:00:00+07	Penarikan Sukarela SU-0016-1851 a.n. ac	11	0.00	200000.00	1
203	2025-02-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	11	400000.00	0.00	1
204	2025-02-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	21	0.00	400000.00	1
205	2025-03-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	11	400000.00	0.00	1
206	2025-03-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	21	0.00	400000.00	1
207	2025-04-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	11	400000.00	0.00	1
208	2025-04-17 00:00:00+07	Setoran Sukarela SU-0016-1851 a.n. ac	21	0.00	400000.00	1
209	2025-08-16 00:00:00+07	Pencairan pinjaman PIN-0016-884969	13	450000000.00	0.00	1
210	2025-08-16 00:00:00+07	Pencairan pinjaman PIN-0016-884969	11	0.00	450000000.00	1
211	2025-04-01 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-884969	11	94500000.00	0.00	1
212	2025-04-01 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-884969	13	0.00	90000000.00	1
213	2025-04-01 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-884969	41	0.00	4500000.00	1
214	2025-05-07 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-884969	11	94500000.00	0.00	1
215	2025-05-07 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-884969	13	0.00	90000000.00	1
216	2025-05-07 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-884969	41	0.00	4500000.00	1
217	2025-06-07 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-884969	11	94500000.00	0.00	1
218	2025-06-07 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-884969	13	0.00	90000000.00	1
219	2025-06-07 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-884969	41	0.00	4500000.00	1
220	2025-07-07 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0016-884969	11	94500000.00	0.00	1
221	2025-07-07 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0016-884969	13	0.00	90000000.00	1
222	2025-07-07 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0016-884969	41	0.00	4500000.00	1
223	2025-08-07 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0016-884969	11	94500000.00	0.00	1
224	2025-08-07 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0016-884969	13	0.00	90000000.00	1
225	2025-08-07 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0016-884969	41	0.00	4500000.00	1
226	2025-05-06 00:00:00+07	Pencairan pinjaman PIN-0016-973598	13	25000000.00	0.00	1
227	2025-05-06 00:00:00+07	Pencairan pinjaman PIN-0016-973598	11	0.00	25000000.00	1
228	2025-06-16 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-973598	11	2333333.00	0.00	1
229	2025-06-16 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-973598	13	0.00	2083333.00	1
230	2025-06-16 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0016-973598	41	0.00	250000.00	1
231	2025-07-16 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-973598	11	2333333.00	0.00	1
232	2025-07-16 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-973598	13	0.00	2083333.00	1
233	2025-07-16 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0016-973598	41	0.00	250000.00	1
234	2025-08-16 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-973598	11	2333333.00	0.00	1
235	2025-08-16 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-973598	13	0.00	2083333.00	1
236	2025-08-16 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0016-973598	41	0.00	250000.00	1
237	2025-08-19 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0005-310600	11	112000.00	0.00	1
238	2025-08-19 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0005-310600	13	0.00	100000.00	1
239	2025-08-19 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0005-310600	41	0.00	12000.00	1
240	2025-08-19 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0005-310600	11	112000.00	0.00	1
241	2025-08-19 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0005-310600	13	0.00	100000.00	1
242	2025-08-19 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0005-310600	41	0.00	12000.00	1
243	2025-08-19 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0005-310600	11	112000.00	0.00	1
244	2025-08-19 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0005-310600	13	0.00	100000.00	1
245	2025-08-19 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0005-310600	41	0.00	12000.00	1
246	2025-08-19 00:00:00+07	Pencairan pinjaman PIN-0008-054769	13	40000000.00	0.00	1
247	2025-08-19 00:00:00+07	Pencairan pinjaman PIN-0008-054769	11	0.00	40000000.00	1
248	2025-08-19 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0008-054769	11	4400000.00	0.00	1
249	2025-08-19 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0008-054769	13	0.00	4000000.00	1
250	2025-08-19 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0008-054769	41	0.00	400000.00	1
251	2025-08-19 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0006-917682	11	22000000.00	0.00	1
252	2025-08-19 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0006-917682	13	0.00	20000000.00	1
253	2025-08-19 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0006-917682	41	0.00	2000000.00	1
254	2025-08-20 00:00:00+07	Penarikan Wajib WA-0016-9808 a.n. ac	23	29000000.00	0.00	1
255	2025-08-20 00:00:00+07	Penarikan Wajib WA-0016-9808 a.n. ac	11	0.00	29000000.00	1
256	2025-08-20 00:00:00+07	Setoran Qurban QU-0014-7057 a.n. ASTAGA	11	250000.00	0.00	1
257	2025-08-20 00:00:00+07	Setoran Qurban QU-0014-7057 a.n. ASTAGA	25	0.00	250000.00	1
258	2025-08-20 00:00:00+07	Setoran Wajib WA-0014 a.n. ASTAGA	11	45000.00	0.00	1
259	2025-08-20 00:00:00+07	Setoran Wajib WA-0014 a.n. ASTAGA	23	0.00	45000.00	1
260	2025-08-20 00:00:00+07	Setoran Wajib WA-0015-9563 a.n. Lulu Sofi K	11	35000.00	0.00	1
261	2025-08-20 00:00:00+07	Setoran Wajib WA-0015-9563 a.n. Lulu Sofi K	23	0.00	35000.00	1
262	2025-08-20 00:00:00+07	Penarikan Wajib WA-0015-9563 a.n. Lulu Sofi K	23	35000.00	0.00	1
263	2025-08-20 00:00:00+07	Penarikan Wajib WA-0015-9563 a.n. Lulu Sofi K	11	0.00	35000.00	1
264	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0060-524057	13	14500000.00	0.00	1
265	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0060-524057	11	0.00	14500000.00	1
266	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0083-547658	13	4500000.00	0.00	1
267	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0083-547658	11	0.00	4500000.00	1
268	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0033-570162	13	78000000.00	0.00	1
269	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0033-570162	11	0.00	78000000.00	1
270	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0079-668327	13	25000000.00	0.00	1
271	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0079-668327	11	0.00	25000000.00	1
272	2025-08-20 00:00:00+07	Setoran Sukarela SU-0036-8022 a.n. Enok Cahyanti	11	50000000.00	0.00	1
273	2025-08-20 00:00:00+07	Setoran Sukarela SU-0036-8022 a.n. Enok Cahyanti	21	0.00	50000000.00	1
274	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0123-758393	13	16000000.00	0.00	1
275	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0123-758393	11	0.00	16000000.00	1
276	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0123-758393	11	778667.00	0.00	1
277	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0123-758393	13	0.00	666667.00	1
278	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0123-758393	41	0.00	112000.00	1
279	2025-08-20 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0123-758393	11	778667.00	0.00	1
280	2025-08-20 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0123-758393	13	0.00	666667.00	1
281	2025-08-20 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0123-758393	41	0.00	112000.00	1
282	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0108-871411	13	14500000.00	0.00	1
283	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0108-871411	11	0.00	14500000.00	1
284	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0108-871411	11	1309833.00	0.00	1
285	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0108-871411	13	0.00	1208333.00	1
286	2025-08-20 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0108-871411	41	0.00	101500.00	1
287	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0056-231391	13	14500000.00	0.00	1
288	2025-08-20 00:00:00+07	Pencairan pinjaman PIN-0056-231391	11	0.00	14500000.00	1
289	2025-08-21 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0060-524057	11	504278.00	0.00	1
290	2025-08-21 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0060-524057	13	0.00	402778.00	1
291	2025-08-21 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0060-524057	41	0.00	101500.00	1
292	2025-08-21 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-524778	11	55000.00	0.00	1
293	2025-08-21 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-524778	13	0.00	50000.00	1
294	2025-08-21 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0007-524778	41	0.00	5000.00	1
295	2025-08-21 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0007-524778	11	55000.00	0.00	1
296	2025-08-21 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0007-524778	13	0.00	50000.00	1
297	2025-08-21 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0007-524778	41	0.00	5000.00	1
298	2025-08-21 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0007-524778	11	55000.00	0.00	1
299	2025-08-21 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0007-524778	13	0.00	50000.00	1
300	2025-08-21 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0007-524778	41	0.00	5000.00	1
301	2025-08-22 00:00:00+07	Pencairan pinjaman PIN-0126-108854	13	4500000.00	0.00	1
302	2025-08-22 00:00:00+07	Pencairan pinjaman PIN-0126-108854	11	0.00	4500000.00	1
306	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0012-845095	11	845833.32	0.00	1
307	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0012-845095	13	0.00	833333.32	1
308	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0012-845095	41	0.00	12500.00	1
311	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0123-758393	11	14778666.00	0.00	1
312	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0123-758393	13	0.00	14666666.00	1
313	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0123-758393	41	0.00	112000.00	1
318	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0126-108854	11	781500.00	0.00	1
319	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0126-108854	13	0.00	750000.00	1
320	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0126-108854	41	0.00	31500.00	1
321	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0126-108854	11	781500.00	0.00	1
322	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0126-108854	13	0.00	750000.00	1
323	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0126-108854	41	0.00	31500.00	1
324	2025-08-22 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0126-108854	11	781500.00	0.00	1
325	2025-08-22 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0126-108854	13	0.00	750000.00	1
326	2025-08-22 00:00:00+07	Pembayaran angsuran ke-3 pinjaman PIN-0126-108854	41	0.00	31500.00	1
327	2025-08-22 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0126-108854	11	781500.00	0.00	1
328	2025-08-22 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0126-108854	13	0.00	750000.00	1
329	2025-08-22 00:00:00+07	Pembayaran angsuran ke-4 pinjaman PIN-0126-108854	41	0.00	31500.00	1
330	2025-08-22 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0126-108854	11	781500.00	0.00	1
331	2025-08-22 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0126-108854	13	0.00	750000.00	1
332	2025-08-22 00:00:00+07	Pembayaran angsuran ke-5 pinjaman PIN-0126-108854	41	0.00	31500.00	1
333	2025-08-22 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0126-108854	11	781500.00	0.00	1
334	2025-08-22 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0126-108854	13	0.00	750000.00	1
335	2025-08-22 00:00:00+07	Pembayaran angsuran ke-6 pinjaman PIN-0126-108854	41	0.00	31500.00	1
336	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0126-108854	11	0.00	0.00	1
337	2025-08-22 00:00:00+07	Pelunasan dipercepat pinjaman PIN-0126-108854	13	0.00	0.00	1
338	2025-07-09 00:00:00+07	Pencairan pinjaman PIN-0094-068227	13	15400000.00	0.00	1
339	2025-07-09 00:00:00+07	Pencairan pinjaman PIN-0094-068227	11	0.00	15400000.00	1
340	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0094-068227	11	7807800.00	0.00	1
341	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0094-068227	13	0.00	7700000.00	1
342	2025-08-22 00:00:00+07	Pembayaran angsuran ke-1 pinjaman PIN-0094-068227	41	0.00	107800.00	1
343	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0094-068227	11	7807800.00	0.00	1
344	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0094-068227	13	0.00	7700000.00	1
345	2025-08-22 00:00:00+07	Pembayaran angsuran ke-2 pinjaman PIN-0094-068227	41	0.00	107800.00	1
346	2025-08-22 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
347	2025-08-22 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
348	2025-08-22 00:00:00+07	Pembayaran angsuran ke-8 pinjaman PIN-0014-848280	41	0.00	450000.00	1
349	2025-08-22 00:00:00+07	Pembayaran angsuran ke-9 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
350	2025-08-22 00:00:00+07	Pembayaran angsuran ke-9 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
351	2025-08-22 00:00:00+07	Pembayaran angsuran ke-9 pinjaman PIN-0014-848280	41	0.00	450000.00	1
352	2025-08-22 00:00:00+07	Pembayaran angsuran ke-10 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
353	2025-08-22 00:00:00+07	Pembayaran angsuran ke-10 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
354	2025-08-22 00:00:00+07	Pembayaran angsuran ke-10 pinjaman PIN-0014-848280	41	0.00	450000.00	1
355	2025-08-22 00:00:00+07	Pembayaran angsuran ke-11 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
356	2025-08-22 00:00:00+07	Pembayaran angsuran ke-11 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
357	2025-08-22 00:00:00+07	Pembayaran angsuran ke-11 pinjaman PIN-0014-848280	41	0.00	450000.00	1
358	2025-08-22 00:00:00+07	Pembayaran angsuran ke-12 pinjaman PIN-0014-848280	11	4200000.00	0.00	1
359	2025-08-22 00:00:00+07	Pembayaran angsuran ke-12 pinjaman PIN-0014-848280	13	0.00	3750000.00	1
360	2025-08-22 00:00:00+07	Pembayaran angsuran ke-12 pinjaman PIN-0014-848280	41	0.00	450000.00	1
\.


--
-- Data for Name: kas_bank; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kas_bank (id, nama_akun, nomor_rekening, nama_bank, saldo_awal, saldo_sekarang, kode_akun_id, created_at) FROM stdin;
\.


--
-- Data for Name: kode_akun; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.kode_akun (id, kode, nama_akun, posisi_saldo, header_akun, kelompok_akun) FROM stdin;
1	1-1000	ASET	debit	\N	\N
10	1-1100	ASET LANCAR	debit	ASET	\N
11	1-1101	Kas	debit	ASET	Kas dan Bank
12	1-1102	Bank	debit	ASET	Kas dan Bank
13	1-1201	Piutang Pinjaman Anggota	debit	ASET	Piutang
2	2-1000	KEWAJIBAN	kredit	\N	\N
20	2-1100	KEWAJIBAN JANGKA PENDEK	kredit	KEWAJIBAN	\N
21	2-1101	Simpanan Sukarela	kredit	KEWAJIBAN	Simpanan Anggota
22	2-1102	Simpanan Pokok	kredit	KEWAJIBAN	Simpanan Anggota
23	2-1103	Simpanan Wajib	kredit	KEWAJIBAN	Simpanan Anggota
24	2-1104	Simpanan Lebaran	kredit	KEWAJIBAN	Simpanan Anggota
25	2-1105	Simpanan Qurban	kredit	KEWAJIBAN	Simpanan Anggota
26	2-1106	Simpanan Lain-lain	kredit	KEWAJIBAN	Simpanan Anggota
3	3-1000	MODAL	kredit	\N	\N
31	3-1101	Modal Disetor	kredit	MODAL	Modal Koperasi
32	3-1102	Sisa Hasil Usaha (SHU)	kredit	MODAL	Modal Koperasi
4	4-1000	PENDAPATAN	kredit	\N	\N
41	4-1101	Pendapatan Jasa Pinjaman	kredit	PENDAPATAN	Pendapatan Operasional
42	4-1102	Pendapatan Administrasi	kredit	PENDAPATAN	Pendapatan Operasional
5	5-1000	BEBAN	debit	\N	\N
51	5-1101	Beban Gaji	debit	BEBAN	Beban Operasional
52	5-1102	Beban ATK	debit	BEBAN	Beban Operasional
\.


--
-- Data for Name: konfigurasi_poin_sukarela; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.konfigurasi_poin_sukarela (id, batas_saldo, harga_saham) FROM stdin;
6	5000000.00	15000.00
7	10000000.00	20000.00
8	15000000.00	25000.00
9	20000000.00	30000.00
10	999999999999.00	35000.00
\.


--
-- Data for Name: konfigurasi_shu; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.konfigurasi_shu (id, nama_konfigurasi, kunci_konfigurasi, nilai, deskripsi) FROM stdin;
1	Pra-alokasi Jasa Peminjam (%)	alokasi_jasa_peminjam_persen	10.00	Persentase dari Jasa Simpan Pinjam yang dikembalikan langsung ke peminjam.
2	Distribusi SHU untuk Anggota (%)	distribusi_anggota_persen	50.00	Persentase dari Saldo Laba yang dialokasikan untuk anggota.
3	Distribusi SHU untuk Cadangan (%)	distribusi_cadangan_persen	5.00	Persentase dari Saldo Laba yang disimpan sebagai dana cadangan.
4	Distribusi SHU untuk Dana Sosial (%)	distribusi_sosial_persen	5.00	Persentase dari Saldo Laba untuk dana sosial.
5	Distribusi SHU untuk Pengurus (%)	distribusi_pengurus_persen	40.00	Persentase dari Saldo Laba untuk pengurus.
6	Harga Poin Belanja (Rp)	harga_poin_belanja	10000.00	Nilai belanja dalam Rupiah untuk mendapatkan 1 poin SHU Toko.
7	Pembagi Poin (Pokok & Wajib)	pembagi_poin_pokok_wajib	10000.00	Angka pembagi untuk total simpanan pokok & wajib dalam perhitungan poin SHU.
8	Pembagi Poin (Lebaran)	pembagi_poin_lebaran	15000.00	Angka pembagi untuk total simpanan lebaran dalam perhitungan poin SHU.
\.


--
-- Data for Name: pengurus; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pengurus (id, nama_lengkap, username, password, role, created_at) FROM stdin;
1	Admin Utama	admin	$2b$10$TuroRm3jkbXZdMxEi.ot5u/eEWpVETfbbLdS52M0jxT4RQtb0kdnS	pengurus	2025-08-07 23:11:13.973822+07
\.


--
-- Data for Name: periode_akuntansi; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.periode_akuntansi (id, nama_periode, tgl_mulai, tgl_selesai, status) FROM stdin;
1	Tahun Buku 2025	2025-01-01	2025-12-31	open
\.


--
-- Data for Name: rekening_pinjaman; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rekening_pinjaman (id, anggota_id, no_pinjaman, jumlah_pinjaman, tenor, tingkat_jasa_persen, status, tgl_pencairan, created_at, sisa_pokok, jenis_pinjaman_id) FROM stdin;
17	16	PIN-0016-973598	25000000.00	12	1.00	aktif	2025-05-06	2025-08-16 18:16:13.596941	18750001.00	\N
9	7	PIN-0007-687314	400000.00	10	1.00	aktif	2025-08-07	2025-08-07 22:48:07.314468	240000.00	\N
16	16	PIN-0016-884969	450000000.00	5	1.00	aktif	2025-08-16	2025-08-16 18:14:44.968755	0.00	\N
10	5	PIN-0005-310600	1200000.00	12	1.00	aktif	2025-08-07	2025-08-07 22:58:30.633635	700000.00	\N
18	8	PIN-0008-054769	40000000.00	10	1.00	aktif	2025-08-19	2025-08-19 13:30:54.767187	36000000.00	\N
12	6	PIN-0006-917682	200000000.00	10	1.00	aktif	2025-06-01	2025-08-09 18:28:37.735877	40000000.00	\N
20	83	PIN-0083-547658	4500000.00	24	0.70	aktif	2025-08-20	2025-08-20 11:02:27.657232	4500000.00	\N
21	33	PIN-0033-570162	78000000.00	10	0.70	aktif	2025-08-20	2025-08-20 11:02:50.160779	78000000.00	\N
22	79	PIN-0079-668327	25000000.00	6	0.70	aktif	2025-08-20	2025-08-20 11:04:28.326673	25000000.00	\N
24	108	PIN-0108-871411	14500000.00	12	0.70	aktif	2025-08-20	2025-08-20 11:07:51.410341	13291667.00	\N
25	56	PIN-0056-231391	14500000.00	12	1.00	aktif	2025-08-20	2025-08-20 13:27:11.384167	14500000.00	\N
19	60	PIN-0060-524057	14500000.00	36	0.70	aktif	2025-08-20	2025-08-20 11:02:04.055107	14097222.00	\N
11	7	PIN-0007-524778	500000.00	10	1.00	aktif	2025-08-08	2025-08-08 13:45:24.779463	200000.00	\N
15	12	PIN-0012-845095	1250000.00	12	1.00	lunas	2025-08-13	2025-08-13 11:20:45.137315	0.00	\N
23	123	PIN-0123-758393	16000000.00	24	0.70	lunas	2025-08-20	2025-08-20 11:05:58.392403	0.00	\N
26	126	PIN-0126-108854	4500000.00	6	0.70	lunas	2025-08-22	2025-08-22 10:58:28.852543	0.00	\N
27	94	PIN-0094-068227	15400000.00	2	0.70	lunas	2025-07-09	2025-08-22 14:01:08.226473	0.00	\N
13	14	PIN-0014-848280	45000000.00	12	1.00	lunas	2025-02-12	2025-08-12 09:30:48.327176	0.00	\N
\.


--
-- Data for Name: rekening_simpanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rekening_simpanan (id, anggota_id, jenis_simpanan, no_rekening, saldo, created_at) FROM stdin;
21	5	Pokok	PO-0005	50000.00	2025-08-07 22:57:25.22918
26	6	Wajib	WA-0006	50000000.00	2025-08-08 21:37:24.798168
32	5	Lebaran	LE-0005	50000.00	2025-08-11 09:10:30.961279
33	5	Qurban	QU-0005	1650000.00	2025-08-11 09:10:43.371395
37	16	Sukarela	SU-0016-1851	3305000.00	2025-08-15 10:57:51.85294
20	4	Sukarela	SU-0004	100000.00	2025-08-07 22:47:43.989143
19	7	Wajib	WA-0007	620000.00	2025-08-07 22:46:56.989211
22	5	Wajib	WA-0005	3000000.00	2025-08-08 13:44:35.873201
23	8	Pokok	PO-0008	10000.00	2025-08-08 13:51:00.083752
24	8	Wajib	WA-0008	150000.00	2025-08-08 13:51:05.220094
25	9	Sukarela	SU-0009	250000000.00	2025-08-08 21:36:42.761725
27	7	Sukarela	SU-0007	2500000.00	2025-08-09 16:58:26.947985
28	12	Pokok	PO-0012	25000000.00	2025-08-10 19:33:56.176063
29	12	Wajib	WA-0012	150000.00	2025-08-10 19:49:04.141987
30	14	Pokok	PO-0014	250000.00	2025-08-10 23:49:29.260479
36	16	Wajib	WA-0016-9808	175225000.00	2025-08-15 10:54:09.810191
34	14	Qurban	QU-0014-7057	250000.00	2025-08-11 22:51:27.058468
31	14	Wajib	WA-0014	45000.00	2025-08-10 23:49:33.306532
35	15	Wajib	WA-0015-9563	45000000.00	2025-08-15 10:14:19.564758
38	36	Sukarela	SU-0036-8022	50000000.00	2025-08-20 11:05:08.023251
39	56	Pokok	PO-0056-7179	0.00	2025-08-20 13:27:17.17987
\.


--
-- Data for Name: shu_pemerataan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shu_pemerataan (id, anggota_id, periode_id, jumlah, keterangan) FROM stdin;
1	16	1	150000.00	\N
2	12	1	250000.00	\N
3	5	1	250000.00	\N
4	14	1	450000.00	\N
5	6	1	350000.00	\N
6	4	1	200000.00	\N
7	7	1	20000.00	\N
8	8	1	1500.00	\N
9	15	1	45000000.00	\N
10	9	1	36000.00	\N
\.


--
-- Data for Name: transaksi_simpanan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transaksi_simpanan (id, rekening_id, tgl_transaksi, jenis_transaksi, jumlah) FROM stdin;
21	19	2025-08-07 22:47:02.887522	Setor	500000.00
22	20	2025-08-07 22:47:49.839696	Setor	100000.00
23	19	2025-08-07 22:56:36.451842	Setor	120000.00
24	21	2025-08-07 22:57:32.231242	Setor	1500000.00
25	22	2025-08-08 13:44:45.033992	Setor	3000000.00
26	23	2025-08-08 13:51:16.53424	Setor	10000.00
27	24	2025-08-08 13:51:37.761513	Setor	150000.00
28	25	2025-08-08 21:36:54.97776	Setor	250000000.00
29	26	2025-08-08 21:37:33.633405	Setor	250000000.00
30	27	2025-08-09 16:58:34.372212	Setor	2500000.00
31	28	2025-08-10 19:45:01.03506	Setor	25000000.00
32	29	2025-08-10 19:49:32.661997	Setor	150000.00
33	30	2025-08-10 23:49:48.391469	Setor	250000.00
34	21	2025-08-11 09:34:21.329938	Setor	2500000.00
35	21	2025-08-11 09:36:26.686198	Tarik	3950000.00
36	32	2025-08-11 09:42:33.989591	Setor	150000.00
37	26	2025-08-11 09:59:51.840493	Tarik	200000000.00
38	32	2025-08-11 22:50:46.204584	Setor	650000.00
39	32	2025-08-12 00:00:00	Tarik	750000.00
40	33	2025-01-12 00:00:00	Setor	1650000.00
41	35	2025-08-15 00:00:00	Setor	45000000.00
42	36	2025-08-15 00:00:00	Setor	110000000.00
43	36	2025-08-15 00:00:00	Setor	94225000.00
44	37	2025-01-15 00:00:00	Setor	2800000.00
45	37	2025-01-16 00:00:00	Tarik	95000.00
46	37	2025-02-16 00:00:00	Tarik	200000.00
47	37	2025-03-16 00:00:00	Tarik	200000.00
48	37	2025-04-16 00:00:00	Tarik	200000.00
49	37	2025-02-17 00:00:00	Setor	400000.00
50	37	2025-03-17 00:00:00	Setor	400000.00
51	37	2025-04-17 00:00:00	Setor	400000.00
52	36	2025-08-20 00:00:00	Tarik	29000000.00
53	34	2025-08-20 00:00:00	Setor	250000.00
54	31	2025-08-20 00:00:00	Setor	45000.00
55	35	2025-08-20 00:00:00	Setor	35000.00
56	35	2025-08-20 00:00:00	Tarik	35000.00
57	38	2025-08-20 00:00:00	Setor	50000000.00
\.


--
-- Name: anggota_auth_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.anggota_auth_id_seq', 5, true);


--
-- Name: anggota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.anggota_id_seq', 126, true);


--
-- Name: belanja_anggota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.belanja_anggota_id_seq', 37, true);


--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jadwal_angsuran_id_seq', 303, true);


--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jenis_pinjaman_id_seq', 5, true);


--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jenis_simpanan_id_seq', 6, true);


--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.jurnal_umum_id_seq', 360, true);


--
-- Name: kas_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kas_bank_id_seq', 1, false);


--
-- Name: kode_akun_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.kode_akun_id_seq', 1, false);


--
-- Name: konfigurasi_poin_sukarela_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.konfigurasi_poin_sukarela_id_seq', 10, true);


--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.konfigurasi_shu_id_seq', 8, true);


--
-- Name: pengurus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.pengurus_id_seq', 1, true);


--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.periode_akuntansi_id_seq', 1, true);


--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rekening_pinjaman_id_seq', 27, true);


--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rekening_simpanan_id_seq', 39, true);


--
-- Name: shu_pemerataan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shu_pemerataan_id_seq', 30, true);


--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transaksi_simpanan_id_seq', 57, true);


--
-- Name: anggota_auth anggota_auth_anggota_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_anggota_id_key UNIQUE (anggota_id);


--
-- Name: anggota_auth anggota_auth_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_pkey PRIMARY KEY (id);


--
-- Name: anggota_auth anggota_auth_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_username_key UNIQUE (username);


--
-- Name: anggota anggota_kode_anggota_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota
    ADD CONSTRAINT anggota_kode_anggota_key UNIQUE (kode_anggota);


--
-- Name: anggota anggota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota
    ADD CONSTRAINT anggota_pkey PRIMARY KEY (id);


--
-- Name: belanja_anggota belanja_anggota_anggota_id_periode_id_bulan_tahun_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_anggota_id_periode_id_bulan_tahun_key UNIQUE (anggota_id, periode_id, bulan, tahun);


--
-- Name: belanja_anggota belanja_anggota_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_pkey PRIMARY KEY (id);


--
-- Name: jadwal_angsuran jadwal_angsuran_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_angsuran
    ADD CONSTRAINT jadwal_angsuran_pkey PRIMARY KEY (id);


--
-- Name: jenis_pinjaman jenis_pinjaman_nama_jenis_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_pinjaman
    ADD CONSTRAINT jenis_pinjaman_nama_jenis_key UNIQUE (nama_jenis);


--
-- Name: jenis_pinjaman jenis_pinjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_pinjaman
    ADD CONSTRAINT jenis_pinjaman_pkey PRIMARY KEY (id);


--
-- Name: jenis_simpanan jenis_simpanan_nama_jenis_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_nama_jenis_key UNIQUE (nama_jenis);


--
-- Name: jenis_simpanan jenis_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_pkey PRIMARY KEY (id);


--
-- Name: jurnal_umum jurnal_umum_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT jurnal_umum_pkey PRIMARY KEY (id);


--
-- Name: kas_bank kas_bank_nama_akun_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_nama_akun_key UNIQUE (nama_akun);


--
-- Name: kas_bank kas_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_pkey PRIMARY KEY (id);


--
-- Name: kode_akun kode_akun_kode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kode_akun
    ADD CONSTRAINT kode_akun_kode_key UNIQUE (kode);


--
-- Name: kode_akun kode_akun_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kode_akun
    ADD CONSTRAINT kode_akun_pkey PRIMARY KEY (id);


--
-- Name: konfigurasi_poin_sukarela konfigurasi_poin_sukarela_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.konfigurasi_poin_sukarela
    ADD CONSTRAINT konfigurasi_poin_sukarela_pkey PRIMARY KEY (id);


--
-- Name: konfigurasi_shu konfigurasi_shu_kunci_konfigurasi_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.konfigurasi_shu
    ADD CONSTRAINT konfigurasi_shu_kunci_konfigurasi_key UNIQUE (kunci_konfigurasi);


--
-- Name: konfigurasi_shu konfigurasi_shu_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.konfigurasi_shu
    ADD CONSTRAINT konfigurasi_shu_pkey PRIMARY KEY (id);


--
-- Name: pengurus pengurus_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pengurus
    ADD CONSTRAINT pengurus_pkey PRIMARY KEY (id);


--
-- Name: pengurus pengurus_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pengurus
    ADD CONSTRAINT pengurus_username_key UNIQUE (username);


--
-- Name: periode_akuntansi periode_akuntansi_nama_periode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periode_akuntansi
    ADD CONSTRAINT periode_akuntansi_nama_periode_key UNIQUE (nama_periode);


--
-- Name: periode_akuntansi periode_akuntansi_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.periode_akuntansi
    ADD CONSTRAINT periode_akuntansi_pkey PRIMARY KEY (id);


--
-- Name: rekening_pinjaman rekening_pinjaman_no_pinjaman_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_no_pinjaman_key UNIQUE (no_pinjaman);


--
-- Name: rekening_pinjaman rekening_pinjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_pkey PRIMARY KEY (id);


--
-- Name: rekening_simpanan rekening_simpanan_no_rekening_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_no_rekening_key UNIQUE (no_rekening);


--
-- Name: rekening_simpanan rekening_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_pkey PRIMARY KEY (id);


--
-- Name: shu_pemerataan shu_pemerataan_anggota_id_periode_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_anggota_id_periode_id_key UNIQUE (anggota_id, periode_id);


--
-- Name: shu_pemerataan shu_pemerataan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_pkey PRIMARY KEY (id);


--
-- Name: transaksi_simpanan transaksi_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_pkey PRIMARY KEY (id);


--
-- Name: anggota_auth anggota_auth_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.anggota_auth
    ADD CONSTRAINT anggota_auth_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id) ON DELETE CASCADE;


--
-- Name: belanja_anggota belanja_anggota_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: belanja_anggota belanja_anggota_periode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.belanja_anggota
    ADD CONSTRAINT belanja_anggota_periode_id_fkey FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id);


--
-- Name: jurnal_umum fk_periode; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT fk_periode FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id);


--
-- Name: jadwal_angsuran jadwal_angsuran_rekening_pinjaman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jadwal_angsuran
    ADD CONSTRAINT jadwal_angsuran_rekening_pinjaman_id_fkey FOREIGN KEY (rekening_pinjaman_id) REFERENCES public.rekening_pinjaman(id) ON DELETE CASCADE;


--
-- Name: jenis_simpanan jenis_simpanan_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jenis_simpanan
    ADD CONSTRAINT jenis_simpanan_akun_id_fkey FOREIGN KEY (akun_id) REFERENCES public.kode_akun(id);


--
-- Name: jurnal_umum jurnal_umum_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.jurnal_umum
    ADD CONSTRAINT jurnal_umum_akun_id_fkey FOREIGN KEY (akun_id) REFERENCES public.kode_akun(id);


--
-- Name: kas_bank kas_bank_kode_akun_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kas_bank
    ADD CONSTRAINT kas_bank_kode_akun_id_fkey FOREIGN KEY (kode_akun_id) REFERENCES public.kode_akun(id);


--
-- Name: rekening_pinjaman rekening_pinjaman_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: rekening_pinjaman rekening_pinjaman_jenis_pinjaman_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_jenis_pinjaman_id_fkey FOREIGN KEY (jenis_pinjaman_id) REFERENCES public.jenis_pinjaman(id);


--
-- Name: rekening_simpanan rekening_simpanan_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: shu_pemerataan shu_pemerataan_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id) ON DELETE CASCADE;


--
-- Name: shu_pemerataan shu_pemerataan_periode_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shu_pemerataan
    ADD CONSTRAINT shu_pemerataan_periode_id_fkey FOREIGN KEY (periode_id) REFERENCES public.periode_akuntansi(id) ON DELETE CASCADE;


--
-- Name: transaksi_simpanan transaksi_simpanan_rekening_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_rekening_id_fkey FOREIGN KEY (rekening_id) REFERENCES public.rekening_simpanan(id);


--
-- PostgreSQL database dump complete
--

