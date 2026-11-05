# 03 · Workflow Bisnis dan Skema Data

## 1. Workflow bisnis (diagram tekstual)

Format tiap alur: Trigger → Aktor → Form/Input → SLA → Notifikasi →
Exception handling → Audit log.

### WF-1. Lead → Intake → Conflict Check → Consultation → Engagement → Matter

```
[Trigger] Lead masuk (web / WhatsApp / email / referral)
   │
   ▼
[Form Intake dinamis]  Aktor: Klien/Paralegal
   │  field: identitas, kontak, bidang hukum, uraian, urgensi,
   │         wilayah, bahasa, dokumen awal
   ▼
[Validasi & Duplikasi]  Sistem
   │  gagal ──▶ minta perbaikan (link aman, tanpa data sensitif di email)
   ▼
[Conflict Check otomatis]  Sistem + Admin
   │  bersih ──▶ lanjut
   │  potensi konflik ──▶ tahan + review manual (wajib alasan bila lanjut)
   ▼
[Acknowledgment otomatis]  Sistem
   │  SLA: < 5 menit; isi: nomor tiket, langkah berikut, kanal resmi
   ▼
[Routing]  Sistem
   │  berdasarkan bidang, wilayah, urgensi, bahasa, ketersediaan advokat
   ▼
[Consultation]  Advokat + Klien
   │  SLA: jadwal < 2 hari kerja
   ▼
[Engagement Letter]  Advokat
   │  e-signature; tarif & lingkup; konflik kepentingan ditandatangani
   ▼
[Retainer]  Keuangan
   │  pembayaran/link; trust account
   ▼
[Matter Dibuka]  Sistem
   │  Record matter, tim, akses, template dokumen, kalender tenggat
   ▼
[Audit Log]  setiap transisi tercatat: pelaku, waktu, before/after
```
Exception: lead spam/duplikat → arsip; konflik tinggi → tolak dengan alasan;
klien tidak menandatangani engagement dalam 30 hari → matter dibatalkan
(arsip, audit).

### WF-2. Dokumen masuk → OCR → klasifikasi → ekstraksi → review AI → validasi → arsip

```
[Trigger] Dokumen diunggah (portal / email-in / paralegal)
   ▼
[Virus scan + tipe & ukuran]  Sistem
   │  gagal ──▶ tolak dengan alasan (audit)
   ▼
[OCR]  Sistem (untuk scan/gambar)
   │  gagal OCR ──▶ tandai "perlu input manual" (escalate)
   ▼
[Klasifikasi]  Sistem
   │  tipe: kontrak, putusan, surat, KTP/akta, invoice, korespondensi, lainnya
   ▼
[Ekstraksi data]  Sistem (NER)
   │  pihak, tanggal, nilai, kewajiban, tenggat, pasal rujukan
   ▼
[Review AI]  Sistem
   │  klausul berisiko, anomali, kewajiban tersembunyi, tanggal kritis
   ▼
[Validasi advokat]  Advokat
   │  koreksi, tanda "terverifikasi", atau tolak temuan AI
   ▼
[Arsip ke Matter Vault]  Sistem
   │  versi, metadata, retensi, hak akses
   ▼
[Audit Log]  unggah, OCR, klasifikasi, temuan AI, validasi, retensi
```
Exception: dokumen sensitif tanpa izin akses → blokir; ekstraksi ragu →
status "butuh review" dan tidak dipakai otomatis.

### WF-3. Permintaan kontrak → intake → risk assessment → drafting → review → negosiasi → approval → e-sign → repository

```
[Trigger] Permintaan kontrak (self-service / email / procurement)
   ▼
[Intake Kontrak]  Pemohon
   │  jenis kontrak, pihak, nilai, durasi, yurisdiksi, sensitivitas
   ▼
[Risk Assessment]  Sistem
   │  skor risiko + playbook yang berlaku + approval tier
   ▼
[Drafting]  Drafter (advokat/paralegal) + AI
   │  dari clause library + data matter; fallback clause disarankan
   ▼
[Internal Review]  Partner/Legal
   │  redlining, komentar, versioning
   ▼
[Negosiasi]  Drafter + Pihak ketiga
   │  setiap putaran versi tersimpan
   ▼
[Approval Matrix]  Berdasarkan nilai/risiko
   │  levels: manager → legal head → partner → board
   ▼
[E-signature]  Sistem
   │  TTE tersertifikasi (BSrE/PSrE) sesuai UU ITE
   ▼
[Repository + Obligation Tracking]  Sistem
   │  tanggal kritis, kewajiban, pembaruan/terminasi otomatis
   ▼
[Audit Log]  setiap tahap + penandatangan + hash dokumen
```
Exception: kontrak melebihi playbook → eskalasi wajib; pihak menolak klausul
wajib → catat pengecualian + persetujuan berjenjang.

### WF-4. Perkara litigasi → agenda sidang → deadline → berkas → drafting → review partner → filing → monitoring

```
[Trigger] Matter litigasi dibuka
   ▼
[Registrasi Pengadilan & Agenda]  Paralegal
   │  nomor perkara, majelis, jadwal sidang, lokasi, e-court
   ▼
[Deadline Engine]  Sistem
   │  H-7/H-3/H-1 reminder; risiko keterlambatan
   ▼
[Persiapan Berkas]  Tim
   │  checklist berkas, bukti, saksi; vault
   ▼
[Drafting]  Advokat + AI
   │  gugatan/jawaban/kesimpulan/dalil dari precedent + fakta matter
   ▼
[Review Partner]  Partner
   │  approval sebelum filing
   ▼
[Filing]  Paralegal
   │  e-court/physik; unggah bukti filing ke vault
   ▼
[Monitoring]  Tim
   │  putusan, banding, kasasi; pembaruan status ke portal klien
   ▼
[Audit Log]  seluruh jejak perkara
```
Exception: sidang dibatalkan/ditunda → recalculation tenggat otomatis; bukti
terlambat → eskalasi partner.

### WF-5. Riset hukum → pertanyaan → pencarian sumber → cited answer → verifikasi advokat → knowledge asset

```
[Trigger] Pertanyaan riset (advokat/paralegal)
   ▼
[Pencarian sumber]  Sistem
   │  hukum publik (BPK/JDIH/peraturan.go.id/MK/MA)
   │  + dokumen internal firma (knowledge base, precedent)
   ▼
[Cited Answer]  AI (RAG)
   │  klaim + sitasi: instrumen, pasal, tanggal berlaku, status
   │  bila sumber kurang ──▶ jawab "dasar hukum primer tidak cukup"
   ▼
[Verifikasi advokat]  Advokat
   │  cek sumber, koreksi, tandai terverifikasi
   ▼
[Penyimpanan]  Sistem
   │  sesi riset + hasil verifikasi → knowledge asset (ber-tag, ber-matter)
   ▼
[Audit Log]  prompt, dokumen sumber, keputusan AI, verifikasi manusia
```
Exception: permintaan melanggar etik/ilegal → guardrail menolak dengan alasan;
yurisdiksi tidak didukung → batasi jawaban ke yurisdiksi tersedia.

### SLA ringkas

| Alur | SLA kunci |
|---|---|
| WF-1 Intake | acknowledgment < 5 mnt; jadwal konsultasi < 2 hari kerja |
| WF-2 Dokumen | OCR+klasifikasi < 2 mnt/dok; eskalasi manual ≤ 1 hari |
| WF-3 Kontrak | draf awal ≤ 2 hari kerja (standar); approval sesuai tier |
| WF-4 Litigasi | reminder H-7/H-3/H-1; filing ≥ H-1 |
| WF-5 Riset | jawaban < 10 detik; verifikasi ≤ 1 hari kerja |

---

## 2. Skema data inti

Konvensi: setiap entitas multi-tenant memiliki `organizationId`; setiap akses
disaring oleh `clientId`/`matterId`. Semua tabel punya `createdAt`,
`updatedAt`, `createdBy`. Kolom sensitif terenkripsi (at-rest).

### User
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId | uuid | |
| role | enum | ADVOKAT, PARTNER, PARALEGAL, CLIENT, CORP_LEGAL, MANAGEMENT, ADMIN |
| name, email, phone | string | email unik per org |
| mfaEnabled | bool | wajib staf |
| barNumber | string? | nomor PERADI/induk profesi |
| status | enum | AKTIF, NONAKTIF, SUSPEND |
| lastLoginAt | datetime | |

### Client
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId | uuid | |
| type | enum | INDIVIDU, KORPORASI |
| name | string | |
| npwp/ktp | string? | terenkripsi |
| contacts | json | |
| portalUserId | uuid? | tautan akun portal |
| conflictFlags | json | hasil conflict check |
| retentionPolicy | string | |

### Matter
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, clientId | uuid | |
| matterNumber | string | format firma |
| title | string | |
| matterType | enum | sengketa-medis, kepatuhan-fasyankes, perizinan-akreditasi, tata-kelola-rme, pdpl-data-pasien, tenaga-kesehatan, jkn-asuransi, informasi-publik-medis, kontrak-kesehatan, litigasi, arbitrase |
| status | enum | INTAKE, AKTIF, PENDING, SELESAI, DITUTUP, DITOLAK, DIRUJUK |
| opposingParties | json | lawan + pihak terkait |
| court | string? | pengadilan/forum |
| jurisdiction | string | default Indonesia |
| team | uuid[] | advokat, paralegal, PIC |
| budget | decimal? | |
| riskLevel | enum | LOW, MEDIUM, HIGH |
| confidentiality | enum | BIASA, TERBATAS, RAHASIA |
| openedAt, closedAt | datetime | |

### Document
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, matterId, clientId | uuid | |
| title, fileName, mimeType, sizeBytes | | |
| docType | enum | kontrak, putusan, surat, identitas, invoice, korespondensi, lainnya |
| version | int | |
| parentDocumentId | uuid? | versioning |
| storageKey | string | objek terenkripsi |
| ocrText | text? | hasil OCR |
| extractedData | json? | NER: pihak, tanggal, nilai, kewajiban |
| aiReview | json? | temuan + skor risiko |
| reviewStatus | enum | BELUM, BUTUH_REVIEW, TERVERIFIKASI, DITOLAK |
| accessControl | json | daftar peran/pengguna |
| retentionUntil | date? | |
| eSignatureMeta | json? | penandatangan, hash, PSrE |

### Task
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, matterId | uuid | |
| title, description | | |
| assigneeId | uuid | |
| priority | enum | LOW, MEDIUM, HIGH, URGENT |
| status | enum | TODO, IN_PROGRESS, BLOCKED, DONE, CANCELLED |
| dueAt | datetime? | |
| dependsOn | uuid[] | |
| createdBy | uuid | |

### Deadline
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, matterId | uuid | |
| kind | enum | SIDANG, BERKAS, KONTRAK, ADMIN, PAJAK, LAIN |
| dueAt | datetime | kalender kerja |
| reminderRule | json | H-7/H-3/H-1 |
| ownerId | uuid | |
| status | enum | AMAN, MENDEKATI, TERLAMBAT, SELESAI |
| sourceDocumentId | uuid? | dasar tenggat |

### Contract
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, matterId?, clientId | uuid | |
| contractType | string | NDA, kerja, sewa, jasa, MOU, dll |
| counterparty | json | |
| value | decimal? | |
| currency | string | IDR |
| termStart, termEnd | date | |
| jurisdiction | string | |
| riskScore | int | |
| workflowState | enum | REQUESTED, RISK_ASSESSED, DRAFTING, INTERNAL_REVIEW, NEGOTIATION, APPROVAL, SIGNED, ACTIVE, EXPIRED, TERMINATED |
| clauseRefs | json[] | clause library + playbook |
| approvals | json[] | tier, approver, waktu |
| signedAt | datetime? | |
| obligations | json[] | tanggal kritis & kewajiban |

### Invoice
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, clientId, matterId? | uuid | |
| type | enum | HOURLY, FIXED, RETAINER, SUCCESS_FEE, DISBURSEMENT |
| lineItems | json[] | waktu, deskripsi, rate, jumlah |
| subtotal, tax, total | decimal | |
| status | enum | DRAFT, SENT, PARTIAL, PAID, OVERDUE, VOID |
| paymentLink | string? | |
| trustAccountId | uuid? | pisah dari operasional |
| dueAt | date | |
| issuedAt, paidAt | datetime? | |

### AuditLog
| Field | Tipe | Catatan |
|---|---|---|
| id | uuid | |
| organizationId, actorId | uuid | |
| action | string | CREATE/UPDATE/DELETE/VIEW/EXPORT/AI_PROMPT/AI_DECISION/LOGIN |
| entityType, entityId | string/uuid | |
| before, after | json? | diff (redaksi data sensitif) |
| aiMeta | json? | model, promptHash, sumber, verifikasi |
| ip, userAgent | string | |
| at | datetime | append-only, tidak dapat diubah |
| hashChain | string | integritas berantai |

### Relasi kunci

```
Organization 1─* User
Organization 1─* Client 1─* Matter 1─* Document
                                    ├─* Task
                                    ├─* Deadline
                                    ├─* Contract (opsional)
                                    ├─* Invoice
                                    └─* AuditLog (via entity)
Client 1─1 PortalUser
Document *─1 AuditLog (perubahan)
```

### Catatan implementasi

- Repositori lama memakai JSON store (`prisma/seed.json`). Migrasi platform
  memerlukan PostgreSQL + Prisma; JSON store tetap sebagai seed untuk modul
  `legal-research`.
- Isolasi multi-tenant: row-level security + penyaringan wajib di setiap query.
- Data klien dilarang dipakai untuk pelatihan model tanpa persetujuan eksplisit
  (lihat doc 04 dan doc 05).
