"use client";
import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = "md" }: ModalProps) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) { document.body.style.overflow = "hidden"; window.addEventListener("keydown", handler); }
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={cn("relative w-full rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl", widths[maxWidth])}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-800">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">{title}</h2>
            {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
          </div>
          <button onClick={onClose} className="ml-4 text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Body */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
