import {onObjectFinalized} from "firebase-functions/v2/storage";
import {initializeApp} from "firebase-admin/app";
import {getFirestore, FieldValue} from "firebase-admin/firestore";
import {ImageAnnotatorClient} from "@google-cloud/vision";
import {parseReceipt} from "./parseReceipt";

initializeApp();

export const processReceipt = onObjectFinalized(
  {region: "us-east1"},
  async (event) => {
    const filePath = event.data.name;
    const bucket = event.data.bucket;

    // Ignoră fișiere care nu sunt în /receipts/
    if (!filePath.includes("/receipts/")) {
      console.log("Ignorat, nu e bon:", filePath);
      return;
    }

    // Extrage receiptId din path:
    // users/{uid}/receipts/receipt_1234567890.jpg
    const fileName = filePath.split("/").pop() ?? "";
    const receiptId = fileName.replace(/\.[^.]+$/, ""); // scoate extensia

    console.log("Procesez bon:", receiptId);

    const db = getFirestore();
    const receiptRef = db.collection("receipts").doc(receiptId);

    try {
      // ── 1. Vision API — OCR ──────────────────────────
      const visionClient = new ImageAnnotatorClient();
      const [result] = await visionClient.textDetection(
        `gs://${bucket}/${filePath}`,
      );

      const fullText = result.fullTextAnnotation?.text ?? "";
      console.log("Text detectat:", fullText.slice(0, 200));

      if (!fullText) {
        await receiptRef.update({
          status: "error",
          errorMessage: "Nu s-a putut extrage text din imagine.",
          updatedAt: FieldValue.serverTimestamp(),
        });
        return;
      }

      // ── 2. Parsare text ──────────────────────────────
      const parsed = parseReceipt(fullText);
      console.log("Parsare rezultat:", parsed);

      // ── 3. Actualizare Firestore ─────────────────────
      await receiptRef.update({
        storeName: parsed.storeName,
        date: parsed.date,
        total: parsed.total,
        products: parsed.products,
        rawText: fullText, // util pentru debugging
        status: "done",
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log("Bon procesat cu succes:", receiptId);
    } catch (err) {
      console.error("Eroare la procesare:", err);

      await receiptRef.update({
        status: "error",
        errorMessage: err instanceof Error ? err.message : "Eroare necunoscută",
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  },
);
