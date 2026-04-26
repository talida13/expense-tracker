"use client";

import { Button } from "@/components/ui/button";
import { Receipt, Sparkles, TrendingUp } from "lucide-react";

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between px-6 py-12">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative mb-8">
          <div className="relative flex h-48 w-40 flex-col items-center justify-center rounded-2xl bg-card shadow-xl">
            <div className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
            <Receipt className="mb-3 h-16 w-16 text-primary" />
            <div className="space-y-1.5">
              <div className="h-2 w-20 rounded-full bg-muted" />
              <div className="h-2 w-16 rounded-full bg-muted" />
              <div className="h-2 w-24 rounded-full bg-muted" />
            </div>
          </div>
          <div className="absolute -left-8 top-8 flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>

          <div className="absolute -bottom-4 -right-6 h-16 w-16 rounded-2xl bg-accent/30 backdrop-blur-sm" />
        </div>

        <div className="mt-8 text-center">
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">
            Track your expenses effortlessly
          </h1>
          <p className="mt-4 text-pretty text-muted-foreground">
            Scan receipts, organize spending, and gain insights into your
            financial habits with just a few taps.
          </p>
        </div>
      </div>

      <div className="w-full space-y-4">
        <Button
          onClick={onGetStarted}
          className="h-14 w-full rounded-2xl bg-primary text-lg font-semibold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl"
        >
          Get Started
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          No credit card required
        </p>
      </div>
    </div>
  );
}
