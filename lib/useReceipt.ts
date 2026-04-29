import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export interface ReceiptData {
  userId: string;
  receiptId: string;
  storeName: string | null;
  date: string | null;
  total: number | null;
  products: { name: string; price: number }[];
  status: "processing" | "done" | "error";
  imageUrl: string | null;
  imagePath: string;
  category?: string;
  errorMessage?: string;
}

export function useReceipt(receiptId: string | null) {
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!receiptId) {
      console.log("useReceipt: no receiptId");
      setReceipt(null);
      setLoading(false);
      return;
    }

    console.log("useReceipt listening to:", receiptId);
    setLoading(true);

    const receiptRef = doc(db, "receipts", receiptId);

    const unsub = onSnapshot(
      receiptRef,
      (snap) => {
        console.log("Firestore snap exists:", snap.exists());
        console.log("Firestore snap id:", snap.id);
        console.log("Firestore snap data:", snap.data());

        if (snap.exists()) {
          setReceipt({
            ...(snap.data() as ReceiptData),
            receiptId: snap.id,
          });
        } else {
          setReceipt(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error("useReceipt error:", error);
        setReceipt(null);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [receiptId]);

  return { receipt, loading };
}
