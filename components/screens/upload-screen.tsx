"use client";

import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Upload, FileText, Check, AlertCircle } from "lucide-react";
import { uploadReceipt } from "@/lib/uploadReceipt";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface UploadScreenProps {
  onClose: () => void;
  onUpload: (receiptId: string) => void;
}

type UploadState = "idle" | "dragging" | "uploading" | "success" | "error";

export function UploadScreen({ onClose, onUpload }: UploadScreenProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [userReady, setUserReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User Firebase:", user.uid);
        setUserReady(true);
        return;
      }

      try {
        const result = await signInAnonymously(auth);
        console.log("User anonim creat:", result.user.uid);
        setUserReady(true);
      } catch (error) {
        console.error(error);
        setErrorMessage("Nu s-a putut face autentificarea anonimă.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("dragging");
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("idle");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("idle");

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/") || file.type === "application/pdf") {
        setSelectedFile(file);
      }
    }
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);
      }
    },
    [],
  );

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    if (!userReady) {
      setErrorMessage("Autentificarea încă se încarcă. Încearcă din nou.");
      return;
    }

    setUploadState("uploading");
    setErrorMessage(null);

    try {
      const id = await uploadReceipt(selectedFile);

      setUploadState("success");

      setTimeout(() => {
        onUpload(id);
      }, 500);
    } catch (err) {
      console.error("Upload error:", err);
      setUploadState("error");
      setErrorMessage("Nu s-a putut încărca bonul.");
    }
}, [selectedFile, userReady, onUpload]);

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setUploadState("idle");
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 backdrop-blur-sm">
      <Card className="mx-4 w-full max-w-lg border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              Upload Receipt
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {!selectedFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
                uploadState === "dragging"
                  ? "border-accent bg-accent/5"
                  : "border-border bg-secondary/30 hover:border-muted-foreground hover:bg-secondary/50"
              }`}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl transition-colors ${
                  uploadState === "dragging" ? "bg-accent/20" : "bg-secondary"
                }`}
              >
                <Upload
                  className={`h-8 w-8 ${uploadState === "dragging" ? "text-accent" : "text-muted-foreground"}`}
                />
              </div>
              <h3 className="mb-2 font-semibold text-foreground">
                {uploadState === "dragging"
                  ? "Drop your file here"
                  : "Drag and drop your receipt"}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                or click to browse your files
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, PDF (Max 10MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-secondary/50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                  <FileText className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate font-medium text-foreground">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {uploadState === "idle" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
                {uploadState === "uploading" && (
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                )}
                {uploadState === "success" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                )}
                {uploadState === "error" && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive">
                    <AlertCircle className="h-4 w-4 text-destructive-foreground" />
                  </div>
                )}
              </div>

              {uploadState === "uploading" && (
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full animate-pulse rounded-full bg-accent"
                    style={{ width: "70%" }}
                  />
                </div>
              )}

              {uploadState === "idle" && (
                <Button
                  onClick={handleUpload}
                  disabled={!userReady}
                  className="w-full rounded-xl bg-accent py-6 text-accent-foreground hover:bg-accent/90"
                >
                  {userReady ? "Process Receipt" : "Preparing Firebase..."}
                </Button>
              )}

              {uploadState === "success" && (
                <p className="text-center text-sm font-medium text-green-600">
                  Upload successful! Processing...
                </p>
              )}
            </div>
          )}
          {errorMessage && (
            <p className="mt-4 text-center text-sm text-destructive">
              {errorMessage}
            </p>
          )}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Your receipt will be automatically scanned and data extracted
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
