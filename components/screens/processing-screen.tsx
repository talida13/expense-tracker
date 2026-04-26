"use client";

import { useEffect, useState } from "react";
import { Receipt, Sparkles, Check } from "lucide-react";

interface ProcessingScreenProps {
  onComplete: () => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing image...",
    "Extracting receipt data...",
    "Processing line items...",
    "Almost done...",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          setTimeout(onComplete, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 700);

    return () => clearInterval(interval);
  }, [onComplete, steps.length]);

  const isComplete = step >= steps.length - 1;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="relative mb-8">
        <div
          className={`flex h-32 w-32 items-center justify-center rounded-3xl transition-all duration-500 ${
            isComplete ? "bg-green-500" : "bg-primary"
          }`}
        >
          {isComplete ? (
            <Check className="h-16 w-16 text-white animate-in zoom-in duration-300" />
          ) : (
            <Receipt className="h-16 w-16 text-primary-foreground" />
          )}
        </div>

        {!isComplete && (
          <>
            <div
              className="absolute inset-0 animate-ping rounded-3xl bg-primary/20"
              style={{ animationDuration: "1.5s" }}
            />
            <div className="absolute -right-2 -top-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg">
              <Sparkles className="h-5 w-5 text-accent-foreground" />
            </div>
          </>
        )}
      </div>

      <div className="text-center">
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          {isComplete ? "Complete!" : "Processing Receipt"}
        </h2>
        <p className="text-muted-foreground">
          {isComplete ? "Receipt data extracted successfully" : steps[step]}
        </p>
      </div>

      <div className="mt-8 flex gap-2">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index <= step ? "w-6 bg-primary" : "w-2 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
