# 01 · Visi, Persona, dan User Journey

## 1. Product Vision

**PAGARMIK adalah ruang kerja hukum vertikal sektor kesehatan Indonesia:
platform yang menyatukan basis data regulasi RMIK/kesehatan/PDP, riset
ber-sitasi, operasi firma, dan kolaborasi klien dalam satu sistem.**

Visi jangka panjang: menjadi rujukan utama kepatuhan hukum informasi kesehatan
di Indonesia — bagi advokat dan tim legal yang menangani sengketa medis,
fasyankes, perizinan, audit RME, dan pelindungan data pasien; bagi fasilitas
pelayanan kesehatan yang mengelola kepatuhan; dan bagi profesi RMIK — dengan
AI yang selalu menunjuk sumber primer hukum Indonesia dan tidak pernah
menggantikan penilaian advokat.

Batas domain: PAGARMIK **bukan** platform hukum umum. Praktik umum (pidana
umum, pertanahan komersial, dll.) hanya didukung bila bersinggungan dengan
kepatuhan fasilitas kesehatan, rekam medis, informasi kesehatan, atau PDP.

### Problem statement

1. Riset hukum tersebar: JDIH BPK, JDIH Kemenkes, peraturan.go.id, putusan
   MK/MA, regulasi daerah, dan dokumen internal klien tidak terhubung.
2. Operasi firma terpisah dari riset: matter, dokumen, tenggat, dan tagihan
   hidup di alat berbeda, sehingga konteks hukum hilang saat menyusun dokumen.
3. Kualitas dan risiko AI: keluaran AI tanpa sitasi, tanpa status keberlakuan,
   dan tanpa jejak audit tidak dapat dipakai di pekerjaan hukum nyata.
4. Kepatuhan data: data klien adalah rahasia profesi. Penyimpanan dan
   pemrosesan AI harus mematuhi UU PDP dan kewajiban kerahasiaan advokat.

### Value proposition

| Untuk | Nilai |
|---|---|
| Advokat | Riset lebih cepat, draf lebih cepat, supervisi tim terukur |
| Firma/Manajemen | Utilization, revenue per matter, SLA, dan risiko tenggat terlihat |
| Klien | Transparansi status perkara, unggah dokumen aman, komunikasi terpusat |
| Korporasi | CLM, playbook, approval matrix, dan jejak kepatuhan |

### Prinsip produk

1. **Citation-first.** Semua pernyataan hukum menunjuk sumber primer
   (UU/Perppu/PP/Perpres/Permen/Putusan/Yurisprudensi/Perda) dengan nomor,
   tahun, pasal, tanggal berlaku, dan status hukum.
2. **Human-in-the-loop.** AI menghasilkan draf; advokat memvalidasi. Tidak ada
   dokumen material yang keluar tanpa persetujuan manusia.
3. **Jurisdiction-aware.** Default hukum Indonesia. Yurisdiksi dapat dibatasi
   per matter.
4. **Data segregation.** Isolasi data per klien dan per matter; tidak ada
   pelatihan model dari data klien tanpa persetujuan eksplisit.
5. **Auditable by default.** Prompt, dokumen, akses, ekspor, dan keputusan AI
   tercatat dalam audit log yang tidak dapat diubah.
6. **Bahasa Indonesia profesional**, dengan dukungan istilah hukum dwibahasa
   untuk klien korporasi.

---

## 2. Persona

### P1. Advokat / Partner — "Rani, Partner Litigasi"
- **Tujuan:** menang perkara, jaga kualitas, kelola tim, jaga margin.
- **Pain point:** riset manual lambat; draf berulang; sulit melihat beban tim;
  takut ada tenggat terlewat; review dokumen junior menyita waktu.
- **Fitur prioritas:** workroom per perkara, riset AI ber-sitasi, drafting
  dari precedent, review dokumen berisiko, dashboard beban & deadline,
  approval dokumen, billing review.

### P2. Paralegal / Legal Admin — "Dimas, Paralegal"
- **Tujuan:** administrasi rapi, tenggat terkendali, dokumen lengkap.
- **Pain point:** input data ganda, berkas tersebar, reminder manual,
  ekstraksi data dokumen melelahkan.
- **Fitur prioritas:** intake terstruktur, task board, deadline engine,
  OCR + ekstraksi data, template surat, checklist berkas, kalender sidang.

### P3. Klien Individu — "Bu Sari, Klien"
- **Tujuan:** tahu status perkaranya, kirim dokumen mudah, dapat kepastian.
- **Pain point:** tidak tahu progres, komunikasi via WhatsApp tidak resmi,
  tidak paham jargon hukum.
- **Fitur prioritas:** portal klien, lini masa status berbahasa awam,
  unggah dokumen aman, notifikasi, jadwal konsultasi, pembayaran.

### P4. Klien Korporasi — "Pak Budi, Head of Legal"
- **Tujuan:** kontrak cepat, kepatuhan terjaga, biaya terkendali.
- **Pain point:** bottleneck legal, kontrak berulang tanpa standar, tidak ada
  visibilitas risiko klausul.
- **Fitur prioritas:** self-service intake, CLM, clause library + playbook,
  approval matrix, dashboard SLA & risiko, e-signature.

### P5. Manajemen Firma — "Ibu Wulan, Managing Partner"
- **Tujuan:** profitabilitas, utilisasi, reputasi, risiko.
- **Pain point:** tidak ada data real-time; keputusan berbasis asumsi.
- **Fitur prioritas:** analytics (utilization, WIP, receivable, win/loss,
  waktu penyelesaian, SLA, backlog), laporan per praktik, denda risiko tenggat.

### P6. Admin Sistem — "Teknisi Firma"
- **Tujuan:** sistem aman, patuh, terintegrasi, dapat diaudit.
- **Pain point:** kontrol akses lemah, integrasi rapuh, log tidak lengkap.
- **Fitur prioritas:** RBAC/MFA, SSO, audit log, manajemen integrasi,
  retensi & penghapusan data, ekspor kepatuhan.

---

## 3. User Journey (ringkas)

### J1. Advokat — dari pertanyaan ke memo
1. Rani membuka workroom perkara.
2. Mengajukan pertanyaan hukum di panel riset.
3. AI mengembalikan jawaban + sitasi primer + status berlaku + peringatan.
4. Rani menyalin jawaban ke drafting sebagai legal opinion, menyesuaikan fakta.
5. Menandai memo tersimpan sebagai knowledge asset firma.

SLA: jawaban riset < 10 detik; memo draf siap < 15 menit.

### J2. Paralegal — intake sampai matter dibuka
1. Lead masuk (web/WhatsApp/email) → form intake dinamis per bidang hukum.
2. Sistem menjalankan conflict check otomatis terhadap klien/lawan yang ada.
3. Routing ke advokat sesuai bidang, wilayah, urgensi, ketersediaan.
4. Acknowledgment otomatis < 5 menit ke klien.
5. Consultation → Engagement Letter → Retainer → Matter dibuka.

### J3. Klien individu — pengajuan dan pemantauan
1. Klien mengisi form pengajuan sederhana (maks 5 langkah).
2. Mengunggah dokumen; sistem OCR + klasifikasi.
3. Klien mendapat portal untuk memantau status dan mengirim pesan.
4. Klien menerima notifikasi pada setiap perubahan status.

### J4. Korporasi — permintaan dan siklus kontrak
1. Tim bisnis mengajukan permintaan kontrak via self-service intake.
2. Sistem mengklasifikasi jenis & risiko, memilih playbook.
3. Drafter menyusun dari clause library; AI review menandai klausul berisiko.
4. Approval matrix berjalan; e-signature; arsip ke repository.

### J5. Manajemen — review operasional mingguan
1. Membuka dashboard: utilization, WIP, receivable, backlog, risiko tenggat.
2. Menyorot matter berisiko dan praktik dengan margin rendah.
3. Menetapkan tindakan; sistem melacak sampai selesai.

### J6. Admin — onboarding & tata kelola
1. Membuat organisasi, role, dan kebijakan retensi.
2. Mengonfigurasi integrasi (email, kalender, e-signature, pembayaran).
3. Mengaktifkan MFA/SSO dan audit log.
4. Menjalankan uji pemulihan (backup/DR) berkala.

---

## 4. Metrik keberhasilan (KPI)

| KPI | Target MVP | Target Growth |
|---|---|---|
| Waktu respons intake (acknowledgment) | < 5 menit | < 2 menit |
| Konversi lead → klien | terukur baseline | +20% |
| Waktu pembuatan dokumen dari template | < 15 menit | < 5 menit |
| Output AI tervalidasi tanpa revisi besar | ≥ 70% | ≥ 85% |
| Ketepatan deadline | ≥ 98% | ≥ 99,5% |
| NPS klien | ≥ 30 | ≥ 50 |
| Utilization advokat (terukur) | tersedia | +10% |
| Revenue per matter (terukur) | tersedia | +15% |
| Insiden keamanan kritikal | 0 | 0 |
