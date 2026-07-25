"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  width?: "sm" | "md" | "lg";
}

export function Drawer({ isOpen, onClose, title, description, children, width = "md" }: DrawerProps) {
  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const widthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  }[width];

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full bg-slate-900 border-l border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col",
          widthClass,
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800 shrink-0">
          <div>
            <h2 className="text-sm font-bold text-slate-100">{title}</h2>
            {description && (
              <p className="text-xs text-slate-500 mt-0.5">{description}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </>
  );
}
