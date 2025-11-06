// src/components/security-view.tsx
import { useSafeAreaInsets } from "@/lib/use-safe-area";
import React from "react";

export default function SecurityView({
  children,
}: {
  children: React.ReactNode;
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <div
      className="min-h-screen bg-white dark:bg-zinc-900 transition-colors duration-300 dark:text-white text-zinc-800 flex flex-col"
      style={{
        paddingTop: top,
        paddingBottom: bottom,
      }}
    >
      {children}
    </div>
  );
}
