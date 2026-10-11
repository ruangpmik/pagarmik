declare module "pdf-parse" {
  interface PdfResult {
    text: string;
    numpages: number;
    info: unknown;
    metadata: unknown;
  }
  const pdfParse: (data: Buffer, options?: Record<string, unknown>) => Promise<PdfResult>;
  export default pdfParse;
}
