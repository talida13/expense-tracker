// lib/uploadReceipt.ts
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { storage, db, auth } from "./firebase";

export async function uploadReceipt(file: File): Promise<string> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Utilizatorul nu este autentificat");
  }

  const receiptId = `receipt_${Date.now()}`;

  // Path în Cloud Storage
  const storagePath = `users/${user.uid}/receipts/${receiptId}.jpg`;
  const storageRef = ref(storage, storagePath);

  // 1. Upload imagine în Storage
  await uploadBytes(storageRef, file);

  // 2. Luăm URL-ul imaginii
  const downloadURL = await getDownloadURL(storageRef);

  // 3. Creăm documentul în Firestore cu același ID ca receiptId
  await setDoc(doc(db, "receipts", receiptId), {
    userId: user.uid,
    receiptId,
    imagePath: storagePath,
    imageUrl: downloadURL,

    // momentan nu avem OCR, deci rămân goale/null
    storeName: null,
    date: null,
    total: null,
    products: [],

    // Cloud Function-ul va schimba în "done" sau "error"
    status: "processing",

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return receiptId;
}
