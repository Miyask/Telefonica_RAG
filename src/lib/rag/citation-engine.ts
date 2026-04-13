import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { RetrievalResult } from "./rag-retriever";

export function formatCitation(results: RetrievalResult[]): string {
  if (results.length === 0) return "";

  return results.map(res => {
    const doc = res.document;
    const expiryDate = new Date(doc.expiryDate);
    const formattedDate = format(expiryDate, "dd/MM/yyyy");
    
    return `Según [${doc.title}] v[${doc.version}] ([${doc.owner}], vigencia [${formattedDate}]): ${doc.content}`;
  }).join("\n\n");
}

export function validateCitation(text: string): boolean {
  // Regex to check the mandatory format
  const citationRegex = /Según \[.+\] v\[\d+\.\d+\] \(\[.+\], vigencia \[\d{2}\/\d{2}\/\d{4}\]\):/;
  return citationRegex.test(text);
}
