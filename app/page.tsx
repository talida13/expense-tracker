"use client";

import { useState, useCallback, useEffect } from "react";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { DashboardScreen } from "@/components/screens/dashboard-screen";
import { ScanScreen } from "@/components/screens/scan-screen";
import { UploadScreen } from "@/components/screens/upload-screen";
import { ProcessingScreen } from "@/components/screens/processing-screen";
import { ReceiptDetailsScreen } from "@/components/screens/receipt-details-screen";
import { AllReceiptsScreen } from "@/components/screens/all-receipts-screen";
import { SettingsScreen } from "@/components/screens/settings-screen";
import type { Screen, Receipt } from "@/lib/types";
import { mockReceipts, monthlyData } from "@/lib/mock-data";

export default function ReceiptTrackerApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("onboarding");
  const [receipts, setReceipts] = useState<Receipt[]>(mockReceipts);
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);
  const [isNewReceipt, setIsNewReceipt] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

  const handleUploadComplete = useCallback(() => {
    setCurrentScreen("processing");
  }, []);

  const handleProcessingComplete = useCallback(() => {
    const newReceipt: Receipt = {
      id: Date.now().toString(),
      storeName: "New Store",
      date: new Date().toISOString().split("T")[0],
      total: 0,
      category: "Other",
    };
    setSelectedReceipt(newReceipt);
    setIsNewReceipt(true);
    setCurrentScreen("receipt-details");
  }, []);

  const handleViewReceipt = useCallback((receipt: Receipt) => {
    setSelectedReceipt(receipt);
    setIsNewReceipt(false);
    setCurrentScreen("receipt-details");
  }, []);

  const handleSaveReceipt = useCallback(
    (updatedReceipt: Receipt) => {
      if (isNewReceipt) {
        setReceipts((prev) => [updatedReceipt, ...prev]);
      } else {
        setReceipts((prev) =>
          prev.map((r) => (r.id === updatedReceipt.id ? updatedReceipt : r)),
        );
      }
      setCurrentScreen("dashboard");
      setSelectedReceipt(null);
    },
    [isNewReceipt],
  );

  const handleDeleteReceipt = useCallback((id: string) => {
    setReceipts((prev) => prev.filter((r) => r.id !== id));
    setCurrentScreen("dashboard");
    setSelectedReceipt(null);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentScreen("dashboard");
    setSelectedReceipt(null);
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
      if (!selectedReceipt) return null;
      return (
        <ReceiptDetailsScreen
          receipt={selectedReceipt}
          onBack={handleBack}
          onSave={handleSaveReceipt}
          onDelete={handleDeleteReceipt}
          isNew={isNewReceipt}
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
