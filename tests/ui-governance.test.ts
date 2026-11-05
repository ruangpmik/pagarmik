import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function sourceFiles(directory: string): string[] {
  return readdirSync(join(root, directory)).flatMap((name) => {
    const path = join(root, directory, name);
    if (statSync(path).isDirectory()) return sourceFiles(relative(root, path));
    return /\.(tsx|css)$/.test(path) ? [path] : [];
  });
}

describe("PAGARMIK UI design contract", () => {
  const files = [...sourceFiles("app"), ...sourceFiles("src/components")];
  const source = files.map((path) => readFileSync(path, "utf8")).join("\n");

  it("uses the documented brand palette as CSS tokens and Tailwind aliases", () => {
    const css = readFileSync(join(root, "app/globals.css"), "utf8");
    const tailwind = readFileSync(join(root, "tailwind.config.ts"), "utf8");

    expect(css).toContain("--brand-navy: #0b2e45");
    expect(css).toContain("--brand-teal: #15966d");
    expect(css).toContain("--accent-teal: #0f7254");
    expect(tailwind).toContain("rgb(var(--color-pagar-800) / <alpha-value>)");
    expect(css).toContain(".text-pagar-800 { color: rgb(var(--color-pagar-800))");
  });

  it("keeps white text on the primary accent at WCAG AA contrast", () => {
    const css = readFileSync(join(root, "app/globals.css"), "utf8");
    const match = css.match(/--color-pagar-700:\s*(\d+)\s+(\d+)\s+(\d+)/);
    expect(match).not.toBeNull();
    const linear = match!.slice(1, 4).map(Number).map((channel) => {
      const value = channel / 255;
      return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    const luminance = 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
    const contrastWithWhite = 1.05 / (luminance + 0.05);
    expect(contrastWithWhite).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps route titles on the shared heading scale", () => {
    for (const path of sourceFiles("app").filter((file) => /page\.tsx$/.test(file))) {
      const page = readFileSync(path, "utf8");
      const titleTags = [...page.matchAll(/<h1\b([^>]*)>/g)];
      expect(titleTags.length, relative(root, path)).toBeGreaterThan(0);
      for (const [, attributes] of titleTags) {
        const className = attributes.match(/className="([^"]*)"/)?.[1] ?? "";
        expect(className, relative(root, path)).not.toMatch(/(?:^|\s)(?:text-(?:xs|sm|base|lg|xl|\d)|font-)/);
      }
    }
  });

  it("avoids emoji and ornamental card effects in interface source", () => {
    expect(source).not.toMatch(/\p{Emoji_Presentation}/u);
    const gradientUtility = ["bg", "gradient", "to"].join("-");
    const blurUtility = ["backdrop", "blur"].join("-");
    const ornamentalPattern = new RegExp(
      "(?:^|\\s)(?:" + gradientUtility + "|" + blurUtility + "|shadow-(?:sm|md|lg))(?:\\s|:|\")",
    );
    expect(source).not.toMatch(ornamentalPattern);
  });

  it("ships the PAGARMIK mark as the App Router icon", () => {
    expect(statSync(join(root, "app/icon.png")).isFile()).toBe(true);
    expect(readFileSync(join(root, "app/layout.tsx"), "utf8")).toContain('src="/icon.png"');
  });

  it("prevents nested html/body tags in sub-route layouts", () => {
    for (const path of sourceFiles("app").filter((file) => /layout\.tsx$/.test(file))) {
      const rel = relative(root, path).replace(/\\/g, "/");
      if (rel === "app/layout.tsx") continue;
      const content = readFileSync(path, "utf8");
      expect(content, rel).not.toMatch(/<(?:html|body)\b/i);
    }
  });

  it("mounts the unified FeedbackProvider, toast deduplication, and accessible confirmation dialog", () => {
    const layout = readFileSync(join(root, "app/layout.tsx"), "utf8");
    const feedback = readFileSync(join(root, "src/components/FeedbackProvider.tsx"), "utf8");
    const submitBtn = readFileSync(join(root, "src/components/SubmitButton.tsx"), "utf8");

    expect(layout).toContain("<FeedbackProvider>");
    expect(feedback).toContain("dedupeKey");
    expect(feedback).toContain('role="dialog"');
    expect(feedback).toContain('aria-modal="true"');
    expect(submitBtn).toContain("aria-busy={submitting}");
    expect(submitBtn).toContain("disabled={disabled || submitting}");
  });

  it("provides consistent Breadcrumb navigation across all non-home page routes", () => {
    for (const path of sourceFiles("app").filter((file) => /page\.tsx$/.test(file))) {
      const rel = relative(root, path).replace(/\\/g, "/");
      if (rel === "app/page.tsx") continue;
      const page = readFileSync(path, "utf8");
      expect(page, rel).toContain("Breadcrumb");
    }
  });

  it("avoids font-extrabold unsupported by loaded IBM Plex Sans weights", () => {
    expect(source).not.toMatch(/\bfont-extrabold\b/);
  });

  it("provides App Router loading, error-recovery, not-found, offline, and retry states", () => {
    const loading = readFileSync(join(root, "app/loading.tsx"), "utf8");
    const errorBoundary = readFileSync(join(root, "app/error.tsx"), "utf8");
    const notFound = readFileSync(join(root, "app/not-found.tsx"), "utf8");
    const feedback = readFileSync(join(root, "src/components/FeedbackProvider.tsx"), "utf8");
    const comparePanel = readFileSync(join(root, "src/components/CompareAiPanel.tsx"), "utf8");
    const explainBtn = readFileSync(join(root, "src/components/ExplainPasalButton.tsx"), "utf8");

    expect(loading).toContain('aria-busy="true"');
    expect(errorBoundary).toContain("reset()");
    expect(notFound).toContain("<EmptyState");
    expect(feedback).toContain('window.addEventListener("offline"');
    expect(feedback).toContain('event.key === "Tab"');
    expect(comparePanel).toContain("/api/ai/compare");
    expect(comparePanel).toContain("Coba lagi");
    expect(explainBtn).toContain("/api/ai/explain-pasal");
    expect(explainBtn).toContain("Coba lagi");
  });
});
