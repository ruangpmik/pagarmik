import { Fragment, type ReactNode } from "react";

/**
 * PAGARMIK memakai subset markdown di beberapa medan konten:
 * artikel "konten" (## heading, 1. daftar) dan jawaban AI (**bold**).
 * Renderer ringan ini menangani subset itu tanpa dependensi baru.
 * Teks dirender sebagai React text node, jadi aman dari injeksi HTML.
 */

/** Inline **bold** dan `code`. Dipakai di dalam kontainer white-space: pre-line. */
export function InlineMarkdown({ text }: { text: string }): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      return (
        <code key={i} className="rounded bg-ink-100 px-1 text-[0.9em]">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const isHeading = (s: string) => /^#{2,4}\s+/.test(s);
const isOrdered = (s: string) => /^\d+\.\s+/.test(s);
const isUnordered = (s: string) => /^[-*]\s+/.test(s);

/** Blok markdown: ## heading, daftar bernomor/titik, paragraf. */
export function Markdown({ text }: { text: string }) {
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];
    const h = line.match(/^(#{2,4})\s+(.*)$/);
    if (h) {
      const Tag = `h${h[1].length}` as "h2" | "h3" | "h4";
      out.push(
        <Tag key={k++}>
          <InlineMarkdown text={h[2]} />
        </Tag>,
      );
      i++;
      continue;
    }
    if (isOrdered(line)) {
      const items: string[] = [];
      while (i < lines.length && isOrdered(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      out.push(
        <ol key={k++}>
          {items.map((it, j) => (
            <li key={j}>
              <InlineMarkdown text={it} />
            </li>
          ))}
        </ol>,
      );
      continue;
    }
    if (isUnordered(line)) {
      const items: string[] = [];
      while (i < lines.length && isUnordered(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i++;
      }
      out.push(
        <ul key={k++}>
          {items.map((it, j) => (
            <li key={j}>
              <InlineMarkdown text={it} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !isHeading(lines[i]) &&
      !isOrdered(lines[i]) &&
      !isUnordered(lines[i])
    ) {
      para.push(lines[i]);
      i++;
    }
    out.push(
      <p key={k++}>
        <InlineMarkdown text={para.join(" ")} />
      </p>,
    );
  }

  return <div className="prose-pagar">{out}</div>;
}