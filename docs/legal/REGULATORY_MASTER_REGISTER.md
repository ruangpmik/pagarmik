# PAGARMIK Regulatory Master Register

Audit cut-off: 3 November 2026  
Repository: PAGARMIK, C:\laragon\www\pagarmik  
Scope: the 36 regulation and decision records present in prisma/seed.json after the documented corrections, plus official instruments found that affect their legal lifecycle or a feature evidenced in the product.

This register separates (1) the current label in the repository, (2) what the official record/text supports, and (3) product relevance. A repository label is not itself evidence of legal force. “Active” below means the official catalog marks the instrument active, unless an article-level caveat is stated. This is a technical intelligence audit, not a legal opinion or a certification of compliance.

## Product and scope evidence

The repository describes PAGARMIK as a legal information product for medical records and health information management. Confirmed functions include regulatory search/detail, statutory text and AI explanations, case-question analysis, comparison, topic/article content, user registration/profile, local bookmarks/history, and admin legal-document ingest and status verification. Relevant evidence is in README.md, docs/architecture.md, docs/api-spec.md, app/, app/api/, and src/.

No patient-record/EHR, hospital/SIMRS, telemedicine, clinical treatment, health-facility licensing, public-body operator, or SIK/SATUSEHAT integration feature was found in the inspected code. This means health-sector operational duties cannot be assigned to PAGARMIK solely because the corpus discusses health law. It does not decide the operator’s legal classification, business model, deployment, or contractual role.

The system does collect account identifiers and accepts free-text legal/case questions and arbitrary PDF/text ingestion. Such inputs may contain health or other sensitive personal data even though there is no dedicated patient-record model. The configurable AI adapter can send the question and retrieved context to an external endpoint. Treat these paths as privacy-sensitive; do not use real patient material in this demo.

## Current high-confidence findings

| Instrument | Officially supported finding | Repository finding |
|---|---|---|
| Permenkes 6/2026 | JDIH Kemenkes marks it active, set 4 June 2026, promulgated/effective 12 June 2026. Article 84 lists 21 instruments for repeal, including PMK 82/2013 and PMK 4/2018; item c is limited by its “sepanjang” clause. Articles 84–85 make the repeal effective with PMK 6 upon promulgation. Article 83 separately provides adjustment periods for hospital operation requirements. | PMK 6 is correctly active; the corrected seed summary now states 21 instruments and the partial scope. |
| Permenkes 82/2013 | JDIH Kemenkes marks it no longer in force and identifies PMK 6/2026 as repealing it. The original was set 10 December 2013 and promulgated/effective 20 January 2014. | Status DICABUT is right; seed tglBerlaku is corrected to 2014-01-20. |
| Permenkes 13/2025 | JDIH marks it active and gives a set date of 18 October 2025; promulgated/effective 3 November 2025. The extracted text of the official PDF footer reads “8 Oktober 2025”, leaving the date of determination unresolved. Article 309 expressly lists PMK 55/2013 for repeal; Article 310 makes the rule effective upon promulgation. | PMK 13 is now in the seed as active; PMK 55 is DICABUT with a repeal relation. The new record omits its disputed set date pending visual confirmation of the authentic page. |
| Permenkes 36/2012 | JDIH Kemenkes marks it active; set 10 August 2012 and promulgated 12 September 2012. | Seed dates are corrected to 2012-08-10 and 2012-09-12. Continue to flag harmonization with UU 17/2023 and UU PDP for legal review. |
| Permenkes 24/2022 | JDIH Kemenkes marks it active. Article 46 expressly repeals PMK 269/2008; Article 47 is effective upon promulgation. | PMK 24 active and PMK 269 DICABUT are consistent. Its original legal basis includes statutes and PP 46/2014 that have since changed/repealed; this does not by itself prove PMK 24 was repealed. |
| UU 17/2023 | BPK marks it active and lists Constitutional Court decisions, including 49/PUU-XXII/2024 and 182/PUU-XXII/2024. Article 453 preserves implementing instruments of the repealed Acts only insofar as they do not conflict with UU 17; Article 454 expressly repeals named Acts. | Core status BERLAKU is supported. Article-level effects of relevant MK decisions need to be represented separately. |
| UU 27/2022 | BPK marks it active and records MK decision 151/PUU-XXII/2024, which conditionally changes the wording in Article 53(1)(b). The statutory transition period in Article 74 ended 17 October 2024. | BERLAKU is supported, but the decision and ended transition should be linked in the legal content. |
| PP 28/2024 | BPK marks it active and records express repeals, including PP 46/2014, in Article 1170. | BERLAKU is supported. Do not treat this as automatically repealing every ministerial instrument made under PP 46/2014. |
| UU 11/2008 / UU 19/2016 | The official chain includes UU 1/2024, which expressly amends UU 11/2008 as previously amended by UU 19/2016. Official BPK also records constitutional-review outcomes. | The latest amendment is absent. The current “PERUBAHAN” and separate “BERLAKU” labels do not represent a consolidated-text model. |
| PP 71/2019 | BPK marks it active; Article 103(1) preserves predecessor implementing rules only if not inconsistent or not replaced, and Article 103(2) expressly repeals PP 82/2012. | PP 71 active and PP 82 DICABUT are consistent. Existing relations should point to the UU ITE chain, not just UU 19/2016. |
| Permenkominfo 5/2020 | Official JDIH records the instrument and its 2021 amendment. Permenkominfo 10/2021 is the amendment, promulgated 21 May 2021. | Amendment missing from the seed corpus. |
| Permenkominfo 20/2016 | BPK metadata marks it active. UU PDP Article 75 preserves prior privacy rules only to the extent they do not conflict with UU PDP. | BERLAKU_DENGAN_CATATAN is a reasonable editorial warning; article-by-article harmonization is open, not a blanket repeal. |
| UU 1/2023 KUHP | BPK records UU 1/2026 on criminal adjustments, effective 2 January 2026. | Existing UU 1/2023 date reflects its future effective date, but the 2026 change is absent. |
| PP 28/2025 | BPK marks it active from 5 June 2025 and says it repeals PP 5/2021. | Not present. Applicability depends on PAGARMIK’s actual licensed business classification; no healthcare business-permit feature is evidenced. |
| Permenkes 11/2025 | BPK marks it active from 3 October 2025. Its repeal is expressly partial: the listed older health-sector business-licensing rules are repealed only insofar as they cover standards also regulated by PMK 11/2025. | Not present. It is conditional context, not a proved direct product obligation. |
| Peraturan BSSN 1/2026 | BPK marks it active from 25 May 2026 and says it changes Peraturan BSSN 5/2021 on BSSN cybersecurity and cryptography training. | Relationship is represented, but “PERUBAHAN” on the predecessor conflates amendment with legal status. The subject is training and is not a PAGARMIK cybersecurity control standard. |

## Full repository inventory

The “catalog status” column preserves the label found during the audit baseline (35 entries); it is not necessarily the current seed label. The audit implementation added one verified instrument, so the current seed has 36 regulation/decision records. The findings column records the reviewed result and the completed corrections.

| # | Repository slug / title short form | Catalog status | Audit result / next handling |
|---:|---|---|---|
| 1 | uu-17-2023 — UU 17/2023 Kesehatan | BERLAKU | Official BPK active. Read with Article 453–454 and binding MK decisions; source and relation chain need enrichment. |
| 2 | permenkes-24-2022 — PMK 24/2022 Rekam Medis | BERLAKU | Official Kemenkes active; Article 46 repeals PMK 269/2008. Reconcile legacy legal bases; do not infer PMK 24 repeal. |
| 3 | uu-27-2022 — UU 27/2022 PDP | BERLAKU | Official BPK active; MK 151/PUU-XXII/2024 affects Article 53(1)(b). Update source URI and decision relationship. |
| 4 | pp-28-2024 — PP 28/2024 implementing UU Health | BERLAKU | Official BPK active; expressly repeals PP 46/2014 among other rules. |
| 5 | permenkes-269-2008 — PMK 269/2008 Rekam Medis | DICABUT | Expressly repealed by PMK 24/2022 Article 46. Preserve as historical. |
| 6 | permenkes-36-2012 — PMK 36/2012 Rahasia Kedokteran | BERLAKU_DENGAN_CATATAN | Official JDIH active. Correct set date to 2012-08-10 and effective date to 2012-09-12; harmonization open. |
| 7 | permenkes-6-2026 — PMK 6/2026 Rumah Sakit | BERLAKU | Official JDIH active; Article 84 lists 21 instruments and includes PMK 82 and PMK 4. One listed repeal is partial. Seed summary is corrected to 21. Article 83 periods do not delay repeal. |
| 8 | permenkes-82-2013 — PMK 82/2013 SIMRS | DICABUT | Expressly repealed by PMK 6/2026. Seed effective date is corrected to 2014-01-20. Historical record retained. |
| 9 | permenkes-4-2018 — PMK 4/2018 kewajiban RS/pasien | DICABUT | Expressly listed in PMK 6/2026 Article 84. Keep historical. |
| 10 | uu-43-2009 — UU 43/2009 Kearsipan | BERLAKU | Official BPK/ANRI record identifies active status; applicability depends on whether operator/records fall under an archival duty. |
| 11 | pp-28-2012 — PP 28/2012 pelaksanaan Kearsipan | BERLAKU | Official BPK record is active; scope is role and record dependent, not inferred from a legal-corpus feature. |
| 12 | perka-anri-22-2015 — Perka ANRI 22/2015 JRA | BERLAKU | Official ANRI JDIH record identified as active; the operator’s status and archive classification remain unknown. |
| 13 | perka-anri-12-2007 — Perka ANRI 12/2007 JRA | BERLAKU | Official ANRI catalog record identified as active; full current-scope review remains open. |
| 14 | uu-1-2023 — UU 1/2023 KUHP | BERLAKU | Effective 2 January 2026; must be read with UU 1/2026 on criminal adjustments. |
| 15 | uu-14-2008 — UU 14/2008 KIP | BERLAKU | Active in official catalog; only applies if PAGARMIK operator is within the public-body regime. |
| 16 | pp-61-2010 — PP 61/2010 pelaksanaan KIP | BERLAKU | Supporting implementation rule; public-body status and current article-level harmonization need owner/legal confirmation. |
| 17 | perpres-95-2018 — Perpres 95/2018 SPBE | BERLAKU | Public-sector/SPBE relevance is conditional; no government operator/client role is established in the inspected product. |
| 18 | uu-11-2008 — UU ITE | PERUBAHAN | Base statute amended by UU 19/2016 and UU 1/2024; treat as a consolidated law chain, not a standalone “PERUBAHAN” status. |
| 19 | uu-19-2016 — amendment to UU ITE | BERLAKU | Historical amendment instrument; later changed by UU 1/2024. Link in the chain; do not present as the latest consolidated text. |
| 20 | pp-71-2019 — PP PSTE | BERLAKU | Official BPK active; Article 103(1) has a continuity condition and Article 103(2) expressly repeals PP 82/2012. |
| 21 | pp-82-2012 — PP PSTE predecessor | DICABUT | Expressly repealed by PP 71/2019; preserve as historical. |
| 22 | permenkominfo-20-2016 — privacy in electronic systems | BERLAKU_DENGAN_CATATAN | Official BPK catalog says active; apply UU PDP Article 75 conflict test provision by provision. |
| 23 | permenkominfo-5-2020 — private PSE | BERLAKU | Official JDIH record exists; changed by Permenkominfo 10/2021, absent from repository. Scope depends on PSE classification/operator facts. |
| 24 | permenkes-20-2019 — telemedicine between facilities | BELUM_DIVERIFIKASI | Official BPK catalog describes it as active. No PAGARMIK telemedicine feature; status can be verified separately before any corpus update. |
| 25 | permenkes-55-2013 — work of medical-record professionals | BELUM_DIVERIFIKASI (baseline) | Current seed status is DICABUT because PMK 13/2025 Article 309 expressly repeals it, effective 2025-11-03; the repeal relation is recorded. This row's explanatory text is marked historical. The original PMK 55 text was not independently retrieved; the repeal identity/title is confirmed in official PMK 13/2025. PMK 13's set date remains blank pending visual review. |
| 26 | uu-36-2014 — UU Tenaga Kesehatan | DICABUT | Expressly repealed by UU 17/2023 Article 454; preserve historical. |
| 27 | uu-8-1999 — UU Perlindungan Konsumen | BERLAKU | Active in BPK; relevance depends on consumer-facing commercial offering and transactions, not established by source code alone. |
| 28 | mk-111-182-puu-2024 — combined MK 111 and 182 decision label | BERLAKU | Not a regulation/status enum item. Split into separate decision records. Both 111 and 182 decisions were pronounced in 2026; add MK 49/PUU-XXII/2024 (2025) relevant to UU 17. |
| 29 | peranri-2-2021 — conversion of static archives | BERLAKU | ANRI catalog identifies active; applicability depends on statutory archive and operator role. |
| 30 | peranri-1-2023 — authentication of static archives | BERLAKU | Official ANRI record active; not a general consumer-app duty absent archive-custodian facts. |
| 31 | uu-29-2004 — UU Praktik Kedokteran | DICABUT | Expressly repealed by UU 17/2023 Article 454; preserve historical. |
| 32 | uu-36-2009 — former UU Kesehatan | DICABUT | Expressly repealed by UU 17/2023 Article 454; preserve historical. |
| 33 | uu-44-2009 — UU Rumah Sakit | DICABUT | Expressly repealed by UU 17/2023 Article 454; preserve historical. |
| 34 | perbssn-1-2026 — amendment to PerBSSN 5/2021 | BERLAKU | Official BPK active from 2026-05-25; this concerns BSSN training, not a general technical-security standard for PAGARMIK. |
| 35 | perbssn-5-2021 — BSSN cybersecurity training | PERUBAHAN | Relationship to 1/2026 is valid, but the schema should model “amended as of” separately from instrument status. |
| 36 | permenkes-13-2025 — PMK 13/2025 Pengelolaan Sumber Daya Manusia Kesehatan | Added after audit; BERLAKU | JDIH active; effective 2025-11-03; express repeal relationship to PMK 55/2013. Set date intentionally omitted because JDIH metadata and extracted PDF text conflict. |

## Official items added and remaining watchlist

| Instrument | Why it belongs in the watchlist | Status / applicability conclusion |
|---|---|---|
| Permenkes 13/2025 | Expressly repeals the existing PMK 55/2013 corpus item. | Added to the seed as active with official JDIH source and effective date; set date omitted pending resolution. |
| UU 1/2024 | Latest amendment to the UU ITE chain already represented by UU 11/2008 and UU 19/2016. | Active; affects current consolidated electronic-information rules. |
| Permenkominfo 10/2021 | Amends existing Permenkominfo 5/2020 record. | Amendment confirmed; PSE applicability remains conditional. |
| UU 1/2026 | Adjusts criminal provisions and post-dates the existing KUHP record. | Active; relevant to penal content, not an independent product feature. |
| PP 28/2025 | Current risk-based business licensing regulation; replaces PP 5/2021. | Active; specific applicability requires entity, KBLI, and activity facts. |
| Permenkes 11/2025 | Current health-sector risk-based standards and partial repeal. | Active; no healthcare business-permit feature was found, so conditional watchlist. |
| Permenkes 18/2022 | Satu Data/SIK rule whose prior parent PP 46/2014 is expressly repealed by PP 28/2024. | BPK still catalogues it as active; do not infer automatic repeal, but perform article-level harmonization if SIK integration/product role is added. |
| MK 49/PUU-XXII/2024 | Binding interpretation affecting UU 17/2023 Article 212(2), decided in 2025. | Decision record should be separate from the UU. |

## Official source directory

- [JDIH Kemenkes — PMK 6/2026 record](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-6-tahun-2026) and [official text PDF](https://jdih.kemkes.go.id/storage/documents/pdfs/2026permenkes006.pdf).
- [JDIH Kemenkes — PMK 13/2025 record](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-13-tahun-2025) and [official text PDF](https://jdih.kemkes.go.id/storage/documents/pdfs/2025permenkes013.pdf).
- [JDIH Kemenkes — PMK 82/2013 record](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-82-tahun-2013) and [official text PDF](https://jdih.kemkes.go.id/storage/documents/pdfs/2013permenkes082.pdf).
- [JDIH Kemenkes — PMK 24/2022 record](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-24-tahun-2022) and [official text PDF](https://jdih.kemkes.go.id/storage/documents/pdfs/2022permenkes024.pdf).
- [JDIH Kemenkes — PMK 36/2012 record](https://jdih.kemkes.go.id/documents/peraturan-menteri-kesehatan-nomor-36-tahun-2012).
- [BPK JDIH — UU 17/2023](https://peraturan.bpk.go.id/Details/258028/uu-no-17-tahun-2023), [PP 28/2024](https://peraturan.bpk.go.id/Details/294077/pp-no-28-tahun-2024), [UU PDP 27/2022](https://peraturan.bpk.go.id/Details/229798/uu-no-27-tahun-2022), and [UU ITE amendment 1/2024](https://peraturan.bpk.go.id/Details/274494/uu-no-1-tahun-).
- [BPK JDIH — PP 71/2019](https://peraturan.bpk.go.id/Details/122030/pp-no-71-tahun-2019), [PP 28/2025](https://peraturan.bpk.go.id/Details/319773/pp-no-28-tahun-2025), [PMK 11/2025](https://peraturan.bpk.go.id/Details/335213/permenkes-no-11-tahun-2025), and [UU 1/2026](https://peraturan.bpk.go.id/Details/337869/uu-no-1-tahun-2026).
- [JDIH Kemkomdigi — Permenkominfo 10/2021](https://jdih.komdigi.go.id/produk_hukum/view/id/774/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Binformatika%2Bnomor%2B10%2Btahun%2B2021) and [Permenkominfo 5/2020](https://jdih.komdigi.go.id/produk_hukum/view/id/759/t/peraturan%2Bmenteri%2Bkomunikasi%2Bdan%2Binformatika%2Bnomor%2B5%2Btahun%2B2020).
- [BPK JDIH — Peraturan BSSN 1/2026](https://peraturan.bpk.go.id/Details/353764/peraturan-bssn-no-1-tahun-2026) and [Permenkominfo 20/2016](https://peraturan.bpk.go.id/Details/150543/permenkominfo-no-20-tahun-2016).
- [MK — official decision search for 49/PUU-XXII/2024](https://www.mkri.id/perkara/persidangan/putusan?jenis=PUU&page=1&perPage=50&search=9%2FPUU-XXII%2F2024), [decision 111/PUU-XXII/2024 PDF](https://www.mkri.id/public/content/persidangan/putusan/putusan_mkri_13743_1769743020.pdf), and [decision 182/PUU-XXII/2024 PDF](https://s.mkri.id/public/content/persidangan/putusan/putusan_mkri_13742_1769757863.pdf).
- [ANRI JDIH — Perka ANRI 22/2015](https://jdih.anri.go.id/peraturan/peraturan-kepala-arsip-nasional-republik-indonesia-no-22-tahun-2015) and [PerANRI 1/2023](https://jdih.anri.go.id/peraturan/peraturan-arsip-nasional-republik-indonesia-no-1-tahun-2023).

## Limits and required follow-up

This pass independently verifies the lifecycle instruments central to the discovered product domain and the seed items for which clear official evidence was found. It does not claim article-by-article validation of every one of the 36 current records. For rows marked conditional or with an open review, keep the current historical content and avoid presenting a new certainty label until the official text and relevant operator facts are reviewed. The scope is Indonesian instruments found in repository/product evidence; it is not an exhaustive search of every Indonesian law potentially affecting a software company.

