"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <div className="group relative">{children}</div>;
}

export function TooltipTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

export function TooltipContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("pointer-events-none absolute left-0 top-full z-20 mt-2 hidden rounded-md px-3 py-2 text-xs shadow-lg group-hover:block", className)}>
      {children}
    </div>
  );
}
