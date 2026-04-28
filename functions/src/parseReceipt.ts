export interface ParsedReceipt {
  storeName: string;
  date: string | null;
  total: number | null;
  products: { name: string; price: number }[];
}
/**
 * Parsează textul OCR extras din bon.
 *
 * @param {string} text Textul OCR extras din imaginea bonului.
 * @return {ParsedReceipt} Datele structurate extrase din bon.
 */
export function parseReceipt(text: string): ParsedReceipt {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  // ── TOTAL ──────────────────────────────────────────────
  // Caută linii cu TOTAL, SUMA, DE PLATA, etc.
  let total: number | null = null;
  const totalRegex =
    /(?:TOTAL|SUMA|DE PLAT[AĂ]|ACHITAT)\s*:?\s*(\d+[.,]\d{2})/i;
  for (const line of lines) {
    const match = line.match(totalRegex);
    if (match) {
      total = parseFloat(match[1].replace(",", "."));
      break;
    }
  }

  // ── DATĂ ───────────────────────────────────────────────
  // Format DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY
  let date: string | null = null;
  const dateRegex = /(\d{2})[/.-](\d{2})[/.-](\d{4})/;
  for (const line of lines) {
    const match = line.match(dateRegex);
    if (match) {
      date = `${match[3]}-${match[2]}-${match[1]}`; // ISO: YYYY-MM-DD
      break;
    }
  }

  // ── MAGAZIN ────────────────────────────────────────────
  // Prima linie non-goală e de obicei numele magazinului
  const storeName = lines[0] ?? "Necunoscut";

  // ── PRODUSE ────────────────────────────────────────────
  // Linii de forma: "Nume produs    9.99" sau "Nume produs    9,99"
  const products: { name: string; price: number }[] = [];
  const productRegex = /^(.{3,}?)\s{2,}(\d+[.,]\d{2})\s*$/;
  const skipRegex = /TOTAL|SUMA|TVA|PLAT|BON|CASA|DATA|NR\.|CF|CUI/i;

  for (const line of lines.slice(1)) {
    if (skipRegex.test(line)) continue;
    const match = line.match(productRegex);
    if (match) {
      products.push({
        name: match[1].trim(),
        price: parseFloat(match[2].replace(",", ".")),
      });
    }
  }

  return {storeName, date, total, products};
}
