"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function MasukanForm() {
  const [nama, setNama] = useState("");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const lines: string[] = [];
    if (nama.trim()) lines.push(`Dari: ${nama.trim()}`);
    lines.push(pesan.trim());
    const subject = subjek.trim() || "Masukan PAGARMIK";
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n\n"))}`;
    window.location.href = url;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-1.5">
        <label htmlFor="nama" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Nama (opsional)
        </label>
        <input
          id="nama"
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama atau institusi Anda"
          className="form-input"
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="subjek" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Subjek <span className="text-rose-500">*</span>
        </label>
        <input
          id="subjek"
          type="text"
          required
          value={subjek}
          onChange={(e) => setSubjek(e.target.value)}
          placeholder="Contoh: Usulan fitur, laporan galat data, atau pertanyaan"
          className="form-input"
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="pesan" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pesan <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="pesan"
          required
          rows={5}
          value={pesan}
          onChange={(e) => setPesan(e.target.value)}
          placeholder="Tulis masukan Anda..."
          className="form-input text-sm leading-relaxed"
        />
      </div>

      <button type="submit" className="btn-primary">
        Kirim via Email
      </button>
      <p className="text-xs text-slate-500">
        Tombol membuka aplikasi email Anda dengan pesan terisi otomatis ke{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-pagar-700 underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </form>
  );
}