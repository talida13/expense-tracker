export interface ParsedReceipt {
  storeName: string;
  date: string | null;
  total: number | null;
  products: {name: string; price: number}[];
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

  const fullText = lines.join(" ");

  let total: number | null = null;

  const totalRegex =
        /(?:^|\s)TOTAL(?!\s*TVA)(?:\s+(?:LEI|RON))?[^\d]{0,15}(\d+[.,]\d{2})/i;

  const totalMatch = fullText.match(totalRegex);
  if (totalMatch) {
    total = parseFloat(totalMatch[1].replace(",", "."));
  }

  let date: string | null = null;
  const dateRegex = /(\d{2})[/.-](\d{2})[/.-](\d{4})/;

  const dateMatch = fullText.match(dateRegex);
  if (dateMatch) {
    date = `${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}`;
  }

  let storeName = "Necunoscut";
  const companyRegex = /S\.C\.\s+(.+?)\s+S\.R\.L\./i;
  const companyMatch = fullText.match(companyRegex);

  if (companyMatch) {
    storeName = companyMatch[1].trim();
  } else {
    for (const line of lines) {
      if (/^[a-zA-ZăâîșțĂÂÎȘȚ\s]{3,}$/.test(line)) {
        storeName = line;
        break;
      }
    }
  }

  const products: { name: string; price: number }[] = [];

  const productPattern =
    "(?:^|\\s)" +
    "\\d+[.,]\\d{3}\\s*x\\s*" +
    "(?:COL)?\\d+[.,]\\d{2}\\s+" +
    "(.+?)\\s+" +
    "(\\d+[.,]\\d{2})\\s+[ABab](?=\\s|$)";

  const productRegex = new RegExp(productPattern, "g");
  let productMatch;

  while ((productMatch = productRegex.exec(fullText)) !== null) {
    const name = productMatch[1].replace(/\s+[ABab]$/, "").trim();

    const price = parseFloat(productMatch[2].replace(",", "."));

    if (name.length >= 3 && price > 0) {
      products.push({name, price});
    }
  }

  return {storeName, date, total, products};
}
