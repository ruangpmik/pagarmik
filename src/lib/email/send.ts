// Pengiriman email masukan via SMTP (nodemailer).
// Kredensial dibaca dari env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.
// Default dikonfigurasi untuk Gmail (smtp.gmail.com:587) dengan App Password.

import nodemailer from "nodemailer";

const FROM = process.env.SMTP_FROM ?? "PAGARMIK <ruangpmik@gmail.com>";
const TO = process.env.SMTP_TO ?? "ruangpmik@gmail.com";

export async function sendMasukan(input: {
  nama?: string;
  email?: string;
  subjek: string;
  pesan: string;
}): Promise<void> {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP belum dikonfigurasi. Atur SMTP_HOST, SMTP_USER, SMTP_PASS.");
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === "465",
    auth: { user, pass },
  });

  const sender = input.nama || "Anonim";
  const body = [`Dari: ${sender}${input.email ? ` <${input.email}>` : ""}`, "", input.pesan].join("\n");

  await transporter.sendMail({
    from: FROM,
    to: TO,
    replyTo: input.email || undefined,
    subject: `[Masukan PAGARMIK] ${input.subjek}`,
    text: body,
  });
}