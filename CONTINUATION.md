# CONTINUATION — Full-Stack UI/UX Consistency & Refinement

Updated: 2026-11-05 (WIB)

## 1. Ringkasan Audit & Masalah yang Diselesaikan

1. **Defect Layout Bersarang (`/topik`) & Konsistensi Tipografi IBM Plex Sans**:
   - `app/topik/layout.tsx` sebelumnya memuat boilerplate bawaan Next.js (`<html lang="en"><body>...`) di dalam `app/layout.tsx` serta metadata `title: 'Next.js'`. Diperbaiki menjadi layout pass-through bersih dan ditambahkan tes regresi di `tests/ui-governance.test.ts`.
   - Seluruh kelas `font-extrabold` (bobot 800 yang tidak tersedia pada IBM Plex Sans) telah dinormalkan menjadi `font-bold`/`font-semibold` dan dijaga melalui tes otomatis di `tests/ui-governance.test.ts`.
2. **Design Tokens & Primitives Terpadu (`app/globals.css`, `src/components/ui.tsx`)**:
   - Ditambahkan token semantik `--danger-bg`, `--danger-border`, `--warning-bg`, `--warning-border`, `--success-bg`, `--success-border`, `--info`, `--info-bg`, `--info-border`.
   - Ditambahkan kelas utilitas fondasi bersama: `.page-header`, `.section-card`, `.form-input`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.pagar-spinner`, dan `.pagar-progress-bar` (menghormati `prefers-reduced-motion`).
3. **Sistem Feedback, Toast, Konfirmasi, Offline State, Loading & Progress (`src/components/FeedbackProvider.tsx`, `src/components/SubmitButton.tsx`)**:
   - Satu mekanisme notifikasi bersama (`useFeedback().toast`) dengan deduplikasi otomatis (`dedupeKey`), durasi lebih panjang untuk peringatan/error, tombol tutup eksplisit, dan ikon SVG non-warna per varian (`success`, `error`, `warning`, `info`).
   - Deteksi kondisi jaringan aktual (`window.addEventListener("offline" | "online")`) yang menampilkan banner peringatan luring (`isOffline`) serta toast pemulihan saat jaringan kembali aktif.
   - Dialog konfirmasi aksesibel (`useFeedback().confirm`) dengan `role="dialog"`, `aria-modal="true"`, *focus trap* (`Tab`/`Shift+Tab`), tombol `Escape`, serta pemulihan fokus untuk tindakan destruktif/kritis (hapus bookmark, bersihkan riwayat lokal, dan penetapan status `DICABUT` pada panel verifikasi admin).
   - `SubmitButton` mencegah submit ganda (`disabled` + `aria-busy`), menampilkan indikator loading pada tombol, dan menampilkan tahapan progres aktual (`progressSteps`) pada operasi riset AI, analisis kasus, dan ingest PDF regulasi.
4. **App Router Lifecycle States & Integrasi Endpoint Interaktif**:
   - Ditambahkan `app/loading.tsx` (skeleton state terstruktur yang menjaga stabilitas layout), `app/error.tsx` (error boundary tanpa membocorkan stack trace + tombol pemulihan `Coba lagi`), dan `app/not-found.tsx` (404 terstandar dengan `Breadcrumb` dan `EmptyState`).
   - Ditambahkan `src/components/CompareAiPanel.tsx` pada `/bandingkan` (terhubung ke `GET /api/ai/compare`) dan `src/components/ExplainPasalButton.tsx` pada `/regulasi/[slug]` serta `/pasal` (terhubung ke `GET /api/ai/explain-pasal`), lengkap dengan skeleton loading, pencegahan klik ganda, penanganan rate-limit 429/offline, dan tombol `Coba lagi` (retry).
   - Penanganan redirect error form HTML pada `POST /api/admin/ingest` (`?ingestError=...`) dan `POST /api/auth/register` (`?error=exists|validation`) tanpa mengubah respons JSON untuk klien API.

## 2. Modul yang Telah Diperbarui (18 Rute Halaman + Lifecycle Routes)

- `/` (`app/page.tsx`): ID pencarian unik (`home-q`), tautan eksplorasi ke `/bandingkan`.
- `/legal-search` (`app/legal-search/page.tsx`): `Breadcrumb`, `SearchBar` mempertahankan `defaultValue={q}`, tombol reset filter aktif, initial state dengan kueri populer saat `!q`, dan `EmptyState` terstandar saat hasil kosong.
- `/regulasi` (`app/regulasi/page.tsx`): `Breadcrumb`, metrik keberlakuan dengan token semantik, tombol aksi cepat ke `/bandingkan` dan `/grafik`, serta `EmptyState`.
- `/regulasi/[slug]` (`app/regulasi/[slug]/page.tsx`): `Breadcrumb`, tombol aksi simpan & bandingkan, banner `Alert` untuk status `DICABUT` / `PERUBAHAN` / `BELUM_BERLAKU`, banner *Partial-data state* jika rincian pasal/tanggal penetapan/sumber resmi belum lengkap, tautan sumber resmi yang dapat diklik, `aria-current="page"` pada tab, pemisahan tegas `LegalBlock`, serta komponen `ExplainPasalButton` untuk ringkasan AI di tempat.
- `/pasal` (`app/pasal/page.tsx`): `Breadcrumb`, `SubmitButton`, initial state contoh kueri pasal, `ScoreBar` terstandar, `ExplainPasalButton`, dan `EmptyState`.
- `/bandingkan` (`app/bandingkan/page.tsx`): `Breadcrumb`, `SubmitButton`, peringatan validasi jika regulasi A dan B sama, initial state preset perbandingan populer, `<caption>` tabel semantik, dan `CompareAiPanel`.
- `/grafik` (`app/grafik/page.tsx`): `Breadcrumb` dan `SubmitButton` dengan mempertahankan penuh batas bukti relasi (`VERIFIED` vs `LEGAL_REVIEW_REQUIRED`).
- `/timeline` (`app/timeline/page.tsx`): `Breadcrumb`, ringkasan rentang tahun, serta kartu regulasi dengan nomor dan instansi penerbit.
- `/ai` (`app/ai/page.tsx`): `Breadcrumb`, label terlihat untuk input pertanyaan, pemberitahuan privasi data pasien, `SubmitButton` dengan tahapan progres RAG, `LegalBlock`, dan peringatan penyaringan sitasi tidak terverifikasi.
- `/analisis-kasus` (`app/analisis-kasus/page.tsx`): `Breadcrumb`, label terlihat, pemberitahuan privasi, `SubmitButton` dengan tahapan progres, klasifikasi otomatis bagian hasil ke dalam `LegalBlock`, dan initial state contoh skenario operasional.
- `/topik` & `/topik/[slug]` (`app/topik/page.tsx`, `app/topik/[slug]/page.tsx`, `app/topik/layout.tsx`): penghapusan emoji mentah, penghapusan duplikasi tag `<html>/<body>`, penambahan `Breadcrumb`, `generateMetadata`, hitungan regulasi/artikel per topik, dan `EmptyState`.
- `/artikel` & `/artikel/[slug]` (`app/artikel/page.tsx`, `app/artikel/[slug]/page.tsx`): `Breadcrumb` berbahasa Indonesia, `generateMetadata`, daftar dasar hukum dengan `StatusBadge`, dan `BookmarkButton` terintegrasi toast.
- `/masuk`, `/daftar`, `/profil` (`app/masuk/page.tsx`, `app/daftar/page.tsx`, `app/profil/page.tsx`, `src/components/AuthForms.tsx`, `src/components/LibraryView.tsx`): validasi form di dekat field yang mempertahankan input pengguna, pembedaan error validasi vs error autentikasi/registrasi server, serta tampilan simpanan/riwayat lokal yang tetap dapat diakses beserta dialog konfirmasi penghapusan.
- `/admin` (`app/admin/page.tsx`, `src/components/AdminForms.tsx`): state izin ditolak (`Permission-denied`) lengkap dengan `<h1>` dan `Alert`, banner `ingestError`, validasi ukuran/format PDF dan panjang ringkasan sebelum kirim, tahapan progres unggah, serta dialog konfirmasi saat menetapkan status `DICABUT`.

## 3. Verifikasi & Pengujian yang Dijalankan

- **PASS:** `npm.cmd run typecheck` (`tsc --noEmit`) — 0 error.
- **PASS:** `npm.cmd test` (`vitest run`) — 47/47 tes lulus di 7 berkas uji (`tests/ui-governance.test.ts` [10 tes], `tests/regulatory-registry.test.ts` [13 tes], `tests/relationship-graph.test.ts` [5 tes], `tests/search.test.ts` [4 tes], `tests/rag.test.ts` [10 tes], `tests/verification-store.test.ts` [2 tes], `tests/governance-guards.test.ts` [3 tes]).
- **Git Metadata:** `.git` aktif pada branch `main` (`HEAD` di `290cba2 style: normalkan heading extrabold ke semibold (IBM Plex tak punya 800)`).

## 4. Masalah Tersisa & Langkah Berikutnya

1. **Verifikasi Visual & Keyboard Menyeluruh di Browser (`localhost:3311`)**: Uji coba interaksi dialog konfirmasi, toast, `CompareAiPanel`, `ExplainPasalButton`, dan alur `/admin` dengan akun demo `ADMIN`/`VERIFIER`.
2. **Telaah Hukum Relasi Subjektif**: 17 relasi berstatus `LEGAL_REVIEW_REQUIRED` tetap ditahan dari grafik hingga telaah hukum manusia selesai.
3. **Penyimpanan Produksi**: `JsonStore` dan `data/verification.json` tetap merupakan penyimpanan demo berbasis berkas lokal hingga migrasi Prisma/PostgreSQL diotorisasi.
