import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://www.bnr.ro/nbrfxrates.xml');
    const text = await response.text();
    const rates: Record<string, number> = { RON: 1 };
    // Parse XML manually
    const rateMatches = text.matchAll(/<Rate currency="([^"]+)">([^<]+)<\/Rate>/g);
    for (const match of rateMatches) {
      const currency = match[1];
      const value = parseFloat(match[2]);
      if (currency && value > 0) {
        rates[currency] = value;
      }
    }
    return NextResponse.json(rates);
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return NextResponse.json({ RON: 1 }, { status: 500 });
  }
}