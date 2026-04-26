"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
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
  LogOut,
  ChevronRight,
} from "lucide-react";

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
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);

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
          value: currency,
          onChange: setCurrency,
          options: [
            { value: "USD", label: "USD ($)" },
            { value: "EUR", label: "EUR (€)" },
            { value: "GBP", label: "GBP (£)" },
            { value: "JPY", label: "JPY (¥)" },
          ],
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
                John Doe
              </p>
              <p className="text-sm font-medium text-primary-foreground/70">
                john.doe@email.com
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
            <Card className="border border-border/50 bg-card shadow-sm">
              <CardContent className="divide-y divide-border p-0">
                {section.items.map((item, index) => (
                  <div
                    key={item.label}
                    className={`flex items-center gap-4 p-4 ${
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
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}

        <Button
          variant="outline"
          className="h-14 w-full rounded-2xl border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </main>
    </div>
  );
}
