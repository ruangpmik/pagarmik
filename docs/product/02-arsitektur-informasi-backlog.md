# 02 · Arsitektur Informasi, Backlog MoSCoW, dan User Story

## 1. Information Architecture

Platform dibagi menjadi tiga permukaan (surfaces) dengan navigasi yang saling
terhubung — mengikuti pola "modul bertaut" AIlex Hukumonline (grup Pro /
Solusi / Wawasan, pencarian bercakupan, dan tautan silang antarmodul):

- **Firm Workspace** (advokat, paralegal, manajemen): operasi firma.
- **Client Portal** (klien individu/korporasi): transparansi dan kolaborasi.
- **Knowledge & Research** (semua peran internal): riset dan aset pengetahuan.

### Peta modul dan keterhubungan

```
Intake & CRM ──(konversi)──▶ Matter ──┬──▶ Dokumen ──▶ Drafting/CLM ──▶ E-sign
      ▲                                ├──▶ Task & Deadline ──▶ Kalender
      │                                ├──▶ Riset AI ──▶ Knowledge ──▶ Drafting
   Client Portal ◀──(status/notifikasi)┘├──▶ Billing & Trust ──▶ Analytics
                                        └──▶ Audit Log
```

Aturan keterhubungan (setiap modul selalu menautkan ke konteksnya):
1. Dari **Matter** selalu dapat menuju: dokumen, task, deadline, riset, tagihan,
   komunikasi klien, audit.
2. Dari **Dokumen/Kontrak** selalu dapat menuju: matter asal, clause library,
   hasil review AI, versi sebelumnya, pihak penandatangan.
3. Dari **Keluaran AI** selalu dapat menuju: sumber primer, status keberlakuan,
   matter tempat ia dipakai, dan jejak verifikasi manusia.
4. Setiap **riset** dapat dipromosikan menjadi **knowledge asset** firma.
5. Setiap entitas menampilkan **breadcrumb klien › matter › objek** agar tidak
   ada data yatim.

## 2. Fokus domain (vertikal kesehatan)

Seluruh modul diarahkan ke praktik hukum sektor kesehatan. Matter type utama:
sengketa medis/malpraktik, kepatuhan fasyankes (RS/Puskesmas/klinik/lab/apotek),
perizinan & akreditasi, audit dan tata kelola RME, pelindungan data pasien/PDP,
ketenagakerjaan tenaga kesehatan, kerja sama fasyankes–asuransi (JKN/BPJS dan
asuransi komersial), serta sengketa informasi publik terkait rekam medis.

Template, clause library, checklist, dan playbook mengikuti kebutuhan ini —
bukan daftar praktik hukum umum. Modul riset bersumber primer pada regulasi
kesehatan (UU 17/2023, PP 28/2024, Permenkes) dan PDP (UU 27/2022, PP 33/2026),
dengan sumber lintas sektor sebagai konteks pendukung.

## 3. Sitemap (rute aplikasi)

```
/                              # Dashboard per peran
/intake                        # Form intake publik/klien
/intake/[id]                   # Detail lead, konflik, routing
/matters                       # Daftar matter (filter: jenis, status, advokat)
/matters/[id]                  # Workroom matter (tab: ringkas, dokumen, task,
                               #   deadline, riset, tagihan, komunikasi, audit)
/matters/[id]/documents        # Vault dokumen matter
/documents                     # Semua dokumen (pencarian, klasifikasi)
/documents/[id]                # Viewer + versi + hasil review AI
/contracts                     # CLM: permintaan, draf, approval, arsip
/contracts/[id]                # Lifecycle kontrak
/contracts/clauses             # Clause library + playbook
/research                      # Riset AI (chat + cakupan sumber)
/research/[sessionId]          # Sesi riset tersimpan
/knowledge                     # Repository precedent, memo, template, checklist
/knowledge/[id]                # Aset pengetahuan
/deadlines                     # Deadline engine + kalender
/tasks                         # Task board
/billing                       # Waktu, WIP, invoice, trust
/billing/invoices/[id]         # Detail invoice
/analytics                     # Dashboard manajemen + laporan
/settings                      # Org, pengguna, role, integrasi, retensi
/settings/audit                # Audit log
/portal                        # (Klien) beranda
/portal/cases/[id]             # (Klien) status perkara, unggah, pesan, bayar
/portal/requests               # (Korporasi) permintaan legal
```

Dipertahankan dari repositori lama sebagai modul `legal-research`: `/regulasi`,
`/pasal`, `/bandingkan`, `/grafik`, `/timeline`, `/topik`, `/artikel`,
`/analisis-kasus`, `/ai`, dan `/legal-search`.

---

## 4. Feature Backlog (MoSCoW)

### MUST (MVP, 0–3 bulan)

| # | Fitur | Modul | Kriteria selesai |
|---|---|---|---|
| M1 | Autentikasi + RBAC + MFA | Admin | 6 peran, isolasi data, MFA wajib staf |
| M2 | Intake dinamis + acknowledgment < 5 mnt | Intake | Form per bidang, email/WA ack otomatis |
| M3 | Conflict check otomatis | Intake | Cek klien/lawan/pihak terkait + skor |
| M4 | Matter record terpusat | Matter | Klien, lawan, tim, status, audit trail |
| M5 | Vault dokumen + OCR + klasifikasi | Dokumen | Unggah, OCR, tipe terdeteksi, versi |
| M6 | Deadline engine + kalender | Deadline | Tenggat otomatis + reminder berjenjang |
| M7 | Riset AI citation-first | Riset | Sitasi primer, status, disclaimer |
| M8 | Portal klien (status/unggah/pesan) | Portal | Isolasi per klien, notifikasi |
| M9 | Audit log menyeluruh | Admin | Prompt, akses, perubahan, ekspor |
| M10 | Disklaimer & sitasi wajib di AI | Riset | Blokir output tanpa sumber |

### SHOULD (Growth, 3–6 bulan)

| # | Fitur | Modul |
|---|---|---|
| S1 | Document automation dari template | Drafting |
| S2 | Versioning + redlining + approval | Drafting |
| S3 | Integrasi Microsoft Word/Google Docs | Drafting |
| S4 | CLM: intake permintaan + risk scoring | CLM |
| S5 | Clause library + playbook negosiasi | CLM |
| S6 | Approval matrix + e-signature | CLM |
| S7 | Time capture otomatis | Billing |
| S8 | Rate card, invoice, trust accounting | Billing |
| S9 | Knowledge repository + pencarian semantik | Knowledge |
| S10 | Analytics: utilization, WIP, win/loss, SLA | Analytics |

### COULD (Enterprise, 6–12 bulan)

| # | Fitur | Modul |
|---|---|---|
| C1 | Workflow builder tanpa kode | Platform |
| C2 | AI agents (riset, review, drafting otonom terbatas) | AI |
| C3 | Integrasi korporasi (ERP, HRIS, procurement) | Integrasi |
| C4 | Advanced compliance & multi-entity | Kepatuhan |
| C5 | Pembelajaran preferensi firma (bukan data klien) | AI |

### WON'T (untuk sekarang)

| # | Fitur | Alasan |
|---|---|---|
| W1 | Nasihat hukum otomatis tanpa advokat | Melanggar batas profesi |
| W2 | Pelatihan model dari data klien default | Risiko kerahasiaan |
| W3 | Klaim hasil (menang perkara) tanpa bukti | Etika & kepercayaan |
| W4 | Marketplace advokat terbuka tanpa verifikasi | Risiko kualitas/etika |

---

## 5. User Story + Acceptance Criteria

Format: `Sebagai <peran>, saya ingin <tujuan> agar <manfaat>.`

### US-01 Intake dinamais (P1, MVP)
Sebagai calon klien, saya ingin mengisi formula pengajuan sesuai bidang hukum
agar saya tidak ditanya hal yang tidak relevan.
- AC1 Form berubah sesuai bidang (pidana/perdata/keluarga/kerja/korporasi/tanah).
- AC2 Wajib: identitas, kontak, uraian, dokumen (opsional), urgensi.
- AC3 Simpan draf; unggah maks 25 MB per file; tipe pdf/docx/jpg/png.
- AC4 Acknowledgment otomatis via email/WA < 5 menit berisi nomor tiket.
- AC5 Alur selesai ≤ 5 langkah; mobile-first.

### US-02 Conflict check (P2, MVP)
Sebagai admin/paralegal, saya ingin bulan konflik otomatis agar firma tidak
menerima perkara yang berkonflik.
- AC1 Sistem memeriksa klien, lawan, dan pihak terkait terhadap basis data.
- AC2 Keluaran: bersih / potensi konflik (dengan skor + pihak yang cocok).
- AC3 Wajib override manual dengan alasan + audit log bila dilanjutkan.
- AC4 Tidak dapat lanjut ke engagement tanpa hasil conflict check.

### US-03 Matter record (P1/P2, MVP)
Sebagai advokat, saya ingin satu matter record terpusat agar semua konteks
perkara berada di satu tempat.
- AC1 Memuat klien, lawan, jenis perkara, pengadilan, tim, status, biaya.
- AC2 Semua dokumen, task, deadline, riset, dan tagihan tertaut ke matter.
- AC3 Timeline mencatat setiap perubahan dengan pelaku dan waktu.
- AC4 Akses dibatasi tim matter; auditor dapat melihat tanpa mengubah.

### US-04 Deadline engine (P2, MVP)
Sebagai paralegal, saya ingin tenggat otomatis dan pengingat berjenjang agar
tidak ada tenggat terlewat.
- AC1 Tenggat dihitung dari aturan (mis. H-7, H-3, H-1, hari-H + kalender kerja).
- AC2 Notifikasi ke PIC, supervisor, dan (opsional) klien.
- AC3 Tampilan risiko: aman / mendekati / terlambat.
- AC4 Perubahan tenggat manual wajib beralasan + audit log.

### US-05 Riset AI citation-first (P1, MVP)
Sebagai advokat, saya ingin jawaban hukum dengan sitasi primer agar dapat
dipercaya dan diverifikasi.
- AC1 Setiap klaim menunjuk sumber: instrumen, pasal, tanggal berlaku, status.
- AC2 Bila sumber tidak cukup, sistem menjawab "dasar hukum primer tidak cukup".
- AC3 Ditampilkan disklaimer: bukan nasihat hukum final.
- AC4 Setiap sesi riset tersimpan dan dapat menjadi knowledge asset.
- AC5 Audit mencatat prompt, potongan sumber, dan verifikasi advokat.

### US-06 Portal klien (P3/P4, MVP)
Sebagai klien, saya ingin memantau status dan berkirim dokumen agar saya
tenang dan komunikasi terpusat.
- AC1 Klien hanya melihat data miliknya (isolasi ketat).
- AC2 Status berbahasa awam + lini masa + langkah berikutnya.
- AC3 Unggah dokumen aman; pesan terenkripsi; notifikasi.
- AC4 Jadwal konsultasi dan tautan pembayaran (bila aktif).

### US-07 Document automation (P1/P2, SHOULD)
Sebagai advokat, saya ingin membuat dokumen dari template terisi otomatis agar
hemat waktu dan konsisten.
- AC1 Template: surat kuasa, somasi, gugatan, jawaban, MOU, perjanjian, NDA,
  kontrak kerja, legal opinion, due diligence report.
- AC2 Isi otomatis dari data matter/klien/formulir; variabel wajib divalidasi.
- AC3 Versioning, redlining, approval, e-signature, arsip ke matter file.
- AC4 Ekspor ke Word/Google Docs.

### US-08 CLM (P4, SHOULD)
Sebagai tim legal korporasi, saya ingin siklus kontrak terkelola agar cepat,
patuh, dan rendah risiko.
- AC1 Intake permintaan → klasifikasi jenis & risiko → playbook.
- AC2 Clause library dengan fallback clause dan panduan negosiasi.
- AC3 Review AI menandai: klausul berisiko, kewajiban, tanggal, sanksi,
  yurisdiksi, kerahasiaan, IP, terminasi, force majeure.
- AC4 Approval matrix + e-signature + repository terversi.

### US-09 Billing & trust (P1/P5, SHOULD)
Sebagai partner/manajemen, saya ingin waktu dan tagihan terukur agar margin
dan kepatuhan keuangan terjaga.
- AC1 Time capture dari aktivitas; rate card (hourly/fixed/retainer/success).
- AC2 Invoice + payment link + trust accounting terpisah dari operasional.
- AC3 Laporan WIP dan receivable; dapat diaudit.
- AC4 Kepatuhan aturan advokat & pencatatan keuangan.

### US-10 Analytics (P5, SHOULD)
Sebagai manajemen, saya ingin dashboard operasional agar keputusan berbasis data.
- AC1 Metrik: jumlah matter, win/loss, waktu penyelesaian, utilization,
  revenue per praktik, SLA, backlog, risiko tenggat.
- AC2 Laporan dapat difilter (periode, praktik, advokat, klien).
- AC3 Ekspor untuk partner/klien korporasi.

### US-11 Knowledge management (P1, SHOULD)
Sebagai advokat, saya ingin repository precedent dan memo agar tidak mengulang
riset.
- AC1 Simpan precedent, memo, template, checklist, panduan firma.
- AC2 Pencarian semantik lintas aset; AI memakai knowledge internal sebagai
  konteks.
- AC3 Sistem membedakan hukum publik vs dokumen internal vs opini non-otoritatif.
- AC4 Tidak ada kebocoran antar-klien/antar-matter (isolasi + uji akses).

### US-12 Audit & ekspor kepatuhan (P6, MVP)
Sebagai admin, saya ingin audit log lengkap agar dapat membuktikan kepatuhan.
- AC1 Tercatat: prompt, dokumen, akses, perubahan, ekspor, keputusan AI.
- AC2 Log tidak dapat diubah; retensi dapat dikonfigurasi.
- AC3 Ekspor laporan kepatuhan (periode/peran/klien).
