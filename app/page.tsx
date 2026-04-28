"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { ScanScreen } from "@/components/screens/scan-screen";
import { UploadScreen } from "@/components/screens/upload-screen";
import { ProcessingScreen } from "@/components/screens/processing-screen";
import { ReceiptDetailsScreen } from "@/components/screens/receipt-details-screen";
import { AllReceiptsScreen } from "@/components/screens/all-receipts-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import type { Screen, Receipt } from "@/lib/types";
import { useReceipts } from "@/lib/useReceipts";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ReceiptTrackerApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [selectedReceiptId, setSelectedReceiptId] = useState<string | null>(
    null,
  );
  const [isNewReceipt, setIsNewReceipt] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  const { receipts: firebaseReceipts, loading } = useReceipts();

  useEffect(() => {
    // Temporarily disabled auth check
    // const unsub = onAuthStateChanged(auth, (user) => {
    //   setUser(user);
    //   if (user) {
    //     setCurrentScreen("dashboard");
    //   } else {
    //     setCurrentScreen("onboarding");
    //   }
    // });
    // return unsub;
    setCurrentScreen("dashboard");
  }, []);

  const receipts = useMemo(() => {
    return firebaseReceipts
      .filter(r => r.status === "done" && r.total !== null && r.date !== null)
      .map(r => ({
        id: r.receiptId,
        storeName: r.storeName || "Unknown",
        date: r.date || "",
        total: r.total || 0,
        category: r.category || "Other",
        items: r.products.map(p => ({ name: p.name, price: p.price, quantity: 1 })),
      }));
  }, [firebaseReceipts]);

  const monthlyData = useMemo(() => {
    const monthMap: { [key: string]: number } = {};
    receipts.forEach(r => {
      if (r.date) {
        const date = new Date(r.date);
        const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
        monthMap[month] = (monthMap[month] || 0) + r.total;
      }
    });
    return Object.entries(monthMap).map(([month, amount]) => ({ month, amount }));
  }, [receipts]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const handleGetStarted = useCallback(() => {
    setCurrentScreen("dashboard");
  }, []);

  const handleScanReceipt = useCallback(() => {
    setCurrentScreen("scan");
  }, []);

  const handleUploadReceipt = useCallback(() => {
    setCurrentScreen("upload");
  }, []);

  const handleCapture = useCallback(() => {
    setCurrentScreen("processing");
  }, []);

  const handleUploadComplete = useCallback((receiptId: string) => {
    setSelectedReceiptId(receiptId);
    setIsNewReceipt(true);
    setCurrentScreen("receipt-details");
  }, []);

  const handleViewReceipt = useCallback((receipt: Receipt) => {
    setSelectedReceiptId(receipt.id);
    setIsNewReceipt(false);
    setCurrentScreen("receipt-details");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    setCurrentScreen("dashboard");
  }, []);

  const handleSaveReceipt = useCallback(
    (updatedReceipt: Receipt) => {
      // Since we use Firebase, the data updates automatically
      setCurrentScreen("dashboard");
      setSelectedReceiptId(null);
    },
    [],
  );

  const handleDeleteReceipt = useCallback((id: string) => {
    // Since we use Firebase, the data updates automatically
    setCurrentScreen("dashboard");
    setSelectedReceiptId(null);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen("dashboard");
    setSelectedReceiptId(null);
  }, []);

  switch (currentScreen) {
    case "onboarding":
      return <OnboardingScreen onGetStarted={handleGetStarted} />;

    case "dashboard":
      return (
        <DashboardScreen
          receipts={receipts}
          monthlyData={monthlyData}
          onScanReceipt={handleScanReceipt}
          onUploadReceipt={handleUploadReceipt}
          onViewAllReceipts={() => setCurrentScreen("all-receipts")}
          onViewReceipt={handleViewReceipt}
          onOpenSettings={() => setCurrentScreen("settings")}
        />
      );

    case "scan":
      return <ScanScreen onClose={handleBack} onCapture={handleCapture} />;

    case "upload":
      return (
        <UploadScreen onClose={handleBack} onUpload={handleUploadComplete} />
      );

    case "processing":
      return <ProcessingScreen onComplete={handleProcessingComplete} />;

    case "receipt-details":
      if (!selectedReceiptId) return null;
      return (
        <ReceiptDetailsScreen
          receiptId={selectedReceiptId}
          onBack={handleBack}
          onDeleted={() => {
            setCurrentScreen("dashboard");
            setSelectedReceiptId(null);
          }}
          onSaved={() => {
            setCurrentScreen("dashboard");
            setSelectedReceiptId(null);
          }}
        />
      );

    case "all-receipts":
      return (
        <AllReceiptsScreen
          receipts={receipts}
          onBack={handleBack}
          onViewReceipt={handleViewReceipt}
        />
      );

    case "settings":
      return (
        <SettingsScreen
          onBack={handleBack}
          isDarkMode={isDarkMode}
          onToggleDarkMode={setIsDarkMode}
        />
      );

    default:
      return null;
  }
}
