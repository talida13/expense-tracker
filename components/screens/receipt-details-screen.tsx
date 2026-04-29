"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Trash2,
  Save,
  Calendar,
  Store,
  DollarSign,
  Tag,
  Loader2,
  AlertCircle,
  Package,
  Plus,
  X,
  Edit,
} from "lucide-react";
import { doc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useReceipt } from "@/lib/useReceipt";
import { CATEGORIES } from "@/lib/types";
import { useAppSettings } from "@/lib/SettingsContext";
import { formatCurrency } from "@/lib/utils";

interface ReceiptDetailsScreenProps {
  receiptId: string;        // primești ID-ul, nu obiectul
  onBack: () => void;
  onDeleted: () => void;
  onSaved?: () => void;
}

export function ReceiptDetailsScreen({
  receiptId,
  onBack,
  onDeleted,
  onSaved,
}: ReceiptDetailsScreenProps) {
  const normalizedReceiptId = receiptId.startsWith("receipt_")
    ? receiptId
    : `receipt_${receiptId}`;

  const { receipt, loading } = useReceipt(normalizedReceiptId);
  const { settings, rates } = useAppSettings();
  console.log("DETAILS receiptId prop:", receiptId);
  console.log("DETAILS loading:", loading);
  console.log("DETAILS receipt:", receipt);

  const [formData, setFormData] = useState({
    storeName: "",
    userId: "",
    products: [],
    date: "",
    total: "",
    category: "",
  });
  const [products, setProducts] = useState<{ name: string; price: number }[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  // Populează form când vin datele din Firestore
useEffect(() => {
  if (!receipt) return;

  setFormData({
    storeName: receipt.storeName ?? "",
    userId: receipt.userId ?? "",
    date: receipt.date ?? "",
    products: receipt.products ?? [],
    total: receipt.total !== null && receipt.total !== undefined ? String(receipt.total) : "",
    category: receipt.category ?? "",
  });
  setProducts(receipt.products ?? []);
}, [receipt]);

  // Recalculează total când se schimbă produsele
  useEffect(() => {
    const totalFromProducts = products.reduce((sum, item) => sum + item.price, 0);
    if (totalFromProducts > 0) {
      setFormData(prev => ({ ...prev, total: totalFromProducts.toFixed(2) }));
    }
  }, [products]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDoc(doc(db, "receipts", receiptId), {
        storeName: formData.storeName,
        date: formData.date,
        total: parseFloat(formData.total) || 0,
        category: formData.category,
        products: products,
        status: "done",
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onSaved?.();
      }, 2000);
    } catch (err) {
      console.error("Eroare la save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Ștergi acest bon?")) return;
    await deleteDoc(doc(db, "receipts", receiptId));
    onDeleted();
  };

  // ── LOADING — procesare OCR ──────────────────────────
  if (loading || receipt?.status === "processing") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
        <p className="font-medium text-foreground">Processing receipt...</p>
        <p className="text-sm text-muted-foreground">
          Extracting data with Vision API
        </p>
      </div>
    );
  }

  // ── EROARE OCR ───────────────────────────────────────
  if (receipt?.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-5">
        <AlertCircle className="h-10 w-10 text-destructive" />
        <p className="font-medium text-foreground">Could not process receipt</p>
        <p className="text-sm text-muted-foreground">
          {receipt.errorMessage ?? "Unknown error"}
        </p>
        <Button onClick={onBack} variant="outline" className="rounded-xl">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  // ── FORM PRINCIPAL ───────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 px-5 pb-4 pt-6 backdrop-blur-lg lg:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              Receipt Details
            </h1>
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <Button
              variant="outline"
              className="rounded-xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            <Button
              className="rounded-xl bg-primary text-primary-foreground"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {saved ? "Saved!" : "Save Receipt"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6 pb-32 lg:px-8 lg:pb-8">
        <Card className="border-0 shadow-md">
          <CardContent className="space-y-6 p-5 lg:p-6">
            <div className="grid gap-6 lg:grid-cols-2">

              <div className="space-y-2 lg:col-span-2">
                <Label htmlFor="storeName" className="flex items-center gap-2 text-muted-foreground">
                  <Store className="h-4 w-4" /> Store Name
                </Label>
                <Input
                  id="storeName"
                  value={formData.storeName}
                  onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  className="h-12 rounded-xl border-input bg-secondary/50"
                  placeholder="Enter store name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" /> Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="h-12 rounded-xl border-input bg-secondary/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="total" className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" /> Total Amount (RON)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    Lei
                  </span>
                  <Input
                    id="total"
                    type="number"
                    step="0.01"
                    value={formData.total}
                    onChange={(e) => setFormData({ ...formData, total: e.target.value })}
                    className="h-12 rounded-xl border-input bg-secondary/50 pl-12"
                    placeholder="0.00"
                  />
                </div>
                {settings.currency !== 'RON' && (
                  <p className="text-xs text-muted-foreground">
                    Estimated in your currency: {(parseFloat(formData.total) / (rates[settings.currency] || 1)).toFixed(2)} {settings.currency}
                  </p>
                )}
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" /> Category
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12 rounded-xl border-input bg-secondary/50">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Produse extrase de OCR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-4 w-4" /> Extracted Items
                </Label>
                {/* {receipt?.imageUrl && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs h-6 px-2"
                    onClick={() => {
                      // 44afl
                      alert("Re-detection not implemented yet");
                    }}
                  >
                    Re-detect
                  </Button>
                )} */}
              </div>
              <div className="space-y-2 rounded-xl bg-secondary/30 p-4">
                {products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    {editingIndex === index ? (
                      <>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 h-8 text-sm mr-2"
                          placeholder="Product name"
                        />
                        <Input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-20 h-8 text-sm mr-2"
                          placeholder="Price"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                          onClick={() => {
                            if (editName.trim() && editPrice) {
                              const updatedProducts = [...products];
                              updatedProducts[index] = {
                                name: editName.trim(),
                                price: parseFloat(editPrice)
                              };
                              setProducts(updatedProducts);
                              setEditingIndex(null);
                              setEditName("");
                              setEditPrice("");
                            }
                          }}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-muted-foreground/70"
                          onClick={() => {
                            setEditingIndex(null);
                            setEditName("");
                            setEditPrice("");
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span className="text-foreground">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">
                            {item.price.toFixed(2)} Lei
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-blue-600"
                            onClick={() => {
                              setEditingIndex(index);
                              setEditName(item.name);
                              setEditPrice(item.price.toString());
                            }}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => setProducts(products.filter((_, i) => i !== index))}
                            disabled={products.length === 1}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {/* Add new product */}
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Input
                    placeholder="Product name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="flex-1 h-8 text-sm"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-20 h-8 text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => {
                      if (newProductName.trim() && newProductPrice) {
                        setProducts([...products, { name: newProductName.trim(), price: parseFloat(newProductPrice) }]);
                        setNewProductName("");
                        setNewProductPrice("");
                      }
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Preview imagine bon */}
            {receipt?.imageUrl && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Receipt Image</Label>
                <img
                  src={receipt.imageUrl}
                  alt="Receipt"
                  className="w-full rounded-xl object-contain max-h-64"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Butoane mobile */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/80 px-5 py-4 backdrop-blur-lg lg:hidden">
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-14 flex-1 rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
            onClick={handleDelete}
          >
            <Trash2 className="mr-2 h-5 w-5" /> Delete
          </Button>
          <Button
            className="h-14 flex-1 rounded-2xl bg-primary text-primary-foreground shadow-lg"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Save className="mr-2 h-5 w-5" />
            )}
            {saved ? "Saved!" : "Save"}
          </Button>
        </div>
      </div>
    </div>
  )
};