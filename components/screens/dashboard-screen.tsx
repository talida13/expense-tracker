"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Receipt,
  TrendingUp,
  Camera,
  ChevronRight,
  Settings,
  FileText,
  Upload,
  Plus,
} from "lucide-react";
import type { Receipt as ReceiptType } from "@/lib/types";
import { Bar, BarChart, XAxis, YAxis, Tooltip, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useAppSettings } from "@/lib/SettingsContext";
import { formatCurrency } from "@/lib/utils";

interface DashboardScreenProps {
  receipts: ReceiptType[];
  monthlyData: { month: string; amount: number }[];
  onScanReceipt: () => void;
  onUploadReceipt: () => void;
  onViewAllReceipts: () => void;
  onViewReceipt: (receipt: ReceiptType) => void;
  onOpenSettings: () => void;
}

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
};

export function DashboardScreen({
  receipts,
  monthlyData,
  onScanReceipt,
  onUploadReceipt,
  onViewAllReceipts,
  onViewReceipt,
  onOpenSettings,
}: DashboardScreenProps) {
  const { settings, rates } = useAppSettings();
  const totalSpent = receipts.reduce((sum, r) => sum + r.total, 0);
  const recentReceipts = receipts.slice(0, 4);
  const avgPerReceipt = receipts.length > 0 ? totalSpent / receipts.length : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const categoryData = receipts.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + r.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  const categoryBreakdown = Object.entries(categoryData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 px-5 pb-4 pt-6 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium tracking-wide text-muted-foreground">
              Glad to see you back!
            </p>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
              Expense Tracker
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onUploadReceipt}
              className="hidden h-10 gap-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 md:flex"
            >
              <Upload className="h-4 w-4" />
              Upload Receipt
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full"
              onClick={onOpenSettings}
            >
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-6 lg:px-8 lg:pb-8">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <Card className="border-0 bg-primary shadow-lg shadow-primary/20 dark:shadow-primary/10">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-foreground/15">
                      <TrendingUp className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-primary-foreground/70">
                    This Month
                  </p>
                  <p className="font-serif text-2xl font-semibold tracking-tight text-primary-foreground">
                    {formatCurrency(totalSpent, settings.currency, rates)}
                  </p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 bg-card shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15">
                      <Receipt className="h-4 w-4 text-accent" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Receipts
                  </p>
                  <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {receipts.length}
                  </p>
                </CardContent>
              </Card>

              <Card className="hidden border border-border/50 bg-card shadow-sm lg:block">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Avg. per Receipt
                  </p>
                  <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {formatCurrency(avgPerReceipt, settings.currency, rates)}
                  </p>
                </CardContent>
              </Card>

              <Card className="hidden border border-border/50 bg-card shadow-sm lg:block">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground">
                    Categories
                  </p>
                  <p className="font-serif text-2xl font-semibold tracking-tight text-foreground">
                    {Object.keys(categoryData).length}
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="border border-border/50 bg-card shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                  Monthly Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ChartContainer
                  config={chartConfig}
                  className="h-48 w-full lg:h-64"
                >
                  <BarChart data={monthlyData} barSize={40}>
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fill: "hsl(var(--muted-foreground))",
                        fontSize: 12,
                      }}
                      tickFormatter={(value) => formatCurrency(value, settings.currency, rates)}
                      className="hidden lg:block"
                      hide
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                      dataKey="amount"
                      fill="var(--color-amount)"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="hidden border border-border/50 bg-card shadow-sm lg:block">
              <CardHeader className="pb-2">
                <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                  Spending by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryBreakdown.map(([category, amount], index) => (
                    <div key={category} className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        <FileText className="h-5 w-5 text-secondary-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-medium text-foreground">
                            {category}
                          </span>
                          <span className="text-sm font-semibold text-foreground">
                            {formatCurrency(amount, settings.currency, rates)}
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-accent transition-all"
                            style={{ width: `${(amount / totalSpent) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="font-serif text-lg font-semibold tracking-tight">
                  Recent Receipts
                </CardTitle>
                <Button
                  variant="ghost"
                  className="h-auto p-0 text-sm text-accent hover:bg-transparent hover:text-accent/80"
                  onClick={onViewAllReceipts}
                >
                  View All
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-3 pt-0">
                {recentReceipts.map((receipt) => (
                  <div
                    key={receipt.id}
                    className="flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-all hover:bg-secondary/50"
                    onClick={() => onViewReceipt(receipt)}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
                      <FileText className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">
                        {receipt.storeName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(receipt.date)}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(receipt.total, settings.currency, rates)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="hidden border-2 border-dashed border-border bg-transparent shadow-none lg:block">
              <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mb-2 font-semibold text-foreground">
                  Upload Receipt
                </h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <Button
                  onClick={onUploadReceipt}
                  className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Choose File
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <div className="fixed bottom-6 left-0 right-0 flex justify-center md:hidden">
        <Button
          onClick={onScanReceipt}
          className="h-16 w-16 rounded-full bg-accent shadow-xl transition-all hover:bg-accent/90 hover:shadow-2xl"
        >
          <Camera className="h-7 w-7 text-accent-foreground" />
          <span className="sr-only">Scan Receipt</span>
        </Button>
      </div>
    </div>
  );
}
