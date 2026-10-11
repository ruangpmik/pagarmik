// Seed: menulis data/users.json (akun demo) dan memvalidasi seed.json.
// Production dengan DB: ganti dengan Prisma create (lihat docs/database-schema.md).
import { writeFileSync, mkdirSync, readFileSync } from "fs";
import { join } from "path";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hash(pw: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(pw, salt, 64)) as Buffer;
  return `${salt}:${buf.toString("hex")}`;
}

async function main() {
  const seed = JSON.parse(readFileSync(join(process.cwd(), "prisma", "seed.json"), "utf-8"));
  console.log(`Seed valid: ${seed.regulations.length} regulasi, ${seed.pasals.length} pasal, ${seed.topics.length} topik, ${seed.articles.length} artikel.`);

  mkdirSync(join(process.cwd(), "data"), { recursive: true });
  // KRITIS: jangan pernah menanam akun demo berkredensial publik di production.
  // Container production menjalankan seed ini setiap start (lihat docker-compose.yml).
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_DEMO_USERS !== "1") {
    console.log("Production: penulisan akun demo DILEWATI. Buat admin via Prisma langsung dengan password kuat.");
    return;
  }
  const adminPass = randomBytes(12).toString("base64url");
  const demoPass = randomBytes(12).toString("base64url");
  const users = [
    { id: "u-admin", email: "admin@pagarmik.id", name: "Admin PAGARMIK", role: "ADMIN", passwordHash: await hash(adminPass) },
    { id: "u-demo", email: "pmik@contoh.id", name: "Demo PMIK", role: "USER", profesi: "PMIK", passwordHash: await hash(demoPass) },
  ];
  writeFileSync(join(process.cwd(), "data", "users.json"), JSON.stringify(users, null, 2));
  console.log(`DEMO LOGIN — admin@pagarmik.id / ${adminPass} (ADMIN)`);
  console.log(`DEMO LOGIN — pmik@contoh.id / ${demoPass} (USER)`);
}

main().catch((e) => { console.error(e); process.exit(1); });
