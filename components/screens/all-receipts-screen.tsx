"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Search,
  FileText,
  Filter,
  X,
  Calendar,
  ChevronRight,
  ShoppingBag,
  Car,
  Coffee,
  ShoppingCart,
  Heart,
  Film,
  Package,
} from "lucide-react";
import type { Receipt } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import { useAppSettings } from "@/lib/SettingsContext";
import { formatCurrency } from "@/lib/utils";

interface AllReceiptsScreenProps {
  receipts: Receipt[];
  onBack: () => void;
  onViewReceipt: (receipt: Receipt) => void;
}

const categoryIcons: Record<string, React.ElementType> = {
  Groceries: ShoppingCart,
  Transportation: Car,
  Dining: Coffee,
  Shopping: ShoppingBag,
  Healthcare: Heart,
  Entertainment: Film,
  Other: Package,
};

const categoryColors: Record<string, string> = {
  Groceries:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Transportation:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Dining:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Shopping: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Healthcare: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Entertainment:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
};

export function AllReceiptsScreen({
  receipts,
  onBack,
  onViewReceipt,
}: AllReceiptsScreenProps) {
  const { settings, rates } = useAppSettings();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter((receipt) => {
      const matchesSearch = receipt.storeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || receipt.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [receipts, searchQuery, categoryFilter]);

  const sortedReceipts = useMemo(() => {
    return [...filteredReceipts].sort((a, b) => b.date.localeCompare(a.date));
  }, [filteredReceipts]);

  const totalFiltered = filteredReceipts.reduce((sum, r) => sum + r.total, 0);

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || Package;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 px-5 pb-4 pt-6 backdrop-blur-xl lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onBack}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
              All Receipts
            </h1>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search receipts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 rounded-xl border border-border/50 bg-card pl-11 pr-4 shadow-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Button
              variant={showFilters ? "default" : "outline"}
              size="icon"
              className="h-12 w-12 rounded-xl lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-5 w-5" />
            </Button>
            <div className="hidden lg:block">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 w-48 rounded-xl border border-border/50 bg-card shadow-sm">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200 lg:hidden">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 rounded-xl border border-border/50 bg-card">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </header>

      <div className="border-b border-border/50 bg-card/50 px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
          <span className="font-medium text-muted-foreground">
            {filteredReceipts.length} receipt
            {filteredReceipts.length !== 1 ? "s" : ""}
          </span>
          <span className="font-serif font-semibold text-foreground">
            Total: {formatCurrency(totalFiltered, settings.currency, rates)}
          </span>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 py-6 lg:px-8">
        {sortedReceipts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-1 font-serif font-semibold text-foreground">
              No receipts found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery || categoryFilter !== "all"
                ? "Try adjusting your filters"
                : "Start scanning receipts to see them here"}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {sortedReceipts.map((receipt) => {
                const CategoryIcon = getCategoryIcon(receipt.category);
                const itemCount = receipt.items?.length || 0;

                return (
                  <Card
                    key={receipt.id}
                    className="group cursor-pointer border border-border/50 bg-card shadow-sm transition-all duration-200 hover:border-border hover:shadow-md"
                    onClick={() => onViewReceipt(receipt)}
                  >
                    <CardContent className="p-5">
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl ${categoryColors[receipt.category] || categoryColors.Other}`}
                        >
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${categoryColors[receipt.category] || categoryColors.Other}`}
                        >
                          {receipt.category}
                        </span>
                      </div>

                      <div className="mb-3">
                        <h4 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {receipt.storeName}
                        </h4>
                        <p className="font-serif text-2xl font-bold tracking-tight text-foreground">
                          {formatCurrency(receipt.total, settings.currency, rates)}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-border/50 pt-3">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatShortDate(receipt.date)}</span>
                        </div>
                        {itemCount > 0 && (
                          <span className="text-sm text-muted-foreground">
                            {itemCount} item{itemCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>

                      {receipt.items && receipt.items.length > 0 && (
                        <div className="mt-3 border-t border-border/50 pt-3">
                          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Items
                          </p>
                          <div className="space-y-1">
                            {receipt.items.slice(0, 3).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-sm"
                              >
                                <span className="truncate text-foreground/80">
                                  {item.name}
                                </span>
                                <span className="ml-2 text-muted-foreground">
                                  {formatCurrency(item.price, settings.currency, rates)}
                                </span>
                              </div>
                            ))}
                            {receipt.items.length > 3 && (
                              <p className="text-xs text-muted-foreground">
                                +{receipt.items.length - 3} more item
                                {receipt.items.length - 3 !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-end text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        <span>View details</span>
                        <ChevronRight className="ml-1 h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="space-y-3 lg:hidden">
              {sortedReceipts.map((receipt) => {
                const CategoryIcon = getCategoryIcon(receipt.category);

                return (
                  <Card
                    key={receipt.id}
                    className="cursor-pointer border border-border/50 bg-card shadow-sm transition-all hover:shadow-md"
                    onClick={() => onViewReceipt(receipt)}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${categoryColors[receipt.category] || categoryColors.Other}`}
                      >
                        <CategoryIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {receipt.storeName}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{receipt.category}</span>
                          <span className="text-border">•</span>
                          <span>{formatShortDate(receipt.date)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-serif font-semibold text-foreground">
                          {formatCurrency(receipt.total, settings.currency, rates)}
                        </p>
                        {receipt.items && receipt.items.length > 0 && (
                          <p className="text-xs text-muted-foreground">
                            {receipt.items.length} items
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
