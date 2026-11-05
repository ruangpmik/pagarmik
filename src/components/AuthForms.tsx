"use client";

import { useState, type FormEvent } from "react";
import { SubmitButton } from "@/components/SubmitButton";

export function LoginForm({ nextUrl }: { nextUrl: string }) {
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const nextErrors: { email?: string; password?: string } = {};

    if (!email || !email.includes("@")) {
      nextErrors.email = "Masukkan alamat email yang valid (contoh: nama@institusi.id).";
    }
    if (!password) {
      nextErrors.password = "Kata sandi wajib diisi.";
    }

    if (Object.keys(nextErrors).length > 0) {
      e.preventDefault();
      setErrors(nextErrors);
      return;
    }
    setErrors({});
  };

  return (
    <form
      action="/api/auth/login"
      method="post"
      noValidate
      onSubmit={handleSubmit}
      className="section-card grid gap-4"
    >
      <input type="hidden" name="next" value={nextUrl} />

      <div className="grid gap-1">
        <label htmlFor="login-email" className="text-sm font-semibold text-pagar-800">
          Email <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          placeholder="nama@rumah-sakit.id"
          className="form-input"
          onChange={() => errors.email && setErrors((prev) => ({ ...prev, email: undefined }))}
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            Kesalahan validasi: {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="login-password" className="text-sm font-semibold text-pagar-800">
          Kata sandi <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "login-password-error" : undefined}
          className="form-input"
          onChange={() => errors.password && setErrors((prev) => ({ ...prev, password: undefined }))}
        />
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            Kesalahan validasi: {errors.password}
          </p>
        )}
      </div>

      <SubmitButton loadingLabel="Memverifikasi kredensial..." className="w-full">
        Masuk
      </SubmitButton>
    </form>
  );
}

export function RegisterForm() {
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const nextErrors: { name?: string; email?: string; password?: string } = {};

    if (name.length < 2) {
      nextErrors.name = "Nama lengkap minimal terdiri dari 2 karakter.";
    }
    if (!email.includes("@")) {
      nextErrors.email = "Masukkan format alamat email yang valid.";
    }
    if (password.length < 8) {
      nextErrors.password = "Kata sandi wajib minimal 8 karakter.";
    }

    if (Object.keys(nextErrors).length > 0) {
      e.preventDefault();
      setErrors(nextErrors);
      return;
    }
    setErrors({});
  };

  return (
    <form
      action="/api/auth/register"
      method="post"
      noValidate
      onSubmit={handleSubmit}
      className="section-card grid gap-4"
    >
      <div className="grid gap-1">
        <label htmlFor="reg-name" className="text-sm font-semibold text-pagar-800">
          Nama lengkap <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="reg-name"
          name="name"
          required
          minLength={2}
          autoComplete="name"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "reg-name-error" : undefined}
          className="form-input"
          onChange={() => errors.name && setErrors((prev) => ({ ...prev, name: undefined }))}
        />
        {errors.name && (
          <p id="reg-name-error" role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            Kesalahan validasi: {errors.name}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="reg-email" className="text-sm font-semibold text-pagar-800">
          Email <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "reg-email-error" : undefined}
          placeholder="nama@institusi.id"
          className="form-input"
          onChange={() => errors.email && setErrors((prev) => ({ ...prev, email: undefined }))}
        />
        {errors.email && (
          <p id="reg-email-error" role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            Kesalahan validasi: {errors.email}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="reg-profesi" className="text-sm font-semibold text-pagar-800">
          Profesi / Peran
        </label>
        <select id="reg-profesi" name="profesi" className="form-input">
          <option>PMIK</option>
          <option>Mahasiswa RMIK</option>
          <option>Dosen RMIK</option>
          <option>Manajemen RS</option>
          <option>IT/SIMRS</option>
          <option>Tim Legal RS</option>
          <option>Lainnya</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor="reg-institusi" className="text-sm font-semibold text-pagar-800">
          Institusi (opsional)
        </label>
        <input
          id="reg-institusi"
          name="institusi"
          placeholder="Nama rumah sakit, klinik, atau perguruan tinggi"
          className="form-input"
        />
      </div>

      <div className="grid gap-1">
        <label htmlFor="reg-password" className="text-sm font-semibold text-pagar-800">
          Kata sandi (minimal 8 karakter) <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="reg-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? "reg-password-error" : "reg-password-hint"}
          className="form-input"
          onChange={() => errors.password && setErrors((prev) => ({ ...prev, password: undefined }))}
        />
        <p id="reg-password-hint" className="text-xs text-ink-900/65">
          Gunakan minimal 8 karakter untuk keamanan akun Anda.
        </p>
        {errors.password && (
          <p id="reg-password-error" role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            Kesalahan validasi: {errors.password}
          </p>
        )}
      </div>

      <SubmitButton loadingLabel="Mendaftarkan akun..." className="w-full">
        Buat akun
      </SubmitButton>
    </form>
  );
}

