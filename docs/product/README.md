# PAGARMIK Platform Blueprint

Status: draft arsitektur produk, 5 November 2026.
Ruang lingkup: reposisi PAGARMIK dari basis rujukan regulasi RMIK menjadi platform
operasi hukum Indonesia yang modern (matter, intake, drafting, CLM, billing,
portal klien, AI research ber-sitasi).

## Positioning (penting)

PAGARMIK **bukan** platform hukum umum. PAGARMIK adalah platform hukum
**vertikal sektor kesehatan**: basis data peraturan perundang-undangan dan
instrumen kepatuhan **rekam medis, informasi kesehatan, dan pelindungan data
pribadi di fasilitas pelayanan kesehatan**.

Konsekuensi desain:
1. Domain inti tetap RMIK, informasi kesehatan, fasilitas pelayanan kesehatan,
   dan PDP. Ini keunggulan bersaing terhadap platform hukum horizontal.
2. Lapisan operasi firma (matter, intake, drafting, CLM, billing, portal,
   analytics) dibangun untuk **praktik hukum kesehatan**: sengketa medis,
   kepatuhan fasyankes (RS, Puskesmas, klinik, lab, apotek), perizinan, audit
   RME, tata kelola data pasien, dan sengketa PDP.
3. Matter type, template dokumen, clause library, dan playbook diarahkan ke
   kebutuhan sektor kesehatan, bukan daftar praktik hukum umum.
4. AI dan knowledge base bersumber primer pada regulasi kesehatan dan PDP
   Indonesia, dengan sumber lintas sektor (ANRI, BSSN, Kominfo, BPJS, OJK,
   BPOM, BAPETEN) sebagai konteks pendukung — sesuai direktori yang sudah
   disusun.

## Catatan reposisi

PAGARMIK saat ini adalah aplikasi Next.js 14 (App Router) dengan basis data
JSON (`prisma/seed.json`): katalog regulasi kesehatan, pasal, relasi hukum,
artikel, dan AI research berbasis RAG. Repositori ini menjadi **modul
`legal-research`** di dalam platform baru, dan **domain inti PAGARMIK tetap
RMIK/ kesehatan/PDP** — bukan dilepas.

Yang dipertahankan:
- Mesin sitasi dan validasi sumber (`src/lib/citation/validator.ts`).
- Pipeline RAG (`src/lib/rag/pipeline.ts`), pencarian hybrid, tokenizer.
- Gate verifikasi relasi (`src/lib/data/relationship-graph.ts`).
- Design system dan shell aplikasi (`docs/design/PAGARMIK_DESIGN_SYSTEM.md`).

Yang ditambah: modul operasi firma (intake, matter, dokumen, kontrak, billing,
portal klien, knowledge, analytics) dan tata kelola AI multi-tenant.

Referensi standar yang diadopsi: Clio (matter, intake, billing, portal),
Harvey (AI research/drafting/review, cited answers), CoCounsel (citation
validation, document analysis), Lexis+ Protégé (workroom per perkara, vault,
citation check), Filevine (workflow litigasi, deadline otomatis), Smokeball
(otomasi dokumen, integrasi Word), Checkbox/Onit/Xakia (intake, self-service,
CLM, approval, compliance, reporting), dan AIlex Hukumonline (tema visual,
keterhubungan antarmodul, riset hukum ber-sitasi).

## Benchmark praktik dunia → adopsi PAGARMIK

| Praktik dunia | Adopsi ke PAGARMIK | Diterapkan di |
|---|---|---|
| Matter-centered workflow | Semua dokumen, tugas, tagihan, dan komunikasi terikat pada satu Perkara/Matter | Modul Matter (doc 02 M4, doc 03 skema `Matter`) |
| Cited legal AI | Setiap jawaban AI wajib menampilkan sumber hukum dan status berlakunya | Modul Riset (doc 02 M7/M10, doc 04 prompt riset) |
| Automated intake | Formulir memicu conflict check, routing, dan pembukaan matter otomatis | Modul Intake (doc 03 WF-1) |
| Document automation | Template mengambil data dari matter dan menghasilkan draf yang direview advokat | Modul Drafting (doc 03 WF-3) |
| Secure collaboration | Workroom/vault per perkara dengan kontrol akses dan audit trail | Modul Dokumen + Portal (doc 03 skema, doc 05 keamanan) |
| Legal operations | Dashboard untuk SLA, backlog, utilization, revenue, risiko, produktivitas | Modul Analytics (doc 02 US-10, doc 05 KPI) |

Sumber praktik acuan: Xakia, LexisNexis, Zenphi, Taskade, Clio, Harvey,
CoCounsel, Filevine, Smokeball, Checkbox/Onit. Daftar ini adalah benchmark
industri, bukan sitasi hukum.

## Isi dokumen

| Dokumen | Isi |
|---|---|
| [01-visi-persona-journey.md](01-visi-persona-journey.md) | Visi produk, prinsip, persona, pain point, user journey |
| [02-arsitektur-informasi-backlog.md](02-arsitektur-informasi-backlog.md) | IA & sitemap, backlog MoSCoW, user story + acceptance criteria |
| [03-workflow-skema-data.md](03-workflow-skema-data.md) | Workflow bisnis tekstual, skema data inti |
| [04-ai-governance-prompt.md](04-ai-governance-prompt.md) | Tata kelola AI, prompt template riset/drafting/review/ringkasan |
| [05-keamanan-roadmap-risiko.md](05-keamanan-roadmap-risiko.md) | Keamanan & kepatuhan Indonesia, roadmap, risiko + mitigasi |

## Batas tanggung jawab

PAGARMIK adalah alat bantu kerja hukum. PAGARMIK **bukan** advokat dan tidak
menggantikan penilaian advokat. Setiap keluaran AI bersifat draf yang wajib
diverifikasi manusia sebelum dipakai sebagai nasihat hukum atau diajukan ke
pengadilan.

## Prinsip non-negosiabel

1. Citation-first: tidak ada klaim hukum tanpa sumber yang dapat diverifikasi.
2. Human-in-the-loop untuk setiap keluaran hukum material.
3. Jurisdiction-aware: hukum Indonesia sebagai default.
4. Data segregation per klien dan per matter.
5. Auditability: setiap akses, perubahan, ekspor, dan keputusan AI tercatat.
6. Kepatuhan UU PDP (UU 27/2022 dan peraturan pelaksananya).
