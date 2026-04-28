// lib/uploadReceipt.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { storage, db, auth } from "./firebase";
export async function uploadReceipt(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("Utilizatorul nu este autentificat");

  const receiptId = `receipt_${Date.now()}`;
  const storagePath = `users/${user.uid}/receipts/${receiptId}.jpg`;
  const storageRef = ref(storage, storagePath);

  await setDoc(doc(db, "receipts", receiptId), {
    userId: user.uid,
    receiptId,
    imagePath: storagePath,
    imageUrl: null,
    storeName: null,
    date: null,
    total: null,
    products: [],
    status: "processing",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  await setDoc(
    doc(db, "receipts", receiptId),
    {
      imageUrl: downloadURL,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return receiptId;
}