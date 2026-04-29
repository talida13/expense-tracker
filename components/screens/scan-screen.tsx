"use client";

import { Button } from "@/components/ui/button";
import { X, Camera, Image as ImageIcon, Zap } from "lucide-react";

interface ScanScreenProps {
  onClose: () => void;
  onCapture: () => void;
}

export function ScanScreen({ onClose, onCapture }: ScanScreenProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-foreground">
      <header className="relative z-10 flex items-center justify-between px-5 pt-6">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-background/20 text-background hover:bg-background/30"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 rounded-full bg-background/20 px-3 py-1.5">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-background">
            Auto-detect
          </span>
        </div>
      </header>

      <div className="relative flex flex-1 items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-b from-foreground/90 to-foreground" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative h-80 w-64 rounded-2xl border-2 border-dashed border-background/50">
            <div className="absolute -left-1 -top-1 h-8 w-8 rounded-tl-xl border-l-4 border-t-4 border-accent" />
            <div className="absolute -right-1 -top-1 h-8 w-8 rounded-tr-xl border-r-4 border-t-4 border-accent" />
            <div className="absolute -bottom-1 -left-1 h-8 w-8 rounded-bl-xl border-b-4 border-l-4 border-accent" />
            <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-br-xl border-b-4 border-r-4 border-accent" />

            <div className="flex h-full flex-col items-center justify-center">
              <Camera className="mb-3 h-12 w-12 text-background/30" />
              <p className="text-sm text-background/50">
                Position receipt here
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-background/70">
            Align your receipt within the frame
          </p>
        </div>
      </div>

      <div className="relative z-10 bg-linear-to-t from-foreground via-foreground to-transparent pb-10 pt-6">
        <div className="flex items-center justify-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            className="h-14 w-14 rounded-full bg-background/20 text-background hover:bg-background/30"
          >
            <ImageIcon className="h-6 w-6" />
            <span className="sr-only">Upload from gallery</span>
          </Button>

          <button
            onClick={onCapture}
            className="group relative flex h-20 w-20 items-center justify-center"
          >
            <div className="absolute inset-0 rounded-full bg-background transition-transform group-hover:scale-105" />
            <div className="absolute inset-2 rounded-full border-4 border-foreground" />
            <span className="sr-only">Capture receipt</span>
          </button>

          <div className="h-14 w-14" />
        </div>
      </div>
    </div>
  );
}
