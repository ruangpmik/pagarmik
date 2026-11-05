"use client";

import { useState, type FormEvent } from "react";
import { CONTACT_EMAIL } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

export default function MasukanForm() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [subjek, setSubjek] = useState("");
  const [pesan, setPesan] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/masukan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, subjek, pesan }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setStatus("error");
        setError(data.error || "Gagal mengirim. Coba lagi nanti.");
        return;
      }
      setStatus("success");
      setNama("");
      setEmail("");
      setSubjek("");
      setPesan("");
    } catch {
      setStatus("error");
      setError("Jaringan bermasalah. Coba lagi.");
    }
  }

  if (status === "success") {
    return (
      <div className="space-y-3">
        <p className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status">
          Terima kasih! Masukan Anda sudah terkirim ke {CONTACT_EMAIL}.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary">
          Kirim masukan lain
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <p className="rounded-xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-700" role="alert">
          {error}{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline underline-offset-2">
            Kirim lewat email langsung
          </a>
          .
        </p>
      )}

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
        <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Email Anda (opsional)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Agar kami bisa membalas"
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

      <button type="submit" className="btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Mengirim..." : "Kirim Masukan"}
      </button>
    </form>
  );
}