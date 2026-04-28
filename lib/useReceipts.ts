import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db, auth } from "./firebase";

export interface ReceiptData {
  receiptId: string;
  userId: string;
  storeName: string | null;
  date: string | null;
  total: number | null;
  products: { name: string; price: number }[];
  status: "processing" | "done" | "error";
  imageUrl: string | null;
  imagePath: string;
  category?: string;
  errorMessage?: string;
  createdAt: any;
  updatedAt: any;
}

export function useReceipts() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // const user = auth.currentUser;
    // if (!user) {
    //   setReceipts([]);
    //   setLoading(false);
    //   return;
    // }

    const q = query(collection(db, "receipts"));
    // 44afl @ will add after firebase auth: where("userId", "==", user.uid)

    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        const receiptsData: ReceiptData[] = [];
        querySnapshot.forEach((doc) => {
          receiptsData.push({
            ...(doc.data() as ReceiptData),
            receiptId: doc.id,
          });
        });
        setReceipts(receiptsData);
        setLoading(false);
      },
      (error) => {
        console.error("useReceipts error:", error);
        setReceipts([]);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  return { receipts, loading };
}