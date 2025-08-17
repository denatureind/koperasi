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
-- Name: konfigurasi_shu; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.konfigurasi_shu (
    id integer NOT NULL,
    nama_konfigurasi character varying(100) NOT NULL,
    kunci_konfigurasi character varying(50) NOT NULL,
    nilai numeric(5,2) NOT NULL,
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
    sisa_pokok numeric(15,2)
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
-- Name: kode_akun id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.kode_akun ALTER COLUMN id SET DEFAULT nextval('public.kode_akun_id_seq'::regclass);


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
-- Name: transaksi_simpanan id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan ALTER COLUMN id SET DEFAULT nextval('public.transaksi_simpanan_id_seq'::regclass);


--
-- Data for Name: anggota; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: jadwal_angsuran; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jadwal_angsuran (id, rekening_pinjaman_id, angsuran_ke, tgl_jatuh_tempo, jumlah_angsuran_pokok, jumlah_angsuran_jasa, status_pembayaran, pokok_dibayar, jasa_dibayar, tgl_pembayaran) FROM stdin;
81	9	3	2025-11-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
102	11	2	2025-10-08	50000.00	5000.00	lunas	50000.00	5000.00	\N
128	13	8	2025-10-12	3750000.00	450000.00	belum_bayar	0.00	0.00	\N
129	13	9	2025-11-12	3750000.00	450000.00	belum_bayar	0.00	0.00	\N
130	13	10	2025-12-12	3750000.00	450000.00	belum_bayar	0.00	0.00	\N
131	13	11	2026-01-12	3750000.00	450000.00	belum_bayar	0.00	0.00	\N
132	13	12	2026-02-12	3750000.00	450000.00	belum_bayar	0.00	0.00	\N
137	15	5	2026-01-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
138	15	6	2026-02-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
139	15	7	2026-03-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
140	15	8	2026-04-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
141	15	9	2026-05-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
142	15	10	2026-06-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
143	15	11	2026-07-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
144	15	12	2026-08-13	104166.67	12500.00	belum_bayar	0.00	0.00	\N
83	9	5	2026-01-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
84	9	6	2026-02-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
85	9	7	2026-03-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
86	9	8	2026-04-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
87	9	9	2026-05-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
88	9	10	2026-06-07	40000.00	4000.00	belum_bayar	0.00	0.00	\N
79	9	1	2025-09-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
91	10	3	2025-11-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
92	10	4	2025-12-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
93	10	5	2026-01-07	100000.00	12000.00	belum_bayar	0.00	0.00	\N
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
104	11	4	2025-12-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
105	11	5	2026-01-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
106	11	6	2026-02-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
107	11	7	2026-03-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
108	11	8	2026-04-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
109	11	9	2026-05-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
110	11	10	2026-06-08	50000.00	5000.00	belum_bayar	0.00	0.00	\N
101	11	1	2025-09-08	50000.00	5000.00	lunas	50000.00	5000.00	\N
80	9	2	2025-10-07	40000.00	4000.00	lunas	40000.00	4000.00	\N
89	10	1	2025-09-07	100000.00	12000.00	lunas	100000.00	12000.00	\N
90	10	2	2025-10-07	100000.00	12000.00	lunas	100000.00	12000.00	\N
116	12	6	2025-12-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
117	12	7	2026-01-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
118	12	8	2026-02-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
119	12	9	2026-03-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
120	12	10	2026-04-01	20000000.00	2000000.00	belum_bayar	0.00	0.00	\N
111	12	1	2025-07-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	\N
112	12	2	2025-08-01	20000000.00	2000000.00	lunas	20000000.00	2000000.00	\N
\.


--
-- Data for Name: jenis_pinjaman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jenis_pinjaman (id, nama_jenis, tingkat_jasa_persen, deskripsi) FROM stdin;
1	Pinjaman Reguler	1.00	Pinjaman umum untuk anggota
2	Pinjaman Sementara	1.50	Pinjaman jangka pendek dengan bunga sedikit lebih tinggi
3	BON Karyawan	0.50	Pinjaman khusus untuk karyawan internal
\.


--
-- Data for Name: jenis_simpanan; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: jurnal_umum; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Data for Name: kode_akun; Type: TABLE DATA; Schema: public; Owner: postgres
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
-- Data for Name: konfigurasi_shu; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.konfigurasi_shu (id, nama_konfigurasi, kunci_konfigurasi, nilai, deskripsi) FROM stdin;
1	Pra-alokasi Jasa Peminjam (%)	alokasi_jasa_peminjam_persen	10.00	Persentase dari Jasa Simpan Pinjam yang dikembalikan langsung ke peminjam.
2	Distribusi SHU untuk Anggota (%)	distribusi_anggota_persen	50.00	Persentase dari Saldo Laba yang dialokasikan untuk anggota.
3	Distribusi SHU untuk Cadangan (%)	distribusi_cadangan_persen	5.00	Persentase dari Saldo Laba yang disimpan sebagai dana cadangan.
4	Distribusi SHU untuk Dana Sosial (%)	distribusi_sosial_persen	5.00	Persentase dari Saldo Laba untuk dana sosial.
5	Distribusi SHU untuk Pengurus (%)	distribusi_pengurus_persen	40.00	Persentase dari Saldo Laba untuk pengurus.
\.


--
-- Data for Name: pengurus; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pengurus (id, nama_lengkap, username, password, role, created_at) FROM stdin;
1	Admin Utama	admin	$2b$10$TuroRm3jkbXZdMxEi.ot5u/eEWpVETfbbLdS52M0jxT4RQtb0kdnS	pengurus	2025-08-07 23:11:13.973822+07
\.


--
-- Data for Name: periode_akuntansi; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.periode_akuntansi (id, nama_periode, tgl_mulai, tgl_selesai, status) FROM stdin;
1	Tahun Buku 2025	2025-01-01	2025-12-31	open
\.


--
-- Data for Name: rekening_pinjaman; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rekening_pinjaman (id, anggota_id, no_pinjaman, jumlah_pinjaman, tenor, tingkat_jasa_persen, status, tgl_pencairan, created_at, sisa_pokok) FROM stdin;
10	5	PIN-0005-310600	1200000.00	12	1.00	aktif	2025-08-07	2025-08-07 22:58:30.633635	1000000.00
9	7	PIN-0007-687314	400000.00	10	1.00	aktif	2025-08-07	2025-08-07 22:48:07.314468	240000.00
12	6	PIN-0006-917682	200000000.00	10	1.00	aktif	2025-06-01	2025-08-09 18:28:37.735877	100000000.00
11	7	PIN-0007-524778	500000.00	10	1.00	aktif	2025-08-08	2025-08-08 13:45:24.779463	350000.00
13	14	PIN-0014-848280	45000000.00	12	1.00	aktif	2025-02-12	2025-08-12 09:30:48.327176	18750000.00
15	12	PIN-0012-845095	1250000.00	12	1.00	aktif	2025-08-13	2025-08-13 11:20:45.137315	833333.32
\.


--
-- Data for Name: rekening_simpanan; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rekening_simpanan (id, anggota_id, jenis_simpanan, no_rekening, saldo, created_at) FROM stdin;
21	5	Pokok	PO-0005	50000.00	2025-08-07 22:57:25.22918
26	6	Wajib	WA-0006	50000000.00	2025-08-08 21:37:24.798168
34	14	Qurban	QU-0014-7057	0.00	2025-08-11 22:51:27.058468
32	5	Lebaran	LE-0005	50000.00	2025-08-11 09:10:30.961279
33	5	Qurban	QU-0005	1650000.00	2025-08-11 09:10:43.371395
20	4	Sukarela	SU-0004	100000.00	2025-08-07 22:47:43.989143
19	7	Wajib	WA-0007	620000.00	2025-08-07 22:46:56.989211
22	5	Wajib	WA-0005	3000000.00	2025-08-08 13:44:35.873201
23	8	Pokok	PO-0008	10000.00	2025-08-08 13:51:00.083752
24	8	Wajib	WA-0008	150000.00	2025-08-08 13:51:05.220094
25	9	Sukarela	SU-0009	250000000.00	2025-08-08 21:36:42.761725
27	7	Sukarela	SU-0007	2500000.00	2025-08-09 16:58:26.947985
28	12	Pokok	PO-0012	25000000.00	2025-08-10 19:33:56.176063
29	12	Wajib	WA-0012	150000.00	2025-08-10 19:49:04.141987
31	14	Wajib	WA-0014	0.00	2025-08-10 23:49:33.306532
30	14	Pokok	PO-0014	250000.00	2025-08-10 23:49:29.260479
\.


--
-- Data for Name: transaksi_simpanan; Type: TABLE DATA; Schema: public; Owner: postgres
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
\.


--
-- Name: anggota_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.anggota_id_seq', 15, true);


--
-- Name: jadwal_angsuran_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jadwal_angsuran_id_seq', 144, true);


--
-- Name: jenis_pinjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jenis_pinjaman_id_seq', 3, true);


--
-- Name: jenis_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jenis_simpanan_id_seq', 6, true);


--
-- Name: jurnal_umum_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jurnal_umum_id_seq', 178, true);


--
-- Name: kode_akun_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kode_akun_id_seq', 1, false);


--
-- Name: konfigurasi_shu_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.konfigurasi_shu_id_seq', 5, true);


--
-- Name: pengurus_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pengurus_id_seq', 1, true);


--
-- Name: periode_akuntansi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.periode_akuntansi_id_seq', 1, true);


--
-- Name: rekening_pinjaman_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rekening_pinjaman_id_seq', 15, true);


--
-- Name: rekening_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rekening_simpanan_id_seq', 34, true);


--
-- Name: transaksi_simpanan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaksi_simpanan_id_seq', 40, true);


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
-- Name: transaksi_simpanan transaksi_simpanan_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_pkey PRIMARY KEY (id);


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
-- Name: rekening_pinjaman rekening_pinjaman_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_pinjaman
    ADD CONSTRAINT rekening_pinjaman_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: rekening_simpanan rekening_simpanan_anggota_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rekening_simpanan
    ADD CONSTRAINT rekening_simpanan_anggota_id_fkey FOREIGN KEY (anggota_id) REFERENCES public.anggota(id);


--
-- Name: transaksi_simpanan transaksi_simpanan_rekening_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaksi_simpanan
    ADD CONSTRAINT transaksi_simpanan_rekening_id_fkey FOREIGN KEY (rekening_id) REFERENCES public.rekening_simpanan(id);


--
-- PostgreSQL database dump complete
--

