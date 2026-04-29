"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  User,
  DollarSign,
  Moon,
  Bell,
  Shield,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import { useSettings } from "@/lib/useSettings";
import { useAppSettings } from "@/lib/SettingsContext";
import { LogoutButton } from "../LogoutButton";
import { getAuth } from "firebase/auth";

interface SettingsScreenProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (value: boolean) => void;
}

export function SettingsScreen({
  onBack,
  isDarkMode,
  onToggleDarkMode,
}: SettingsScreenProps) {
  const { settings, updateSettings, rates } = useAppSettings();
  const [notifications, setNotifications] = useState(true);

  const currencyOptions = [
    { value: "RON", symbol: "lei", rate: 1 },
    { value: "USD", symbol: "$", rate: rates.USD || 0 },
    { value: "EUR", symbol: "€", rate: rates.EUR || 0 },
    { value: "GBP", symbol: "£", rate: rates.GBP || 0 },
  ].map(({ value, symbol, rate }) => ({
    value,
    label: `${value} (${symbol}) - 1 ${value} = ${rate.toFixed(2)} RON (BNR Rate)`,
  }));
  const auth = getAuth();

  const settingsSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          type: "link" as const,
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          type: "link" as const,
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: DollarSign,
          label: "Currency",
          type: "select" as const,
          value: settings.currency,
          onChange: (value: string) => updateSettings({ currency: value }),
          options: currencyOptions,
        },
        {
          icon: Moon,
          label: "Dark Mode",
          type: "switch" as const,
          value: isDarkMode,
          onChange: onToggleDarkMode,
        },
        {
          icon: Bell,
          label: "Notifications",
          type: "switch" as const,
          value: notifications,
          onChange: setNotifications,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & FAQ",
          type: "link" as const,
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/95 px-5 pb-4 pt-6 backdrop-blur-xl lg:px-8">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground">
            Settings
          </h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 space-y-6 px-5 py-6 lg:px-8 lg:py-8">
        <Card className="border-0 bg-primary shadow-lg shadow-primary/20 dark:shadow-primary/10">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <User className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-lg font-semibold text-primary-foreground">
                {auth.currentUser?.displayName || "John Doe"}
              </p>
              <p className="text-sm font-medium text-primary-foreground/70">
                {auth.currentUser?.email || "john.doe@email.com"}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-primary-foreground/50" />
          </CardContent>
        </Card>

        {settingsSections.map((section) => (
          <div key={section.title}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {section.title}
            </h2>
            <Card className="border border-border/50 bg-card shadow-sm py-0">
              <CardContent className="divide-y divide-border p-0">
                {section.items.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 p-6 ${
                      item.type === "link"
                        ? "cursor-pointer hover:bg-secondary/50"
                        : ""
                    } ${index === 0 ? "rounded-t-xl" : ""} ${
                      index === section.items.length - 1 ? "rounded-b-xl" : ""
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                      <item.icon className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <span className="flex-1 font-medium text-foreground">
                      {item.label}
                    </span>

                    {item.type === "link" && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}

                    {item.type === "switch" && (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    )}

                    {item.type === "select" && (
                      <Select value={item.value} onValueChange={item.onChange}>
                        <SelectTrigger className="h-10 w-28 rounded-xl border-0 bg-secondary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {item.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    {item.type === "input" && (
                      <Input
                        type="number"
                        value={item.value}
                        onChange={(e) => item.onChange(e.target.value)}
                        className="h-10 w-28 rounded-xl border-0 bg-secondary"
                      />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
        <LogoutButton />
      </main>
    </div>
  );
}
