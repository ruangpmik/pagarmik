# 05 · Keamanan, Kepatuhan Indonesia, Arsitektur, Roadmap, Risiko

## 1. Keamanan dan kepatuhan Indonesia

### 1.1 Regulasi acuan (domain vertikal kesehatan + PDP)

| Area | Regulasi acuan | Implikasi pada PAGARMIK |
|---|---|---|
| Pelindungan data pribadi | UU 27/2022 (UU PDP); PP 33/2026 (peraturan pelaksanaan UU PDP, berlaku 16 Jan 2027) | Dasar pemrosesan, hak subjek data, pemberitahuan insiden, DPO, transfer lintas batas |
| Rekam medis & informasi kesehatan | UU 17/2023 (Kesehatan), PP 28/2024, Permenkes 24/2022 (RME) | Kerahasiaan rekam medis; data pasien = data pribadi spesifik |
| Informasi & transaksi elektronik | UU 11/2008, UU 19/2016, UU 1/2024 (ITE); PP 71/2019 (PSTE) | Dokumen/TTE sah; kewajiban PSE; penempatan data center/DRC di Indonesia untuk PSE lingkup publik |
| Pendaftaran sistem elektronik | Permenkominfo 5/2020 jo. 10/2021 (PSE Lingkup Privat) | Pendaftaran PSE bila menyelenggarakan sistem elektronik untuk publik |
| Keamanan siber | Perpres 82/2022 (IIV); Peraturan BSSN 7/2023, 8/2023, 1/2024, 8/2020, 4/2021 | Sektor kesehatan sebagai IIV; SMPI (ISO 27001); CSIRT; pelaporan insiden |
| Kearsipan | UU 43/2009, PP 28/2012, Peraturan ANRI 6/2021; Perka ANRI 16/2016 | Retensi & preservasi arsip elektronik; JRA urusan kesehatan |
| Tanda tangan elektronik | UU ITE; PSrE/BSrE | TTE tersertifikasi untuk dokumen material |
| Profesi advokat | UU 18/2003; Kode Etik Advokat | Kerahasiaan hubungan advokat–klien; konflik kepentingan; simpan rahasia |
| Standar keamanan | ISO/IEC 27001, ISO 27017/27018 (cloud) | Kerangka kontrol, sertifikasi opsional |

### 1.2 Kebutuhan keamanan (wajib sebelum produksi)

- **Identitas & akses:** RBAC 6 peran, MFA wajib staf, SSO (SAML/OIDC),
  prinsip least privilege, review akses berkala.
- **Isolasi data:** multi-tenant dengan row-level security; penyaringan wajib
  per `organizationId`, `clientId`, `matterId`; uji akses lintas-tenant.
- **Enkripsi:** at-rest (AES-256) dan in-transit (TLS 1.3); manajemen kunci
  terpisah; kolom sensitif (KTP/NPWP/identitas pasien) terenkripsi.
- **Audit log:** append-only, berantai (hash chain), merekam prompt, dokumen,
  akses, perubahan, ekspor, keputusan AI, login.
- **Retensi & penghapusan:** kebijakan retensi per jenis data; penghapusan
  aman sesuai permintaan subjek data (hak atas penghapusan UU PDP).
- **DPA:** perjanjian pemrosesan data dengan sub-prosesor (penyedia model,
  cloud, e-mail, WhatsApp Business).
- **Backup & DR:** RPO ≤ 1 jam, RTO ≤ 4 jam; uji pemulihan berkala; lokasi
  sesuai kewajiban penempatan data.
- **Observability:** logging terpusat, alerting, deteksi anomali, SIEM.
- **Lingkungan:** staging terpisah; larangan data produksi di dev.
- **Guardrail AI:** lihat doc 04; larangan pelatihan model dari data klien
  tanpa persetujuan eksplisit.
- **Pemberitahuan insiden:** sesuai UU PDP (batas waktu pemberitahuan ke
  subjek data dan otoritas) dan pelaporan ke BSSN bila relevan IIV.

### 1.3 Kontrol khusus data pasien

1. Rekam medis diakses hanya oleh peran berwenang pada matter terkait.
2. Pencarian AI menyaring data pasien dari konteks yang tidak relevan.
3. Setiap ekspor rekam medis wajib alasan + audit.
4. Mode lokal/on-premise untuk firma yang menuntut data tidak keluar fasilitas.

---

## 2. Arsitektur teknis

- **Pola:** modular monolith (monorepo) untuk MVP → ekstraksi ke microservices
  untuk modul berat (AI, OCR, billing, notifikasi) saat skala naik.
- **Backend:** API-first (REST/tRPC), event-driven (message broker) untuk
  workflow (intake, deadline, approval, notifikasi).
- **Data:** PostgreSQL + Prisma (menggantikan JSON store lama untuk modul
  operasi); JSON store tetap untuk seed `legal-research`.
- **Pencarian:** pencarian teks + vektor untuk pencarian semantik internal
  (knowledge base, precedent).
- **AI/RAG:** pipeline retrieval + citation validation; dukung mode cloud dan
  mode lokal/on-premise.
- **Dokumen:** OCR + NER + document intelligence; penyimpanan objek terenkripsi.
- **Frontend:** web (Next.js App Router) + mobile (klien & advokat). Tema dan
  keterhubungan antarmodul mengikuti arahan AIlex Hukumonline (grup navigasi
  Pro/Solusi/Wawasan, pencarian bercakupan, tautan silang antarmodul).
- **Integrasi:** WhatsApp Business API, e-mail, Google/Microsoft Calendar,
  e-signature (PSrE/BSrE), payment gateway, penyimpanan cloud.
- **Observability & DR:** lihat 1.2.

---

## 3. Roadmap

### Fase 1 — MVP (0–3 bulan)

Sasaran: satu firma dapat menjalankan perkara kesehatan dari intake sampai
riset ber-sitasi.

- Autentikasi + RBAC + MFA; organisasi & pengguna.
- Intake dinamis + conflict check + routing + acknowledgment.
- Matter management + task + deadline engine + kalender.
- Vault dokumen + OCR + klasifikasi.
- Riset AI citation-first (memakai mesin sitasi + RAG lama yang diperkuat).
- Portal klien (status, unggah, pesan).
- Audit log menyeluruh.
- Modul `legal-research` lama diintegrasikan sebagai tab riset/matter.

KPI MVP: acknowledgment < 5 mnt; ketepatan deadline ≥ 98%; output AI
tervalidasi ≥ 70%; 0 insiden kritikal.

### Fase 2 — Growth (3–6 bulan)

- Document automation dari template (surat kuasa, somasi, gugatan, jawaban,
  MOU, NDA, legal opinion) + versioning/redlining/approval + integrasi Word.
- CLM: intake permintaan, risk scoring, clause library + playbook, approval
  matrix, e-signature.
- Billing: time capture, rate card, invoice, trust accounting.
- Knowledge management + pencarian semantik.
- Analytics: utilization, WIP, receivable, win/loss, SLA, backlog.

KPI Growth: waktu dokumen < 5 mnt; output AI tervalidasi ≥ 85%; NPS ≥ 50.

### Fase 3 — Enterprise (6–12 bulan)

- Workflow builder tanpa kode.
- AI agents terbatas (riset, review, drafting otonom dengan supervisi).
- Integrasi korporasi (ERP/HRIS/procurement) & multi-entity.
- Advanced compliance & pelaporan otomatis (PDP, IIV).
- Mode on-premise/VPC untuk firma dan fasyankes besar.

---

## 4. Risiko dan mitigasi

### Risiko produk

| Risiko | Dampak | Mitigasi |
|---|---|---|
| AI keliru/halusinasi hukum | Tinggi | Citation-first, validasi sitasi, human-in-the-loop, disklaimer |
| Adopsi rendah (perubahan kebiasaan) | Sedang | Onboarding, template siap pakai, impor data, nilai cepat (riset) |
| Scope melebar (jadi platform umum) | Sedang | Batasi domain ke kesehatan/PDP (lihat README Positioning) |
| Kualitas data awal | Sedang | Verifikasi sumber, gate relasi, tandai data parsial |
| Ketergantungan penyedia model | Sedang | Abstraksi penyedia, dukungan mode lokal |

### Risiko hukum

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kebocoran data klien/pasien | Sangat tinggi | Isolasi, enkripsi, audit, uji akses, DPA |
| Pelanggaran UU PDP | Tinggi | Dasar pemrosesan, hak subjek data, pemberitahuan insiden, DPO |
| Nasihat hukum tanpa advokat | Tinggi | AI = draf; disklaimer; pembatasan keluaran |
| Pelatihan model dari data klien | Tinggi | No-training-by-default + persetujuan eksplisit |
| Konflik kepentingan tak terdeteksi | Tinggi | Conflict check wajib + override beralasan + audit |
| Ketidakpatuhan PSE/penempatan data | Sedang | Pendaftaran PSE, penempatan data sesuai aturan |

### Risiko operasional

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Tenggat terlewat | Tinggi | Deadline engine + reminder berjenjang + escalation |
| Kehilangan data (bencana) | Tinggi | Backup + DR teruji (RPO/RTO) |
| Penyalahgunaan akses internal | Tinggi | Least privilege, MFA, audit, deteksi anomali |
| Tagihan/trust tidak akurat | Sedang | Pencatatan yang dapat diaudit; trust terpisah |
| Kualitas draf AI rendah | Sedang | Review advokat wajib; playbook & precedent |
| Beban operasional dukungan | Sedang | Dokumentasi, self-service, onboarding terstruktur |

---

## 5. Rekomendasi langkah berikutnya

1. Tetapkan keputusan: repositori lama menjadi modul `legal-research`, domain
   inti tetap kesehatan/PDP.
2. Pilih irisan MVP (mis. Intake + Matter + Riset ber-sitasi) dan bangun di atas
   shell + design system yang ada.
3. Siapkan PostgreSQL + Prisma dan skema (doc 03) sebagai fondasi multi-tenant.
4. Pasang audit log dan guardrail AI sejak MVP, bukan setelahnya.
5. Uji kepatuhan (akses lintas-tenant, enkripsi, retensi) sebelum pilot.
